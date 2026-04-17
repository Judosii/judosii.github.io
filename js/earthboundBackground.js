// noinspection SpellCheckingInspection

const canvas = document.getElementById('animatedCanvasBackground');
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = false;

let img = new Image();
img.src = 'img/EbBackgrounds/297.png';

// Offscreen buffer for distortion
const buffer = document.createElement("canvas");
const bctx = buffer.getContext("2d");

let pattern;

let scrollSpeed = 0.0;
let scrollDir = {
    "x": 1,
    "y": 1
};

let offsetX = 0;
let offsetY = 0;

// NEW: time + distortion settings
let time = 0;
let distortion = {
    horizontalAmp: 20,
    horizontalFreq: 0.02,

    verticalAmp: 10,
    verticalFreq: 0.015,

    interleaveAmp: 15,
    interleaveFreq: 0.03,

    paletteCycleSpeed: 6
};

// set canvas to window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

img.onload = function () {
    pattern = ctx.createPattern(img, 'repeat');

    // buffer size (larger than screen for safe sampling)
    buffer.width = img.width * 2;
    buffer.height = img.height * 2;

    Drawbackground();
};

// prevent stretching on resize
window.addEventListener('resize', ResizeCanvas);

function ResizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function Drawbackground() {
    if (pattern) {

        // update scroll
        offsetX += scrollDir.x * scrollSpeed;
        offsetY += scrollDir.y * scrollSpeed;

        offsetX %= img.width;
        offsetY %= img.height;

        // ---- DRAW BASE SCROLL INTO BUFFER ----
        bctx.setTransform(1, 0, 0, 1, 0, 0);
        bctx.clearRect(0, 0, buffer.width, buffer.height);

        bctx.translate(offsetX, offsetY);
        bctx.fillStyle = pattern;
        bctx.fillRect(
            -img.width,
            -img.height,
            buffer.width + img.width,
            buffer.height + img.height
        );

        // ---- CLEAR MAIN CANVAS ----
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ---- SCANLINE DISTORTION ----
        for (let y = 0; y < canvas.height; y++) {

            let horiz =
                Math.sin((y * distortion.horizontalFreq) + time) *
                distortion.horizontalAmp;

            let interleave =
                Math.sin((y * distortion.interleaveFreq) + time * 2) *
                distortion.interleaveAmp;

            if (y % 2 === 0) interleave *= -1;

            let vert =
                Math.sin((y * distortion.verticalFreq) + time) *
                distortion.verticalAmp;

            let sxOffset = horiz + interleave;
            let sy = (y + vert) % buffer.height;
            if (sy < 0) sy += buffer.height;

            // ---- FIX: TILE HORIZONTALLY ----
            let tileWidth = buffer.width;

            // start far enough left to cover screen
            let startX = -tileWidth + (sxOffset % tileWidth);

            for (let x = startX; x < canvas.width; x += tileWidth) {
                ctx.drawImage(
                    buffer,
                    0, sy,
                    tileWidth, 1,
                    x, y,
                    tileWidth, 1
                );
            }
        }

        // ---- PALETTE CYCLING ----
        if (Math.floor(time * 10) % distortion.paletteCycleSpeed === 0) {
            paletteCycle();
        }

        // update time
        time += 0.05;
    }

    requestAnimationFrame(Drawbackground);
}

// ---- PALETTE CYCLING FUNCTION ----
function paletteCycle() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // simple RGB rotation
        data[i] = g;
        data[i + 1] = b;
        data[i + 2] = r;
    }

    ctx.putImageData(imageData, 0, 0);
}