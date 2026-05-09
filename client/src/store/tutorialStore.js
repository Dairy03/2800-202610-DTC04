import { createStore } from "zustand/vanilla";

export const tutorialStore = createStore((set, get) => ({
  active: false,
  currentStep: 0,
  steps: [],

  start() {
    function findTarget(element) {
      if (!element.dataset.tutorialChild) return element;

      const indices = element.dataset.tutorialChild.split(",");
      let current = element;

      for (const i of indices) {
        const child = current.children[parseInt(i, 10)];
        if (!child) break;
        current = child;
      }
      return current;
    }

    const steps = Array.from(document.querySelectorAll("[data-tutorial-step]"))
      .map((element) => ({
        order: parseInt(element.dataset.tutorialStep, 10),
        element: findTarget(element),
        title: element.dataset.tutorialTitle || "",
        tip: element.dataset.tutorialTip || "",
      }))
      .sort((a, b) => a.order - b.order);
    set({ active: true, currentStep: 0, steps });
    get().render();
  },

  next() {
    const { currentStep, steps } = get();
    if (currentStep >= steps.length - 1) return get().finish();
    set({ currentStep: currentStep + 1 });
    get().render();
  },

  prev() {
    const { currentStep } = get();
    if (currentStep <= 0) return;
    set({ currentStep: currentStep - 1 });
    get().render();
  },

  finish() {
    set({ active: false, currentStep: 0 });
    get().cleanup();
  },

  cleanup() {
    document.getElementById("tutorial-overlay")?.remove();
    document.getElementById("tutorial-highlight")?.remove();
    document.getElementById("tutorial-tooltip")?.remove();
  },

  render() {
    const { steps, currentStep } = get();
    get().cleanup();
    const step = steps[currentStep];
    if (!step) return;

    const rect = step.element.getBoundingClientRect();

    const overlay = document.createElement("div");
    overlay.id = "tutorial-overlay";
    overlay.className = "fixed inset-0 bg-black/50 z-[9998]";
    overlay.addEventListener("click", () => get().finish());
    document.body.appendChild(overlay);

    const clone = step.element.cloneNode(true);
    clone.id = "tutorial-highlight";
    clone.removeAttribute("data-tutorial-step");
    clone.className =
      step.element.className +
      " !fixed !z-[9999] scale-105 transition-transform duration-200";
    clone.style.top = rect.top + "px";
    clone.style.left = rect.left + "px";
    clone.style.width = rect.width + "px";
    clone.style.margin = "0";
    document.body.appendChild(clone);

    const ttHeight = 150;
    const ttWidth = 320;
    const isLast = currentStep === steps.length - 1;
    const isFirst = currentStep === 0;
    const tooltip = document.createElement("div");
    tooltip.id = "tutorial-tooltip";
    tooltip.className = `fixed z-[10000] bg-slate-800 text-slate-100 rounded-lg p-4 max-w-[${ttWidth}px] max-h-[${ttHeight}] text-sm shadow-xl`;
    tooltip.innerHTML = `
          <p class="font-bold mb-1">${step.title}</p>
          <p class="opacity-80 mb-3">${step.tip}</p>
          <div class="flex justify-between items-center">
            <span class="opacity-50 text-xs">${currentStep + 1} / ${steps.length}</span>
            <div class="flex gap-2">
              ${!isFirst ? '<button data-action="prev" class="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-xs font-semibold cursor-pointer">Back</button>' : ""}
              <button data-action="${isLast ? "finish" : "next"}" class="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-xs font-semibold cursor-pointer">
                ${isLast ? "Done" : "Next"}
              </button>
            </div>
          </div>
        `;

    tooltip.querySelectorAll("[data-action]").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        if (action === "next") get().next();
        else if (action === "prev") get().prev();
        else get().finish();
      }),
    );

    const gap = 12;
    if (rect.left > window.innerWidth / 2) {
      tooltip.style.right = "12px";
    } else {
      tooltip.style.left = "12px";
    }
    if (rect.bottom + gap + ttHeight < window.innerHeight) {
      tooltip.style.top = `${rect.bottom + gap}px`;
    } else {
      tooltip.style.top = `${rect.top - gap - ttHeight}px`;
    }
    document.body.appendChild(tooltip);
  },
}));
