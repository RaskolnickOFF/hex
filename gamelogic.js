let isFirstTurn = true;
let isCanBeReady = false;
let isReadyClicked = false;
let isEndTurn = false;
let isRefreshed = false;

let isMyTurn = false;
let isEnemyTurn = false;
let isMyTurnReady = false;
let isEnemyTurnReady = false;
let isAttackReady = false;
let isFiltered = false;

let gameOver = false;
let gameWin = false;

let myGold = 30;
let enemyGold = 30;
let armyCost = 10;

let isCanPlace = undefined;
let move = 0;
let enemyTargets = [];
let filteredByX = false;
let filteredByY = false;
let filteredByArmy = false;
let filteredByEnemy = false;
let startFilter = false;
let filterX = [];
let filterY = [];
let filterArmy = [];
let moves = [];

const targetArray = [{ dotX: row1x, dotY: 0 }, { dotX: -row1x, dotY: 0 },
{ dotX: row2x - cellGap, dotY: row2y }, { dotX: row2x - cellGap, dotY: -row2y },
{ dotX: -row2x + cellGap, dotY: row2y }, { dotX: -row2x + cellGap, dotY: -row2y },];

//cool thing :D
function comparer(otherArray) {
    return function (current) {
        return otherArray.filter(function (other) {
            return other.dotX === current.dotX
                && other.dotY === current.dotY
        }).length === 0;
    }
}

function gameLogic() {
    if (gameOver !== true || gameWin !== true) {

        //атака соперника //enemy attack
        if (isEndTurn === false && isRefreshed === false && isFirstTurn === false
            && isMyTurn === false && isEnemyTurn === true && isAttackReady === true
            && isMyTurnReady === false && isEnemyTurnReady === true) { //?
            for (let j = 0; j < enemies.length; j++) {
                for (let i = 0; i < army.length; i++) {
                    if (enemies[j].isCanAttack === true
                        && army[i].isNear === true && enemies[j].isNear === true) {
                        //attack
                        if (collision2(enemies[j], army[i])) {
                            army[i].health -= enemies[j].attackPower;
                            enemies[j].isAlreadyAttacked = true;
                            enemies[j].isCanAttack = false;
                            enemies[j].isCanMove = false;

                            isAttackReady = false;
                            enemyTargets.splice(0, enemyTargets.length);
                            startFilter = false;

                            console.log(`
                                        Enemy in 
                                        x: ${army[i].dotX} 
                                        y: ${army[i].dotY} 
                                        attack army in 
                                        x: ${enemies[j].dotX} 
                                        y: ${enemies[j].dotY}
                                        `);
                        }
                    }
                }
            }
        }

        searchEnemyTarget();

        enemyMoves();

        //первая готовность //first ready
        if (isReadyClicked !== true) {
            if (isCanBeReady === false && army.length > 0 && myGold === 0) {
                isCanBeReady = true;
            }
        }

        //условия победы // gamestatus win or not
        if (gameOver !== true) {
            if (myGold === 0 && army.length === 0) {
                gameOver = true;
                console.log('defeat');
            }
        }
        if (gameWin !== true) {
            if (enemyGold === 0 && enemies.length === 0) {
                gameWin = true;
                console.log('victory');
            }
        }
        //Ready to add
        if (isMyTurn === false && isEnemyTurn === false && isFirstTurn === true) {
            isEnemyTurn = true;
            isEnemyTurnReady = true;
            console.log('ready to add');
        }
        //первый ход //first turn (army added)
        if (isFirstTurn === true && myGold === 0
            && army.length > 0 && isReady === true) {
            for (let i = 0; i < army.length; i++) {
                army[i].isCanMove = false;
            }
            for (let j = 0; j < enemies.length; j++) {
                enemies[j].isCanMove = false;
            }
            if (army.find(move => move.isCanMove === true)
                || enemies.find(move => move.isCanMove === true)) return;
            isFirstTurn = false;
            isCanBeReady = false;
            isEnemyTurn = false;
            isMyTurn = false;
            isEndTurn = true;
            console.log('add army');

        }

        //обновление армии //refresh army
        if (isEndTurn === true && isRefreshed === false
            && isMyTurn === false && isEnemyTurn === false
            && isMyTurnReady === false && isEnemyTurnReady === true) {
            if (army.find(move => move.isCanMove === true)) return;
            for (let i = 0; i < army.length; i++) {
                army[i].isCanMove = true;
                army[i].isCanAttack = false;
                army[i].isAlreadyAttacked = false;
                army[i].isNear = undefined;
            }
            for (let j = 0; j < enemies.length; j++) {
                enemies[j].isAlreadyAttacked = false;
            }
            isRefreshed = true;
            console.log('refresh army');
        }
        //мой ход готов //my turn ready
        if (isEndTurn === true && isRefreshed === true
            && isMyTurn === false && isEnemyTurn === false
            && isMyTurnReady === false && isEnemyTurnReady === true) {
            isEndTurn = false;
            isEnemyTurnReady = false;
            isMyTurnReady = true;
            console.log('my turn ready');
        }
        //мой ход //my turn
        if (isEndTurn === false && isRefreshed === true
            && isMyTurn === false && isEnemyTurn === false
            && isMyTurnReady === true && isEnemyTurnReady === false) {
            isMyTurn = true;
            isRefreshed = false;
            console.log('my turn');
        }

        //завершение моего хода //end my turn
        if (isEndTurn === false && isRefreshed === false
            && isMyTurn === true && isEnemyTurn === false
            && isMyTurnReady === true && isEnemyTurnReady === false) {
            if (army.find(m => m.isCanMove === true)
                || army.find(a => a.isAlreadyAttacked === false)
                || enemies.find(m => m.isCanMove === true)
                || enemies.find(a => a.isCanAttack === true)) return;
            isEndTurn = true;
            isMyTurn = false;
            console.log('end my turn');
        }
        //обновление армии соперника //refresh enemy army
        if (isEndTurn === true && isRefreshed === false
            && isMyTurn === false && isEnemyTurn === false
            && isMyTurnReady === true && isEnemyTurnReady === false) {

            for (let j = 0; j < enemies.length; j++) {
                enemies[j].isCanMove = true;
                enemies[j].isAlreadyAttacked = false;
                enemies[j].isCanAttack = false;
                enemies[j].isNear = undefined;
            }
            for (let i = 0; i < army.length; i++) {
                army[i].isAlreadyAttacked = false;
            }
            isRefreshed = true;
            console.log('refresh enemy army');
        }
        //ход соперника готов //enemy turn ready
        if (isEndTurn === true && isRefreshed === true
            && isMyTurn === false && isEnemyTurn === false
            && isMyTurnReady === true && isEnemyTurnReady === false) {
            isEndTurn = false;
            isMyTurnReady = false;
            isEnemyTurnReady = true;
            console.log('enemy turn ready');
        }
        //ход противника //enemy turn
        if (isEndTurn === false && isRefreshed === true
            && isMyTurn === false && isEnemyTurn === false
            && isMyTurnReady === false && isEnemyTurnReady === true) {
            isEnemyTurn = true;
            isRefreshed = false;
            console.log('enemy turn');
        }
        //завершение хода противника //end enemy turn
        if (isEndTurn === false && isRefreshed === false
            && isMyTurn === false && isEnemyTurn === true
            && isMyTurnReady === false && isEnemyTurnReady === true) {
            // if (enemies.find(a => a.isAlreadyAttacked === false)
            //     && enemyTargets.length > 0) {
            //     enemyTargets.splice(0)
            // }

            if (enemies.find(m => m.isCanMove === true)
                || enemies.find(a => a.isAlreadyAttacked === false)) return;
            isEndTurn = true;
            isEnemyTurn = false;
            enemyTargets.splice(0);
            console.log('end enemy turn');
        }
    }
    //end of logic
}

