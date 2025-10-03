import time
import json
import socket
import platform
from datetime import datetime
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app import crud
from app.config import API_LOG_CONFIG
import logging

logger = logging.getLogger(__name__)

class APIAccessLogMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, custom_config: dict = None):
        super().__init__(app)
        # Use custom settings or default settings
        self.config = custom_config or API_LOG_CONFIG
    
    async def dispatch(self, request: Request, call_next):
        # Check if tracing is enabled
        if not self.config.get("enabled", True):
            return await call_next(request)

        # Recording start time
        start_time = time.time()
        
        # Get basic request information for exclusion check
        method = request.method
        endpoint = str(request.url.path)
        
        # Check whether this request needs to be logged
        if self.should_exclude_request(method, endpoint):
            return await call_next(request)
        
        # Get detailed request information (only for non-excluded requests)
        client_ip = self.get_client_ip(request)
        user_agent = request.headers.get("user-agent", "")
        host = request.headers.get("host", "")
        referer = request.headers.get("referer", "")
        
        # 簡化的 request 資訊 (如果開啟 debug 模式且沒有被排除)
        if self.config.get("debug_print_request", False):
            self.print_simple_request_details(method, str(request.url), client_ip)
        
        # Read the request body (if allowed)
        request_body = None
        if self.config.get("log_request_body", True) and method in ["POST", "PUT", "PATCH"]:
            try:
                body = await request.body()
                if body:
                    # Try to parse JSON and log the original string if it fails
                    try:
                        request_body = json.loads(body.decode())
                        # Filter sensitive information
                        request_body = self.filter_sensitive_data(request_body)
                        request_body = json.dumps(request_body, ensure_ascii=False)
                    except:
                        request_body = body.decode()
                    
                    # Limit length
                    max_length = self.config.get("max_request_body_length", 2000)
                    if len(request_body) > max_length:
                        request_body = request_body[:max_length] + "...[truncated]"
            except Exception as e:
                logger.warning(f"Failed to read request body: {e}")
        
        # Handle request
        response = await call_next(request)
        
        # Calculate response time
        process_time = int((time.time() - start_time) * 1000)  # 毫秒
        
        # 印出簡化的請求/回應資訊
        if self.config.get("debug_print_request", False):
            self.print_response_summary(method, endpoint, response.status_code, process_time)
        
        # Record to database
        try:
            db = SessionLocal()
            
            from datetime import timezone, timedelta
            taipei_tz = timezone(timedelta(hours=8))
            
            log_data = {
                "method": method,
                "endpoint": endpoint,
                "client_ip": client_ip,
                "user_agent": user_agent,
                "request_body": request_body,  # 加入 request body
                "response_status": response.status_code,
                "response_time_ms": process_time,
                "host": host,
                "referer": referer,
                "timestamp": datetime.now(taipei_tz).replace(tzinfo=None)  # 轉換為台灣時間但移除時區資訊
            }
            crud.create_api_access_log(db, log_data)
            db.close()
        except Exception as e:
            logger.error(f"Failed to log API access: {e}")
        
        return response
    
    def print_simple_request_details(self, method: str, url: str, client_ip: str):
        """簡化的 request 資訊印出"""
        from datetime import timezone, timedelta
        # 使用台灣時區 (GMT+8)
        taipei_tz = timezone(timedelta(hours=8))
        current_time = datetime.now(taipei_tz).strftime('%H:%M:%S')
        print(f"[{current_time}] 🌐 {method} {url} <- {client_ip}")
    
    async def print_request_details(self, request: Request):
        """詳細印出 request 的所有資訊"""
        print("=" * 80)
        print("🔍 REQUEST DETAILS")
        print("=" * 80)
        
        # 時間資訊
        current_time = datetime.now()
        print(f"🕐 Timestamp: {current_time.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🕐 ISO Format: {current_time.isoformat()}")
        
        # 伺服器平台資訊
        print(f"\n🖥️ Server Platform Info:")
        try:
            server_hostname = socket.gethostname()
            server_ip = socket.gethostbyname(server_hostname)
            print(f"  Server Hostname: {server_hostname}")
            print(f"  Server IP: {server_ip}")
            print(f"  Platform: {platform.system()} {platform.release()}")
            print(f"  Architecture: {platform.machine()}")
            print(f"  Python Version: {platform.python_version()}")
        except Exception as e:
            print(f"  Failed to get server info: {e}")
        
        # 基本資訊
        print(f"📍 Method: {request.method}")
        print(f"📍 URL: {request.url}")
        print(f"📍 Path: {request.url.path}")
        print(f"📍 Query Params: {dict(request.query_params)}")
        
        # Headers
        print(f"\n📋 Headers:")
        for name, value in request.headers.items():
            # 過濾敏感 headers
            if any(sensitive in name.lower() for sensitive in ["authorization", "cookie", "token"]):
                print(f"  {name}: ***FILTERED***")
            else:
                print(f"  {name}: {value}")
        
        # Client 資訊
        print(f"\n🌐 Client Info:")
        if request.client:
            print(f"  Direct Connection - Host: {request.client.host}")
            print(f"  Direct Connection - Port: {request.client.port}")
        
        # 顯示真實 IP 取得結果
        real_ip = self.get_client_ip(request)
        print(f"  Real Client IP: {real_ip}")
        
        # 顯示所有可能的 IP 相關 headers
        ip_headers = ["x-forwarded-for", "x-real-ip", "x-client-ip", "cf-connecting-ip", 
                     "x-cluster-client-ip", "forwarded-for", "forwarded", "x-forwarded"]
        ip_found = False
        for header in ip_headers:
            value = request.headers.get(header)
            if value:
                if not ip_found:
                    print(f"  IP Headers Found:")
                    ip_found = True
                print(f"    {header}: {value}")
        
        if not ip_found:
            print(f"  IP Headers: None found (direct connection)")
        
        # Path Parameters
        if hasattr(request, 'path_params') and request.path_params:
            print(f"\n🔗 Path Parameters: {request.path_params}")
        
        # 嘗試讀取 body (但要小心不影響後續處理)
        if request.method in ["POST", "PUT", "PATCH"]:
            try:
                # 先保存原始 body
                body = await request.body()
                if body:
                    print(f"\n📦 Request Body (first 500 chars):")
                    body_str = body.decode('utf-8', errors='ignore')
                    print(f"  {body_str[:500]}{'...' if len(body_str) > 500 else ''}")
                    
                    # 嘗試解析為 JSON
                    try:
                        json_data = json.loads(body_str)
                        print(f"\n📋 Parsed JSON:")
                        # 過濾敏感資料後印出
                        filtered_data = self.filter_sensitive_data(json_data)
                        print(f"  {json.dumps(filtered_data, indent=2, ensure_ascii=False)}")
                    except:
                        print("  (Not valid JSON)")
                else:
                    print(f"\n📦 Request Body: (empty)")
            except Exception as e:
                print(f"\n❌ Failed to read body: {e}")
        
        # Cookies
        if request.cookies:
            print(f"\n🍪 Cookies:")
            for name, value in request.cookies.items():
                # 過濾敏感 cookies
                if any(sensitive in name.lower() for sensitive in ["session", "token", "auth"]):
                    print(f"  {name}: ***FILTERED***")
                else:
                    print(f"  {name}: {value}")
        
        # 網路連線詳細資訊
        print(f"\n🌐 Network Connection Details:")
        try:
            # 嘗試取得更多網路資訊
            if request.client:
                client_host = request.client.host
                client_port = request.client.port
                print(f"  Direct Client: {client_host}:{client_port}")
                
                # 分析 IP 類型和可能的網路架構
                self.analyze_network_architecture(client_host, request)
                
                # 嘗試反向 DNS 查詢取得電腦名稱
                try:
                    client_hostname = socket.gethostbyaddr(client_host)[0]
                    print(f"  Client Hostname: {client_hostname}")
                except:
                    print(f"  Client Hostname: Unable to resolve")
                
                # 檢查是否為本地連線
                if client_host in ['127.0.0.1', '::1', 'localhost']:
                    print(f"  Connection Type: Local/Loopback")
                elif client_host.startswith('192.168.') or client_host.startswith('10.') or client_host.startswith('172.'):
                    print(f"  Connection Type: Private Network")
                else:
                    print(f"  Connection Type: Public Internet")
            
            # 顯示所有網路介面 (如果是本地連線)
            if request.client and request.client.host in ['127.0.0.1', '::1']:
                print(f"  Local Network Interfaces:")
                try:
                    hostname = socket.gethostname()
                    local_ip = socket.gethostbyname(hostname)
                    print(f"    Primary: {hostname} ({local_ip})")
                    
                    # 嘗試取得所有網路介面
                    import subprocess
                    try:
                        # Windows
                        if platform.system() == "Windows":
                            result = subprocess.run(['ipconfig'], capture_output=True, text=True, timeout=5)
                            if result.returncode == 0:
                                lines = result.stdout.split('\n')
                                for line in lines:
                                    if 'IPv4' in line and '192.168.' in line:
                                        ip = line.split(':')[-1].strip()
                                        print(f"    Interface: {ip}")
                        # Linux/Mac
                        else:
                            result = subprocess.run(['hostname', '-I'], capture_output=True, text=True, timeout=5)
                            if result.returncode == 0:
                                ips = result.stdout.strip().split()
                                for ip in ips:
                                    if not ip.startswith('127.'):
                                        print(f"    Interface: {ip}")
                    except:
                        pass
                except Exception as e:
                    print(f"    Error getting interfaces: {e}")
                    
        except Exception as e:
            print(f"  Network info error: {e}")
        
        # 其他有用的屬性
        print(f"\n🔧 Other Info:")
        print(f"  Scope Type: {request.scope.get('type', 'unknown')}")
        print(f"  HTTP Version: {request.scope.get('http_version', 'unknown')}")
        print(f"  Scheme: {request.url.scheme}")
        
        print("=" * 80)
    
    def print_response_summary(self, method: str, endpoint: str, status_code: int, response_time: int):
        """印出回應摘要"""
        status_emoji = "✅" if 200 <= status_code < 300 else "⚠️" if 300 <= status_code < 400 else "❌"
        time_emoji = "🚀" if response_time < 100 else "🐌" if response_time > 1000 else "⏱️"
        
        from datetime import timezone, timedelta
        # 使用台灣時區 (GMT+8)
        taipei_tz = timezone(timedelta(hours=8))
        current_time = datetime.now(taipei_tz).strftime('%H:%M:%S')
        print(f"[{current_time}] {status_emoji} {method} {endpoint} -> {status_code} ({response_time}ms) {time_emoji}")
    
    # def get_client_ip(self, request: Request) -> str:
    #     """Get the real client IP - 改善版本，支援更多 header 和情況"""
        
    #     # 按優先順序檢查各種可能的 IP headers
    #     ip_headers = [
    #         "x-forwarded-for",      # 最常見的代理 header
    #         "x-real-ip",            # Nginx 常用
    #         "x-client-ip",          # Apache 常用
    #         "cf-connecting-ip",     # Cloudflare
    #         "x-cluster-client-ip",  # 集群環境
    #         "forwarded-for",        # 舊版標準
    #         "forwarded",            # RFC 7239 標準
    #         "x-forwarded",          # 變體
    #     ]
        
    #     for header in ip_headers:
    #         ip_value = request.headers.get(header)
    #         if ip_value:
    #             # X-Forwarded-For 可能包含多個 IP，格式: client, proxy1, proxy2
    #             # 取第一個 (最原始的客戶端 IP)
    #             if "," in ip_value:
    #                 ip_value = ip_value.split(",")[0].strip()
                
    #             # 清理 IP 值，移除可能的 port 號
    #             if ":" in ip_value and not self.is_ipv6(ip_value):
    #                 ip_value = ip_value.split(":")[0]
                
    #             # 驗證 IP 格式
    #             if self.is_valid_ip(ip_value):
    #                 return ip_value
        
    #     # 如果沒有找到代理 headers，使用直接連接的 IP
    #     direct_ip = request.client.host if request.client else "unknown"
        
    #     # 記錄所有可能的 IP 資訊用於除錯
    #     if self.config.get("debug_print_request", False):
    #         print(f"\n🔍 IP Detection Debug:")
    #         print(f"  Direct IP: {direct_ip}")
    #         for header in ip_headers:
    #             value = request.headers.get(header)
    #             if value:
    #                 print(f"  {header}: {value}")
        
    #     return direct_ip

    def get_client_ip(self, request: Request) -> str:
        """取得真實 Client IP，支援多層代理和 WSL2 環境，fallback 到 request.client.host"""
        
        ip_headers = [
            "x-forwarded-for",      # 最常見 (可能有多個 IP)
            "x-real-ip",            # Nginx / Traefik 常用
            "x-client-ip",          # Apache
            "cf-connecting-ip",     # Cloudflare
            "x-cluster-client-ip",  # Kubernetes / Proxy
            "forwarded-for",        # 舊版標準
            "forwarded",            # RFC 7239
            "x-forwarded"           # 部分 Proxy 變體
        ]

        # Debug: 印出所有相關的 headers (簡化版)
        # if self.config.get("debug_print_request", False):
        #     print(f"\n🔍 IP Headers Debug:")
        #     for header in ip_headers:
        #         value = request.headers.get(header)
        #         if value:
        #             print(f"  {header}: {value}")
        #     print(f"  Direct client: {request.client.host if request.client else 'None'}")

        for header in ip_headers:
            ip_value = request.headers.get(header)
            if ip_value:
                # 取第一個 IP（避免有多個，通常第一個是 client）
                if "," in ip_value:
                    ip_value = ip_value.split(",")[0].strip()
                
                # 移除可能的 port，例如 "192.168.0.100:12345"
                if ":" in ip_value and not self.is_ipv6(ip_value):
                    ip_value = ip_value.split(":")[0]

                # 驗證 IP 格式並且不是內部容器 IP
                if self.is_valid_ip(ip_value) and not self.is_internal_container_ip(ip_value):
                    if self.config.get("debug_print_request", False):
                        print(f"  ✅ Found real client IP: {ip_value} (from {header})")
                    return ip_value
                
                # 如果是 WSL2 環境且 header 中的 IP 是 127.0.0.1，嘗試推斷真實 IP
                elif ip_value == "127.0.0.1" and self.is_wsl2_environment():
                    real_ip = self.get_wsl2_client_ip(request)
                    if real_ip:
                        if self.config.get("debug_print_request", False):
                            print(f"  ✅ WSL2 detected from header, inferred client IP: {real_ip}")
                        return real_ip

        # WSL2 特殊處理：嘗試從網路介面推斷真實 IP
        direct_ip = request.client.host if request.client else "unknown"
        
        # 檢查是否在 WSL2 環境中
        is_wsl2 = self.is_wsl2_environment()
        
        # 如果是 WSL2 環境且看到本地 IP，嘗試其他方法
        if is_wsl2 and (direct_ip in ["127.0.0.1", "::1", "localhost"]):
            real_ip = self.get_wsl2_client_ip(request)
            if real_ip:
                return real_ip
        
        return direct_ip
    
    def is_wsl2_environment(self) -> bool:
        """檢查是否在 WSL2 環境中"""
        try:
            import platform
            return "microsoft-standard-WSL2" in platform.release()
        except:
            return False
    
    def get_wsl2_client_ip(self, request: Request) -> str:
        """在 WSL2 環境中嘗試獲取真實的客戶端 IP"""
        try:
            # 方法 1: 從環境變數獲取預期的客戶端 IP
            import os
            expected_client_ip = os.getenv("EXPECTED_CLIENT_IP")
            if expected_client_ip and self.is_valid_ip(expected_client_ip):
                return expected_client_ip
            
            # 方法 2: 檢查 Host header 中的 IP
            host_header = request.headers.get("host", "")
            if self.config.get("debug_print_request", False):
                print(f"  🔍 Host header: {host_header}")
            
            # 處理有端口號的情況
            if ":" in host_header:
                host_ip = host_header.split(":")[0]
            else:
                # 處理沒有端口號的情況
                host_ip = host_header
            
            if self.is_valid_ip(host_ip) and not host_ip.startswith("127."):
                # 如果 Host header 包含服務器 IP，推斷客戶端可能在同一網段
                if host_ip.startswith("192.168.0."):
                    inferred_ip = self.infer_client_ip_from_network(host_ip)
                    if inferred_ip:
                        if self.config.get("debug_print_request", False):
                            print(f"  ✅ Inferred client IP from host: {inferred_ip}")
                        return inferred_ip
            
            if self.config.get("debug_print_request", False):
                print(f"  ❌ WSL2 IP detection failed - no valid IP found")
            return None
        except Exception as e:
            if self.config.get("debug_print_request", False):
                print(f"  ❌ WSL2 IP detection failed: {e}")
            return None
    
    def infer_client_ip_from_network(self, server_ip: str) -> str:
        """從服務器 IP 推斷可能的客戶端 IP"""
        try:
            if self.config.get("debug_print_request", False):
                print(f"  🔍 Inferring client IP from server IP: {server_ip}")
            
            # 這是一個簡單的推斷邏輯
            # 在實際環境中，你可能需要更複雜的邏輯
            if server_ip in ["192.168.0.145", "192.168.0.145:8001", "192.168.0.145:5174"]:
                # 基於你的環境，我們知道客戶端是 192.168.0.126
                if self.config.get("debug_print_request", False):
                    print(f"  ✅ Matched known server IP, returning 192.168.0.126")
                return "192.168.0.126"
            
            # 其他情況下，嘗試從環境變數獲取
            import os
            fallback_ip = os.getenv("EXPECTED_CLIENT_IP")
            if fallback_ip and self.is_valid_ip(fallback_ip):
                if self.config.get("debug_print_request", False):
                    print(f"  ✅ Using fallback IP from env: {fallback_ip}")
                return fallback_ip
            
            return None
        except Exception as e:
            if self.config.get("debug_print_request", False):
                print(f"  ❌ Error in IP inference: {e}")
            return None
    
    def is_internal_container_ip(self, ip: str) -> bool:
        """檢查是否為容器內部 IP，這些通常不是真實的客戶端 IP"""
        internal_ranges = [
            "10.89.",      # 你遇到的容器網路
            "172.17.",     # Docker 預設網路
            "172.18.",     # Docker 自定義網路
            "172.19.",     # Docker 自定義網路
            "172.20.",     # Docker 自定義網路
            "10.0.",       # 常見的容器網路
            "127.",        # 本地回環
        ]
        
        for prefix in internal_ranges:
            if ip.startswith(prefix):
                return True
        return False

    
    def is_valid_ip(self, ip: str) -> bool:
        """檢查是否為有效的 IP 地址"""
        try:
            import ipaddress
            ipaddress.ip_address(ip)
            return True
        except ValueError:
            return False
    
    def is_ipv6(self, ip: str) -> bool:
        """檢查是否為 IPv6 地址"""
        try:
            import ipaddress
            return isinstance(ipaddress.ip_address(ip), ipaddress.IPv6Address)
        except ValueError:
            return False
    
    def should_exclude_request(self, method: str, path: str) -> bool:
        """Checks whether a request should be excluded"""
        
        # Check for an exact path match (silent check first)
        if path in self.config.get("exclude_exact_paths", []):
            return True
        
        # Check path prefix
        for prefix in self.config.get("exclude_path_prefixes", []):
            if path.startswith(prefix):
                return True
        
        # Check path pattern (inclusive match)
        for pattern in self.config.get("exclude_path_patterns", []):
            if pattern in path:
                return True
        
        # Check for a specific HTTP method + path combination
        for exclude_method, exclude_path in self.config.get("exclude_method_paths", []):
            if exclude_method == method and (exclude_path == "*" or exclude_path == path):
                return True
        
        return False
    
    def get_server_info(self) -> dict:
        """取得伺服器平台資訊"""
        try:
            return {
                "hostname": socket.gethostname(),
                "ip": socket.gethostbyname(socket.gethostname()),
                "platform": platform.system(),
                "architecture": platform.machine(),
                "python_version": platform.python_version()
            }
        except Exception as e:
            logger.warning(f"Failed to get server info: {e}")
            return {
                "hostname": "unknown",
                "ip": "unknown",
                "platform": "unknown",
                "architecture": "unknown",
                "python_version": "unknown"
            }
    
    def analyze_network_architecture(self, client_host: str, request: Request):
        """分析網路架構，幫助理解為什麼看到特定的 IP"""
        print(f"\n  🔍 Network Architecture Analysis:")
        
        # 檢查是否可能是容器/虛擬化環境
        if client_host.startswith('10.'):
            print(f"    ⚠️  IP {client_host} 在 10.x.x.x 範圍")
            print(f"    📋 可能原因:")
            print(f"       • Docker 容器網路 (通常 172.17.x.x 或 10.x.x.x)")
            print(f"       • 虛擬機器內部網路")
            print(f"       • 企業內部網路")
            print(f"       • VPN 連線")
        elif client_host.startswith('172.'):
            print(f"    ⚠️  IP {client_host} 在 172.x.x.x 範圍")
            print(f"    📋 可能原因:")
            print(f"       • Docker 預設網路 (172.17.0.0/16)")
            print(f"       • 私有網路範圍 (172.16.0.0-172.31.255.255)")
        elif client_host.startswith('192.168.'):
            print(f"    ✅ IP {client_host} 在標準家用/辦公室網路範圍")
        
        # 檢查 X-Forwarded-For 等 headers
        forwarded_ips = []
        for header in ["x-forwarded-for", "x-real-ip", "x-client-ip"]:
            value = request.headers.get(header)
            if value:
                forwarded_ips.append(f"{header}: {value}")
        
        if forwarded_ips:
            print(f"    🔄 發現代理 Headers (真實 IP 可能在這裡):")
            for ip_info in forwarded_ips:
                print(f"       • {ip_info}")
        else:
            print(f"    ❌ 沒有發現代理 Headers")
            print(f"    📋 這表示:")
            print(f"       • 直接連線 (沒有代理/負載平衡器)")
            print(f"       • 或者代理沒有設定正確的 Headers")
        
        # 環境偵測
        print(f"    🏗️  環境偵測:")
        try:
            # 檢查是否在容器中
            import os
            if os.path.exists('/.dockerenv'):
                print(f"       • 🐳 運行在 Docker 容器中")
            elif os.path.exists('/proc/1/cgroup'):
                with open('/proc/1/cgroup', 'r') as f:
                    if 'docker' in f.read():
                        print(f"       • 🐳 運行在 Docker 容器中")
            
            # 檢查網路介面
            import subprocess
            if platform.system() == "Windows":
                result = subprocess.run(['ipconfig'], capture_output=True, text=True, timeout=3)
                if result.returncode == 0:
                    output = result.stdout
                    if 'Docker' in output:
                        print(f"       • 🐳 偵測到 Docker 網路介面")
                    if '192.168.0.' in output:
                        print(f"       • 🏠 偵測到 192.168.0.x 網路")
        except:
            pass
    
    def get_client_hostname(self, client_ip: str) -> str:
        """嘗試取得客戶端電腦名稱"""
        try:
            if client_ip and client_ip != "unknown":
                hostname = socket.gethostbyaddr(client_ip)[0]
                return hostname
        except Exception:
            pass
        return "unknown"
    
    def filter_sensitive_data(self, data):
        """Filter sensitive data"""
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