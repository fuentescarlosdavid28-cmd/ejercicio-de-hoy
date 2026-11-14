const URL_API = "https://api-colombia.com/api/v1/President";

const contenedor = document.getElementById("contenedor");
const mensaje = document.getElementById("mensaje");
const resumen = document.getElementById("resumen");

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

function crearTarjeta(presidente) {
  const inicio = obtenerAnio(presidente.startPeriodDate);
  const fin = obtenerAnio(presidente.endPeriodDate);
  const periodo = inicio
    ? inicio + " - " + (fin || "Actualidad")
    : "Periodo no disponible";

  // Tarjeta
  const tarjeta = crearElemento("article", null, "tarjeta");

  // Imagen
  const imagen = document.createElement("img");
  imagen.setAttribute("src", presidente.image || presidente.imageUrl || "");
  imagen.setAttribute("alt", "Foto de " + presidente.name);
  imagen.onerror = function () {
    imagen.onerror = null;
    imagen.setAttribute("src", "https://via.placeholder.com/300x220?text=Sin+foto");
  };

  // Cuerpo
  const cuerpo = crearElemento("div", null, "tarjeta-cuerpo");
  const titulo = crearElemento("h3", presidente.name + " " + (presidente.lastName || ""));
  const etiqueta = crearElemento("span", periodo, "etiqueta");
  const partido = crearElemento("p", "Partido: " + (presidente.politicalParty || "No disponible"));

  cuerpo.appendChild(titulo);
  cuerpo.appendChild(etiqueta);
  cuerpo.appendChild(partido);

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