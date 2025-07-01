// noinspection SpellCheckingInspection

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled=false;

let img = new Image();
img.src = 'js/ebtest.png';

//set canvas to window size on startup
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pattern;

img.onload = function(){
    pattern = ctx.createPattern(img, 'repeat');
    Drawbackground()
}

//prevent stretching on window resize
window.addEventListener('resize', ResizeCanvas )

function ResizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Drawbackground()
}

function Render(){
    ctx.drawImage(img, 0,0,canvas.width, canvas.height);
    Drawbackground();
}

function Drawbackground(){
    if(pattern){
        ctx.fillStyle = pattern;
        ctx.fillRect(0,0, canvas.width, canvas.height)
    }
}

