const card = document.getElementById("card");

// ===== ROTATION =====
let rx = 0, ry = 0;
let tx = 0, ty = 0;

// ===== SHINE =====
let sx = 0, sy = 0, rot = 0;
let tsx = 0, tsy = 0, trot = 0;

// ===== PHYSICS =====
let vx = 0, vy = 0;

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// ================= MOUSE =================
function onMove(e) {
  const r = card.getBoundingClientRect();

  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;

  tx = y * -18;
  ty = x * 18;

  // shine reacts stronger than rotation
  tsx = x * 80;
  tsy = y * 80;
  trot = x * 40;
}

// ================= GYRO =================
function onGyro(e) {
  let x = Math.max(-30, Math.min(30, e.beta || 0));
  let y = Math.max(-30, Math.min(30, e.gamma || 0));

  tx = x / 2;
  ty = y / 2;

  tsx = y * 3;
  tsy = x * 3;
  trot = y * 4;
}

// ================= ENABLE GYRO =================
function enableGyro() {
  if (typeof DeviceOrientationEvent?.requestPermission === "function") {
    DeviceOrientationEvent.requestPermission()
      .then(res => {
        if (res === "granted") {
          window.addEventListener("deviceorientation", onGyro);
        }
      });
  } else {
    window.addEventListener("deviceorientation", onGyro);
  }
}

// ================= INIT =================
if (isMobile) {
  document.body.addEventListener("click", enableGyro, { once: true });
} else {
  window.addEventListener("pointermove", onMove);
}

// ================= LOOP =================
function animate() {
  vx += (tx - rx) * 0.08;
  vy += (ty - ry) * 0.08;

  rx += vx;
  ry += vy;

  vx *= 0.85;
  vy *= 0.85;

  card.style.transform = `
    perspective(1000px)
    rotateX(${rx}deg)
    rotateY(${ry}deg)
    scale(1.05)
  `;

  // smooth shine
  sx += (tsx - sx) * 0.12;
  sy += (tsy - sy) * 0.12;
  rot += (trot - rot) * 0.12;

  // 🔥 REAL VISUAL OUTPUT
  card.style.setProperty("--shine-x", sx + "px");
  card.style.setProperty("--shine-y", sy + "px");
  card.style.setProperty("--rot", rot + "deg");

  // dynamic glow intensity
  const glow = Math.min(0.8, Math.abs(rx + ry) / 30 + 0.3);
  card.style.setProperty("--shine-opacity", glow);

  requestAnimationFrame(animate);
}

animate();