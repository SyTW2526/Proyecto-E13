#!/bin/bash

echo "🚀 Iniciando proyecto..."

# Función para manejar Ctrl+C
cleanup() {
    echo ""
    echo "⏹️  Deteniendo servicios..."
    kill 0
    exit
}

trap cleanup SIGINT

# Iniciar servidor en segundo plano
echo "🔧 Iniciando servidor..."
cd server
npm run dev &
SERVER_PID=$!

# Esperar un momento para que el servidor inicie
sleep 2

# Iniciar cliente en segundo plano
echo "🎨 Iniciando cliente..."
cd ../client
npm run dev &
CLIENT_PID=$!

echo ""
echo "✅ Servicios iniciados:"
echo "   - Servidor: http://localhost:3000"
echo "   - Cliente: http://localhost:5173"
echo ""
echo "Presiona Ctrl+C para detener ambos servicios"

# Esperar a que ambos procesos terminen
wait
