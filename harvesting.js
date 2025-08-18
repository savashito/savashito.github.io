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
document.getElementById('harvestForm').addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const harvestType = document.getElementById('harvest-type').value;
    const harvestStartDate = document.getElementById('harvest-start-date').value;
     const harvestEndDate = document.getElementById('harvest-end-date').value;
    const action_weight = document.getElementById('weight').value;
    const action_moisture = document.getElementById('moisture').value; // optional
    const processingMethod = document.getElementById('processing-method').value; // optional
    const gps_location = document.getElementById('gps').value;
    const farm_id = document.getElementById("farm").value;
    console.log("farm_id ", farm_id)
    if(!key){
      alert('Please sign up first.');
    }
    if (!harvestType || !harvestStartDate|| !harvestEndDate || !action_weight || !gps_location || !farm_id) {
      alert('Please fill out all fields.');
      return;
    }
  const urlParams = new URLSearchParams(window.location.search);
  const nfc_id = urlParams.get("nfc_id");

  // duration in days (Harvesting)
  const durationDays = Math.max(0, Math.ceil((new Date(harvestEndDate) - new Date(harvestStartDate)) / (1000*60*60*24))); 
  
  const base = { nfc_id, actor_id}; 

  // 1) HARVESTING-Entry (immer)
  let harvestingEntry = {
    ...base,
    action_type: 'Harvesting',
    farm_id,          // Variety
    action_variety_process: harvestType,
    action_date: harvestEndDate,        
    action_weight: Number(action_weight),      // total cherries (kg)
    action_moisture: Number(action_moisture),
    gps_location,             // wir nehmen das Enddatum als "Hauptdatum"
    action_duration: durationDays,           // Dauer der Ernte
    // keine drying moisture hier
  };

  // 2) PROCESSING-Entry (optional)
  const processingEntry = processingMethod ? {
    ...base,
    action_type: 'Processing',
    farm_id,          // Variety
    action_variety_process: processingMethod,
    action_date: null,        
    action_weight: Number(action_weight),      // total cherries (kg)
    action_moisture: Number(action_moisture),
    gps_location,             // wir nehmen das Enddatum als "Hauptdatum"
    action_duration: durationDays,           // Dauer der Ernte
  } : null;


  // 3) DRYING-Entry (optional)
  const dryingEntry = action_moisture ? {
    ...base,
    action_type: 'Drying',
    farm_id,          // Variety
    action_variety_process: harvestType,
    action_date: harvestEndDate,        
    action_weight: Number(action_weight),      // total cherries (kg)
    action_moisture: Number(action_moisture),
    gps_location,             // wir nehmen das Enddatum als "Hauptdatum"
    action_duration: null, 
  } : null;

  console.log(harvestingEntry);
  console.log(processingEntry);
  console.log(dryingEntry);
/*
  let s = JSON.stringify(harvestingEntry)
  console.log(s)
  signMessage(key, s)
  .then((signature) => {
    console.log(signature);
    harvestingEntry.signature_base64 = arrayBufferToBase64(signature);
    console.log(harvestingEntry)
    send_to_api("submit_dp_harvesting_entry", harvestingEntry);
  })
  */



  
  try {
    // nacheinander signieren + senden
    await signAndSend("submit_dp_harvesting_entry", harvestingEntry);

    if (processingEntry) {
      await signAndSend("submit_dp_harvesting_entry", processingEntry);
    }
    if (dryingEntry) {
      await signAndSend("submit_dp_harvesting_entry", dryingEntry);
    }
    alert("Entries submitted successfully!");
  } catch(e){
    console.log(e);
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
  })

  // send_to_api("submit_dp_harvesting_entry", o);

    // alert(` ${actor_id} Harvest Type: ${harvestType} \nEnd Date: ${harvestDate}`)*/