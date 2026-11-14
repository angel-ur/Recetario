# ADR 0005: Sesiones de cocina que se entrelazan solas (sustituye «Cocinar a la vez»)

Estado: aceptada, 14-11-2026

## Contexto
El formulario «Cocinar a la vez» pedía elegir platos y una hora antes de cocinar. En la cocina real se abre una receta, se empieza, y a los pocos minutos se abre otra. Además, el plan de cada receta usaba una hora suelta (la del último «empiezo ahora» o la de abrir la pantalla), así que las horas no coincidían con cuándo se había empezado de verdad.

## Decisión
- «Empezar a cocinar» crea una sesión por receta en localStorage (`recetario:v2:sesiones`: inicio, último toque, método, pausa, color). Máximo 3 a la vez.
- Con 2 o más sesiones, la vista «Ahora» entrelaza los pasos con un planificador por dependencias: cada paso espera a los que necesita (`tras`), puede hacerse a la vez que otro (`durante`), el horno es uno solo y la persona también.
- Las sesiones caducan solas: aviso a las 4 h sin tocarlas, cierre a las 6 h (o duración total + 2 h en recetas largas), sin guardar nada.
- Con una sesión activa, todas las horas de esa receta (plan, capítulos, modo cocina) parten de la hora real de inicio. La hora de inicio se puede corregir en «Ahora > Tus platos».

## Consecuencias
- Todo vive en el móvil: otra persona o dispositivo no ve las sesiones.
- Solo caldo, rabo, cocido, lentejas y paella tienen dependencias explícitas; el resto usa el orden por defecto.
- El tiempo ya transcurrido se mide desde el último «Hecho»: es una aproximación.
- Un móvil bloqueado no puede avisar con sonido.
