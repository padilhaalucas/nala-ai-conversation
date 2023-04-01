const voiceRecognitionBtn = document.querySelector("#voiceRecognitionBtn");
const speechOutputBtn = document.querySelector("#speechOutputBtn");
const languageSelect = document.querySelector("#languageSelect");
const conversation = document.querySelector("#conversation");
let language = languageSelect.value;

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = language;

let isConversationActive = false;
let fullTranscript = "";

const maintainMicIcon = () => {
  const icon = document.createElement("i");
  icon.className = "fa fa-microphone";
  voiceRecognitionBtn.prepend(icon);
}

voiceRecognitionBtn.addEventListener("click", () => {
  if (!isConversationActive) {
    isConversationActive = true;
    voiceRecognitionBtn.textContent = "Stop Conversation";
    maintainMicIcon()
    recognition.start();
  } else {
    isConversationActive = false;
    voiceRecognitionBtn.textContent = "Start Conversation";
    maintainMicIcon()
    recognition.stop();
  }
});

recognition.onresult = (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript;
  fullTranscript += transcript + " ";

  if (isConversationActive) {
    const url = `http://ai1.npaw.com:8000/nala?query=${fullTranscript}&module=sql`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const text = data.extra.text;
        conversation.value += `You: ${transcript}\n`;
        conversation.value += `NaLa: ${text}\n`;
        speechSynthesis.speak(new SpeechSynthesisUtterance(text));
        fullTranscript = transcript + " ";
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

speechOutputBtn.addEventListener("click", () => speechSynthesis.speak(new SpeechSynthesisUtterance(conversation.value)))

languageSelect.addEventListener("change", () => {
  language = languageSelect.value;
  recognition.lang = language;
});

recognition.onerror = (event) => console.error(event.error);

recognition.onend = () => {
  fullTranscript = "";
  if (isConversationActive) {
    recognition.start();
  }
};
