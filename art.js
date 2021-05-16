//Утилиты //Utilities

function deBug() {

    ctx.fillStyle = 'black';
    ctx.font = "12px 'Arial'";
    ctx.textAlign = "left";
    ctx.fillText(`New game: ${isFirstTurn}`, side / 2, cellGap * 2);
    ctx.fillText(`Ready: ${isCanBeReady}`, side / 2 + side * 2, cellGap * 2);
    ctx.fillStyle = 'red';
    ctx.fillText(`End turn: ${isEndTurn}`, side / 2 + side * 4, cellGap * 2);
    ctx.fillText(`Refresh: ${isRefreshed}`, side / 2 + side * 6, cellGap * 2);
    ctx.fillStyle = 'blue';
    ctx.fillText(`My turn: ${isMyTurn}`, side / 2 + side * 8, cellGap * 2);
    ctx.fillText(`Enemy turn: ${isEnemyTurn}`, side / 2 + side * 10, cellGap * 2);
    ctx.fillStyle = 'grey';
    ctx.fillText(`Army ready: ${isMyTurnReady}`, side / 2 + side * 12, cellGap * 2);
    ctx.fillText(`Enemy ready: ${isEnemyTurnReady}`, side / 2 + side * 14, cellGap * 2);
    ctx.arc(dotMidX, dotMidY, 1, 0, Math.PI * 2);
    ctx.textAlign = "center";

}


function coordsSelect() {
    let row = ((dotY / side) / (side / 6) / 2) * 10;
    dotMidX = Math.floor((dotX + side) / side * 2 / 2) + Math.floor(row);

    dotMidY = Math.floor((dotY / side) / (side / 6) * 10);

    ctx.fillStyle = 'blue';

    ctx.font = "14px 'Arial'";
    ctx.textAlign = "left";
    ctx.fillText(`Select: ${selected},  X:${Math.floor(dotX)} Y:${Math.floor(dotY)}`, canvas.width - side * 4, canvas.height - side / 2);

    ctx.fillText(`canvas.width = ${canvas.width},  canvas.height = ${canvas.height},  wW = ${wW},  wH = ${wH}`, canvas.width - side * 9, canvas.height - 10);

    ctx.fillText(`side = ${side},  cellGap = ${cellGap} `, canvas.width - side * 9, canvas.height - side / 2);

    ctx.textAlign = "center";
}

function drawScreen() {
    ctx.shadowBlur = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'gold';
    ctx.fillRect(0, canvas.height - side + cellGap, controlsBar.width, controlsBar.height);
}

function gameStatus() {
    let myScore = Math.floor((kill - enemies.length) * (army.length * 10));
    if (myScore < 0) {
        myScore = 0;
    }
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'green';
    ctx.font = "18px 'Arial'";
    ctx.lineWidth = 1;
    ctx.textAlign = "left";
    ctx.strokeText('Score: ' + myScore, cellGap * 2, canvas.height - side / 8);
    ctx.fillText('Score: ' + myScore, cellGap * 2, canvas.height - side / 8);
    ctx.textAlign = "center";
    ctx.strokeText('My gold: ' + myGold, side * 3, canvas.height - side / 8);
    ctx.fillText('My gold: ' + myGold, side * 3, canvas.height - side / 8);
    ctx.textAlign = "left";
    ctx.fillStyle = 'red';
    ctx.strokeText('Enemy gold: ' + enemyGold, side * 4.5, canvas.height - side / 8);
    ctx.fillText('Enemy gold: ' + enemyGold, side * 4.5, canvas.height - side / 8);
    ctx.fillStyle = 'blue';
    ctx.font = "16px 'Arial'";
    ctx.textAlign = "right";
    ctx.strokeText('Created by RaskolnickOFF', canvas.width - side / 8, canvas.height - side / 8);
    ctx.fillText('Created by RaskolnickOFF', canvas.width - side / 8, canvas.height - side / 8);


    ctx.textAlign = "center";

    ctx.lineWidth = 0;
    ctx.shadowBlur = 0;

    if (gameOver !== true || gameWin !== true) {

        if (isMyTurn === true && isEnemyTurn === false) {
            ctx.strokeStyle = 'grey';
            ctx.fillStyle = 'White';
            ctx.font = "30px 'Arial'";
            ctx.lineWidth = 3;
            ctx.strokeText('Your turn', canvas.width * 0.6, canvas.height - side / 4);
            ctx.fillText('Your turn', canvas.width * 0.6, canvas.height - side / 4);
            ctx.lineWidth = 0;
            ctx.shadowBlur = 0;
        }

        if (isEnemyTurn === true && isMyTurn === false && isFirstTurn !== true) {
            ctx.strokeStyle = 'grey';
            ctx.fillStyle = 'White';
            ctx.font = "30px 'Arial'";
            ctx.lineWidth = 3;
            ctx.strokeText('Enemy turn', canvas.width * 0.6, canvas.height - side / 4);
            ctx.fillText('Enemy turn', canvas.width * 0.6, canvas.height - side / 4);
            ctx.lineWidth = 0;
            ctx.shadowBlur = 0;
        }

        if (isEnemyTurn === true && isMyTurn === false && isFirstTurn === true) {
            ctx.strokeStyle = 'grey';
            ctx.fillStyle = 'White';
            ctx.font = "30px 'Arial'";
            ctx.lineWidth = 3;
            ctx.strokeText('Place army!', canvas.width * 0.6, canvas.height - side / 4);
            ctx.fillText('Place army!', canvas.width * 0.6, canvas.height - side / 4);
            ctx.lineWidth = 0;
            ctx.shadowBlur = 0;
        }
    }


    if (gameOver) {

        ctx.strokeStyle = 'grey';
        ctx.font = "110px 'Arial'";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 15;
        ctx.lineWidth = 4;
        ctx.strokeText('Game over!', canvas.width / 2, canvas.height / 2);
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'gold';
        ctx.fillText('Game over!', canvas.width / 2, canvas.height / 2);

    }
    if (gameWin) {
        ctx.strokeStyle = 'grey';
        ctx.font = "110px 'Arial'";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 15;
        ctx.lineWidth = 4;
        ctx.strokeText('Victory!', canvas.width / 2, canvas.height / 2);
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'gold';
        ctx.fillText('Victory!', canvas.width / 2, canvas.height / 2);
        ctx.font = "40px 'Arial'"
        ctx.strokeText('Complete\n\ with score ' + myScore + '...',
            canvas.width / 2 + side, canvas.height / 2 + side);
        ctx.fillText('Complete\n\ with score ' + myScore + '...',
            canvas.width / 2 + side, canvas.height / 2 + side);
    }

    if (myGold >= 0) {
        if (myGold <= 0) {
            isCanPlace = false;
        }
        else isCanPlace = true;
    }
}

