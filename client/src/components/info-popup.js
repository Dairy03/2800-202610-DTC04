// --- fact data: per-kg rates + display formatters ---
const FACTS = [
  {
    emoji: "🚗",
    label: "Driving avoided",
    perKg: 1 / 0.192,
    format: (n) => fmt(n) + " km",
    detail: "of petrol-car driving",
  },
  {
    emoji: "🌳",
    label: "Tree absorption",
    perKg: 1 / 0.917,
    format: (n) =>
      n >= 12 ? fmt(n / 12, 1) + " tree-years" : fmt(n) + " tree-months",
    detail: "of CO₂ pulled from the air",
  },
  {
    emoji: "✈️",
    label: "Flight time",
    perKg: 1 / 1.5,
    format: (n) => (n >= 60 ? fmt(n / 60, 1) + " hr" : fmt(n) + " min"),
    detail: "of flying, per passenger",
  },
  {
    emoji: "📱",
    label: "Phone charges",
    perKg: 1 / 0.008,
    format: (n) => fmt(n) + " charges",
    detail: "of a smartphone, full",
  },
  {
    emoji: "🍔",
    label: "Beef burgers",
    perKg: 1 / 9.5,
    format: (n) => fmt(n, n < 10 ? 1 : 0) + " burgers",
    detail: "swapped for a plant meal",
  },
  {
    emoji: "📺",
    label: "Streaming",
    perKg: 1 / 0.036,
    format: (n) => fmt(n) + " hr",
    detail: "of HD video",
  },
  {
    emoji: "💡",
    label: "Light bulb",
    perKg: 1 / 0.004,
    format: (n) => (n >= 24 ? fmt(n / 24) + " days" : fmt(n) + " hr"),
    detail: "of a 10W LED running",
  },
  {
    emoji: "🧺",
    label: "Laundry",
    perKg: 1 / 0.3,
    format: (n) => fmt(n) + " loads",
    detail: "washed on warm",
  },
];

// --- number formatting helpers ---
function fmt(n, decimals = 0) {
  if (n >= 1000) return Math.round(n).toLocaleString();
  if (decimals > 0 && n < 100) return n.toFixed(decimals);
  return Math.round(n).toLocaleString();
}

function formatAmount(kg) {
  if (kg >= 1000) {
    const t = kg / 1000;
    return (t % 1 === 0 ? t.toFixed(0) : t.toFixed(1)) + " tonnes";
  }
  return kg.toLocaleString() + " kg";
}

// --- pick N random facts ---
function pickRandomFacts(count) {
  return [...FACTS].sort(() => Math.random() - 0.5).slice(0, count);
}

// --- build the popup DOM ---
function buildPopup() {
  if (document.getElementById("co2-popup")) return;

  const wrap = document.createElement("div");
  wrap.id = "co2-popup";
  wrap.setAttribute("role", "dialog");
  wrap.setAttribute("aria-modal", "true");
  wrap.setAttribute("aria-labelledby", "co2-popup-title");
  wrap.className =
    "fixed inset-0 z-[9999] hidden items-end sm:items-center justify-center sm:p-6";

  wrap.innerHTML = `
      <div data-close data-backdrop
           class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm
                  transition-opacity duration-300 opacity-0"></div>

      <div data-modal
           class="relative w-full sm:max-w-md bg-gray-50
                  rounded-t-3xl sm:rounded-3xl
                  p-6 sm:p-7 pb-8
                  max-h-[92vh] overflow-y-auto
                  shadow-2xl shadow-gray-900/40
                  ring-1 ring-gray-900/5
                  transition-all duration-500 ease-out
                  opacity-0 translate-y-6 sm:translate-y-4 sm:scale-95">

        <div class="sm:hidden mx-auto mb-4 w-10 h-1 rounded-full bg-gray-300"></div>

        <button data-close aria-label="Close"
                class="absolute top-4 right-4 w-9 h-9 rounded-full
                       flex items-center justify-center
                       bg-white text-gray-700
                       ring-1 ring-gray-900/10
                       active:bg-gray-800 active:text-stone-50
                       transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
               stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <path d="M1 1 L13 13 M13 1 L1 13"/>
          </svg>
        </button>

        <div class="mb-5">
          <div class="w-12 h-12 rounded-full bg-[#2BA84A]
                      flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="white" stroke-width="1.6"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 19c-3-3-3-9 0-12 3-3 9-3 12 0-1 7-5 12-12 12z"/>
              <path d="M7 19c2-4 5-7 9-9"/>
            </svg>
          </div>
        </div>

        <p class="text-[11px] font-medium uppercase tracking-[0.2em]
                  text-[#2BA84A] mb-2">
          What you saved
        </p>
        <h2 id="co2-popup-title"
            class="text-3xl font-light text-gray-800 leading-tight mb-3">
          <span data-amount class="font-medium text-[#2BA84A]">10 kg</span>
          of CO₂ is roughly…
        </h2>

        <div data-facts class="space-y-3 mt-6 mb-6"></div>

        <button data-close
                class="w-full py-3 px-4 rounded-xl font-medium text-sm
                       bg-[#2BA84A] text-gray-50
                       active:bg-[#2BA84A]
                       transition-colors">
          Got it
        </button>
      </div>
    `;

  document.body.appendChild(wrap);

  // --- delegated click handler for all close triggers ---
  wrap.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) hidePopup();
  });
}

