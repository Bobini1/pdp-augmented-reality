const MODAL_TEXT = "Do you want to enable microphone?";
const MODAL_TITLE = "Confirmation";

var audioShared;
var confirmed = false;

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
  confirmed = true;
}

window.onload = showConfirmBox;