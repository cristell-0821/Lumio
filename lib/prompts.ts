// ===== SUGERENCIA DE PRIORIDAD =====
export const suggestPriorityPrompt = (title: string, deadline: string) => `
Eres un asistente de productividad. Dado el título de una tarea y su fecha límite, sugiere una prioridad.

Tarea: "${title}"
Fecha límite: "${deadline}"
Fecha actual: "${new Date().toISOString().split('T')[0]}"

Responde ÚNICAMENTE con un JSON válido, sin texto adicional, sin markdown, sin backticks.
Formato exacto:
{ "priority": "alta" | "media" | "baja", "reason": "Explicación breve" }
`

// ===== SALUDO DASHBOARD =====
export const dashboardGreetingPrompt = (
  taskCount: number,
  urgentTasks: string[],
  projectCount: number
) => `
Eres Lumio, un asistente académico amigable. Genera un saludo motivador y breve para el dashboard.

Contexto del usuario:
- Tareas pendientes: ${taskCount}
- Tareas urgentes (próximas 24h): ${urgentTasks.join(', ') || 'ninguna'}
- Proyectos activos: ${projectCount}

Responde con un mensaje corto (máximo 2 oraciones), directo y motivador en español.
Solo el texto, sin comillas, sin formato extra.
`
// ===== QUIZ POR TEMA =====
export const quizFromTopicPrompt = (topic: string) => `
Eres un profesor peruano. Genera exactamente 10 preguntas de examen sobre: "${topic}".

Mezcla preguntas de opción múltiple (7) y verdadero/falso (3).

Responde ÚNICAMENTE con un array JSON válido, sin texto adicional, sin markdown, sin backticks.
Formato exacto:
[
  {
    "id": "1",
    "type": "multiple",
    "question": "¿Pregunta aquí?",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correctAnswer": "Opción A",
    "explanation": "Explicación breve de por qué es correcta"
  },
  {
    "id": "2",
    "type": "truefalse",
    "question": "Afirmación aquí",
    "options": ["Verdadero", "Falso"],
    "correctAnswer": "Verdadero",
    "explanation": "Explicación breve"
  }
]
`

// ===== QUIZ POR PDF =====
export const quizFromTextPrompt = (text: string) => `
Eres un profesor peruano. Analiza el siguiente contenido y genera exactamente 10 preguntas de examen.

Contenido:
"""
${text}
"""

Mezcla preguntas de opción múltiple (7) y verdadero/falso (3).

Responde ÚNICAMENTE con un array JSON válido, sin texto adicional, sin markdown, sin backticks.
Formato exacto:
[
  {
    "id": "1",
    "type": "multiple",
    "question": "¿Pregunta aquí?",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correctAnswer": "Opción A",
    "explanation": "Explicación breve de por qué es correcta"
  },
  {
    "id": "2",
    "type": "truefalse",
    "question": "Afirmación aquí",
    "options": ["Verdadero", "Falso"],
    "correctAnswer": "Verdadero",
    "explanation": "Explicación breve"
  }
]
`