// ===== FLASHCARDS POR TEMA =====
export const flashcardsFromTopicPrompt = (topic: string, amount: number = 8) => `
Eres un asistente educativo. Genera ${amount} flashcards sobre el tema: "${topic}".

Responde ÚNICAMENTE con un array JSON válido, sin texto adicional, sin markdown, sin backticks.
Formato exacto:
[
  { "question": "¿Pregunta aquí?", "answer": "Respuesta aquí" },
  ...
]
`

// ===== FLASHCARDS POR TEXTO =====
export const flashcardsFromTextPrompt = (text: string, amount: number = 8) => `
Eres un asistente educativo. Analiza el siguiente texto y genera ${amount} flashcards con los conceptos más importantes.

Texto:
"""
${text}
"""

Responde ÚNICAMENTE con un array JSON válido, sin texto adicional, sin markdown, sin backticks.
Formato exacto:
[
  { "question": "¿Pregunta aquí?", "answer": "Respuesta aquí" },
  ...
]
`

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