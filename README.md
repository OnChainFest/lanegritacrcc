# 🎳 Torneo La Negrita CRCC 2025

Plataforma oficial para la gestión del Torneo de Boliche **La Negrita 2025** del Country Club Río Cuarto, desarrollada para facilitar la inscripción, gestión de llaves (brackets), registro de puntajes y visualización de estadísticas en tiempo real.

---

## ✨ Características Principales

- Registro público de jugadores
- Panel administrativo seguro
- Gestión de brackets y rondas
- Ingreso de puntajes y seguimiento en vivo
- Estadísticas del torneo en tiempo real
- Sistema de pagos e inscripción validada
- Interfaz responsive (móvil y escritorio)

---

## 🧩 Tecnologías Utilizadas

- **Frontend**: Next.js 14, React, TypeScript
- **Estilos**: Tailwind CSS, shadcn/ui
- **Backend & DB**: Supabase (PostgreSQL + Auth)
- **Autenticación**: JWT personalizado + RLS (Row Level Security)
- **Deploy & Hosting**: Vercel

---

## 📌 Funcionalidades

### 🧍 Para Participantes

- Registro e inscripción en línea
- Visualización de brackets en tiempo real
- Seguimiento de puntajes personales y globales
- Acceso a reglamento oficial

### 🛠️ Para Administradores

- Login seguro con credenciales protegidas
- Validación de inscripciones y pagos
- Gestión de llaves y emparejamientos
- Ingreso manual de puntajes por ronda
- Visualización de estadísticas globales del torneo

---

## 🔧 Instalación Local

\`\`\`bash
# Clonar el repositorio
git clone https://github.com/OnChainFest/lanegritacrcc.git
cd lanegritacrcc

# Instalar dependencias
npm install

# Crear y configurar archivo de entorno
cp .env.example .env.local
# Editar .env.local con credenciales de Supabase

# Ejecutar aplicación en modo desarrollo
npm run dev

\`\`\`

## 🚀 Despliegue en Producción (Vercel)

El proyecto está preparado para despliegue automático en Vercel:

1. Conecta este repositorio a tu cuenta de [Vercel](https://vercel.com).
2. Configura las variables de entorno (`.env.local`) desde el Vercel Dashboard.
3. Ejecuta los scripts SQL necesarios en tu proyecto de Supabase.
4. Publica y accede a la plataforma desde tu dominio personalizado.

---

## 🗃️ Estructura de Base de Datos (Supabase)

### Tablas Principales

- `players`: Información de registro de jugadores.
- `tournaments`: Configuración general de torneos.
- `brackets`: Llaves y emparejamientos del torneo.
- `player_series`: Resultados de partidas individuales.
- `tournament_rounds`: Fases y rondas del torneo.
- `tournament_standings`: Clasificaciones y estadísticas.
- `login_attempts`: Registro de intentos de acceso administrativo.
- `user_activities`: Auditoría de cambios y acciones en la plataforma.

---

## 🔐 Seguridad

- **JWT personalizado**: Control seguro de sesiones de usuario.
- **RLS (Row Level Security)**: Protección a nivel de fila en Supabase para cada tabla sensible.
- **Control de roles**: Separación de permisos entre jugadores y administradores.
- **Protección CSRF**: Middleware activo para prevenir ataques de falsificación de solicitudes.
- **Validación de datos**: Validaciones estrictas tanto en frontend como backend.

---

## 📊 Estadísticas y Reportes

- Clasificación general por puntaje total y promedio.
- Mejor partida individual por jugador.
- Distribución de participación por categoría.
- Estados de inscripción (pendiente, verificado).
- Exportación de datos en formato CSV y Excel para análisis externo.

---

## 🏟️ Detalles del Torneo

- **Nombre**: Torneo de Boliche “La Negrita” 2025  
- **Ubicación**: Country Club Río Cuarto, Costa Rica  
- **Modalidad**: Eliminación directa  
- **Categorías**: Handicap, Scratch, Senior, Maratón de Strikes, Desesperado

---

## 📄 Licencia

Este software fue desarrollado exclusivamente para fines organizativos del **Torneo La Negrita CRCC 2025**.  
Su uso está restringido a contextos relacionados con el evento y requiere autorización del comité organizador.
