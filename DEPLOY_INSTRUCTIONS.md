# 🚀 Instrucciones de Deploy - Vercel

## Deploy en 3 Pasos

### 1. Ve a Vercel
Abre [vercel.com](https://vercel.com) e inicia sesión con GitHub

### 2. Importa el Repositorio
1. Click en "Add New Project"
2. Selecciona el repositorio: `OnChainFest/lanegritacrcc`
3. Click en "Import"

### 3. Configura Variables de Entorno
Agrega estas variables en el dashboard de Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
JWT_SECRET=tu_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu_contraseña_segura

# Stripe (opcional por ahora)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (opcional)
RESEND_API_KEY=tu_resend_key
```

### 4. Deploy
Click en "Deploy" - ¡listo en 2 minutos!

## URL del Sitio
Vercel te dará una URL como:
```
https://lanegritacrcc.vercel.app
```

## Configurar Dominio Personalizado (Opcional)
1. En Vercel dashboard > Settings > Domains
2. Agrega tu dominio
3. Actualiza DNS según instrucciones

---

## Webhook de Stripe (Cuando configures Stripe)
Después del deploy, actualiza el webhook en Stripe Dashboard:
```
https://tu-dominio.vercel.app/api/stripe/webhook
```

---

¡Eso es todo! El sitio estará en vivo y accesible públicamente.
