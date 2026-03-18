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
  projectCount: number,
  name?: string
) => `
Eres un asistente académico amigable llamado Lumio.
${name ? `El estudiante se llama ${name}.` : ''}
Genera un saludo personalizado, breve y motivador (máximo 2 oraciones) para un estudiante que tiene:
- ${taskCount} tareas pendientes
- ${urgentTasks.length > 0 ? `Tareas urgentes: ${urgentTasks.join(', ')}` : 'Sin tareas urgentes'}
- ${projectCount} proyectos activos
${name ? `Dirígete a ${name} por su nombre.` : ''}
Responde solo el saludo, sin comillas, sin explicaciones.
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