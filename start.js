// 'use strict';
// window.onload = function () {}
let isReady = undefined;
document.getElementById('reset').onclick = function () {
    location.reload(); // перезагружаем страницу //reload page
}
document.getElementById('ready').onclick = function () {
    if (isCanBeReady === true)
        isReady = true; // готовность // is player ready?
    if (army.length > 0 && myGold === 0) {
        isReadyClicked = true;
    }
}


let hex = undefined;
let midX = undefined;
let midY = undefined;
let dotX = undefined;
let dotY = undefined;

let frame = 0;
let selected = false;
let kill = 0;

const army = [];
const targetSelect = [];
const enemies = [];
const arrows = [];

const controlsBar = {
    width: canvas.width,
    height: side * 2,
}

//Управление
const mouse = {
    x: undefined,
    y: undefined,
    width: 0.1,
    height: 0.1,
    clicked: false,
    move: false
}

let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function (e) {
    mouse.move = true;
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
})
canvas.addEventListener('mouseleave', function () {
    mouse.x = undefined;
    mouse.y = undefined;
})

// canvas.addEventListener('mousedown', function () {
//     mouse.clicked = true;
// })
// canvas.addEventListener('mouseup', function () {
//     mouse.clicked = false;
// })

// canvas.addEventListener('dblclick', function () {

// })

canvas.addEventListener('click', function () {
    if (dotY > (canvas.height - 100)) return;

    for (let i = 0; i < startPositions.length; i++)
        if (myGold >= armyCost && Math.floor(startPositions[i].x) === Math.floor(dotX) && Math.floor(startPositions[i].y) === Math.floor(dotY)) {
            for (let a = 0; a < army.length; a++)
                if (army[a].dotX === Math.floor(dotX)
                    && army[a].dotY === Math.floor(dotY)) return;
            army.push(new Army(Math.floor(dotX), Math.floor(dotY)));
            myGold -= armyCost;
        }

    for (let j = 0; j < enemies.length; j++) {
        for (let i = 0; i < army.length; i++) {

            if (selected === true) {
                if (enemies[j].dotX === Math.floor(dotX)
                    && enemies[j].dotY === Math.floor(dotY)
                ) {


                    if (army[i].isAlreadyAttacked === false) {
                        if (army[i].isNear === true) {
                            //attack only when enemy around
                            if (collision2(army[i], enemies[j])) {
                                //Атака
                                if (army[i].isCanAttack === true) {
                                    if (isMyTurn === true) {
                                        enemies[j].health -= army[i].attackPower;
                                        army[i].isAlreadyAttacked = true;
                                        army[i].isCanMove = false;

                                        console.log(`
                                        Army in 
                                        x: ${army[i].dotX} 
                                        y: ${army[i].dotY} 
                                        attack enemy in 
                                        x: ${enemies[j].dotX} 
                                        y: ${enemies[j].dotY}
                                        `);
                                    }
                                } else console.log('Attack is failed');


                            }
                        }
                    }
                }
            }
        }
    }
    if (selected === true) {
        for (let i = 0; i < army.length; i++) {
            if (army[i].dotX === Math.floor(dotX)
                && army[i].dotY === Math.floor(dotY)) {
                targetSelect.splice(0, targetSelect.length);
                selected = false;
                return;
            }
        }
        for (let j = 0; j < enemies.length; j++) {
            if (enemies[j].dotX === Math.floor(dotX)
                && enemies[j].dotY === Math.floor(dotY)) {
                targetSelect.splice(0, targetSelect.length);
                selected = false;
                return;
            }
        }
        for (let i = 0; i < army.length; i++) {
            //Передвижение армии //move army
            if (army[i].isCanMove === true)
                if (army[i].dotX === targetSelect[0].dotX
                    && army[i].dotY === targetSelect[0].dotY) {
                    army[i].dotX = Math.floor(dotX);
                    army[i].dotY = Math.floor(dotY);
                    army[i].isCanMove = false;
                    targetSelect.splice(0, targetSelect.length);
                    selected = false;
                    return;
                }
            //Передвижение армии во время первого хода //first turn move army
            if (army[i].isCanMove === false && isFirstTurn === true)
                for (let s = 0; s < startPositions.length; s++) {
                    if (Math.floor(startPositions[s].x) === Math.floor(dotX) && Math.floor(startPositions[s].y) === Math.floor(dotY)) {
                        if (army[i].dotX === targetSelect[0].dotX
                            && army[i].dotY === targetSelect[0].dotY) {
                            army[i].dotX = Math.floor(dotX);
                            army[i].dotY = Math.floor(dotY);
                            army[i].isCanMove = false;
                            targetSelect.splice(0, targetSelect.length);
                            selected = false;
                            return;
                        }
                    }


                }
        }
        targetSelect.splice(0, targetSelect.length);
        selected = false;
    }
    for (let i = 0; i < army.length; i++) {
        if (army[i].dotX === Math.floor(dotX) && army[i].dotY === Math.floor(dotY)) {
            selected = true;
            targetSelect.push(new SelectedTarget(Math.floor(dotX), Math.floor(dotY)));
            return;
        }
    }
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].dotX === Math.floor(dotX)
            && enemies[i].dotY === Math.floor(dotY)) {
            selected = true;
            targetSelect.push(new SelectedTarget(Math.floor(dotX), Math.floor(dotY)));
            return;
        }
    }

    targetSelect.splice(0, targetSelect.length);
    selected = false;
})


//Движ на экране //animation on screen
function animate() {
    drawScreen();
    handleHexes();
    handleStartPositions();

    drawHoverHex();

    gameLogic();

    handleArmy();
    handleEnemies();
    handleEnemyTarget();
    handleSelect();
    // coordsSelect();
    handleArrows();
    gameStatus();
    // deBug();
    frame++;

    // if (!gameOver || !gameWin) 
    requestAnimationFrame(animate);
}

animate();
window.addEventListener('resize', function () {
    canvasPosition = canvas.getBoundingClientRect();
})