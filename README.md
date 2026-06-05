<h1 align="center">⏱️ FocusLife</h1>
<h3 align="center">Gestor de productividad SPA con técnica Pomodoro</h3>

<p align="center">
  <a href="https://albabustamante98.github.io/FocusLife/">
    <img src="https://img.shields.io/badge/VER_DEMO-007BFF?style=for-the-badge&logo=vercel&logoColor=white" alt="Ver Demo">
  </a>
</p>

<p align="center">
  Proyecto final de <strong>Lenguaje de Marcas</strong> (1º DAM) enfocado en la manipulación avanzada del DOM mediante JavaScript Vainilla.
</p>

---

## 📋 Descripción

**FocusLife** es una **SPA (Single Page Application)**. Esto significa que el archivo HTML base está prácticamente vacío (solo contiene un `<div id="app"></div>`) y toda la interfaz, categorías y paneles se construyen, destruyen y actualizan dinámicamente desde JavaScript sin recargar la página en ningún momento.

El diseño visual está construido desde cero aplicando el estilo **Glassmorphism** (efecto cristal esmerilado), logrando una interfaz limpia y fluida.

---

## ✨ Funcionalidades Destacadas

* **Gestión Inteligente:** Creación de tareas con título, descripción, fecha, categoría (Estudio, Trabajo, Personal) y Nivel de Energía (Alta, Media, Baja).
* **Motor de Recomendaciones:** Según el estado de ánimo diario que selecciones, el sistema recalcula y resalta visualmente por qué tarea deberías empezar.
* **Modo Enfoque (Pomodoro):** Temporizador funcional integrado (25 minutos) con alertas gestionadas mediante la librería `SweetAlert2`.
* **Persistencia Local:** Uso de `LocalStorage` para guardar el estado de las tareas (completadas, favoritas, eliminadas) sin necesidad de backend.
* **Búsqueda en Tiempo Real:** Filtrado dinámico por texto en el título o descripción.
* **Mini-Calendario:** Navegación por fechas que actualiza automáticamente la lista de "Tareas de Hoy".

---

## 🛠️ Tecnologías

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![SweetAlert2](https://img.shields.io/badge/SweetAlert2-8A2BE2?style=for-the-badge&logo=javascript&logoColor=white)

</div>

---

## 💡 Conceptos Aplicados (Los 14 pilares del proyecto)

A nivel de código, este proyecto me ha servido para consolidar los siguientes conceptos de JavaScript:

| Apartado | Concepto Técnico aplicado en el código |
| :--- | :--- |
| 1 | **Creación dinámica del DOM** desde cero (`createElement`, `innerHTML`, `appendChild`). |
| 2 | **Selección y manipulación de nodos** (`getElementById`, `querySelectorAll`). |
| 3 | **Modificación en tiempo real de estilos y clases** (`classList.toggle`, manipulación de `style`). |
| 4 | **Delegación global de eventos** sobre el contenedor padre para optimizar el rendimiento. |
| 5 | **Navegación avanzada por la jerarquía del DOM** (`e.target.closest()`). |
| 6 | **Gestión integral de eventos de usuario** (`click`, `submit`, `input`, `change`). |
| 7 | Uso de **Atributos de Datos Personalizados** (`dataset.categoria`, `dataset.energia`) para lógica condicional. |
| 8 | **Manipulación de Arrays de Nodos** (`Array.from()`) y métodos funcionales (`filter`, `find`, `sort`). |
| 9 | **Validación de formularios** mediante JavaScript previniendo el comportamiento por defecto (`preventDefault`). |
| 10 | **Eliminación y transición de elementos** del árbol del DOM (`remove()`, `scrollIntoView()`). |
| 11 | **Búsqueda y filtrado en tiempo real** implementando algoritmos de coincidencia de cadenas (`includes`, `toLowerCase`). |
| 12 | **Persistencia de datos en el cliente** usando `LocalStorage` y conversiones JSON (`JSON.stringify`, `JSON.parse`). |
| 13 | **Asincronía y control de tiempos** mediante temporizadores (`setInterval`, `clearInterval`, `setTimeout`). |
| 14 | **Mejora de UX** mediante integración de librerías de terceros (notificaciones Toast de SweetAlert2). |

---

## ▶️ Cómo ejecutarlo

Al ser un proyecto Vanilla sin dependencias de servidor (Node.js, etc.), no requiere instalación.

```text
index.html  ➔  Abrir directamente con doble clic o usando Live Server (VS Code).
```

---

## 📂 Estructura del proyecto

```text
📄 index.html    ➔ Único contenedor HTML e importación de iconos/alertas.
📄 style.css     ➔ Variables CSS, layout, animaciones y diseño Glassmorphism.
📄 app.js        ➔ Toda la lógica: renderizado del DOM, arrays, eventos y LocalStorage.
```

---

## 🎨 Diseño y UX

* Efecto **Glassmorphism** en contenedores principales y tarjetas.
* Animaciones CSS (keyframes) para notificaciones y transición de tareas (`barridoLuzLento`, `deslizar`).
* Diseño responsivo (Media Queries) adaptado para dispositivos móviles.
* Paleta de colores basada en tonos neón sobre fondos oscuros para minimizar la fatiga visual.

---

## 🎓 Contexto académico

Proyecto Final de la asignatura **Lenguaje de Marcas** · 1º DAM · Curso 2025/2026.
