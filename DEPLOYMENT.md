# Vercel Deployment Configuration

## Variables de Entorno Requeridas

Configura las siguientes variables de entorno en tu proyecto de Vercel:

### Base de Datos
- `DATABASE_URL`: URL de conexión a PostgreSQL (usar pooling)
- `DIRECT_URL`: URL directa a PostgreSQL (para migraciones)

### Autenticación
- `JWT_SECRET`: Secret key para JWT
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID

### Google Gemini AI (Chatbot) - GRATUITO
**Gemini es la opción recomendada**: gratuito, potente y compatible con Vercel.

1. Ve a https://aistudio.google.com/app/apikey
2. Genera una API key gratuita
3. Configura las variables:
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Tu API key de Gemini
   - `GEMINI_MODEL`: `gemini-1.5-flash` (recomendado, rápido y gratuito)

### Alternativas de IA (si no quieres usar Gemini):
- **Groq** (gratuito y muy rápido): https://console.groq.com
  - `GROQ_API_KEY`
  - `GROQ_MODEL`: `llama-3.1-8b-instant`

- **OpenAI** (de pago): https://platform.openai.com
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL`: `gpt-3.5-turbo`
  
- **OpenRouter** (tiene modelos gratuitos): https://openrouter.ai
  - `OPENROUTER_API_KEY`
  - `OPENROUTER_MODEL`: `meta-llama/llama-3.1-8b-instruct:free`

## Pasos para Desplegar

1. **Conectar el repositorio a Vercel**:
   ```bash
   vercel login
   vercel --prod
   ```

2. **Configurar variables de entorno** en el dashboard de Vercel

3. **Verificar build**:
   - Client: `npm run vercel-build`
   - Server: `npm run vercel-build`

4. **Deploy**:
   ```bash
   vercel --prod
   ```

## Cómo desinstalar Ollama de tu máquina local

Si instalaste Ollama y ya no lo necesitas:

### Linux:
```bash
sudo systemctl stop ollama
sudo systemctl disable ollama
sudo rm /usr/local/bin/ollama
sudo rm -rf /usr/share/ollama
sudo rm -rf ~/.ollama
sudo userdel ollama
```

### macOS:
```bash
brew uninstall ollama
rm -rf ~/.ollama
```

### Windows:
- Ve a "Agregar o quitar programas"
- Busca "Ollama"
- Haz clic en "Desinstalar"
- Elimina la carpeta `C:\Users\TuUsuario\.ollama`

## Notas Importantes

- ✅ Google Gemini funciona perfectamente en Vercel (serverless)
- ✅ Es completamente gratuito (con límites generosos)
- ✅ Muy potente (contexto de hasta 1M tokens en algunos modelos)
- ✅ Integrado con el ecosistema de Google
- ⚠️ Vercel tiene límites de tiempo de ejecución (10s hobby, 60s pro)