// //Художества //some art

function drawHoverHex() {
    if (mouse.move === true) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'gold';
        ctx.beginPath();
        ctx.moveTo(dotX + (side / 2), dotY);

        ctx.lineTo(dotX, dotY + (side / 4));
        ctx.lineTo(dotX, dotY + (side / 4 + side / 2));
        ctx.lineTo(dotX + (side / 2), dotY + (side));
        ctx.lineTo(dotX + (side), dotY + (side / 4 + side / 2));
        ctx.lineTo(dotX + (side), dotY + (side / 4));
        ctx.closePath();

        ctx.stroke();
    }
}

function drawStart() {
    if (startPositions.length === 18) {
        if (myGold > 0 || isFirstTurn === true) {
            if (myGold === 0 && isFirstTurn !== true) return;

            ctx.fillStyle = 'rgba(0, 0, 100, 0.1)';
            ctx.strokeStyle = 'rgba(0, 100, 0, 0.5)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cellGap + side / 2, cellGap);
            ctx.lineTo(cellGap, cellGap + side * 0.25);
            ctx.lineTo(cellGap, row2y);
            ctx.lineTo(cellGap + side / 2, side + cellGap);
            ctx.lineTo(cellGap + side / 2, side * 1.6 + cellGap * 2);
            ctx.lineTo(cellGap, side * 1.9 + cellGap * 2);
            ctx.lineTo(cellGap, side * 2.4 + cellGap * 2);
            ctx.lineTo(cellGap + side / 2, side * 2.6 + cellGap * 2);
            ctx.lineTo(cellGap + side / 2, side * 3.25 + cellGap * 3);
            ctx.lineTo(cellGap, side * 3.5 + cellGap * 3);
            ctx.lineTo(cellGap, side * 4 + cellGap * 3);
            ctx.lineTo(cellGap + side / 2, side * 4.25 + cellGap * 3);
            ctx.lineTo(cellGap + side / 2, side * 4.9 + cellGap * 4);
            ctx.lineTo(cellGap, side * 5.1 + cellGap * 4);
            ctx.lineTo(cellGap, side * 5.6 + cellGap * 4);
            ctx.lineTo(cellGap + side / 2, side * 5.9 + cellGap * 4);
            ctx.lineTo(cellGap + side, side * 5.6 + cellGap * 4);
            ctx.lineTo(cellGap * 2 + side, side * 5.6 + cellGap * 4);
            ctx.lineTo(cellGap * 2 + side * 1.5, side * 5.9 + cellGap * 4);
            ctx.lineTo(cellGap * 2 + side * 2, side * 5.6 + cellGap * 4);
            ctx.lineTo(cellGap * 3 + side * 2, side * 5.6 + cellGap * 4);
            ctx.lineTo(cellGap * 3 + side * 2.5, side * 5.9 + cellGap * 4);
            ctx.lineTo(cellGap * 3 + side * 3, side * 5.6 + cellGap * 4);
            ctx.lineTo(cellGap * 3 + side * 3, side * 5.1 + cellGap * 4);
            ctx.lineTo(cellGap * 3 + side * 2.5, side * 4.9 + cellGap * 4);
            ctx.lineTo(cellGap * 3 + side * 2.5, side * 4.25 + cellGap * 3);
            ctx.lineTo(cellGap * 3 + side * 3, side * 4 + cellGap * 3);
            ctx.lineTo(cellGap * 3 + side * 3, side * 3.5 + cellGap * 3);
            ctx.lineTo(cellGap * 3 + side * 2.5, side * 3.25 + cellGap * 3);
            ctx.lineTo(cellGap * 3 + side * 2.5, side * 2.6 + cellGap * 2);
            ctx.lineTo(cellGap * 3 + side * 3, side * 2.4 + cellGap * 2);
            ctx.lineTo(cellGap * 3 + side * 3, side * 1.9 + cellGap * 2);
            ctx.lineTo(cellGap * 3 + side * 2.5, side * 1.6 + cellGap * 2);
            ctx.lineTo(cellGap * 3 + side * 2.5, side + cellGap);
            ctx.lineTo(cellGap * 3 + side * 3, row2y);
            ctx.lineTo(cellGap * 3 + side * 3, cellGap + side * 0.25);
            ctx.lineTo(cellGap * 3 + side * 2.5, cellGap);
            ctx.lineTo(cellGap * 3 + side * 2, cellGap + side * 0.25);
            ctx.lineTo(cellGap * 2 + side * 2, cellGap + side * 0.25);
            ctx.lineTo(cellGap * 2 + side * 1.5, cellGap);
            ctx.lineTo(cellGap * 2 + side, cellGap + side * 0.25);
            ctx.lineTo(cellGap + side, cellGap + side * 0.25);

            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    }
}