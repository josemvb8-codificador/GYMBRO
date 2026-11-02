# GYMBRO 🏋️

App web para entrenar en casa y en el gimnasio, pensada para el celular (y usable en la Mac).
Funciona sin servidor, sin cuentas y sin conexión: tus datos se guardan en tu dispositivo.

**URL (cuando actives GitHub Pages):** https://josemvb8-codificador.github.io/GYMBRO/

## Funciones

- **Biblioteca de ejercicios**: más de 70 ejercicios por grupo muscular (pecho, espalda, hombros, bíceps, tríceps, piernas, glúteos, core y cardio), con filtro **Casa / Gym**, buscador y técnica de cada uno. Puedes crear ejercicios propios.
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
| `data.js` | Biblioteca de ejercicios (puedes añadir más aquí) |
| `sw.js` | Service worker para que funcione sin conexión |
| `manifest.webmanifest`, `icons/` | Icono y datos para instalarla |

No hay que compilar nada: son archivos estáticos.

## Probar en local (opcional)

```bash
python3 -m http.server 8000
```

Luego abre http://localhost:8000 en el navegador.

## Notas

- Los datos viven en el navegador de cada dispositivo (`localStorage`). El celular y la Mac **no se sincronizan solos**: usa *Exportar / Importar copia* en Ajustes.
- Si borras los datos del sitio en el navegador, se borra tu historial. Haz copias de vez en cuando.
- Si cambias archivos, sube la versión de `CACHE` en `sw.js` para que los dispositivos descarguen la nueva versión.
