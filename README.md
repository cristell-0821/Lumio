# 🌿 Lumio — Asistente Académico Inteligente

Lumio es una aplicación web para estudiantes universitarios que combina gestión de tareas, estudio con flashcards generadas por IA y planificación de proyectos grupales. Todo en un solo lugar, con soporte para modo oscuro y claro.

---

## ✨ Funcionalidades

### 🗂️ Tareas & Kanban
- Tablero Kanban con columnas: **Pendiente**, **En Progreso** y **Listo**
- Drag & drop para mover tareas entre columnas
- Prioridades: alta, media y baja
- Filtros por prioridad y por materia
- Validación de fechas (no permite fechas pasadas)
- Editar y eliminar tareas con confirmación

### 🃏 Flashcards con IA
- Generación automática de flashcards a partir de un **tema** o **texto**
- Animación de volteo (flip) en cada tarjeta
- Guardar sets por materia
- **Exportar sets a PDF** con diseño profesional

### 👥 Proyectos Grupales
- Crear proyectos con nombre, descripción y fecha límite
- Agregar miembros y asignar tareas
- Reasignar tareas en cualquier momento
- Barra de progreso según tareas completadas
- Editar proyectos existentes

### ⏱️ Modo Focus (Pomodoro)
- Timer con anillo SVG animado
- Sesiones de foco y descanso personalizables
- Sonido al terminar cada sesión
- Frases motivacionales al completar
- Contador de sesiones del día

### 🤖 Dashboard con IA
- Saludo personalizado generado por IA según tus tareas pendientes
- Resumen de actividad académica en tiempo real

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 14** | Framework principal (App Router) |
| **TypeScript** | Tipado estático |
| **Tailwind CSS v4** | Estilos y diseño |
| **Groq API** (Llama 3.3) | Inteligencia artificial |
| **@hello-pangea/dnd** | Drag & drop del Kanban |
| **next-themes** | Dark/Light mode |
| **jsPDF** | Exportar flashcards a PDF |
| **lucide-react** | Íconos |
| **localStorage** | Persistencia de datos |

---

## 🚀 Correr el proyecto localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/cristell-0821/lumio.git
cd lumio
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
GROQ_API_KEY=tu_api_key_aqui
```

Puedes obtener una API key gratuita en [console.groq.com](https://console.groq.com)

### 4. Correr el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📁 Estructura del proyecto

```
lumio/
├── app/
│   ├── layout.tsx          # Layout global + theme provider
│   ├── page.tsx            # Dashboard principal
│   ├── tasks/page.tsx      # Kanban de tareas
│   ├── flashcards/page.tsx # Flashcards con IA
│   ├── projects/page.tsx   # Proyectos grupales
│   ├── focus/page.tsx      # Timer Pomodoro
│   └── api/ai/route.ts     # Endpoint seguro para Groq API
├── components/
│   ├── ui/                 # ConfirmModal, Toast, PageTransition
│   ├── layout/             # Sidebar, ThemeToggle
│   ├── tasks/              # TaskCard, TaskColumn
│   ├── flashcards/         # FlashCard, FlashcardGenerator
│   └── projects/           # ProjectCard, ProjectDetail
├── lib/
│   ├── storage.ts          # Helpers de localStorage
│   ├── prompts.ts          # Prompts para la IA
│   ├── exportPDF.ts        # Exportar flashcards a PDF
│   └── useToast.ts         # Hook para notificaciones
└── types/
    └── index.ts            # Tipos TypeScript globales
```

## 👨‍💻 Autor

Desarrollado por: cristell-0821 

