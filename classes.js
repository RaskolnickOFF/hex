class Hex {
    constructor(x, y) {

        // this.id = id;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.width = side;
        this.height = side;
        this.midX = Math.floor(this.x + side / 2);
        this.midY = Math.floor(this.y + side / 2);
    }
    draw() {

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(200,200,200,1)';
        ctx.beginPath();
        ctx.moveTo(this.midX, this.y);
        ctx.lineTo(this.x + side, this.y + side / 4);
        ctx.lineTo(this.x + side, this.y + side / 4 + side / 2);
        ctx.lineTo(this.midX, this.y + side);
        ctx.lineTo(this.x, this.y + side / 4 + side / 2);
        ctx.lineTo(this.x, this.y + side / 4);
        ctx.closePath();
        ctx.stroke();

        // ctx.fillStyle = 'grey';
        // ctx.font = "12px 'Arial'";
        // ctx.textAlign = "center";
        // ctx.fillText(`${this.midX},${this.midY}`, this.midX, this.midY + 5);

        this.selected = false;


        //Select Hex
        if (mouse.x && mouse.y && collision(this, mouse)) {
            dotX = this.x;
            dotY = this.y;
            this.selected = true;
        }
        function collision(f, s) {
            if (!(f.x > s.x + s.width + cellGap / 2 ||
                f.x + f.width + cellGap / 2 < s.x ||
                f.y > s.y + s.height - cellGap ||
                f.y + f.height - cellGap < s.y)
            ) {
                return true;
            };
        };

    }
}
function collision2(f, s) {
    if (f.dotX + side * 0.6
        > s.dotX - side * 0.6
        && f.dotY + side * 0.6
        > s.dotY - side * 0.6
        && s.dotX + side * 0.6
        > f.dotX - side * 0.6
        && s.dotY + side * 0.6
        > f.dotY - side * 0.6) {
        return true;
    }
}

class StartPosition {
    constructor(x, y) {
        this.dotX = x;
        this.dotY = y;
        this.midX = Math.floor(this.x + side / 2);
        this.midY = Math.floor(this.y + side / 2);
    }
    draw() {
        ctx.fillStyle = 'blue';
        ctx.font = "12px 'Arial'";
        ctx.textAlign = "center";
        ctx.fillText("Start", this.midX, this.midY + 15);
    }
}

