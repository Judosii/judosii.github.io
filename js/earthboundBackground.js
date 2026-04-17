const canvas = document.getElementById('animatedCanvasBackground');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

let img = new Image();
img.src = 'img/EbBackgrounds/297.png';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pattern;
let scrollSpeed = 0.1;
let scrollDir = { x: 1, y: 1 };
let offsetX = 0;
let offsetY = 0;
let time = 0;

// --- Distortion config ---
const distortion = {
    // Global horizontal sine wave (whole image sways left/right)
    horizOscillate: {
        enabled: true,
        amplitude: 18,   // px
        speed: 0.010,
    },
    // Global vertical sine wave (whole image bobs up/down)
    vertOscillate: {
        enabled: true,
        amplitude: 10,   // px
        speed: 0.0,
    },
    // Per-row horizontal shift (SNES wavy/ripple effect)
    interleavedRows: {
        enabled: true,
        rowHeight: 1,    // px per slice
        amplitude: 32,   // px max shift per row
        speed: 0.005,    // wave travel speed
    },
};

img.onload = function () {
    pattern = ctx.createPattern(img, 'repeat');
    DrawBackground();
};

window.addEventListener('resize', ResizeCanvas);

function ResizeCanvas() {
    canvas.width  = window.innerWidth  + img.width;
    canvas.height = window.innerHeight + img.height;
    RenderFrame();
}

function RenderFrame() {
    if (!pattern) return;

    const W = canvas.width;
    const H = canvas.height;
    const iw = img.width;
    const ih = img.height;

    // Global oscillation offsets
    const globalDX = distortion.horizOscillate.enabled
        ? Math.sin(time * distortion.horizOscillate.speed * 60) * distortion.horizOscillate.amplitude
        : 0;
    const globalDY = distortion.vertOscillate.enabled
        ? Math.sin(time * distortion.vertOscillate.speed * 60) * distortion.vertOscillate.amplitude
        : 0;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = pattern;

    if (!distortion.interleavedRows.enabled) {
        // Simple scrolling + global oscillation, no row slicing
        ctx.translate(offsetX + globalDX, offsetY + globalDY);
        ctx.fillRect(-iw, -ih, W + iw * 2, H + ih * 2);
    } else {
        // Slice the canvas into horizontal strips and shift each independently
        const { rowHeight, amplitude, speed } = distortion.interleavedRows;
        const rh = Math.max(1, rowHeight);

        for (let y = -rh * 2; y < H + rh * 2; y += rh) {
            const row   = Math.floor(y / rh);
            const phase = row * Math.PI; // alternates phase per row
            const rowDX = Math.sin(time * speed * 60 + phase) * amplitude;

            ctx.save();
            ctx.beginPath();
            ctx.rect(0, y, W, rh + 1); // +1 avoids hairline gaps
            ctx.clip();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.translate(offsetX + globalDX + rowDX, offsetY + globalDY);
            ctx.fillStyle = pattern;
            ctx.fillRect(-iw * 2, y - ih, W + iw * 4, rh + ih * 2);
            ctx.restore();
        }
    }
}

function DrawBackground() {
    time += 0.016; // ~60fps time step

    offsetX += scrollDir.x * scrollSpeed;
    offsetY += scrollDir.y * scrollSpeed;
    offsetX %= img.width;
    offsetY %= img.height;

    RenderFrame();
    requestAnimationFrame(DrawBackground);
}