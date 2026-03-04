@echo off
REM =====================================================
REM BlueVision NAT Port Proxy Setup Script
REM This script configures Windows port forwarding for
REM BlueVision production services
REM =====================================================

echo =====================================================
echo BlueVision NAT Port Proxy Setup
echo =====================================================
echo.

echo.
echo [Step 0/3] Current NAT table:
echo.

netsh interface portproxy show all

echo.
echo [Step 1/3] Removing existing NAT rules...
echo.

netsh interface portproxy delete v4tov4 listenaddress=192.168.70.122 listenport=5174
netsh interface portproxy delete v4tov4 listenaddress=192.168.70.122 listenport=8001

netsh interface portproxy delete v4tov4 listenaddress=10.225.74.134 listenport=5174
netsh interface portproxy delete v4tov4 listenaddress=10.225.74.134 listenport=8001

echo.
echo [Step 2/3] Adding new NAT rules...
echo.

netsh interface portproxy add v4tov4 listenaddress=192.168.70.122 listenport=5174 connectaddress=127.0.0.1 connectport=5174
netsh interface portproxy add v4tov4 listenaddress=192.168.70.122 listenport=8001 connectaddress=127.0.0.1 connectport=8001

netsh interface portproxy add v4tov4 listenaddress=10.225.74.134 listenport=5174 connectaddress=127.0.0.1 connectport=5174
netsh interface portproxy add v4tov4 listenaddress=10.225.74.134 listenport=8001 connectaddress=127.0.0.1 connectport=8001

echo.
echo [Step 3/3] Current NAT table:
echo.

netsh interface portproxy show all

echo.
echo =====================================================
echo NAT setup completed!
echo =====================================================
pause