class SelectedTarget {
    constructor(x, y) {
        this.dotX = x;
        this.dotY = y;
    }
    draw() {
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'gold';
        ctx.beginPath();
        ctx.moveTo(this.dotX + side / 2, this.dotY);
        ctx.lineTo(this.dotX + side, this.dotY + side / 4);
        ctx.lineTo(this.dotX + side, this.dotY + side / 4 + side / 2);
        ctx.lineTo(this.dotX + side / 2, this.dotY + side);
        ctx.lineTo(this.dotX, this.dotY + side / 4 + side / 2);
        ctx.lineTo(this.dotX, this.dotY + side / 4);
        ctx.closePath();
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 7;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

class EnemyTarget {
    constructor(x, y) {
        this.dotX = x;
        this.dotY = y;
    }
    update() {

    }
    draw() {
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(this.dotX + side / 2, this.dotY);
        ctx.lineTo(this.dotX + side, this.dotY + side / 4);
        ctx.lineTo(this.dotX + side, this.dotY + side / 4 + side / 2);
        ctx.lineTo(this.dotX + side / 2, this.dotY + side);
        ctx.lineTo(this.dotX, this.dotY + side / 4 + side / 2);
        ctx.lineTo(this.dotX, this.dotY + side / 4);
        ctx.closePath();
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

//Армия игрока //Player's army
class Army {
    constructor(x, y) {
        this.isCanMove = false;
        this.isCanAttack = false;
        if (isFirstTurn === true) {
            this.isAlreadyAttacked = false;
        }
        if (isFirstTurn === false) {
            this.isAlreadyAttacked = true;
        }

        this.isNear = undefined;

        this.dotX = x;
        this.dotY = y;
        this.health = 100;
        this.maxHealth = this.health;
        this.attackPower = 17;
        this.arrows = [];

    }
    update() {
        if (army.length > 0) {

            for (let j = 0; j < enemies.length; j++) {
                if (collision2(this, enemies[j])) {
                    //Проверка доступности расстояния//Distance availability check
                    this.isNear = true;

                }
            }

            for (let j = 0; j < enemies.length; j++) {
                //Ответная атака врага//Enemy retaliatory attack
                if (this.isAlreadyAttacked === true
                    && isMyTurn === true) {
                    if (collision2(this, enemies[j])) {
                        if (enemies[j].isCanAttack === true
                            && enemies[j].isAlreadyAttacked === false) {
                            this.health -= enemies[j].attackPower;
                            enemies[j].isAlreadyAttacked = true;
                            enemies[j].isCanAttack = false;
                            console.log('enemy retaliatory attack');
                        }
                    }
                }
            }

            //Проверка доступности атаки //Checking the availability of an attack
            if (this.isCanAttack === false && this.isCanMove === false
                && this.isNear === true) {
                this.isCanAttack = true;
            }

            // штраф на атаку по дальности //range attack penalty
            if (this.isNear === false) {
                this.isCanAttack = false;

            }

            // штрафы на повтор атаки //retaliation penalties

            if (this.isAlreadyAttacked === true) {
                this.isCanAttack = false;
            }

            if (isMyTurn === true && isMyTurnReady === true && isEndTurn === false
                && this.isCanMove === false && this.isNear === undefined
                && this.isCanAttack === false) {
                this.isAlreadyAttacked = true;
            }

            //Дальность //Range
            if (isMyTurn === true && isMyTurnReady === true && isEndTurn === true
                && this.isCanMove === false && this.isCanAttack === false)
                if (this.isNear === undefined) {
                    this.isNear = false;
                }


        }
    }

    draw() {
        if (this.isAlreadyAttacked === false) {
            ctx.fillStyle = 'green';
        }
        if (this.isAlreadyAttacked === true) {
            ctx.fillStyle = 'rgba(0, 100, 0, 0.5)';
        }


        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.dotX + side / 2, this.dotY);
        ctx.lineTo(this.dotX + side, this.dotY + side / 4);
        ctx.lineTo(this.dotX + side, this.dotY + side / 4 + side / 2);
        ctx.lineTo(this.dotX + side / 2, this.dotY + side);
        ctx.lineTo(this.dotX, this.dotY + side / 4 + side / 2);
        ctx.lineTo(this.dotX, this.dotY + side / 4);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();


        if (this.isCanAttack === false || this.isCanAttack === undefined) {
            ctx.fillStyle = 'white';
        }
        if (this.isCanAttack === true) {
            ctx.fillStyle = 'gold';
        }

        ctx.font = '18px Arial';
        ctx.fillText(Math.floor(this.health) + ' %', this.dotX + side / 2, this.dotY + side / 3);

        if (this.isCanMove === false) {
            ctx.font = '12px Arial';
            ctx.fillText('Stop', this.dotX + side / 2, this.dotY + side / 1.3);
        }

        if (this.isCanAttack === false || this.isCanAttack === undefined) {
            ctx.font = '12px Arial';
            ctx.fillText('No target', this.dotX + side / 2, this.dotY + side / 1.8);
        }
    }
}

// //Враги //enemy
class Enemy {
    constructor(x, y) {
        this.isCanMove = false;
        this.isCanAttack = false;

        if (isFirstTurn === true) {
            this.isAlreadyAttacked = false;
        }
        if (isFirstTurn === false) {
            this.isAlreadyAttacked = true;
        }

        this.isNear = undefined;

        this.dotX = x;
        this.dotY = y;
        this.health = 100;
        this.maxHealth = this.health;
        this.attackPower = 17;
        this.arrows = [];

    }
    update() {
        if (enemies.length > 0) {


            for (let i = 0; i < army.length; i++) {
                if (collision2(this, army[i])) {
                    //Проверка доступности расстояния//Distance availability check
                    this.isNear = true;
                }
            }

            //Проверка доступности атаки //Checking the availability of an attack
            if (this.isCanAttack === false && this.isCanMove === false) {
                for (let i = 0; i < army.length; i++) {
                    if (collision2(this, army[i])) {
                        this.isCanAttack = true;
                    }
                }
            }

            //Ответная атака//retaliatory attack

            if (isEndTurn === false && isRefreshed === false && isFirstTurn === false
                && isMyTurn === false && isEnemyTurn === true
                && isMyTurnReady === false && isEnemyTurnReady === true) { //?
                for (let i = 0; i < army.length; i++) {
                    if (this.isAlreadyAttacked === true) {

                        if (army[i].isCanAttack === true && army[i].isNear === true
                            && army[i].isAlreadyAttacked === false) {
                            if (collision2(this, army[i])) {
                                this.health -= army[i].attackPower;
                                army[i].isAlreadyAttacked = true;
                                army[i].isCanAttack = false;
                                console.log('army retaliatory attack');
                            }
                        }
                    }
                }
            }

            // штраф на атаку по дальности //range attack penalty
            if (this.isNear === false) {
                this.isCanAttack = false;

            }

            // штрафы на повтор атаки //retaliation penalties

            if (this.isAlreadyAttacked === true) {
                this.isCanAttack = false;
            }

            if (isEnemyTurn === true && isEnemyTurnReady === true && isEndTurn === true
                && this.isCanMove === false && this.isNear === undefined
                && this.isCanAttack === false) {
                this.isAlreadyAttacked = true;
            }

            //Дальность //Range
            if (isEnemyTurn === true && isEnemyTurnReady === true && isEndTurn === false
                && this.isCanMove === false && this.isCanAttack === false)
                if (this.isNear === undefined) {
                    this.isNear = false;
                }
        }
    }
    draw() {

        if (this.isAlreadyAttacked === false) {
            ctx.fillStyle = 'red';
        }
        if (this.isAlreadyAttacked === true) {
            ctx.fillStyle = 'rgba(180, 0, 0, 0.5)';
        }


        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.dotX + side / 2, this.dotY);
        ctx.lineTo(this.dotX + side, this.dotY + side / 4);
        ctx.lineTo(this.dotX + side, this.dotY + side / 4 + side / 2);
        ctx.lineTo(this.dotX + side / 2, this.dotY + side);
        ctx.lineTo(this.dotX, this.dotY + side / 4 + side / 2);
        ctx.lineTo(this.dotX, this.dotY + side / 4);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        if (this.isCanAttack === false || this.isCanAttack === undefined) {
            ctx.fillStyle = 'white';
        }
        if (this.isCanAttack === true) {
            ctx.fillStyle = 'gold';
        }

        ctx.font = '18px Arial';
        ctx.fillText(Math.floor(this.health) + ' %', this.dotX + side / 2, this.dotY + side / 3);

        if (this.isCanMove === false) {

            ctx.font = '12px Arial';
            ctx.fillText('Stop', this.dotX + side / 2, this.dotY + side / 1.3);
        }

        if (this.isCanAttack === false) {

            ctx.font = '12px Arial';
            ctx.fillText('No target', this.dotX + side / 2, this.dotY + side / 1.8);
        }

    }
}

class Arrow {
    constructor(x, y) {
        this.dotX = x;
        this.dotY = y;
    }
    update() {
    }
    draw() {
        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.dotX, this.dotY, this.width, 0, Math.PI * 2);
        // ctx.fill();
    }
}
