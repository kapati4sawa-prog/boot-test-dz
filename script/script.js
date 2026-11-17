
const products = [
    {
        name: "Куллер cooler master",
        label: "500 гривень",
        price: 500,
        photo: "photo/cooler.jpg"
    },
    {
        name: "Say hi to the new galaxy Galaxy Note 10",
        label: "hi гривень",
        price: null,
        photo: "photo/galaxy-note-10.jpg"
    },
    {
        name: "Навушники безпровідні",
        label: "1000 гривень",
        price: 1000,
        photo: "photo/headphones.jpg"
    },
    {
        name: "Процесор intel core i5 12400f",
        label: "7000 гривень",
        price: 7000,
        photo: "photo/intel-i5-12400f.jpg"
    },
    {
        name: "Ноутбук Lenovo",
        label: "6000 гривень",
        price: 6000,
        photo: "photo/lenovo-laptop.jpg"
    },
    {
        name: "Картопля молода",
        label: "35 гривень",
        price: 35,
        photo: "photo/potato.jpg"
    },
    {
        name: "Клавіатура ігрова Paida",
        label: "31000 гривень",
        price: 31000,
        photo: "photo/keyboard-paida.jpg"
    },
    {
        name: "Заберіть це. Воно вже весь мій будинок зодовбало",
        label: "0 гривень",
        price: 0,
        photo: "photo/take-this.jpg"
    },
    {
        name: "Zipt•k 10 mg",
        label: "гривень гривень",
        price: null,
        photo: "photo/ziptik.jpg"
    }
];

// DOM Elements
const grid = document.getElementById("grid");
const search = document.getElementById("q");
const sortBtn = document.getElementById("sortBtn");
const cnt = document.getElementById("cnt");

// Global Variables
let sortMode = "def";
let cartCount = 0;


// HTML Protection
function escapeHtml(s) {
    return s.replace(/[&<>"]/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;"
    }[c]));
}


// Product Rendering
function render() {
    const q = search.value.trim().toLowerCase();

    const list = products.filter(p =>
        p.name.toLowerCase().includes(q)
    );

    // Sorting
    if (sortMode !== "def") {
        list.sort((a, b) => {
            if (a.price === null) return 1;
            if (b.price === null) return -1;

            return sortMode === "asc"
                ? a.price - b.price
                : b.price - a.price;
        });
    }

    // Empty Search Result
    if (!list.length) {
        grid.innerHTML = '<p class="text-muted">Нічого не знайдено</p>';
        return;
    }

    // Generate Product Cards
    grid.innerHTML = list.map(p => `
        <div class="col">
            <div class="card h-100">
                <div class="pimg card-img-top">
                    <img
                        src="${p.photo}"
                        alt="${escapeHtml(p.name)}"
                        onerror="this.outerHTML='<div class=&quot;ph&quot;>Фото: ${p.photo}</div>'"
                    >
                </div>

                <div class="card-body d-flex flex-column">
                    <h6 class="card-title">
                        ${escapeHtml(p.name)}
                    </h6>

                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span class="price">${p.label}</span>

                        <button class="btn btn-primary btn-sm buy">
                            🛒 Купити
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}


// Search Event
search.addEventListener("input", render);


// Sorting Events
document.querySelectorAll("[data-sort]").forEach(a => {
    a.addEventListener("click", e => {
        e.preventDefault();

        sortMode = a.dataset.sort;

        sortBtn.textContent =
            "Сортування: " + a.textContent.toLowerCase();

        render();
    });
});


// Shopping Cart Event
grid.addEventListener("click", e => {
    if (e.target.closest(".buy")) {
        cnt.textContent = ++cartCount;
    }
});


// 3D Carousel Elements
const scene = document.getElementById("scene");
const ring = document.getElementById("ring");
const panels = [...ring.children];

const n = panels.length;
const step = 360 / n;

let radius = 0;
let current = 0;
let rotation = 0;
let timer = null;


// Carousel Layout
function layout() {
    const w = Math.min(scene.clientWidth * 0.72, 640);

    ring.style.width = w + "px";

    radius = Math.round(
        (w / 2) / Math.tan(Math.PI / n) * 1.06
    );

    panels.forEach((p, i) => {
        p.style.transform =
            `rotateY(${i * step}deg) translateZ(${radius}px)`;
    });

    apply();
}


// Apply Carousel Rotation
function apply() {
    ring.style.transform =
        `translateZ(${-radius}px) rotateY(${rotation}deg)`;
}


// Move Carousel
function go(dir) {
    current += dir;
    rotation = -current * step;

    apply();
}


// Automatic Rotation
function startAuto() {
    stopAuto();

    timer = setInterval(() => go(1), 3500);
}

function stopAuto() {
    clearInterval(timer);
}


// Navigation Buttons
document.getElementById("prev").addEventListener("click", () => {
    go(-1);
    startAuto();
});

document.getElementById("next").addEventListener("click", () => {
    go(1);
    startAuto();
});


// Dragging Variables
let dragging = false;
let startX = 0;
let startRot = 0;


// Start Dragging
scene.addEventListener("pointerdown", e => {
    dragging = true;

    startX = e.clientX;
    startRot = rotation;

    ring.classList.add("nodrag");
    scene.classList.add("drag");

    scene.setPointerCapture(e.pointerId);

    stopAuto();
});


// Drag Movement
scene.addEventListener("pointermove", e => {
    if (!dragging) return;

    rotation = startRot + (e.clientX - startX) * 0.35;

    apply();
});


// End Dragging
function endDrag() {
    if (!dragging) return;

    dragging = false;

    ring.classList.remove("nodrag");
    scene.classList.remove("drag");

    current = Math.round(-rotation / step);
    rotation = -current * step;

    apply();
    startAuto();
}


// Dragging Events
scene.addEventListener("pointerup", endDrag);
scene.addEventListener("pointercancel", endDrag);


// Window Resize
window.addEventListener("resize", layout);


// Initialization
render();
layout();
startAuto();
