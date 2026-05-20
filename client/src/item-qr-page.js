const deal = {
  "item-name":         "SunHarvest Classic Granola Bar",
  "item-location":     "FreshMart — 1234 Oak Street, Burnaby BC",
  "item-price-after":  "1.50",
  "qr-token":          "https://yourapp.com/redeem/TKN-7X92",
  "redeem-by":         "2026-05-19T23:59:00",
  "store-coordinates": "1234 Oak Street Burnaby BC",
  "item-distance":     "0.4 km",
  "item-price-before": "$2.99",
  "item-discount":     "50%",
  "item-expiration":   "2026-05-19T23:59:00",
  "item-money-saved":  "$1.50",
};

const isExpired = new Date(deal["redeem-by"]) < new Date();

let status = "success";

function renderQRPage() {

  if (status === "loading") {
    show("qr-loading");
    hide("qr-error");
    hide("qr-code-image");
    hide("expired-overlay");
    hide("share-deal-btn");
    hide("get-directions-btn");
    return;
  }

  if (status === "error") {
    hide("qr-loading");
    show("qr-error");
    hide("qr-code-image");
    hide("expired-overlay");
    hide("share-deal-btn");
    hide("get-directions-btn");
    setText("item-name", deal["item-name"]);
    return;
  }

  if (isExpired) {
    hide("qr-loading");
    hide("qr-error");
    show("qr-code-image");
    getEl("qr-code-image").style.opacity = "0.3";
    show("expired-overlay");
    hide("share-deal-btn");
    hide("get-directions-btn");
    setText("item-name",        deal["item-name"]);
    setText("item-location",    deal["item-location"]);
    setText("item-price-after", deal["item-price-after"]);
    generateQR(deal["qr-token"]);
    return;
  }

  hide("qr-loading");
  hide("qr-error");
  hide("expired-overlay");
  show("qr-code-image");
  show("share-deal-btn");
  show("get-directions-btn");

  setText("item-name",        deal["item-name"]);
  setText("item-location",    deal["item-location"]);
  setText("item-price-after", deal["item-price-after"]);

  generateQR(deal["qr-token"]);

  getEl("share-deal-btn").onclick = (e) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({ title: deal["item-name"], url: deal["qr-token"] });
    } else {
      navigator.clipboard.writeText(deal["qr-token"]);
      getEl("share-deal-btn").textContent = "Link copied!";
      setTimeout(() => { getEl("share-deal-btn").textContent = "Share Deal"; }, 2000);
    }
  };

  getEl("get-directions-btn").onclick = (e) => {
    e.preventDefault();
    const addr = encodeURIComponent(deal["store-coordinates"]);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
  };
}

function getEl(id)        { return document.getElementById(id); }
function show(id)         { const el = getEl(id); if (el) el.style.display = ""; }
function hide(id)         { const el = getEl(id); if (el) el.style.display = "none"; }
function setText(id, val) { const el = getEl(id); if (el) el.textContent = val; }

function generateQR(token) {
  const container = getEl("qr-code-image");
  if (!container || container.hasChildNodes()) return;
  new QRCode(container, {
    text:         token,
    width:        200,
    height:       200,
    colorDark:    "#111111",
    colorLight:   "#ffffff",
    correctLevel: QRCode.CorrectLevel.M,
  });
}

renderQRPage();