// const API = "http://localhost:3000";
const API = import.meta.env.VITE_API_URL


//stat config per role
const STAT_CONFIGS = {
  user: [
    {
      label: "All time saved",
      key: "totalSaved",
      format: (v) => `$${(v || 0).toFixed(2)}`,
    },
    { label: "Deals claimed", key: "dealsClaimed", format: (v) => v ?? 0 },
    { label: "Pending deals", key: "pendingDeals", format: (v) => v ?? 0 },
    {
      label: "Total waste prevented",
      key: "wastePrevented",
      format: (v) => `${(v || 0).toFixed(2)}kg CO₂` ?? 0,
    },
    {
      label: "Join date",
      key: "_id",
      format: (v) => formatDate(dateFromId(v)),
    },
    ,
    { label: "ID", key: "_id", format: (v) => v, mono: true },
  ],
  business: [
    { label: "Deals posted", key: "dealsPosted", format: (v) => v ?? 0 },
    { label: "Active listings", key: "activeListings", format: (v) => v ?? 0 },
    { label: "Total claimed", key: "totalClaimed", format: (v) => v ?? 0 },
    { label: "Waste prevented", key: "wastePrevented", format: (v) => v ?? 0 },
    {
      label: "Join date",
      key: "_id",
      format: (v) => formatDate(dateFromId(v)),
    },
    ,
    {
      label: "ID",
      key: "_id",
      format: (v) => `${v || 0}`,
      mono: true,
    },
  ],
};

const ROLE_BADGE = {
  user: { label: "user", cls: "bg-green-100 text-green-800 max-w-18" },
  business: { label: "Business", cls: "bg-red-100 text-red-800 max-w-18" },
};

function formatDate(iso) {
  return new Date(iso)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, " ");
}

function dateFromId(id) {
  const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
  return new Date(timestamp);
}

function renderStats(user) {
  const role = user.role === "business" ? "business" : "user";
  const configs = STAT_CONFIGS[role];
  const container = document.getElementById("stats-container");

  container.innerHTML = "";
  configs.forEach(({ label, key, format, mono }) => {
    const row = document.createElement("div");
    row.className = "flex items-center justify-between py-4";
    row.innerHTML = `
        <span class="text-base text-gray-700">${label}</span>
        <span class="${mono ? "text-sm text-gray-400 font-mono" : "text-base font-semibold text-gray-900"}">${format(user[key])}</span>
        `;
    container.appendChild(row);
  });
}

async function loadProfile() {
  try {
    const res = await fetch(`${API}/auth/me`, {
      credentials: "include", // sends session cookie so server knows who you are
    });
    if (!res.ok) {
      window.location.href = "/";
      return;
    }
    const { user } = await res.json();

    const toggle = document.getElementById("tutorial-toggle");
    toggle.checked = !!user.tutorial_toggle;

    document.getElementById("profile-name").textContent =
      `${user.fName || ""} ${user.lName || ""}`.trim() || "User";

    const role = user.role === "business" ? "business" : "user";
    const profileBadge = document.getElementById("role-badge");
    profileBadge.textContent = ROLE_BADGE[role].label;
    profileBadge.className = `text-xs font-medium px-3 py-1 rounded-full mb-8 ${ROLE_BADGE[role].cls}`;

    renderStats(user);
  } catch (err) {
    console.error("Failed to load Profile.");
  }
}

async function onTutorialToggle(enabled) {
  await fetch(`${API}/auth/user`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tutorial_toggle: enabled }),
  });
}

async function signOut() {
  await fetch(`${API}/auth/logout`, { method: "POST" });
  window.location.href = "/login-page.html";
}

window.onTutorialToggle = onTutorialToggle;
window.signOut = signOut;

loadProfile();
