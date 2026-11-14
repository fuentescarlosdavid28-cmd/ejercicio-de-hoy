# Mini Portal de Colombia

## Descripción

Mini portal web informativo sobre Colombia que consume datos en tiempo real
desde la API pública [API Colombia](https://api-colombia.com/) y los muestra
dinámicamente en el DOM con JavaScript.

El proyecto cuenta con dos páginas conectadas mediante hipervínculos:

- **Presidentes de Colombia** (`index.html`): muestra el nombre, periodo,
  partido político y foto de cada presidente, ordenados por año.
- **Sabores de Colombia** (`sabores.html`): muestra el nombre, descripción,
  departamento e imagen de los platos típicos, junto con el total de platos.

## Funcionalidades

- Consumo de datos con `fetch` (endpoints `/api/v1/President` y `/api/v1/TypicalDish`).
- Creación dinámica de tarjetas en el DOM.
- Mensaje de "Cargando..." mientras llegan los datos.
- Manejo de errores con `catch`.
- Diseño responsive con CSS Grid.
- Extras: presidentes ordenados por año y conteo de platos típicos.

## Tecnologías usadas

- HTML5
- CSS3 (Grid, Flexbox, variables CSS)
- JavaScript (ES6+, Fetch API, manipulación del DOM)
- [API Colombia](https://api-colombia.com/)

## Estructura del proyecto