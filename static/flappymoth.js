const canvas = this.document.getElementById("canvas");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight * 0.75;

class Player {
    constructor(game) {
        this.game = game;
        this.hitx = this.game.width/4;
        this.hity = this.game.height/2;
        this.hitr = 20;
        this.img = document.getElementById("moth-horizontal");
        // this.vely = 0;
    }
    draw(context) {
        if (this.game.firstFrame) {
            this.img = document.getElementById("moth-horizontal");
        }
        else if (this.game.gravity > 0) {
            this.img = document.getElementById("moth-down");
        }
        else if (this.game.gravity < 0) {
            this.img = document.getElementById("moth-up");
        }
        context.drawImage(this.img, this.hitx-this.hitr-10, this.hity-this.hitr-10, 60, 60)
        // context.beginPath();
        // context.arc(this.hitx,this.hity,this.hitr,0,Math.PI*2);
        // context.save();
        // context.globalAlpha = 0.5;
        // context.fill();
        // context.restore();
        // context.stroke();
    }
    update() {
        // this.vely += this.game.gravity;
        // this.hity += this.vely;
        this.hity += this.game.gravity;
    }
}

class Pole {
    constructor(game, side, gapStart) {
        this.game = game;
        this.side = side;
        this.lowerLeft;
        this.upperRight;
        if (this.side == "top") {
            this.lowerLeft = {x:this.game.width-25, y:gapStart};
            this.upperRight = {x:this.game.width, y:0};
        }
        else if (this.side == "bottom") {
            this.lowerLeft = {x:this.game.width - 25, y:this.game.height};
            this.upperRight = {x:this.game.width, y:gapStart+150};
        }
        this.scored = false;
    }
    draw(context) {
        context.beginPath();
        context.moveTo(this.lowerLeft.x, this.lowerLeft.y);
        context.lineTo(this.lowerLeft.x, this.upperRight.y);
        context.moveTo(this.lowerLeft.x, this.upperRight.y);
        context.lineTo(this.upperRight.x, this.upperRight.y);
        context.moveTo(this.upperRight.x, this.upperRight.y);
        context.lineTo(this.upperRight.x, this.lowerLeft.y);
        context.moveTo(this.upperRight.x, this.lowerLeft.y);
        context.lineTo(this.lowerLeft.x, this.lowerLeft.y);
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
    }
    update() {
        this.lowerLeft.x -= 5;
        this.upperRight.x -= 5;
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.player = new Player(this);
        this.obstacles = [];
        this.score = 0;
        this.gravity = 0.1;
        this.active = false;
        this.firstFrame = true;
        this.framesSinceLastSpawn = 0;

        // event listeners
        window.addEventListener("keydown", e => {
            if (e.key == " ") {
                if (!this.active) {
                    $("#start-btn").css("display", "none");
                    this.active = true;
                    this.firstFrame = false;
                }
                this.gravity = -7;
            }
        })
        
    }
    render(context) {
        this.player.draw(context);
        if (this.checkBorderCollision()) {
            endGame(this.score);
        }
        this.obstacles.forEach(ob =>  {
            ob.draw(context);
            // if (ob.upperRight.x <= 0) {
            //     this.obstacles.splice(this.obstacles.indexOf(ob), 1)
            // }
            if (this.checkPoleCollision(this.player, ob)) {
                endGame(this.score);
            }
            else if (ob.side == "top" && !ob.scored && ob.upperRight.x < this.player.hitx) {
                ob.scored = true;
                this.score++;
                $("#score").text(this.score);
            }
            ob.update();
        });
        this.player.update();
    }
    checkBorderCollision() {
        return (this.player.hity+this.player.hitr >= this.height || this.player.hity-this.player.hitr <= -1*this.player.hitr);
    }
    checkPoleCollision(player, pole) {
        return (player.hitx+player.hitr >= pole.lowerLeft.x && player.hitx-player.hitr <= pole.upperRight.x && player.hity-player.hitr <= pole.lowerLeft.y && player.hity+player.hitr >= pole.upperRight.y);
    }
    spawnPole() {
        let gapStart = Math.floor(Math.random() * 400)
        this.obstacles.push(new Pole(this, "top", gapStart))
        this.obstacles.push(new Pole(this, "bottom", gapStart))
    }
}

const game = new Game(canvas);
const ground = {
    hitx: game.player.hitx,
    hity: canvas.height,
    hitr: 0
}

function animate() {
    if (game.firstFrame || game.active) {
        game.firstFrame = false;
        ctx.clearRect(0,0,canvas.width, canvas.height);
        game.render(ctx);

        // if (game.gravity <= 0.5) {
        //     game.gravity += 0.25
        //     game.gravity = Math.round(game.gravity * 100) / 100;
        //     if (game.gravity > 0.5) {
        //         game.gravity = 0.5;
        //     }
        // }

        // if (game.gravity <= 0.3) {
        //     game.gravity += 0.1;
        //     game.gravity = Math.round(game.gravity * 10) / 10;
        // }

        game.gravity = game.gravity+0.5;
        // console.log(game.gravity);
        game.gravity = Math.round(game.gravity * 10) / 10;

        console.log(game.gravity);
        // requestAnimationFrame(animate);
        if (game.framesSinceLastSpawn == 90) {
            game.spawnPole();
            game.framesSinceLastSpawn = 0;
        }
        else {
            game.framesSinceLastSpawn++;
        }
    }
    requestAnimationFrame(animate);
}
animate();

function endGame(score) {
    game.active = false;
    let form = document.createElement("form");
    $(form).attr("action", "/flappymoth");
    $(form).attr("method", "post");
    let scoreInput = document.createElement("input");
    $(scoreInput).attr("name", "score");
    $(scoreInput).val(score);
    form.appendChild(scoreInput);
    document.getElementById("body").appendChild(form);
    $(form).submit();
}