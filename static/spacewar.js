window.addEventListener('load', function() {
    const canvas = this.document.getElementById("canvas");
    const ctx = canvas.getContext('2d');

    canvas.width = 960;
    canvas.height = 540;

    ctx.fillStyle = "green";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "green";

    class Player {
        constructor(game) {
            this.game = game;
            this.hitx = this.game.width/2;
            this.hity = this.game.height/2;
            this.hitr = 20;
            this.speedx = 0;
            this.speedy = 0;
            this.dx = 0;
            this.dx = 0;
            this.speedMod = 5;
        }
        draw(context) {
            context.beginPath();
            context.arc(this.hitx,this.hity,this.hitr,0,Math.PI*2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
            context.beginPath();
            context.moveTo(this.hitx, this.hity);
            context.lineTo(this.game.mouse.x, this.game.mouse.y);
            context.stroke();
        }
        update() {
            this.dx = this.game.mouse.x - this.hitx;
            this.dy = this.game.mouse.y - this.hity;
            const dist = Math.hypot(this.dy, this.dx);
            if (dist > this.speedMod) {
                this.speedX = this.dx/dist || 0;
                this.speedY = this.dy/dist || 0;
            }
            else {
                this.speedX = 0;
                this.speedY = 0;
            }
            
            this.hitx += this.speedX*this.speedMod;
            this.hity += this.speedY*this.speedMod;
        }
    }

    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.mouse = {
                x: this.width/2,
                y: this.height/2,
                pressed: false
            }

            // event listeners
            // canvas.addEventListener('mousedown', e => {
            //     this.mouse.x = e.offsetX;
            //     this.mouse.y = e.offsetY;
            //     this.mouse.pressed = true;
            // });
            // canvas.addEventListener('mouseup', e => {
            //     this.mouse.x = e.offsetX;
            //     this.mouse.y = e.offsetY;
            //     this.mouse.pressed = false;
            // });
            canvas.addEventListener('mousemove', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                // if (this.mouse.pressed) {
                //     this.mouse.x = e.offsetX;
                //     this.mouse.y = e.offsetY;
                // }
                
            });
        }

        render(context) {
            this.player.draw(context);
            this.player.update();
        }
    }

    const game = new Game(canvas);

    function animate() {
        ctx.clearRect(0,0,canvas.width, canvas.height);
        game.render(ctx);
        requestAnimationFrame(animate);
    }
    animate()

});