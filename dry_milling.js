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


document.getElementById('dryingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const dryStartDate = document.getElementById('dry-start-date').value;
    const dryEndDate = document.getElementById('dry-end-date').value;
    const action_weight = document.getElementById('weight').value;
    const action_moisture = document.getElementById('moisture').value;
    const gps_location = document.getElementById('gps').value;
    if(!key){
      alert('Please sign up first.');
    }
    if (!dryStartDate || !dryEndDate || !action_weight || !action_moisture || !gps_location ) {
      alert('Please fill out all fields.');
      return;
    }
    // calculate the duration from both calendars
    const start = new Date(dryStartDate);
    const end = new Date(dryEndDate);
    // Calculate duration in days
    const durationMs = end - start;
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

    // Check for negative duration
    if (durationDays < 0) {
      alert("Error: End date is before start date!");
      return
    } else {
      console.log(`Drying duration: ${durationDays} day(s)`);
    }

  const urlParams = new URLSearchParams(window.location.search);
  const nfc_id = urlParams.get("nfc_id");
  const action_type = 'Drying';
  const farm_id = '1';
  // const ico_number = 'jojo';
  const action_variety_process = null;
  const action_date = dryStartDate;
  const action_duration = durationDays;
    
  let o = {
    nfc_id,
    actor_id,
    action_type,
    farm_id: '1',
    // icn_number,
    action_variety_process,
    action_date,
    action_weight,
    action_moisture,
    gps_location,
    action_duration
  };
  let s = JSON.stringify(o)
  console.log(s)
  signMessage(key, s)
  .then((signature) => {
    console.log(signature);
    o.signature_base64 = arrayBufferToBase64(signature);
    send_to_api("submit_dp_harvesting_entry", o);
  })

  // send_to_api("submit_dp_harvesting_entry", o);

    // alert(` ${actor_id} Harvest Type: ${harvestType} \nEnd Date: ${harvestDate}`);
});


