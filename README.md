# GYMBRO 🏋️

App web para entrenar en casa y en el gimnasio, pensada para el celular (y usable en la Mac).
Funciona sin servidor, sin cuentas y sin conexión: tus datos se guardan en tu dispositivo.

**URL:** https://josemvb8-codificador.github.io/GYMBRO/

## Funciones

- **Armar mi rutina ✨**: responde unas preguntas (objetivo, sexo y enfoque —equilibrado, glúteos y piernas o tren superior—, casa o gym y material, nivel, días y tiempo) y GYMBRO genera un plan semanal completo con series, repeticiones y descansos adecuados. Puedes pedir otra variante y editarlo después.
- **Versión de imágenes a elegir**: fotos reales (versión 1) o animaciones 3D (versión 2). Se elige al abrir la app por primera vez y se cambia en Ajustes ⚙️.
- **Mi cuerpo**: perfil (sexo, edad, altura, actividad), registro de peso y medidas (cuello, cintura, cadera, pecho, brazo, muslo) con gráficas, e índices personales: IMC, % de grasa (método US Navy o estimado), masa magra, FFMI, metabolismo basal, gasto diario, cintura/altura, cintura/cadera, peso saludable, agua y proteína diarias.
- **Nutrición**: calorías y macros según tu objetivo (déficit calórico, mantener o ganar músculo) y propuestas de comidas para el día (3, 4 o 5 comidas, omnívora o vegetariana) con cantidades ajustadas; puedes cambiar cada comida o pedir otra propuesta.
- **Biblioteca de ejercicios**: 82 ejercicios por grupo muscular (pecho, espalda, hombros, bíceps, tríceps, piernas, glúteos, core y cardio) con un maniquí 3D animado que resalta en **rojo** el músculo trabajado, **mapa muscular** (frente y espalda, principal y secundario), pasos para hacerlo y consejos. Filtro **Casa / Gym**, buscador y ejercicios propios.
- **Rutinas por músculo**: infografía por grupo muscular con niveles Principiante / Intermedio / Avanzado, series × repeticiones e imágenes; entrénala al momento o guárdala como rutina.
- **Rutinas por día**: asigna una rutina a uno o varios días de la semana, con series, repeticiones (o segundos/minutos) y descanso por ejercicio. Incluye rutinas de ejemplo.
- **Registro del entrenamiento**: peso y repeticiones por serie, con lo que hiciste la vez anterior como referencia (tócalo para copiarlo).
- **Temporizador de descanso**: arranca solo al marcar una serie, con ±15 s, sonido y vibración (Android).
- **Historial y progreso**: sesiones, volumen, récords (PR) y gráficas por ejercicio (peso máximo, 1RM estimado, volumen).
- **Copia de seguridad**: exporta/importa tus datos (Ajustes ⚙️) para pasarlos entre el celular y la Mac.
- **Instalable (PWA)**: añádela a la pantalla de inicio y se abre como una app, también sin internet.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | Estructura de la app |
| `styles.css` | Diseño oscuro, pensado para usar con una mano |
| `app.js` | Lógica (rutinas, registro, temporizador, historial) |
| `data.js` | Biblioteca de ejercicios con instrucciones (puedes añadir más aquí) |
| `muscles.js` | Músculos que trabaja cada ejercicio y siluetas del mapa muscular |
| `comidas.js` | Base de comidas con macros para las propuestas de nutrición |
| `img/foto/` | Fotos reales de cada ejercicio (versión 1): inicio, final y miniatura |
| `img/ex/` | Animación 3D (`<id>.webp`) y miniatura (`<id>-t.webp`) de cada ejercicio (versión 2) |
| `sw.js` | Service worker para que funcione sin conexión |
| `manifest.webmanifest`, `icons/` | Icono y datos para instalarla |

No hay que compilar nada: son archivos estáticos.

## Probar en local (opcional)

```bash
python3 -m http.server 8000
```

Luego abre http://localhost:8000 en el navegador.

## Versiones

- **Versión 3** (rama `main`, la publicada): incluye las imágenes de la versión 1 y de la versión 2 (se elige en la app), Mi cuerpo, Nutrición y rutinas por sexo.
- **Versión 1** (rama [`version-1`](https://github.com/josemvb8-codificador/GYMBRO/tree/version-1)): la primera versión con fotos reales, guardada tal cual.

## Créditos

- Fotos de ejercicios: [Free Exercise DB](https://github.com/yuhonas/free-exercise-db), dominio público (Unlicense).
- Animaciones 3D de ejercicios: [Open Exercise Figures](https://github.com/AbanoubAmir/open-exercise-figures), dominio público (CC0).
- Siluetas del mapa muscular: [react-body-highlighter](https://github.com/giavinh79/react-body-highlighter), licencia MIT © 2020 GV79.

## Notas

- Los datos viven en el navegador de cada dispositivo (`localStorage`). El celular y la Mac **no se sincronizan solos**: usa *Exportar / Importar copia* en Ajustes.
- Si borras los datos del sitio en el navegador, se borra tu historial. Haz copias de vez en cuando.
- Si cambias archivos, sube la versión de `CACHE` en `sw.js` para que los dispositivos descarguen la nueva versión.
- Los índices y las calorías son estimaciones generales (Mifflin-St Jeor, US Navy) y no sustituyen a un profesional de la salud.
- Para entrenar sin señal en el gimnasio, en Ajustes ⚙️ toca **Guardar imágenes para usar sin internet** una vez.
