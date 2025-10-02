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


/* ====== Submit: 'import_roasting' ====== */
document.getElementById("importRoastingForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!key) {
    alert("Please sign up first.");
    return;
  }

  // Pflicht-/Optionalfelder lesen
  // const country      = document.getElementById("country").value;
  // const farmSelect   = document.getElementById("farm");
  // const farm_id      = farmSelect.value;
  // const farm_name    = farmSelect.options[farmSelect.selectedIndex]?.text || null;


 const coffee_id = document.getElementById("coffee").value; 
 const roast_date = document.getElementById("roast_date").value;
const roast_level = document.getElementById("roast_level").value;
const roast_temp = document.getElementById("roast_temp").value;
const roast_duration = document.getElementById("roast_duration").value;
const weightStr = document.getElementById("weight").value;
const ico_number = document.getElementById("ico_number").value;
  
  const gps_location   = document.getElementById("gps").value;

 if (!coffee_id || !roast_date || !roast_level || !roast_temp || !roast_duration || !weightStr) {
alert("Please fill out all required fields.");
return;
}

const action_weight   = Number(weightStr);
  if (Number.isNaN(action_weight) || action_weight < 0) {
    alert("Weight must be a non-negative number.");
    return;
  }


  // NFC aus URL
  const urlParams = new URLSearchParams(window.location.search);
  const nfc_id = urlParams.get("nfc_id");


  const payload = {
    nfc_id,
    actor_id,
    action_type: "import_roasting",
    farm_id: null,



    harvest_method:null,
    variety:null,
    processing_method:null,
    drying_method:null,

    action_start_date: null,
    action_date: roast_date,
    action_weight,
    action_moisture:null,
    gps_location: gps_location || null,
    ico_number: ico_number || null,

    action_duration: Number(roast_duration),
    coffee_id: coffee_id,
    roast_level,
    roast_temperature: Number(roast_temp),
  };
  console.log(payload)
  try {
    await signAndSend("submit_dp_harvesting_entry", payload);
    alert("Entry submitted successfully!");
    // window.location.href = "/success.html";
  } catch (err) {
    console.error(err);
    alert("Failed to submit entry. See console for details.");
  }
});
