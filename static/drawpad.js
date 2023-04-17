// import Canvas2Image from "./canvas2image";
// import { saveAsPNG } from './canvas2image';

const canvas = this.document.getElementById("canvas");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight * 0.75;

class Pen {
    constructor(pad, context) {
        this.pad = pad;
        this.context = context;
        this.context.strokeStyle = "black"
        this.context.lineWidth = 1;
        this.context.globalAlpha = 1;
    }
}

class Pad {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.pen = new Pen(this, ctx);
        this.mouse = {
            x: this.width/2,
            y: this.height/2,
            pressed: false
        }

        // event listeners
        canvas.addEventListener('mousedown', e => {
            this.mouse.pressed = true;
        });
        window.addEventListener('mouseup', e => {
            this.mouse.pressed = false;
        });
        canvas.addEventListener('mousemove', e => {
            if (this.mouse.pressed) {
                this.pen.context.beginPath();
                this.pen.context.moveTo(this.mouse.x, this.mouse.y);
                this.pen.context.lineTo(e.offsetX, e.offsetY);
                this.pen.context.stroke();
            }
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        });

    }
}

const pad = new Pad(canvas);

function changePenAttr(attr, value) {
    if (attr == "color") {
        pad.pen.context.strokeStyle = value;
    }
    else if (attr == "thickness") {
        pad.pen.context.lineWidth = value;
    }
    else if (attr == "opacity") {
        pad.pen.context.globalAlpha = value;
    }
    $("#draw-"+attr).val(value);
    $("#draw-presets").val("custom");
}

function changePenPreset(value) {
    if (value == "pen") {
        changePenAttr("color", "black");
        changePenAttr("thickness", 1);
        changePenAttr("opacity", 1);
    }
    else if (value == "marker") {
        changePenAttr("color", "blue");
        changePenAttr("thickness", 9);
        changePenAttr("opacity", .9);
    }
    else if (value == "highlighter") {
        changePenAttr("color", "yellow");
        changePenAttr("thickness", 10);
        changePenAttr("opacity", .4);
    }
    else if (value == "pencil") {
        changePenAttr("color", "gray");
        changePenAttr("thickness", 1);
        changePenAttr("opacity", 1);
    }
    $("#draw-presets").val(value);
}

function clearPad() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
}
