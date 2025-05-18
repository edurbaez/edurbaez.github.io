let recognition;
document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const input = document.getElementById("userInput");
  const btnDictado = document.getElementById("btnDictado");

  btnDictado.addEventListener("mousedown", iniciarDictado);
  btnDictado.addEventListener("mouseup", detenerDictado);
  btnDictado.addEventListener("touchstart", e => { e.preventDefault(); iniciarDictado(); });
  btnDictado.addEventListener("touchend", e => { e.preventDefault(); detenerDictado(); });

  window.enviarMensaje = async function () {
    const mensaje = input.value.trim();
    if (!mensaje) return;

    chat.innerHTML += "<p><strong>Tú:</strong> " + mensaje + "</p>";
    input.value = "";

    const res = await fetch("https://TU_PROYECTO_GLITCH.glitch.me/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje })
    });

    const data = await res.json();
    chat.innerHTML += "<p><strong>GPT:</strong> " + data.respuesta + "</p>";

    const voz = new SpeechSynthesisUtterance(data.respuesta);
    voz.lang = "de-DE";
    speechSynthesis.speak(voz);
  };
});

function iniciarDictado() {
  speechSynthesis.cancel();
  recognition = new webkitSpeechRecognition();
  recognition.lang = "de-DE";
  recognition.continuous = true;
  recognition.interimResults = true;

  const input = document.getElementById("userInput");

  recognition.onresult = function(event) {
    let texto = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      texto += event.results[i][0].transcript;
    }
    input.value = texto;
  };

  recognition.start();
}

function detenerDictado() {
  if (recognition) recognition.stop();
}