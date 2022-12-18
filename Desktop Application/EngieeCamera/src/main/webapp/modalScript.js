const MODAL_TEXT = "Do you want to enable microphone?";
const MODAL_TITLE = "Confirmation";

var audioShared;

function showConfirmBox() {
  document.getElementById("modal-title").innerHTML = MODAL_TITLE;
  document.getElementById("modal-text").innerHTML = MODAL_TEXT;
  document.getElementById("overlay").hidden = false;
}

function closeConfirmBox() {
  document.getElementById("overlay").hidden = true;
}

function isConfirm(answer) {
  audioShared = answer;
  closeConfirmBox();
  let mainScript = document.createElement('script');
  let menuScript = document.createElement('script');
  mainScript.type = 'text/javascript';
  menuScript.type = 'text/javascript';
  mainScript.src = 'session.js?reload=true';
  menuScript.src = 'menuScript.js';
  document.body.appendChild(mainScript);
  document.body.appendChild(menuScript);
}

window.onload = showConfirmBox;