// --- render the 3 facts, each fading in sequentially ---
function renderFacts(kg) {
  const container = document.querySelector("#co2-popup [data-facts]");
  if (!container) return;

  const facts = pickRandomFacts(3);

  container.innerHTML = facts
    .map(
      (f) => `
        <div data-fact
             class="flex items-center gap-3 p-3.5 rounded-2xl
                    bg-white ring-1 ring-gray-900/5
                    opacity-0 translate-y-3
                    transition-all duration-700 ease-out">
          <div class="shrink-0 w-11 h-11 rounded-xl bg-gray-100
                      flex items-center justify-center text-2xl">
            ${f.emoji}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-[10px] font-medium uppercase tracking-[0.15em]
                        text-gray-500 mb-0.5">
              ${f.label}
            </div>
            <div class="text-lg font-medium text-gray-800 leading-tight">
              ${f.format(kg * f.perKg)}
            </div>
            <div class="text-[13px] text-gray-500 mt-0.5">
              ${f.detail}
            </div>
          </div>
        </div>
      `,
    )
    .join("");

  // --- sequentially reveal each fact ---
  const items = container.querySelectorAll("[data-fact]");
  items.forEach((el, i) => {
    setTimeout(
      () => {
        el.classList.remove("opacity-0", "translate-y-3");
      },
      250 + i * 450,
    );
  });
}

// --- show popup with a given kg amount ---
function showPopup(kg) {
  if (typeof kg !== "number" || kg < 0) {
    console.warn("showCO2Popup: expected a positive number, got", kg);
    return;
  }

  buildPopup();
  const popup = document.getElementById("co2-popup");
  popup.querySelector("[data-amount]").textContent = formatAmount(kg);

  popup.classList.remove("hidden");
  popup.classList.add("flex");
  document.body.style.overflow = "hidden";

  // --- trigger entry animation on next frame ---
  requestAnimationFrame(() => {
    popup.querySelector("[data-backdrop]").classList.remove("opacity-0");
    const modal = popup.querySelector("[data-modal]");
    modal.classList.remove(
      "opacity-0",
      "translate-y-6",
      "sm:translate-y-4",
      "sm:scale-95",
    );
  });

  renderFacts(kg);
}

// --- hide popup with a brief exit animation ---
function hidePopup() {
  const popup = document.getElementById("co2-popup");
  if (!popup || popup.classList.contains("hidden")) return;

  popup.querySelector("[data-backdrop]").classList.add("opacity-0");
  const modal = popup.querySelector("[data-modal]");
  modal.classList.add(
    "opacity-0",
    "translate-y-6",
    "sm:translate-y-4",
    "sm:scale-95",
  );

  setTimeout(() => {
    popup.classList.add("hidden");
    popup.classList.remove("flex");
    document.body.style.overflow = "";
  }, 300);
}

export { showPopup as showCO2Popup, hidePopup as hideCO2Popup };
