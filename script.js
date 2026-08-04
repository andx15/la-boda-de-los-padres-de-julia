// =========================================
// PESTAÑAS
// =========================================
const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Desactivar la pestaña y el panel actualmente activos
    tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
    document.querySelectorAll(".panel").forEach((panel) => {
      panel.hidden = true;
    });

    // Activar la pestaña pulsada y su panel correspondiente
    tab.setAttribute("aria-selected", "true");
    const panel = document.getElementById(tab.getAttribute("aria-controls"));
    panel.hidden = false;
  });
});

// =========================================
// Google Apps Script
// =========================================
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxVcGu0NFFfYfPGEwXv4Ga10axBZI28JwTw86fawUS8dqZCQUaHQxc0m7ilLfZ4qzNe/exec";

const form = document.getElementById("rsvp-form");
const submitBtn = document.getElementById("rsvp-submit");
const mensaje = document.getElementById("rsvp-mensaje");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const datos = {
    nombre: form.nombre.value.trim(),
    asiste: form.asiste.value,
    alergias: form.alergias.value.trim(),
    comentario: form.comentario.value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";
  mensaje.textContent = "";
  mensaje.className = "rsvp-mensaje";

  try {
    // Nota: usamos Content-Type "text/plain" a propósito para evitar
    // el preflight CORS que Apps Script no gestiona bien con JSON.
    await fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(datos),
    });

    // Con mode "no-cors" no podemos leer la respuesta del servidor,
    // así que asumimos éxito si el fetch no lanza un error de red.
    mensaje.textContent = "¡Gracias! Hemos recibido tu confirmación.";
    mensaje.classList.add("ok");
    form.reset();
  } catch (err) {
    mensaje.textContent =
      "Ha ocurrido un error al enviar el formulario. Inténtalo de nuevo.";
    mensaje.classList.add("error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar confirmación";
  }
});