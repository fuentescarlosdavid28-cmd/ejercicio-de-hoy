# Mini Portal de Colombia

Proyecto web de varias páginas que consume la API pública de Colombia y muestra
la información de forma dinámica con JavaScript.

## Descripción

Mini portal web informativo sobre Colombia que consume datos en tiempo real
desde la API pública [API Colombia](https://api-colombia.com/) y los muestra
dinámicamente en el DOM con JavaScript.

El HTML de cada página casi no tiene contenido: todas las tarjetas se crean
desde JavaScript con los datos que responde la API.

## Objetivo

Practicar el consumo de una API REST con `fetch` y la manipulación del DOM,
aplicando buenas prácticas como la separación de HTML, CSS y JS, el mensaje de
carga y el manejo de errores.

## Páginas del proyecto

El proyecto cuenta con dos páginas conectadas mediante hipervínculos:

| Página | Archivo | Endpoint | Qué muestra |
|---|---|---|---|
| Presidentes de Colombia | `index.html` | `/api/v1/President` | Nombre, periodo, partido político y foto |
| Sabores de Colombia | `sabores.html` | `/api/v1/TypicalDish` y `/api/v1/Department` | Nombre, descripción, departamento e imagen |

- **Presidentes de Colombia** (`index.html`): muestra el nombre, periodo,
  partido político y foto de cada presidente, ordenados por año.
- **Sabores de Colombia** (`sabores.html`): muestra el nombre, descripción,
  departamento e imagen de los platos típicos, junto con el total de platos.

## Funcionalidades

- Consumo de datos con `fetch` (endpoints `/api/v1/President`, `/api/v1/TypicalDish`
  y `/api/v1/Department`).
- Creación dinámica de tarjetas en el DOM con `createElement` y `appendChild`.
- Mensaje de "Cargando..." con spinner mientras llegan los datos.
- Manejo de errores con `catch`: si la API falla, se muestra un mensaje en pantalla.
- Imagen de reemplazo cuando una foto de la API no carga.
- Navegación entre páginas con hipervínculos (sin eventos de JavaScript).
- Diseño responsive con CSS Grid.
- Extras:
  - Presidentes ordenados por año de inicio de su periodo.
  - Conteo del total de platos típicos.

## Tecnologías usadas

- **HTML5**: estructura semántica de las páginas.
- **CSS3**: Grid, Flexbox y variables CSS (colores de la bandera de Colombia).
- **JavaScript (ES6+)**: Fetch API, promesas (`Promise.all`) y manipulación del DOM.
- **[API Colombia](https://api-colombia.com/)**: fuente de los datos.
- **Git y GitHub**: control de versiones y entrega del proyecto.

## Estructura del proyecto

```
nombre-apellido-api-colombia/
├── index.html          # Página de presidentes
├── sabores.html        # Página de sabores de Colombia
├── css/
│   └── style.css       # Estilos compartidos por ambas páginas
├── js/
│   ├── presidentes.js  # Lógica de la página de presidentes
│   └── sabores.js      # Lógica de la página de sabores
└── README.md
```

## Requisitos de la actividad cumplidos

- [x] Mínimo 2 páginas HTML (una por cada opción elegida).
- [x] Páginas conectadas mediante hipervínculos.
- [x] Datos obtenidos con `fetch`.
- [x] Contenido construido dinámicamente en el DOM.
- [x] HTML, CSS y JS en archivos separados.
- [x] Mensaje de carga mientras se obtienen los datos.
- [x] Manejo de errores con `catch`.
- [x] Mínimo 15 elementos por página.

## Instrucciones de uso

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/nombre-apellido-api-colombia.git
   ```

2. Entra a la carpeta del proyecto:

   ```bash
   cd nombre-apellido-api-colombia
   ```

3. Abre `index.html` en tu navegador (doble clic o con la extensión
   *Live Server* de VS Code).

4. Usa el menú superior para navegar entre **Presidentes** y
   **Sabores de Colombia**.

> Se necesita conexión a internet para que la API responda.

## Cómo funciona

1. Al cargar la página, el JavaScript muestra el mensaje "Cargando...".
2. Se hace la petición a la API con `fetch`.
3. Si la respuesta es correcta, se convierte a JSON y se oculta el mensaje de carga.
4. Por cada elemento del arreglo se crea una tarjeta con `createElement`,
   se le agregan sus datos y se inserta en el contenedor con `appendChild`.
5. Si ocurre un error (sin internet, API caída, etc.), el bloque `catch`
   muestra un mensaje de error en pantalla.

## Manejo de imágenes

Algunas imágenes que entrega la API pueden no cargar (error 404 o 400 en el
servidor de origen). Para evitar imágenes rotas, cada imagen tiene un evento
`onerror` que la reemplaza por una imagen alternativa generada en SVG, que no
depende de internet.

## Capturas de pantalla

<!-- Guarda tus capturas en una carpeta "img" y descomenta las líneas -->
<!--
### Presidentes
![Presidentes](img/presidentes.png)

### Sabores de Colombia
![Sabores](img/sabores.png)
-->

## Posibles mejoras

- Agregar un buscador para filtrar presidentes y platos por nombre.
- Filtrar los platos típicos por departamento o región.
- Agregar paginación o botón de "Ver más".
- Añadir una tercera página, como la guía turística o los datos generales del país.

## Créditos

- Datos proporcionados por [carlos fuentes-API Colombia](https://api-colombia.com/).
- Imágenes de los presidentes y platos tomadas de las URL que entrega la API.

## Autor

**Tu carlos david**
Estudiante · 2026