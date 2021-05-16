const canvas = document.getElementById("canvas");
const buttonReset = document.getElementById("reset");
const buttonReady = document.getElementById("ready");
const line = document.getElementById("line");
const ctx = canvas.getContext("2d");

const wW = document.documentElement.clientWidth;
const wH = document.documentElement.clientHeight;
let side = null;
let cellGap = null;

if (wW > 0 && wW < 900) {
    canvas.classList.add('hidden');
    document.getElementById("buttons").innerHTML =
        "<h2>Small screen</h2>";
    buttonReady.classList.add('hidden');
    buttonReset.classList.add('hidden'); newW = 0; newH = 0;
}
if (wW >= 800 && wW < 1024) { newW = 784; newH = 340; side = 48; cellGap = 4; }
if (wW >= 1024 && wW < 1200) { newW = 964; newH = 412; side = 60; cellGap = 4; }
if (wW >= 1200 && wW < 1400) { newW = 1176; newH = 510; side = 72; cellGap = 6; }
if (wW >= 1400 && wW < 1600) { newW = 1357; newH = 582; side = 84; cellGap = 6; }
if (wW >= 1600 && wW < 1920) { newW = 1540; newH = 676; side = 93; cellGap = 9; }
if (wW >= 1920) { newW = 1810; newH = 782; side = 111; cellGap = 9; }

canvas.width = newW;
canvas.height = newH;

buttonReady.style.height = side / 1.5 + "px"; buttonReady.style.width = side * 3 + "px";
buttonReset.style.height = side / 1.5 + "px"; buttonReset.style.width = side * 3 + "px";
document.getElementById("buttons").style.width = newW + "px";

line.style.marginTop = (side * 1.25 + 20) + "px";
line.style.height = canvas.height - (side * 1.25) + "px";