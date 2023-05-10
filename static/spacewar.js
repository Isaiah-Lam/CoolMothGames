window.addEventListener('load', function() {
    $("#dialog").dialog({autoOpen: false});

    $("#start-btn").click(function () {
        $(this).hide();
        $("#canvas").css("visibility", "visible");
        document.getElementById("buffer").scrollIntoView();
        animate();
    })

    const canvas = this.document.getElementById("canvas");
    const ctx = canvas.getContext('2d');

    canvas.width = 1280;
    canvas.height = 720;

    ctx.fillStyle = "green";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "green";

    class Player {
        constructor(game) {
            this.game = game;
            this.hitx = this.game.width/2;
            this.hity = this.game.height/2;
            this.hitr = 15;
            this.speedx = 0;
            this.speedy = 0;
            this.dx = 0;
            this.dy = 0;
            this.speedMod = 10;
            this.goalx = this.game.width/2;
            this.goaly = this.game.height/2;
            this.shotSpeed = 30;
            this.bulletRange = 150;
            this.bulletSize = 2;
            this.health = 500;
        }
        draw(context) {
            context.beginPath();
            context.arc(this.hitx,this.hity,this.hitr,0,Math.PI*2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
            // context.beginPath();
            // context.moveTo(this.hitx, this.hity);
            // context.lineTo(this.game.mouse.x, this.game.mouse.y);
            // context.stroke();
        }
        update() {
            this.dx = this.goalx - this.hitx;
            this.dy = this.goaly - this.hity;
            const dist = Math.hypot(this.dy, this.dx);
            if (dist > this.speedMod) {
                this.speedx = this.dx/dist || 0;
                this.speedy = this.dy/dist || 0;
            }
            else {
                this.speedx = 0;
                this.speedy = 0;
            }
            
            this.hitx += this.speedx*this.speedMod;
            this.hity += this.speedy*this.speedMod;
        }
        moveup() {
            this.goaly = 0;
        }
        moveleft() {
            this.goalx = 0;
        }
        movedown() {
            this.goaly = this.game.canvas.height;
        }
        moveright() {
            this.goalx = this.game.canvas.width;
        }
        stopmovex() {
            this.goalx = this.hitx;
        }
        stopmovey() {
            this.goaly = this.hity;
        }
    }

    class Bullet {
        constructor(game, player, clickx, clicky, type) {
            player.ammo -= 1;
            this.game = game;
            this.hitx = player.hitx;
            this.hity = player.hity;
            // console.log(this.hitx, this.hity)
            this.hitr = player.bulletSize;
            this.range = player.bulletRange;
            let d = Math.sqrt((clickx-this.hitx)**2 + (clicky-this.hity)**2);
            // console.log(d);
            let g = this.range/d;
            // console.log(g);
            this.goalx = ((1-g)*this.hitx+g*clickx);
            this.goaly = ((1-g)*this.hity+g*clicky);
            // this.goalx = clickx;
            // this.goaly = clicky;
            this.originx = player.hitx;
            this.originy = player.hity;
            this.bulletType = type;
            this.speedMod = 5;
            this.speedx = 0;
            this.speedy = 0;
            this.dx = 0;
            this.dy = 0;
        }
        draw(context) {
            context.beginPath();
            context.save();
            context.globalAlpha = 0.5;
            ctx.fillStyle = "red";
            ctx.strokeStyle = "red";
            context.arc(this.hitx,this.hity,this.hitr,0,Math.PI*2);
            context.fill();
            context.stroke();
            // context.moveTo(this.hitx, this.hity);
            // context.lineTo(this.game.mouse.x, this.game.mouse.y);
            context.restore();
            this.update();
        }
        update() {
            this.dx = this.goalx - this.hitx;
            this.dy = this.goaly - this.hity;
            const dist = Math.hypot(this.dy, this.dx);
            if (dist > this.speedMod) {
                this.speedX = this.dx/dist || 0;
                this.speedY = this.dy/dist || 0;
            }
            else {
                this.speedX = this.dx;
                this.speedY = this.dy;
                this.speedMod = 1;
            }
            
            this.hitx += this.speedX*this.speedMod;
            this.hity += this.speedY*this.speedMod;
            this.game.enemies.forEach(e => {
                let [collision, d, collisionDistance, dx, dy] = this.game.checkCollision(this,e);
                if (collision) {
                    console.log("hit");
                    this.game.enemies.splice(this.game.enemies.indexOf(e), 1);
                    this.game.bullets.splice(this.game.bullets.indexOf(this), 1);
                    this.game.score += 10;
                    $("#score").text(this.game.score);
                    let prevLevel = this.game.level;
                    if (this.game.score == this.game.pointsForNextLevel) {
                        this.game.level++;
                        this.game.pointsForNextLevel += (this.game.level*50+50);
                        $("#level").text(this.game.level);
                        this.game.paused = true;
                        startUpgrade(this.game.player.shotSpeed, this.game.player.bulletRange, this.game.player.bulletSize);
                    }
                    // // this.game.level = Math.min(10, (Math.floor(this.game.score/(100+((this.game.level-1)*50)))+1));
                    
                    // if (prevLevel != this.game.level) {
                        
                    //     // $("#upgrade-div").show();
                    // }
                }
                else if (Math.ceil(Math.sqrt((this.hitx-this.originx)**2 + (this.hity-this.originy)**2)) >= this.range) {
                    this.game.bullets.splice(this.game.bullets.indexOf(this), 1);
                }
            });
        }
    }

    class Enemy {
        constructor(game, spawnx, spawny, speed) {
            this.game = game;
            this.hitx = spawnx;
            this.hity = spawny;
            this.hitr = 5;
            this.speedx = 0;
            this.speedy = 0;
            this.dx = 0;
            this.dy = 0;
            this.speedMod = speed;
            this.goalx = this.hitx;
            this.goaly = this.hity;
        }
        draw(context) {
            context.beginPath();
            context.arc(this.hitx,this.hity,this.hitr,0,Math.PI*2);
            context.save();
            context.globalAlpha = 0.5;
            ctx.fillStyle = "yellow";
            ctx.strokeStyle = "yellow";
            context.fill();
            context.stroke();
            context.restore();
            this.update();
        }
        update() {
            this.goalx = this.game.player.hitx;
            this.goaly = this.game.player.hity;
            this.dx = this.goalx - this.hitx;
            this.dy = this.goaly - this.hity;
            const dist = Math.hypot(this.dy, this.dx);
            if (dist > this.speedMod) {
                this.speedx = this.dx/dist || 0;
                this.speedy = this.dy/dist || 0;
            }
            else {
                this.speedx = 0;
                this.speedy = 0;
            }
            
            this.hitx += this.speedx*this.speedMod;
            this.hity += this.speedy*this.speedMod;

            
            let [collision, d, collisionDistance, dx, dy] = this.game.checkCollision(this,this.game.player);
            if (collision) {
                this.game.player.health -= this.game.level*2;
                this.game.player.health = Math.max(this.game.player.health, 0);
                $("#health").text(this.game.player.health);
                if (this.game.player.health == 0) {
                    endGame(this.game.score);
                }
                this.game.enemies.splice(this.game.enemies.indexOf(this), 1);
            }

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
            this.bullets = [];
            this.timerActive = true;
            this.framesSinceLastShot = 0;
            this.framesSinceLastSpawn = 0;
            this.level = 1;
            this.enemies = [];
            this.score = 0;
            this.paused = false;
            this.pointsForNextLevel = 100;

            // event listeners
            this.movementControls = {
                "w": {pressed: false, "fx": this.player.moveup()},
                "a": {pressed: false, "fx": this.player.moveleft()},
                "s": {pressed: false, "fx": this.player.movedown()},
                "d": {pressed: false, "fx": this.player.moveright()},
                "click": {pressed: false, x: null, y: null}
            }
            window.addEventListener('keydown', e => {
                if (this.movementControls[e.key]) {
                   this.movementControls[e.key].pressed = true; 
                }
                
            });
            window.addEventListener('keyup', e => {
                if (this.movementControls[e.key]) {
                    this.movementControls[e.key].pressed = false;
                }
            });
            canvas.addEventListener('mousedown', e => {
                this.movementControls["click"].pressed = true;
                this.movementControls["click"].x = e.offsetX;
                this.movementControls["click"].y = e.offsetY;
                // this.bullets.push(new Bullet(this, this.player, e.offsetX, e.offsetY, "basic"));
            });
            canvas.addEventListener('mouseup', e => {
                this.movementControls["click"].pressed = false;
                this.movementControls["click"].x = null;
                this.movementControls["click"].y = null;
            });
            canvas.addEventListener('mousemove', e => {
                this.movementControls["click"].x = e.offsetX;
                this.movementControls["click"].y = e.offsetY;
                // if (this.movementControls["click"].pressed) {
                //     this.bullets.push(new Bullet(this, this.player, e.offsetX, e.offsetY, "basic"));
                // }
            });
            // canvas.addEventListener('mousemove', e => {
            //     // this.mouse.x = e.offsetX;
            //     // this.mouse.y = e.offsetY;
            //     if (this.mouse.pressed) {
            //         this.mouse.x = e.offsetX;
            //         this.mouse.y = e.offsetY;
            //     }
            // });
        }
        executeMoves(game) {
            Object.keys(this.movementControls).forEach(key=> {
                let lowKey = key.toLowerCase()
                if (this.movementControls[lowKey].pressed) {
                    if (lowKey == "w") {
                        this.player.moveup();
                    }
                    else if (lowKey == "a") {
                        this.player.moveleft();
                    }
                    else if (lowKey == "s") {
                        this.player.movedown();
                    }
                    else if (lowKey == "d") {
                        this.player.moveright();
                    }
                    else if (lowKey == "click" && this.framesSinceLastShot > this.player.shotSpeed) {
                        this.bullets.push(new Bullet(this, this.player, this.movementControls[lowKey].x, this.movementControls[lowKey].y, "basic"));
                        this.framesSinceLastShot = 0;
                    }
                }
                else {
                    if ((lowKey == "w" && !this.movementControls["s"].pressed) || (lowKey == "s" && !this.movementControls["w"].pressed)) {
                        this.player.stopmovey();
                    }
                    else if ((lowKey == "a" && !this.movementControls["d"].pressed) || (lowKey == "d" && !this.movementControls["a"].pressed)) {
                        this.player.stopmovex();
                    }
                }
            });
        }
        render(context) {
            if (this.framesSinceLastSpawn > 60) {
                const spawnPoints = [{x:0,y:0},{x:0,y:this.canvas.height},{x:this.canvas.width,y:this.canvas.height},{x:this.canvas.width,y:0}];
                var lastSpawn = -1;
                var spawnPoint = -1;
                for (let i=0; i<Math.sqrt(this.level)+1; i++) {
                    while (spawnPoint == lastSpawn) {
                        spawnPoint = Math.floor(Math.random() * 4);
                    }
                    this.enemies.push(new Enemy(this, spawnPoints[spawnPoint].x, spawnPoints[spawnPoint].y, Math.min(Math.max(Math.random()*this.level, 0.5), 3)));
                    lastSpawn = spawnPoint;
                }
                this.framesSinceLastSpawn = 0;
            }
            this.player.draw(context);
            this.player.update();
            this.bullets.forEach(b => b.draw(context));
            this.enemies.forEach(e => e.draw(context));

        }
        checkCollision(a, b) {
            let dx = a.hitx - b.hitx;
            let dy = a.hity - b.hity;
            let dist = Math.hypot(dy, dx);
            let collisionDistance = a.hitr + b.hitr;
            return [(dist < collisionDistance), dist, collisionDistance, dx, dy];
        }   
        // stopwatch() {
        //     if (this.timerActive) {
        //         let centiseconds = parseInt($("#centiseconds").text());
        //         let seconds = parseInt($("#seconds").text());
        //         centiseconds++;
        //         if (centiseconds == 100) {
        //             seconds++;
        //             centiseconds = 0;
        //         }
        //         centiseconds = ""+centiseconds;
        //         if (centiseconds < 10) {
        //             centiseconds = "0"+centiseconds;
        //         }
        //         seconds = ""+seconds;
        //         $("#centiseconds").text(centiseconds);
        //         $("#seconds").text(seconds);
        //         setTimeout(this.stopwatch(), 10);
        //     }
        // }
    }

    const game = new Game(canvas);

    // $("#dialog").dialog({
    //     buttons: [
    //         {
    //             text: "Ammo",
    //             click: function() {
    //                 upgrade("ammo");
    //                 $(this).dialog("close");
    //             }
    //         },
    //         {
    //             text: "Shot Speed",
    //             click: function() {
    //                 upgrade("shotspeed");
    //                 $(this).dialog("close");
    //             }
    //         },
    //         {
    //             text: "Range",
    //             click: function() {
    //                 upgrade("range");
    //                 $(this).dialog("close");
    //             }
    //         },
    //         {
    //             text: "Bullet Size",
    //             click: function() {
    //                 upgrade("size");
    //                 $(this).dialog("close");
    //             }
    //         }
    //     ]
    // });

    function animate() {
        if (!game.paused) {
            game.executeMoves(game);
            ctx.clearRect(0,0,canvas.width, canvas.height);
            game.render(ctx);
            game.framesSinceLastShot++;
            game.framesSinceLastSpawn++;
        }
        requestAnimationFrame(animate);
    }
    // animate();

    // game.stopwatch();

    function startUpgrade(shotSpeed, range, size) {
        validUpgrades = [];
        if (shotSpeed > 0) {
            validUpgrades.push({text: "Shot Speed",click: function() {upgrade("shotspeed");$(this).dialog("close");}});
        }
        if (range < 300) {
            validUpgrades.push({text: "Range",click: function() {upgrade("range");$(this).dialog("close");}});
        }
        if (size < 5) {
            validUpgrades.push({text: "Bullet Size",click: function() {upgrade("size");$(this).dialog("close");}});
        }
        $("#dialog").dialog({
            buttons: validUpgrades
        });
        $("#dialog").dialog("open");
    }

    function upgrade(choice) {
        if (choice == "shotspeed") {
            game.player.shotSpeed -= 10;
        }
        else if (choice == "range") {
            game.player.bulletRange += 50;
        }
        else if (choice == "size") {
            game.player.bulletSize += 1;
        }
        game.paused = false;
        // $("#upgrade-div").hide();
    }

    function endGame(score) {
        let form = document.createElement("form");
        $(form).attr("action", "/starwar");
        $(form).attr("method", "post");
        let scoreInput = document.createElement("input");
        $(scoreInput).attr("name", "score");
        $(scoreInput).val(score);
        form.appendChild(scoreInput);
        document.getElementById("score-div").appendChild(form);
        $(form).submit();
    }

});

