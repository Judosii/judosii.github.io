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

let scrollSpeedX = 0.5; // +right -left
let scrollSpeedY= 0.5; // +down -up
let offsetX = 0;
let offsetY = 0;


img.onload = function(){
    pattern = ctx.createPattern(img, 'repeat');
    Drawbackground()
}

//prevent stretching on window resize
window.addEventListener('resize', ResizeCanvas )

function ResizeCanvas(){
    canvas.width = window.innerWidth + img.width;
    canvas.height = window.innerHeight + img.height;
    Drawbackground()
}

function Drawbackground(){
    if(pattern){
        offsetX += scrollSpeedX;
        offsetY += scrollSpeedY;
        
        offsetX %= img.width;
        offsetY %= img.height;
        
        let totalWidth = canvas.width + img.width
        let totalHeight = canvas.height + img.height
        
        ctx.setTransform(1,0,0,1,0,0)
        ctx.clearRect(0,0,canvas.width, canvas.height)
        ctx.translate(offsetX, offsetY)
        
        ctx.fillStyle = pattern;
        ctx.fillRect(-img.width,-img.height, totalWidth, totalHeight)
    }
    requestAnimationFrame(Drawbackground)
    console.log(offsetX)
}

