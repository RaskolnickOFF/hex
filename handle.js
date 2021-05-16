const row1x = side + cellGap; //enemy target
const row2x = side / 2 + cellGap * 1.5; //battlefield / enemy target
const row2y = side / 3 * 2 + cellGap * 2; //battlefield / enemy target
const hexes = [];
let startPositions = [];
let endPositions = [];
let randomEnemy = undefined;

function handleHexes() {
    for (let i = 0; i < hexes.length; i++)
        hexes[i].draw();
}
addHexGrid();

//поле битвы //battlefield

function addHexGrid() {
    for (let y = cellGap; y < canvas.height - side / 2; y += row2y * 2)
        if (y === cellGap
            || y === row2y * 2 + cellGap
            || y === row2y * 4 + cellGap
            || y === row2y * 6 + cellGap
        )
            for (let x = cellGap; x < canvas.width - side; x += side + cellGap) {
                hexes.push(new Hex(x, y));
            }
    for (let y = cellGap; y < canvas.height - side / 2; y += row2y)
        if (y === row2y + cellGap
            || y === row2y * 3 + cellGap
            || y === row2y * 5 + cellGap
        )
            for (let x = row2x; x < canvas.width - side; x += side + cellGap) {
                hexes.push(new Hex(x, y));
            }
}

function handleSelect() {
    for (let i = 0; i < targetSelect.length; i++) {
        targetSelect[i].draw();
    }
}

function handleEnemyTarget() {
    for (let i = 0; i < enemyTargets.length; i++) {
        enemyTargets[i].update();
        enemyTargets[i].draw();
    }
}

function handleStartPositions() {
    drawStart();

    if (startPositions.length < 18) {
        let start = side * 2 + cellGap * 3
        startPositions = hexes.filter(hexes => hexes.x <= start);
    }
}

function handleEnemies() {
    if (enemies.length > 0) {
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].update();
            enemies[i].draw();

            if (enemies[i].health <= 0) {
                myGold += (enemies[i].maxHealth / 10); // +++ My Gold
                enemies.splice(i, 1);
                console.log('enemy down');
                kill++;
                i--;
            }
        }
    }

    let end = canvas.width - side * 4 + cellGap * 4
    endPositions = hexes.filter(hexes => hexes.x >= end);

    randomEnemy = endPositions[Math.floor(Math.random() * endPositions.length)];
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].dotX === randomEnemy.x && enemies[i].dotY === randomEnemy.y) return;
    }

    if (isEnemyTurn === true && isMyTurn === false && isEndTurn === true)
        if (enemies.length > 0 && enemyGold === 0) return;
    if (frame % 1 === 0 && enemyGold >= armyCost) {
        enemies.push(new Enemy(randomEnemy.x, randomEnemy.y));
        enemyGold -= armyCost;
        console.log('add 1 enemy');
    }
    //fixes
    if (isEnemyTurn === false && isRefreshed === false && isMyTurnReady === true
        && isMyTurn === true && isEndTurn === false && isEnemyTurnReady === false) {
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].isNear === true && enemies[i].isCanMove === false
                && enemies[i].isCanAttack === true && enemies[i].isAlreadyAttacked === false) {
                for (let j = 0; j < army.length; j++) {
                    if (!(collision2(enemies[i], army[j]))) {
                        enemies[i].isNear = false;
                        enemies[i].isCanAttack = false;
                    }
                }
            }
        }
    }
}

function handleArmy() {
    if (army.length > 0) {
        for (let i = 0; i < army.length; i++) {

            army[i].update();
            army[i].draw();

            if (army[i].health <= 0) {
                enemyGold += (army[i].maxHealth / 10); // +++ Enemy Gold
                console.log('army down');
                army.splice(i, 1);
                i--;
            }

        }
        //fixes


        if (isEnemyTurn === false && isRefreshed === false && isMyTurnReady === true
            && isMyTurn === true && isEndTurn === false && isEnemyTurnReady === false) {
            for (let i = 0; i < army.length; i++) {
                if (army[i].isNear === false && army[i].isCanMove === false
                    && army[i].isCanAttack === false && army[i].isAlreadyAttacked === false) {

                    army[i].isAlreadyAttacked = true;


                }
            }
        }
    }
}

function handleArrows() {
}