#!/bin/bash
# FAST/HOT·100 一键启动：本地起服务并打开浏览器
cd "$(dirname "$0")"

PORT=8100
PIDFILE=".server.pid"

# 已在运行就直接开页面
if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "服务已在运行 (PID $(cat "$PIDFILE"))，直接打开页面"
  open "http://localhost:$PORT"
  exit 0
fi

# 端口被别的进程占着也直接开页面
if lsof -i ":$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "端口 $PORT 已有服务，直接打开页面"
  open "http://localhost:$PORT"
  exit 0
fi

python3 -m http.server "$PORT" >/dev/null 2>&1 &
echo $! > "$PIDFILE"
sleep 1
open "http://localhost:$PORT"
echo "FAST/HOT·100 已启动 → http://localhost:$PORT  (PID $(cat "$PIDFILE"))"
echo "关闭请双击「关闭.command」，本窗口可直接关掉。"