function enemyMoves() {
    if (gameOver !== true || gameWin !== true) {
        // передвижение соперника // enemy movement

        if (isEndTurn === false && isRefreshed === false && isFirstTurn === false
            && isMyTurn === false && isEnemyTurn === true && isAttackReady === false
            && isMyTurnReady === false && isEnemyTurnReady === true) {

            if (enemyTargets.length === 1) {
                if (enemies.find(a => a.isAlreadyAttacked === false)) {
                    addTargets();
                    startFilter = true;

                }
            }

            if (enemyTargets.length > 1 && isFiltered === false && startFilter === true
                && filteredByX === false) {
                //фильтр //filter of game borders X
                filterX = enemyTargets.filter(x => {
                    if (x.dotX > 0 && x.dotX < canvas.width - side) {
                        return true;
                    }
                })
                filteredByX = true;
                enemyTargets.splice(0, enemyTargets.length);
            }

            if (filterX.length > 1 && filteredByX === true && isFiltered === false
                && filteredByY === false && startFilter === true) {
                //фильтр //filter of game borders Y
                filterY = filterX.filter(y => {
                    if (y.dotY > 0 && y.dotY < canvas.height - side * 1.5) {
                        return true;
                    }
                })
                filteredByY = true;

            }

            if (army.length > 0 && filterY.length > 1 && isFiltered === false
                && filteredByY === true && filteredByArmy === false
                && startFilter === true) {
                //фильтр //filter of army

                filterArmy = filterY.filter(comparer(army));

                filteredByArmy = true;
            }

            if (enemies.length > 0 && filterArmy.length > 1 && isFiltered === false
                && filteredByArmy === true && startFilter === true) {
                //фильтр //filter of enemy
                filterEnemy = filterArmy.filter(comparer(enemies));
                filteredByEnemy = true;
            }

            if (filteredByArmy === true && filteredByEnemy === true
                && isFiltered === false && startFilter === true
                && filteredByY === true && filteredByX === true) {

                console.log('filtered');
                isFiltered = true;

            }

            if (isFiltered === true && isAttackReady === false
                && startFilter === true) {
                for (let i = 0; i < army.length; i++) {
                    for (let j = 0; j < enemies.length; j++) {
                        for (let f = 1; f < filterEnemy.length; f++) {

                            if (enemies[j].isCanMove === true
                                && filterEnemy.length >= 1) {


                                if (filterEnemy.length >= 1
                                    && isAttackReady === false) {
                                    let randomMove = Math.floor(Math.random()
                                        * filterEnemy.length);


                                    console.log('start move');
                                    if (isFiltered === true
                                        && isAttackReady === false
                                        && startFilter === true) {
                                        enemies[j].dotX =
                                            filterEnemy[randomMove].dotX;
                                        enemies[j].dotY =
                                            filterEnemy[randomMove].dotY;


                                        enemies[j].isCanMove = false;
                                        console.log(`
                                    Enemy moves to X: ${enemies[j].dotX}
                                    Y: ${enemies[j].dotY}
                                    `);
                                        isAttackReady = true;
                                        filteredByX = false;
                                        filteredByY = false;
                                        filteredByArmy = false;
                                        filteredByEnemy = false;

                                        filterX.splice(0, filterX.length);
                                        filterY.splice(0, filterY.length);
                                        filterArmy.splice(0, filterArmy.length);
                                        filterEnemy.splice(0, filterEnemy.length);
                                        console.log('clear');
                                        move = move + 1;
                                        console.log('enemy moves =', move);

                                    } return isFiltered = false;

                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

//поиск точек для передвижения вокруг цели // find movement points around enemy target
function addTargets() {
    if (gameOver !== true || gameWin !== true) {

        if (enemyTargets.length === 1 && startFilter === false) {
            console.log('find targets for filter');
            for (let index = 0; index < targetArray.length; index++) {
                let x = targetArray[index].dotX;
                let y = targetArray[index].dotY;
                let targetX = Math.floor(enemyTargets[0].dotX + x);
                let targetY = Math.floor(enemyTargets[0].dotY + y);

                enemyTargets.push(new EnemyTarget(targetX, targetY));
                console.log('targets for filter added');
            }
        }
    }
}

function targetAdd(minHP, maxHP) {
    if (gameOver !== true || gameWin !== true) {
        if (enemyTargets.length >= 1) return;

        let someTarget = army.find(hp => hp.health > minHP && hp.health <= maxHP);
        // console.log(someTarget.dotX, someTarget.dotY);
        enemyTargets.push(new EnemyTarget(someTarget.dotX, someTarget.dotY));
        console.log('enemy target finded');
    }
}

function searchEnemyTarget() {
    if (gameOver === true || gameWin === true) return;

    if (enemyTargets.length > 0 || filteredByX === true
        || filteredByY === true || filteredByArmy === true) return;

    //поиск цели // find target by hp
    if (isEndTurn === false && isRefreshed === false && startFilter === false
        && isMyTurn === false && isEnemyTurn === true
        && isMyTurnReady === false && isEnemyTurnReady === true) {

        console.log('search target');

        if (army.find(hp => hp.health > 10 && hp.health < 20)) {
            if (enemyTargets.length === 0) {
                targetAdd(10, 20);
            }
        }
        if (army.find(hp => hp.health > 20 && hp.health < 30)) {
            if (enemyTargets.length === 0) {
                targetAdd(20, 30);
            }
        }
        if (army.find(hp => hp.health > 30 && hp.health < 40)) {
            if (enemyTargets.length === 0) {
                targetAdd(30, 40);
            }
        }
        if (army.find(hp => hp.health > 40 && hp.health < 50)) {
            if (enemyTargets.length === 0) {
                targetAdd(40, 50);
            }
        }
        if (army.find(hp => hp.health > 50 && hp.health < 60)) {
            if (enemyTargets.length === 0) {
                targetAdd(50, 60);
            }
        }
        if (army.find(hp => hp.health > 60 && hp.health < 70)) {
            if (enemyTargets.length === 0) {
                targetAdd(60, 70);
            }
        }
        if (army.find(hp => hp.health > 70 && hp.health < 80)) {
            if (enemyTargets.length === 0) {
                targetAdd(70, 80);
            }
        }
        if (army.find(hp => hp.health > 80 && hp.health < 90)) {
            if (enemyTargets.length === 0) {
                targetAdd(80, 90);
            }
        }
        if (army.find(hp => hp.health > 90 && hp.health <= 100)) {
            if (enemyTargets.length === 0) {
                targetAdd(90, 100);
            }
        }
    }
}
