"use strict";

/* 1) Keys laden */
let actor_id = '', actor_name = '', key = '';
loadAndDecryptPrivateKey("9732").then(d => {
  actor_id = d.actor_id; key = d.key; actor_name = d.name;
});

/* 2) Helper für "Other..." bei Packaging */
function valueWithOther(selectId, otherInputId) {
  const sel = document.getElementById(selectId);
  const other = document.getElementById(otherInputId);
  if (!sel) return null;
  if (sel.value === "__other__") {
    const t = (other.value || "").trim();
    return t || null;
  }
  // hübscher: Label-Text statt value wie "jute"
  return sel.options[sel.selectedIndex]?.text || sel.value || null;
}
function setupOtherToggle(selectId, otherInputId, requiredWhenOther) {
  const sel = document.getElementById(selectId);
  const other = document.getElementById(otherInputId);
  if (!sel || !other) return;
  const update = () => {
    const show = sel.value === "__other__";
    other.classList.toggle("hidden", !show);
    other.required = !!(requiredWhenOther && show);
    if (!show) other.value = "";
  };
  sel.addEventListener("change", update);
  update();
}

/* 3) Beim Laden: Toggle aktivieren */
document.addEventListener("DOMContentLoaded", () => {
  setupOtherToggle("packaging-type", "packaging-type-other", true);
  // Optional zum Debuggen:
  console.log("Form vorhanden?", !!document.getElementById('export_preparationForm'));
});

/* ====== SUBMIT-HANDLER (HIER!) ====== */
document.getElementById('export_preparationForm').addEventListener('submit', function(e) {
  e.preventDefault();

  if (!key) { alert('Please sign up first.'); return; }

  const urlParams = new URLSearchParams(window.location.search);
  const nfc_id = urlParams.get("nfc_id");

  const packagingType = valueWithOther('packaging-type','packaging-type-other'); // required
  const exportDate    = document.getElementById('export-date').value;             // required
  const exportPort    = document.getElementById('export-port').value.trim();
  const moistureStr   = document.getElementById('moisture').value;                // optional
  const ico_number    = document.getElementById('ico-number').value.trim();
  const gps_location  = document.getElementById('gps').value.trim();

  // Falls du kein Farm-Select hast, bleibt das null
  const farmEl  = document.getElementById('farm');
  const farm_id = farmEl ? farmEl.value : null;

  if (!packagingType || !exportDate) {
    alert('Please choose a packaging type (or enter Other) and the export date.');
    return;
  }

  const action_moisture = moistureStr === '' ? null : Number(moistureStr);
  if (action_moisture !== null && (Number.isNaN(action_moisture) || action_moisture < 0 || action_moisture > 100)) {
    alert("Moisture must be between 0 and 100.");
    return;
  }

  const action_type = 'Export Preparation';


  const o = {
    nfc_id,
    actor_id,
    action_type,
    farm_id, // darf null sein

    harvest_method:null,
    variety:null,
    processing_method:null,
    drying_method:null,
    action_start_date:null,

    action_date: exportDate,
    action_weight:null,
    action_moisture,
    gps_location: gps_location || null,
    ico_number,
    packagingType,
    exportPort
  };
  // if (ico_number) o.ico_number = ico_number;

  // signieren + senden (nimm deine bestehende Funktion)
  signMessage(key, JSON.stringify(o))
    .then(sig => {
      o.signature_base64 = arrayBufferToBase64(sig);
      send_to_api("submit_dp_harvesting_entry", o);
      // oder: send_to_api_async("submit_dp_harvesting_entry", o);
    })
    .catch(err => {
      console.error('Signing failed:', err);
      alert('Signing failed.');
    });
});
