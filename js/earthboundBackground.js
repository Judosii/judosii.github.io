// noinspection SpellCheckingInspection

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

let img = new Image();
img.src = 'js/ebtest.png';

ctx.imageSmoothingEnabled=false;

//set canvas to window size on startup
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

img.onload = function(){
    ctx.fillStyle = ctx.createPattern(img, 'repeat');
    ctx.drawImage(img, 0,0,canvas.width, canvas.height)
}

//prevent stretching on window resize
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Render()
})

function Render(){
    ctx.createPattern(img, "repeat")
    ctx.drawImage(img, 0,0,canvas.width, canvas.height)
    //ctx.fillRect(0,0, canvas.width, canvas.height)
}

