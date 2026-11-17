const URL_API = "https://api-colombia.com/api/v1/President";

const contenedor = document.getElementById("contenedor");
const mensaje = document.getElementById("mensaje");
const resumen = document.getElementById("resumen");

const RETRATOS_ARCHIVO = {
  36: {
    nombre: "José Antonio Montalvo Berbeo",
    imagen:
      "https://web.archive.org/web/20111105082616im_/http://www.banrepcultural.org/sites/default/files/90248/1963-10.jpg",
    fuente:
      "https://web.archive.org/web/20111105082616/http://www.banrepcultural.org/sites/default/files/90248/1963-10.jpg",
    credito: "Fotografía histórica · Banrepcultural",
  },
  39: {
    imagen:
      "https://audiovisuales.icesi.edu.co/server/api/core/bitstreams/2baa3879-3f08-40db-b3df-cd4bc3b0245f/content",
    fuente:
      "https://audiovisuales.icesi.edu.co/items/4f9cf687-ffbc-4cd4-a8f8-908b793fdf0b",
    credito:
      "Archivo Diario Occidente · Biblioteca Departamental Jorge Garcés Borrero · CC BY-NC-ND 4.0",
  },
};

// Crea un elemento con texto y clase
function crearElemento(etiqueta, texto, clase) {
  const elemento = document.createElement(etiqueta);
  if (texto) {
    elemento.appendChild(document.createTextNode(texto));
  }
  if (clase) {
    elemento.setAttribute("class", clase);
  }
  return elemento;
}

function obtenerAnio(fecha) {
  if (!fecha) return null;
  return new Date(fecha).getFullYear();
}

function escaparTextoSvg(texto) {
  return texto.replace(/[&<>"']/g, function (caracter) {
    const entidades = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entidades[caracter];
  });
}

function obtenerImagenReemplazo(nombre) {
  const nombreSvg = escaparTextoSvg(nombre);
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="440" viewBox="0 0 600 440">' +
    '<defs><linearGradient id="fondo" x1="0" y1="0" x2="1" y2="1">' +
    '<stop stop-color="#173c35"/><stop offset="1" stop-color="#315f50"/></linearGradient></defs>' +
    '<rect width="600" height="440" fill="url(#fondo)"/>' +
    '<circle cx="300" cy="178" r="108" fill="none" stroke="#e8c373" stroke-opacity=".22"/>' +
    '<circle cx="300" cy="178" r="87" fill="none" stroke="#e8c373" stroke-opacity=".16"/>' +
    '<path d="M225 168a75 75 0 0 1 150 0v34a75 75 0 0 1-150 0z" fill="#d9c4a0"/>' +
    '<path d="M207 440c8-100 39-151 93-151s85 51 93 151" fill="#e9e7df"/>' +
    '<path d="M264 293l36 42 36-42" fill="#c99b45"/>' +
    '<path d="M250 145c15-46 85-51 108-2-29-8-69-13-108 2" fill="#253b34"/>' +
    '<text x="300" y="46" text-anchor="middle" fill="#e8c373" font-family="Arial,sans-serif" ' +
    'font-size="15" letter-spacing="4">ARCHIVO HISTÓRICO</text>' +
    '<text x="300" y="379" text-anchor="middle" fill="#fff" font-family="Georgia,serif" ' +
    'font-size="22">' + nombreSvg + '</text>' +
    '<text x="300" y="410" text-anchor="middle" fill="#d6e0d9" font-family="Arial,sans-serif" ' +
    'font-size="13" letter-spacing="2">RETRATO NO DISPONIBLE</text></svg>';

  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function crearTarjeta(presidente) {
  const retratoArchivo = RETRATOS_ARCHIVO[presidente.id];
  const nombre =
    (retratoArchivo && retratoArchivo.nombre) ||
    [presidente.name, presidente.lastName].filter(Boolean).join(" ");
  const inicio = obtenerAnio(presidente.startPeriodDate);
  const fin = obtenerAnio(presidente.endPeriodDate);
  const periodo = inicio
    ? inicio + " - " + (fin || "Actualidad")
    : "Periodo no disponible";

  // Tarjeta
  const tarjeta = crearElemento("article", null, "tarjeta");

  // Imagen
  const imagen = document.createElement("img");
  const imagenReemplazo = obtenerImagenReemplazo(nombre);
  const urlImagen =
    (retratoArchivo && retratoArchivo.imagen) ||
    presidente.image ||
    presidente.imageUrl;
  imagen.setAttribute("src", urlImagen || imagenReemplazo);
  imagen.setAttribute(
    "alt",
    urlImagen
      ? "Fotografía histórica de " + nombre
      : "Retrato ilustrado de " + nombre + "; imagen de archivo no disponible"
  );
  imagen.setAttribute("loading", "lazy");
  imagen.setAttribute("decoding", "async");
  if (retratoArchivo) {
    imagen.classList.add("imagen-archivo");
  }
  imagen.onerror = function () {
    imagen.onerror = null;
    imagen.setAttribute("src", imagenReemplazo);
    imagen.setAttribute("alt", "Retrato ilustrado de " + nombre + "; imagen de archivo no disponible");
  };

  // Cuerpo
  const cuerpo = crearElemento("div", null, "tarjeta-cuerpo");
  const titulo = crearElemento("h3", nombre);
  const etiqueta = crearElemento("span", periodo, "etiqueta");
  const partido = crearElemento("p", "Partido: " + (presidente.politicalParty || "No disponible"));

  cuerpo.appendChild(titulo);
  cuerpo.appendChild(etiqueta);
  cuerpo.appendChild(partido);
  if (retratoArchivo) {
    const atribucion = crearElemento("a", retratoArchivo.credito, "fuente-fotografica");
    atribucion.href = retratoArchivo.fuente;
    atribucion.target = "_blank";
    atribucion.rel = "noopener noreferrer";
    cuerpo.appendChild(atribucion);
  }

  tarjeta.appendChild(imagen);
  tarjeta.appendChild(cuerpo);

  return tarjeta;
}

function mostrarPresidentes(lista) {
  for (let i = 0; i < lista.length; i++) {
    contenedor.appendChild(crearTarjeta(lista[i]));
  }
}

// Mensaje de carga
mensaje.textContent = "Cargando presidentes...";
mensaje.setAttribute("class", "mensaje cargando");

fetch(URL_API)
  .then(function (respuesta) {
    if (!respuesta.ok) {
      throw new Error("Error HTTP: " + respuesta.status);
    }
    return respuesta.json();
  })
  .then(function (datos) {
    mensaje.textContent = "";
    mensaje.setAttribute("class", "mensaje");

    // Extra: ordenar por año de inicio
    datos.sort(function (a, b) {
      return new Date(a.startPeriodDate) - new Date(b.startPeriodDate);
    });

    resumen.textContent = datos.length + " presidentes · ordenados por año";
    mostrarPresidentes(datos);
  })
  .catch(function (error) {
    mensaje.setAttribute("class", "mensaje error");
    mensaje.textContent = "No se pudieron cargar los datos. Intenta de nuevo más tarde.";
    console.error(error);
  });