# Instrucciones para Desplegar en Firebase Hosting

## Paso 1: Instalar Firebase CLI

Ejecuta uno de estos comandos en tu terminal:

### Opción A: Con npm (si tienes Node.js)
```bash
npm install -g firebase-tools
```

### Opción B: Con Homebrew (recomendado para macOS)
```bash
# Instalar Homebrew si no lo tienes
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Firebase CLI
brew install firebase-cli
```

### Opción C: Descarga directa
1. Ve a: https://firebase.google.com/docs/cli#install-cli-mac-linux
2. Descarga el binario para macOS
3. Sigue las instrucciones de instalación

## Paso 2: Autenticarse con Firebase

```bash
firebase login
```

## Paso 3: Verificar la configuración

```bash
# Verificar que estás en el directorio correcto
cd /Users/einzunza/Dropbox/UABC/CURSOR/DEVOPS/MyFirstApp

# Verificar la configuración
firebase projects:list
```

## Paso 4: Desplegar

```bash
firebase deploy
```

## Configuración ya creada:

✅ `firebase.json` - Configuración de hosting
✅ `.firebaserc` - Proyecto configurado (myfirstapp-7c7b0)
✅ `firebase-init.js` - Configuración de Firebase para tu app

## URL del proyecto desplegado:
Una vez desplegado, tu sitio estará disponible en:
**https://myfirstapp-7c7b0.web.app**

## Comandos útiles:

```bash
# Ver el estado del proyecto
firebase projects:list

# Servir localmente antes de desplegar
firebase serve

# Ver logs de despliegue
firebase deploy --debug

# Desplegar solo hosting
firebase deploy --only hosting
```

## Notas importantes:

1. **API Key de OpenAI**: Recuerda actualizar tu `config.js` con la API key real antes de desplegar
2. **Dominio personalizado**: Puedes configurar un dominio personalizado en la consola de Firebase
3. **SSL**: Firebase Hosting incluye SSL automático
4. **CDN**: Tu sitio se servirá desde la CDN global de Firebase

## Solución de problemas:

Si tienes problemas con la instalación de Firebase CLI:
1. Asegúrate de tener permisos de administrador
2. Reinicia tu terminal después de la instalación
3. Verifica que `firebase --version` funcione
