#!/bin/bash

echo "🚀 Instalando dependencias del proyecto..."

# Instalar dependencias del servidor
echo ""
echo "📦 Instalando dependencias del servidor..."
cd server
npm install
cd ..

# Instalar dependencias del cliente
echo ""
echo "📦 Instalando dependencias del cliente..."
cd client
npm install
cd ..

echo ""
echo "✅ ¡Instalación completa!"
echo "Ejecuta ./start.sh para iniciar el proyecto"
