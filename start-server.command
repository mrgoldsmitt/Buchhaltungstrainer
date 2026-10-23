#!/bin/bash
cd "$(dirname "$0")"
PORT=8085
echo "Starte Buchhaltungstrainer auf http://localhost:$PORT ..."
python3 -m http.server $PORT &
echo $! > server.pid
echo "Server gestartet (PID $(cat server.pid)). Aufruf: http://localhost:$PORT"
