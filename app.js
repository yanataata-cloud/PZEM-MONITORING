import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// === Konfigurasi Firebase ===
const firebaseConfig = {
  apiKey: window.__env__.FIREBASE_API_KEY,
  authDomain: window.__env__.FIREBASE_AUTH_DOMAIN,
  databaseURL: window.__env__.FIREBASE_DB_URL,
  projectId: window.__env__.FIREBASE_PROJECT_ID,
  storageBucket: window.__env__.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: window.__env__.FIREBASE_MSG_SENDER_ID,
  appId: window.__env__.FIREBASE_APP_ID
};

// === Inisialisasi Firebase ===
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// === DOM Reference ===
const valV = document.getElementById('valV');
const valI = document.getElementById('valI');
const valP = document.getElementById('valP');
const valE = document.getElementById('valE');
const valF = document.getElementById('valF');
const valPF = document.getElementById('valPF');
const r1 = document.getElementById('r1');
const r2 = document.getElementById('r2');
const r3 = document.getElementById('r3');

// === Grafik ===
const labels = [];
const dataPower = [];
const dataVolt = [];

const ctxPower = document.getElementById('powerChart').getContext('2d');
const ctxVolt = document.getElementById('voltChart').getContext('2d');

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { display: false }, y: { beginAtZero: true } }
};

const powerChart = new Chart(ctxPower, {
  type: 'line',
  data: { labels, datasets: [{ label: 'Power', data: dataPower, borderColor: '#0F62FE', borderWidth: 2, tension: 0.2, fill: false }] },
  options: chartOptions
});

const voltChart = new Chart(ctxVolt, {
  type: 'line',
  data: { labels, datasets: [{ label: 'Voltage', data: dataVolt, borderColor: '#00B289', borderWidth: 2, tension: 0.2, fill: false }] },
  options: chartOptions
});

function addPoint(label, p, v) {
  labels.push(label);
  dataPower.push(p);
  dataVolt.push(v);
  if (labels.length > 30) { labels.shift(); dataPower.shift(); dataVolt.shift(); }
  powerChart.update();
  voltChart.update();
}

// === Ambil Data dari Firebase ===
const pzemRef = ref(db, "PZEM");
onValue(pzemRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  const { Voltage: v, Current: i, Power: p, Energy: e, Frequency: f, PowerFactor: pf, Relays } = data;

  valV.textContent = v ? v.toFixed(1) + " V" : "--";
  valI.textContent = i ? i.toFixed(2) + " A" : "--";
  valP.textContent = p ? p.toFixed(1) + " W" : "--";
  valE.textContent = e ? e.toFixed(2) + " Wh" : "--";
  valF.textContent = f ? f.toFixed(1) + " Hz" : "--";
  valPF.textContent = pf ? pf.toFixed(2) : "--";

  if (Relays) {
    r1.textContent = Relays.R1 ? "ON" : "OFF";
    r1.style.background = Relays.R1 ? "#00B28933" : "#e5e7eb";
    r2.textContent = Relays.R2 ? "ON" : "OFF";
    r2.style.background = Relays.R2 ? "#00B28933" : "#e5e7eb";
    r3.textContent = Relays.R3 ? "ON" : "OFF";
    r3.style.background = Relays.R3 ? "#00B28933" : "#e5e7eb";
  }

  const now = new Date().toLocaleTimeString();
  document.getElementById("timeNow").textContent = now;
  addPoint(now, p || 0, v || 0);
});
