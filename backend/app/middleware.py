import time
import json
from datetime import datetime, timezone, timedelta
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.db import SessionLocal
from app import crud
from app.config import API_LOG_CONFIG
from app.utils import verify_token
import logging

logger = logging.getLogger(__name__)

class APIAccessLogMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, custom_config: dict = None):
        super().__init__(app)
        self.config = custom_config or API_LOG_CONFIG
    
    async def dispatch(self, request: Request, call_next):
        # Check if logging is enabled
        if not self.config.get("enabled", True):
            return await call_next(request)

        start_time = time.time()
        method = request.method
        endpoint = str(request.url.path)
        
        # Check if this request should be excluded from logging
        if self.should_exclude_request(method, endpoint):
            return await call_next(request)
        
        # Get request information
        client_ip = self.get_client_ip(request)
        user_agent = request.headers.get("user-agent", "")
        host = request.headers.get("host", "")
        referer = request.headers.get("referer", "")
        
        # Get username from JWT token
        username = self.get_username_from_request(request)
        
        # Optional debug output
        if self.config.get("debug_print_request", False):
            self.print_request_summary(method, str(request.url), client_ip)
        
        # Read request body for POST/PUT/PATCH requests
        request_body = None
        if self.config.get("log_request_body", True) and method in ["POST", "PUT", "PATCH"]:
            try:
                body = await request.body()
                if body:
                    try:
                        request_body = json.loads(body.decode())
                        request_body = self.filter_sensitive_data(request_body)
                        request_body = json.dumps(request_body, ensure_ascii=False)
                    except:
                        request_body = body.decode()
                    
                    # Limit body length
                    max_length = self.config.get("max_request_body_length", 2000)
                    if len(request_body) > max_length:
                        request_body = request_body[:max_length] + "...[truncated]"
            except Exception as e:
                logger.warning(f"Failed to read request body: {e}")
        
        # Process request
        response = await call_next(request)
        
        # Calculate response time
        process_time = int((time.time() - start_time) * 1000)
        
        # Optional debug output
        if self.config.get("debug_print_request", False):
            self.print_response_summary(method, endpoint, response.status_code, process_time)
        
        # Save to database
        try:
            db = SessionLocal()
            taipei_tz = timezone(timedelta(hours=8))
            
            log_data = {
                "method": method,
                "endpoint": endpoint,
                "client_ip": client_ip,
                "username": username,
                "user_agent": user_agent,
                "request_body": request_body,
                "response_status": response.status_code,
                "response_time_ms": process_time,
                "host": host,
                "referer": referer,
                "timestamp": datetime.now(taipei_tz).replace(tzinfo=None)
            }
            crud.create_api_access_log(db, log_data)
            db.close()
        except Exception as e:
            logger.error(f"Failed to log API access: {e}")
        
        return response
    
    def get_username_from_request(self, request: Request) -> str:
        """Extract username from JWT token in request headers"""
        try:
            # Check for Authorization header
            auth_header = request.headers.get("authorization", "")
            if not auth_header.startswith("Bearer "):
                # Check if this is a Python script request based on user agent
                user_agent = request.headers.get("user-agent", "").lower()
                if any(python_indicator in user_agent for python_indicator in ["python", "requests", "urllib", "httpx"]):
                    return "Python"
                return None
            
            # Extract token
            token = auth_header.split(" ")[1]
            
            # Verify token and get username
            username = verify_token(token)
            return username if username else None
            
        except Exception as e:
            logger.debug(f"Failed to extract username from request: {e}")
            # Check if this is a Python script request based on user agent
            user_agent = request.headers.get("user-agent", "").lower()
            if any(python_indicator in user_agent for python_indicator in ["python", "requests", "urllib", "httpx"]):
                return "Python"
            return None
    
    def print_request_summary(self, method: str, url: str, client_ip: str):
        """Print simple request info"""
        taipei_tz = timezone(timedelta(hours=8))
        current_time = datetime.now(taipei_tz).strftime('%H:%M:%S')
        print(f"[{current_time}] 🌐 {method} {url} <- {client_ip}")
    
    def print_response_summary(self, method: str, endpoint: str, status_code: int, response_time: int):
        """Print response summary"""
        status_emoji = "✅" if 200 <= status_code < 300 else "⚠️" if 300 <= status_code < 400 else "❌"
        time_emoji = "🚀" if response_time < 100 else "🐌" if response_time > 1000 else "⏱️"
        
        taipei_tz = timezone(timedelta(hours=8))
        current_time = datetime.now(taipei_tz).strftime('%H:%M:%S')
        print(f"[{current_time}] {status_emoji} {method} {endpoint} -> {status_code} ({response_time}ms) {time_emoji}")

    def get_client_ip(self, request: Request) -> str:
        """Get real client IP from headers or fallback to direct connection"""
        
        # Standard proxy headers in priority order
        ip_headers = [
            "x-forwarded-for",
            "x-real-ip", 
            "x-client-ip",
            "cf-connecting-ip",
            "x-cluster-client-ip",
            "forwarded-for",
            "forwarded"
        ]

        for header in ip_headers:
            ip_value = request.headers.get(header)
            if ip_value:
                # Handle multiple IPs (take first one)
                if "," in ip_value:
                    ip_value = ip_value.split(",")[0].strip()
                
                # Remove port if present
                if ":" in ip_value and not self.is_ipv6(ip_value):
                    ip_value = ip_value.split(":")[0]

                # Validate IP and exclude internal container IPs
                if self.is_valid_ip(ip_value) and not self.is_internal_container_ip(ip_value):
                    return ip_value

        # Fallback to direct connection IP
        return request.client.host if request.client else "unknown"
    
    def is_internal_container_ip(self, ip: str) -> bool:
        """Check if IP is from internal container network"""
        internal_ranges = [
            "10.89.",    # Podman/Docker networks
            "172.17.",   # Docker default
            "172.18.", "172.19.", "172.20.",  # Docker custom
            "10.0.",     # Common container networks
            "127."       # Loopback
        ]
        
        return any(ip.startswith(prefix) for prefix in internal_ranges)
    
    def is_valid_ip(self, ip: str) -> bool:
        """Validate IP address format"""
        try:
            import ipaddress
            ipaddress.ip_address(ip)
            return True
        except ValueError:
            return False
    
    def is_ipv6(self, ip: str) -> bool:
        """Check if IP is IPv6"""
        try:
            import ipaddress
            return isinstance(ipaddress.ip_address(ip), ipaddress.IPv6Address)
        except ValueError:
            return False
    
    def should_exclude_request(self, method: str, path: str) -> bool:
        """Check if request should be excluded from logging"""
        
        # Exact path match
        if path in self.config.get("exclude_exact_paths", []):
            return True
        
        # Path prefix match
        for prefix in self.config.get("exclude_path_prefixes", []):
            if path.startswith(prefix):
                return True
        
        # Path pattern match
        for pattern in self.config.get("exclude_path_patterns", []):
            if pattern in path:
                return True
        
        # Method + path combination
        for exclude_method, exclude_path in self.config.get("exclude_method_paths", []):
            if exclude_method == method and (exclude_path == "*" or exclude_path == path):
                return True
        
        return False
    
    def filter_sensitive_data(self, data):
        """Filter sensitive information from request data"""
        sensitive_fields = self.config.get("sensitive_fields", [])
        
        if isinstance(data, dict):
            filtered = {}
            for key, value in data.items():
                if any(sensitive in key.lower() for sensitive in sensitive_fields):
                    filtered[key] = "***FILTERED***"
                elif isinstance(value, (dict, list)):
                    filtered[key] = self.filter_sensitive_data(value)
                else:
                    filtered[key] = value
            return filtered
        elif isinstance(data, list):
            return [self.filter_sensitive_data(item) for item in data]
        else:
            return data