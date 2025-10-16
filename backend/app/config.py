# API tracking settings
API_LOG_CONFIG = {
    # Whether to enable API tracing
    "enabled": True,
    
    # Whether to print detailed request information to console (for development)
    "debug_print_request": True,
    
    # List of paths to exclude from tracing (exact match)
    "exclude_exact_paths": [
        "/health",
        "/reports/cpu_stats",  # Do Not track cpu_stats API
        "/platforms/latest_reports",  # 排除這個 API，因為會固定時間自動呼叫
        "/",
        "/docs",
        "/redoc",
        "/openapi.json",
        "/favicon.ico"
    ],
    
    # Exclude path prefixes from tracing (prefix matching)
    "exclude_path_prefixes": [
        "/static/",
        "/assets/",
        "/css/",
        "/js/",
        "/img/",
        "/uploads/"  # 排除頭像等上傳檔案
    ],
    
    # Path patterns to exclude from tracing (inclusive matching)
    "exclude_path_patterns": [
        "swagger",
        "favicon"
    ],
    
    # Excluding specific HTTP method + path combinations
    "exclude_method_paths": [
        ("GET", "/api-logs"),  # Avoid logging the API that views the log, causing an infinite loop
        ("OPTIONS", "*")       # Exclude all OPTIONS requests
    ],
    
    # Whether to log the request body (which may contain sensitive information)
    "log_request_body": True,
    
    # Maximum request body length (number of characters)
    "max_request_body_length": 2000,
    
    # Sensitive field keywords (these fields will be filtered)
    "sensitive_fields": [
        "password", "passwd", "pwd",
        "token", "access_token", "refresh_token",
        "secret", "api_key", "private_key",
        "credit_card", "ssn", "social_security"
    ]
}