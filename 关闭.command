#!/bin/bash
# FAST/HOT·100 一键关闭：停掉本地服务
cd "$(dirname "$0")"

PORT=8100
PIDFILE=".server.pid"
stopped=0

if [ -f "$PIDFILE" ]; then
  PID=$(cat "$PIDFILE")
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID" && stopped=1
    echo "已停止服务 (PID $PID)"
  fi
  rm -f "$PIDFILE"
fi

# 兜底：按端口清理（只杀本目录起的 http.server）
PIDS=$(lsof -ti ":$PORT" -sTCP:LISTEN 2>/dev/null)
if [ -n "$PIDS" ]; then
  kill $PIDS 2>/dev/null && stopped=1
  echo "已清理占用端口 $PORT 的进程: $PIDS"
fi

[ "$stopped" = "0" ] && echo "没有发现在运行的服务，无需关闭。"
echo "完成，本窗口可直接关掉。"
