const canvas = this.document.getElementById("canvas");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.4;
canvas.height = window.innerHeight * 0.8;

class Player {
    constructor(game) {
        this.game = game;
        this.hitr = 20;
        this.hitx = this.game.width/2;
        this.hity = this.game.height-this.hitr;
        this.scoreCounter = 0
        // this.vely = 0;
        this.img = document.getElementById("moth-vertical")
    }
    draw(context) {
        if (this.game.gravity >= 0) {
            context.drawImage(this.img, this.hitx-this.hitr-10, this.hity-this.hitr-10, 60, 60)
        }
        else {
            context.drawImage(this.img, this.hitx-this.hitr, this.hity-this.hitr-10, 40, 60)
        }
        // context.beginPath();
        // context.arc(this.hitx,this.hity,this.hitr,0,Math.PI*2);
        // context.save();
        // context.globalAlpha = 0.5;
        // context.fill();
        // context.restore();
        // context.stroke();
    }
    update() {
        this.hity += this.game.gravity;
        if (this.hity < this.game.height/3*2) {
            let dif = this.game.height/3*2-this.hity;
            this.hity = this.game.height/3*2;
            this.game.platforms.forEach(function(item, index, object) {
                // plt.draw(ctx);
                item.lowerLeft.y += dif;
                item.upperRight.y += dif;
                if (item.upperRight.y >= game.height) {
                    object.splice(index,1);
                }
                // console.log(this.game.platforms[0].lowerLeft.y);
            });
            this.scoreCounter++;
            if (this.scoreCounter == 10) {
                this.scoreCounter = 0;
                this.game.score++;
                // this.game.platforms.push(new Platform(this.game, "basic"))
                $("#score").text(this.game.score);
            }
            else if (this.scoreCounter == 3) {
                let typeNum = Math.floor(Math.random()*3);
                let types = ["basic", "broken", "bouncy"];
                this.game.platforms.push(new Platform(this.game, types[typeNum]));
            }
        }
    }
}

class Platform {
    constructor(game, type) {
        this.game = game;
        this.type = type;
        this.jumpedOn = false;
        this.lowerLeft = {x:Math.floor(Math.random() * (this.game.width - 110) + 10), y:10};
        this.upperRight = {x:this.lowerLeft.x+100, y:0};
        this.scored = false;
        this.bounceHeight;
        this.color;
        if (this.type == "basic") {
            this.bounceHeight = -15;
            this.color = "green";
        }
        else if (this.type == "broken") {
            this.bounceHeight = -15;
            this.color = "brown";
        }
        else if (this.type == "bouncy") {
            this.bounceHeight = -45;
            this.color = "blue";
        }
    }
    draw(context) {
        context.fillStyle = this.color;
        // context.moveTo(this.lowerLeft.x, this.lowerLeft.y);
        // context.lineTo(this.lowerLeft.x, this.upperRight.y);
        // context.moveTo(this.lowerLeft.x, this.upperRight.y);
        // context.lineTo(this.upperRight.x, this.upperRight.y);
        // context.moveTo(this.upperRight.x, this.upperRight.y);
        // context.lineTo(this.upperRight.x, this.lowerLeft.y);
        // context.moveTo(this.upperRight.x, this.lowerLeft.y);
        // context.lineTo(this.lowerLeft.x, this.lowerLeft.y);
        // context.fill();
        context.fillRect(this.lowerLeft.x, this.upperRight.y, this.upperRight.x-this.lowerLeft.x, this.lowerLeft.y-this.upperRight.y);
    }
    // update() {
    //     this.lowerLeft.y -= this.game.gravity;
    //     this.upperRight.y -= this.game.gravity;
    // }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.player = new Player(this);
        this.platforms = [new Platform(this, "basic")];
        this.score = 0;
        this.gravity = 0;
        this.active = false;
        this.firstFrame = true;
        this.frameSincePlatform = 0;
        this.started = false;

        // event listeners
        window.addEventListener("mousemove", e => {
            this.player.hitx = e.offsetX;
        })
        canvas.addEventListener("mousedown", e => {
            if (!this.started) {
                this.started = true;
                this.gravity = -50;
                this.active = true;
                animate();
            }
            
        })
        
    }
    render(context) {
        this.player.draw(context);
        this.platforms.forEach(plt =>  {
            plt.draw(context);
            // plt.update();
        });
        if (this.gravity > 0) {
            let [collision, platform] = this.checkPlatformCollision();
            if (collision) {
                this.gravity = platform.bounceHeight;
                platform.jumpedOn = true;
                if (platform.type == "broken") {
                    this.platforms.splice(this.platforms.indexOf(platform), 1);
                }
            }
            
        }
        if (this.checkBorderCollision()) {
            endGame(this.score);
        }
        this.player.update();
    }
    checkBorderCollision() {
        return (this.player.hity-this.player.hitr >= this.height);
    }
    checkPlatformCollision() {
        // console.log(this.platforms[0].upperRight.y - this.player.hity);
        // let dists = [];
        let collision = false;
        let platform;
        this.platforms.every(plt => {
            console.log(plt.upperRight.y - (this.player.hity+this.player.hitr));
            // dists.push(plt.upperRight.y - this.player.hity-this.player.hitr);
            if (this.player.hitx+this.player.hitr >= plt.lowerLeft.x && this.player.hitx-this.player.hitr <= plt.upperRight.x && plt.upperRight.y - (this.player.hity+this.player.hitr) <= 5 && plt.upperRight.y - (this.player.hity+this.player.hitr) >= -5) {
                console.log(plt, plt.upperRight.y - (this.player.hity+this.player.hitr));
                collision = true;
                platform = plt;
                return false;
            }
            return true;
        });
        // console.log("\n\n" + Math.min(...dists));
        return [collision, platform];
    }
    // spawnPlatform() {
        
    // }
}

const game = new Game(canvas);
const ground = {
    hitx: game.player.hitx,
    hity: canvas.height,
    hitr: 0
}

function animate() {
    // console.log(game.platforms.length);
    if (game.active || game.firstFrame) {
        game.firstFrame = false;
        ctx.clearRect(0,0,canvas.width, canvas.height);
        game.render(ctx);

        // if (game.gravity <= 0.2) {
        //     game.gravity += 0.2
        //     game.gravity = Math.round(game.gravity * 100) / 100;
        //     if (game.gravity > 0.2) {
        //         game.gravity = 0.2;
        //     }
        // }

        // if (game.gravity <= 0.3) {
        //     game.gravity += 0.1;
        //     game.gravity = Math.round(game.gravity * 10) / 10;
        // }

        game.gravity = game.gravity+0.5;
        game.gravity = Math.round(game.gravity * 10) / 10;

        // console.log(game.gravity);

        // console.log(game.platforms[game.platforms.length-1].upperRight.y - game.player.hity);
        // if (game.platforms[game.platforms.length-1].upperRight.y - game.player.hity >= -10) {
        //     game.platforms.push(new Platform(game, "basic"));
        // }

        // if (game.player.scoreCounter == 3 || game.player.scoreCounter == 7) {
        //     game.platforms.push(new Platform(game, "basic"));
        // }

        requestAnimationFrame(animate);

    }
}
animate();

function endGame(score) {
    game.active = false;
    let form = document.createElement("form");
    $(form).attr("action", "/doodlemoth");
    $(form).attr("method", "post");
    let scoreInput = document.createElement("input");
    $(scoreInput).attr("name", "score");
    $(scoreInput).val(score);
    form.appendChild(scoreInput);
    document.getElementById("body").appendChild(form);
    $(form).submit();
}