"use strict";

const URL_PLATOS = "https://api-colombia.com/api/v1/TypicalDish";
const URL_DEPARTAMENTOS = "https://api-colombia.com/api/v1/Department";

const contenedor = document.getElementById("contenedor");
const mensaje = document.getElementById("mensaje");
const resumen = document.getElementById("resumen");

const IMAGEN_REEMPLAZO =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="440" viewBox="0 0 600 440">' +
      '<rect width="600" height="440" fill="#e9e7df"/>' +
      '<circle cx="300" cy="176" r="48" fill="#d7a84e" opacity=".35"/>' +
      '<path d="M0 340 170 190l102 91 103-122 225 181v100H0Z" fill="#24574b" opacity=".72"/>' +
      '<text x="300" y="397" font-family="Arial,sans-serif" font-size="24" fill="#173c35" ' +
      'text-anchor="middle">Imagen no disponible</text></svg>'
  );

function mostrarMensaje(texto, clase) {
  mensaje.textContent = texto;
  mensaje.className = clase ? "mensaje " + clase : "mensaje";
}

function crearElemento(etiqueta, texto, clase) {
  const elemento = document.createElement(etiqueta);
  if (texto) {
    elemento.textContent = texto;
  }
  if (clase) {
    elemento.className = clase;
  }
  return elemento;
}

function textoValido(valor, alternativa) {
  return typeof valor === "string" && valor.trim() ? valor.trim() : alternativa;
}

function obtenerUrlImagen(plato) {
  const url = textoValido(plato.imageUrl, "") || textoValido(plato.image, "");
  if (!url) {
    return IMAGEN_REEMPLAZO;
  }

  try {
    const urlValida = new URL(url, window.location.href);
    if (urlValida.protocol === "https:" || urlValida.protocol === "http:") {
      return urlValida.href;
    }
  } catch (error) {
    console.warn("El plato contiene una URL de imagen no válida.", error);
  }

  return IMAGEN_REEMPLAZO;
}

function obtenerDepartamento(plato, nombresDepto) {
  const departamentoAnidado = plato.department;
  if (departamentoAnidado && typeof departamentoAnidado.name === "string") {
    return textoValido(departamentoAnidado.name, "Colombia");
  }

  if (plato.departmentId !== null && plato.departmentId !== undefined) {
    return nombresDepto.get(String(plato.departmentId)) || "Colombia";
  }

  return "Colombia";
}

function crearTarjeta(plato, nombresDepto) {
  const nombre = textoValido(plato.name, "Plato colombiano");
  const tarjeta = crearElemento("article", "", "tarjeta");
  const imagen = document.createElement("img");
  imagen.src = obtenerUrlImagen(plato);
  imagen.alt = "Plato típico: " + nombre;
  imagen.loading = "lazy";
  imagen.decoding = "async";
  imagen.referrerPolicy = "no-referrer";
  imagen.addEventListener("error", function () {
    if (imagen.src !== IMAGEN_REEMPLAZO) {
      imagen.src = IMAGEN_REEMPLAZO;
    }
  }, { once: true });

  const cuerpo = crearElemento("div", "", "tarjeta-cuerpo");
  const titulo = crearElemento("h3", nombre);
  const etiqueta = crearElemento("span", obtenerDepartamento(plato, nombresDepto), "etiqueta");
  const descripcion = crearElemento(
    "p",
    textoValido(plato.description, "Sin descripción disponible.")
  );

  cuerpo.appendChild(titulo);
  cuerpo.appendChild(etiqueta);
  cuerpo.appendChild(descripcion);
  tarjeta.appendChild(imagen);
  tarjeta.appendChild(cuerpo);
  return tarjeta;
}

function esLista(valor) {
  return Array.isArray(valor);
}

function cargarDatos(url) {
  return fetch(url).then(function (respuesta) {
    if (!respuesta.ok) {
      throw new Error("Error HTTP " + respuesta.status + " al consultar " + url);
    }
    return respuesta.json().then(function (datos) {
      if (!esLista(datos)) {
        throw new Error("La respuesta de " + url + " no tiene el formato esperado.");
      }
      return datos;
    });
  });
}

if (!contenedor || !mensaje || !resumen) {
  throw new Error("No se encontraron los elementos necesarios para mostrar los platos.");
}

mostrarMensaje("Cargando platos típicos...", "cargando");

Promise.allSettled([
  cargarDatos(URL_PLATOS),
  cargarDatos(URL_DEPARTAMENTOS),
]).then(function (resultados) {
  const resultadoPlatos = resultados[0];
  const resultadoDepartamentos = resultados[1];

  if (resultadoPlatos.status === "rejected") {
    throw resultadoPlatos.reason;
  }

  const platos = resultadoPlatos.value;
  const departamentos =
    resultadoDepartamentos.status === "fulfilled" ? resultadoDepartamentos.value : [];
  const nombresDepto = new Map();

  departamentos.forEach(function (departamento) {
    if (departamento && departamento.id !== null && departamento.id !== undefined) {
      nombresDepto.set(String(departamento.id), textoValido(departamento.name, "Colombia"));
    }
  });

  if (platos.length === 0) {
    resumen.textContent = "";
    mostrarMensaje("No hay platos típicos disponibles por el momento.");
    return;
  }

  const tarjetas = document.createDocumentFragment();
  platos.forEach(function (plato) {
    if (plato && typeof plato === "object") {
      tarjetas.appendChild(crearTarjeta(plato, nombresDepto));
    }
  });

  contenedor.replaceChildren(tarjetas);
  resumen.textContent = "Total de platos típicos: " + contenedor.children.length;

  if (resultadoDepartamentos.status === "rejected") {
    console.error("No se pudieron cargar los departamentos.", resultadoDepartamentos.reason);
    mostrarMensaje("Los platos se cargaron, pero no fue posible consultar sus departamentos.");
  } else {
    mostrarMensaje("");
  }
}).catch(function (error) {
  console.error("No se pudieron cargar los platos típicos.", error);
  resumen.textContent = "";
  mostrarMensaje("No se pudieron cargar los platos. Comprueba tu conexión e inténtalo más tarde.", "error");
});
