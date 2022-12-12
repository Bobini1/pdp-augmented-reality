const engieeRed = 'rgb(214.7, 51, 55)';
const vectorUp = '(-2px, -12px)';
const vectorDown = '(2px, 12px)';
const reverseVectorUp = '(0px, 0px)';
const reverseVectorDown = '(0px, 0px)';
const buttons = document.getElementsByClassName('menuButton');
const leftSides = document.getElementsByClassName('leftSide');
const rightSides = document.getElementsByClassName('rightSide');
const buttonAreas = document.getElementsByClassName('buttonArea');

for(let i=0;i<buttonAreas.length;i++) {
    let translateX = 0;
    if (i % 3 == 0) {
         translateX = 25;
    } else if (i % 3 == 1) {
        translateX = 0;
    } else if (i % 3 == 2) {
        translateX = -25;
    }
    if (i >= 3) {
        translateX += 25;
    }
    command = 'transform: translate(' + translateX.toString() + 'px, 0px);';
    buttonAreas[i].setAttribute('style', command);
}

for(let i=0;i<buttonAreas.length;i++) {
    buttonAreas[i].addEventListener("mouseover", function(){
        turnOnOutline(i);
    }, false);
    buttonAreas[i].addEventListener("mouseout", function() {
        turnOffOutline(i);
    }, false);
}

for(let i=0;i<buttons.length;i++) {
    buttons[i].addEventListener("mouseover", function() {
        translateButton(i);
    }, false);
    buttons[i].addEventListener("mouseout", function() {
        revertTransformation(i);
    }, false);
}

function turnOnOutline(i) {
    buttons[i].style.borderTop = '3px solid white';
    buttons[i].style.borderBottom = '3px solid white';
    leftSides[i].style.borderTopColor = 'white';
    rightSides[i].style.borderBottomColor = 'white';
}

function turnOffOutline(i) {
    buttons[i].style.borderTop = '3px solid ' + engieeRed;
    buttons[i].style.borderBottom = '3px solid ' + engieeRed;
    leftSides[i].style.borderTopColor = engieeRed;
    rightSides[i].style.borderBottomColor = engieeRed;
}

function translateButton(i) {
    buttons[i].style.transition = 'transform 200ms';
    leftSides[i].style.transition = 'transform 200ms';
    rightSides[i].style.transition = 'transform 200ms';
    if (i < 3) {
        buttons[i].style.transform = 'translate' + vectorUp;
        leftSides[i].style.transform = 'translate' + vectorUp;
        rightSides[i].style.transform = 'translate' + vectorUp;
    } else {
        buttons[i].style.transform = 'translate' + vectorDown;
        leftSides[i].style.transform = 'translate' + vectorDown;
        rightSides[i].style.transform = 'translate' + vectorDown;
    }
}

function revertTransformation(i) {
    if (i < 3) {
        buttons[i].style.transform = 'translate' + reverseVectorUp;
        leftSides[i].style.transform = 'translate' + reverseVectorUp;
        rightSides[i].style.transform = 'translate' + reverseVectorUp;
    } else {
        buttons[i].style.transform = 'translate' + reverseVectorDown;
        leftSides[i].style.transform = 'translate' + reverseVectorDown;
        rightSides[i].style.transform = 'translate' + reverseVectorDown;
    }
}