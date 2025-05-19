
// Historial de la conversación
const conversation = [
  { role: "system", content: "Eres un asistente conversacional para alguen que esta aprendiendo idiomas (responde en el idioma que te hablen) en ese sentido siempre vas a mantener un nivel de comunicacion basico para que alguen que esta en nivel A1 pueda entenderte y tus respuestas deben ser los mas cortas posible, por debajo de 20 palabras a menos que sea necesario para dar una mejor respuesta, vas a tener como finalidad mantener la conversacion, manteniendo el tema de conversacion del usuario o proponiende temas y haciendo preguntas para que la conversacion siga fluyendo,útil. solo usas los signos de puntucion que no se pronuncien como , o , o :" }
];

const chatDiv = document.getElementById("chat");

function actualizarChat() {
  chatDiv.innerHTML = "";
  conversation.forEach(msg => {
    if (msg.role === "system") return;
    const p = document.createElement("p");
    p.textContent = (msg.role === "user" ? "Usuario: " : "Asistente: ") + msg.content;
    chatDiv.appendChild(p);
  });
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

  window.enviarMensaje = async function () {
    const mensaje = input.value.trim();
    if (!mensaje) return;

    chat.innerHTML += "<p><strong>Tú:</strong> " + mensaje + "</p>";
    input.value = "";

    const res = await fetch("https://eddward.glitch.me/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje })
    });

let recognition;

function iniciarDictado() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Tu navegador no soporta reconocimiento de voz.");
    return;
  }
  speechSynthesis.cancel();

  const inputElem = document.getElementById("userInput");
  const idioma = document.getElementById("idioma").value;
  recognition = new webkitSpeechRecognition();
  recognition.lang = idioma;
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onresult = function(event) {
    let textoFinal = '';
    let textoParcial = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const resultado = event.results[i];
      if (resultado.isFinal) {
        textoFinal += resultado[0].transcript + ' ';
      } else {
        textoParcial += resultado[0].transcript;
      }
    }
    inputElem.value = textoFinal + textoParcial;
  };

  recognition.onerror = function(event) {
    console.error("Error de reconocimiento:", event.error);
  };

  recognition.start();
}

function detenerDictado() {
  if (recognition) recognition.stop();
  enviarMensaje();
}

function leerUltimaRespuesta() {
  const ultima = conversation.slice().reverse().find(msg => msg.role === "assistant");
  if (!ultima) return;
  const texto = ultima.content;
  const idioma = document.getElementById("idioma").value;
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = idioma;
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

document.addEventListener("DOMContentLoaded", () => {
  const botonDictar = document.getElementById("botonDictar");

  const empezarDictado = (e) => {
    e.preventDefault();
    iniciarDictado();
  };

  const pararDictado = (e) => {
    e.preventDefault();
    detenerDictado();
  };

  botonDictar.addEventListener("touchstart", empezarDictado, { passive: false });
  botonDictar.addEventListener("touchend", pararDictado);
  botonDictar.addEventListener("mousedown", empezarDictado);
  botonDictar.addEventListener("mouseup", pararDictado);

  const botonPermiso = document.getElementById("btnPermisoMicrofono");

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      botonPermiso.style.display = "none";
      stream.getTracks().forEach(track => track.stop());
    })
    .catch((err) => {
      console.warn("No hay permiso para el micrófono:", err.name);
      botonPermiso.style.display = "inline-block";
    });
});

function solicitarPermisoMicrofono() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Tu navegador no soporta acceso al micrófono.");
    return;
  }

  alert("Se solicitará acceso al micrófono una sola vez. Luego podrás usar el dictado por voz.");
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      stream.getTracks().forEach(track => track.stop());
      document.getElementById("btnPermisoMicrofono").style.display = "none";
    })
    .catch((err) => {
      alert("Necesitas dar permiso al micrófono para usar dictado por voz.");
    });
}

actualizarChat();
