"use strict";

/* ====== Keys laden (wie bei dir) ====== */
let actor_id = '';
let actor_name = '';
let key = '';

loadAndDecryptPrivateKey("9732").then((d) => {
  actor_id   = d.actor_id;
  key        = d.key;
  actor_name = d.name;
  console.log("actor_id:", actor_id);
}).catch(err => {
  console.error("Failed to load private key:", err);
});

/* ====== Helfer ====== */
async function signAndSend(endpoint, payload) {
  const signature = await signMessage(key, JSON.stringify(payload));
  payload.signature_base64 = arrayBufferToBase64(signature);
  await send_to_api_async(endpoint, payload);
}

function valueWithOther(selectId, otherInputId) {
  const sel = document.getElementById(selectId);
  const other = document.getElementById(otherInputId);
  if (!sel) return null;
  const v = sel.value;
  if (v === "__other__") {
    const t = (other?.value || "").trim();
    return t || null; // required-Handling separat
  }
  return v || null;
}

function setupOtherToggle(selectId, otherInputId, otherIsRequiredWhenChosen) {
  const sel = document.getElementById(selectId);
  const other = document.getElementById(otherInputId);
  if (!sel || !other) return;

  const update = () => {
    const isOther = sel.value === "__other__";
    other.classList.toggle("hidden", !isOther);
    other.required = !!(otherIsRequiredWhenChosen && isOther);
    if (!isOther) other.value = "";
  };
  sel.addEventListener("change", update);
  update();
}

/* Datum-Logik: Ende >= Start, Min/Max setzen */
function wireDateConstraints() {
  const startEl = document.getElementById("harvest-start-date");
  const endEl   = document.getElementById("harvest-end-date");
  if (!startEl || !endEl) return;

  const sync = () => {
    if (startEl.value) endEl.min = startEl.value;
    if (endEl.value) startEl.max = endEl.value;
  };
  startEl.addEventListener("change", sync);
  endEl.addEventListener("change", sync);
  sync();
}

/* GPS Button */
window.getLocation = function getLocation() {
  const gpsInput = document.getElementById("gps");
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by this browser.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);
      gpsInput.value = `${lat},${lon}`;
    },
    (err) => {
      console.error(err);
      alert("Could not get GPS location.");
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};

/* ====== Init (nachdem DOM geladen ist) ====== */
document.addEventListener("DOMContentLoaded", () => {
  // „Other…“ Toggler aktivieren
  setupOtherToggle("harvest-method",   "harvest-method-other",   true);  // required wenn Other
  setupOtherToggle("processing-method","processing-method-other",false); // optional
  setupOtherToggle("drying-method",    "drying-method-other",    false); // optional

  wireDateConstraints();

  // Falls du Country/Farm dynamisch lädst, ruf hier deinen Loader auf
  // loadCountries(); loadFarms();  // <-- deine bestehenden Loader
});

/* ====== Submit: EIN Eintrag vom Typ 'harvesting_processing' ====== */
document.getElementById("harvestForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!key) {
    alert("Please sign up first.");
    return;
  }

  // Pflicht-/Optionalfelder lesen
  const country      = document.getElementById("country").value;
  const farmSelect   = document.getElementById("farm");
  const farm_id      = farmSelect.value;
  const farm_name    = farmSelect.options[farmSelect.selectedIndex]?.text || null;

  const harvest_method = valueWithOther("harvest-method", "harvest-method-other"); // required
  const variety        = (document.getElementById("variety").value || "").trim(); // freier Text (required im HTML)
  const startDate      = document.getElementById("harvest-start-date").value;
  const endDate        = document.getElementById("harvest-end-date").value;

  const weightStr      = document.getElementById("weight").value;
  const processing     = valueWithOther("processing-method", "processing-method-other"); // optional
  const drying         = valueWithOther("drying-method", "drying-method-other");         // optional
  const moistureStr    = document.getElementById("moisture").value;
  const gps_location   = document.getElementById("gps").value;

  // Validierungen
  if (!country || !farm_id || !harvest_method || !variety ||
      !startDate || !endDate || !weightStr || moistureStr === "" || !gps_location) {
    alert("Please fill out all required fields.");
    return;
  }
  const start = new Date(startDate);
  const end   = new Date(endDate);
  if (end < start) {
    alert("End date cannot be before start date.");
    return;
  }

  const action_weight   = Number(weightStr);
  const action_moisture = Number(moistureStr);
  if (Number.isNaN(action_weight) || action_weight < 0) {
    alert("Weight must be a non-negative number.");
    return;
  }
  if (Number.isNaN(action_moisture) || action_moisture < 0 || action_moisture > 100) {
    alert("Moisture must be a number between 0 and 100.");
    return;
  }

  // NFC aus URL
  const urlParams = new URLSearchParams(window.location.search);
  const nfc_id = urlParams.get("nfc_id");

  // Dauer in Tagen (schicke sie mit, falls du keinen DB-Trigger nutzt)
  const action_duration = Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

  const payload = {
    nfc_id,
    actor_id,
    action_type: "harvesting_processing",
    farm_id: Number(farm_id),

    snapshot_country: country,
    snapshot_farm_name: farm_name,

    harvest_method,
    action_start_date: startDate,
    action_date: endDate,         // Hauptdatum = Ende
    variety,
    action_weight,
    processing_method: processing || null,
    drying_method:     drying     || null,
    action_moisture,

    gps_location: gps_location || null,

    action_duration
  };

  try {
    await signAndSend("submit_dp_harvesting_entry", payload);
    alert("Entry submitted successfully!");
    // window.location.href = "/success.html";
  } catch (err) {
    console.error(err);
    alert("Failed to submit entry. See console for details.");
  }
});
