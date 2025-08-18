let actor_id=''
let actor_name=''
let key=''

loadAndDecryptPrivateKey("9732")
.then((decrypted_data) => {
  actor_id= decrypted_data.actor_id
  key = decrypted_data.key
  actor_name = decrypted_data.name
  console.log(actor_id);
    // {key, actor_id, name}
  });
/*
if(!key){
  alert('Please sign up first.');
}*/

async function signAndSend(endpoint, payload) {
  const signature = await signMessage(key, JSON.stringify(payload));
  payload.signature_base64 = arrayBufferToBase64(signature);
  await send_to_api_async(endpoint, payload);
}
document.getElementById('harvestForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Eingaben abrufen
  const harvestType = document.getElementById('harvest-type').value;
  const harvestStartDate = document.getElementById('harvest-start-date').value;
  const harvestEndDate = document.getElementById('harvest-end-date').value;
  const totalWeight = document.getElementById('weight').value;
  const dryingMoisture = document.getElementById('moisture').value;
  const processingMethod = document.getElementById('processing-method').value;
  const gps_location = document.getElementById('gps').value;
  const farm_id = document.getElementById("farm").value;

  if (!key) {
    alert("Please sign up first.");
    return;
  }

  if (!harvestType || !harvestStartDate || !harvestEndDate || !totalWeight || !gps_location || !farm_id) {
    alert("Please fill out all required fields.");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const nfc_id = urlParams.get("nfc_id");

  const durationDays = Math.max(0, Math.ceil((new Date(harvestEndDate) - new Date(harvestStartDate)) / (1000 * 60 * 60 * 24)));

  const base = { nfc_id, actor_id, farm_id, gps_location };

  // HARVESTING-Eintrag (immer)
  const harvestingEntry = {
    ...base,
    action_type: 'Harvesting',
    action_date: harvestEndDate,
    action_duration: durationDays,
    action_variety_process: harvestType,
    action_weight: Number(totalWeight)
  };

  // PROCESSING-Eintrag (optional)
  const processingEntry = processingMethod ? {
    ...base,
    action_type: 'Processing',
    action_date: harvestEndDate,
    action_variety_process: processingMethod
  } : null;

  // DRYING-Eintrag (optional)
  const dryingEntry = dryingMoisture ? {
    ...base,
    action_type: 'Drying',
    action_date: harvestEndDate,
    action_moisture: Number(dryingMoisture)
  } : null;

  try {
    await signAndSend("submit_dp_harvesting_entry", harvestingEntry);
    if (processingEntry) await signAndSend("submit_dp_harvesting_entry", processingEntry);
    if (dryingEntry) await signAndSend("submit_dp_harvesting_entry", dryingEntry);

    alert("Entries submitted successfully!");
  } catch (err) {
    console.error(err);
    alert("Error submitting form.");
  }
});

  /*
  let o = {
    nfc_id,
    actor_id,
    action_type,
    farm_id: farm_id,
    // icn_number,
    action_variety_process,
    action_date,
    action_weight,
    action_moisture,
    gps_location
  };
  signMessage(key, JSON.stringify(o))
  .then((signature) => {
    console.log(signature);
    o.signature_base64 = arrayBufferToBase64(signature);
    send_to_api("submit_dp_harvesting_entry", o);
  });

  // send_to_api("submit_dp_harvesting_entry", o);

    // alert(` ${actor_id} Harvest Type: ${harvestType} \nEnd Date: ${harvestDate}`);
*/