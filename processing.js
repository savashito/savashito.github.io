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


document.getElementById('processingForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const processingType = document.getElementById('processing-type').value;
    const processingDate = document.getElementById('processing-date').value;
    // const action_weight = document.getElementById('weight').value;
    const action_moisture = document.getElementById('moisture').value;
    const gps_location = document.getElementById('gps').value;
    if(!key){
      alert('Please sign up first.');
    }
    if (!processingType || !processingDate) {
      alert('Please fill out all fields.');
      return;
    }
  const urlParams = new URLSearchParams(window.location.search);
  const nfc_id = urlParams.get("nfc_id");
  const action_type = 'Processing';
  const farm_id = '1';
  // const icn_number = 'jojo';
  const action_variety_process = processingType;
  const action_date = processingDate;
    
  let o = {
    nfc_id,
    actor_id,
    action_type,
    farm_id: '1',
    // icn_number,
    action_variety_process,
    action_date,
    // action_weight,
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

    // alert(` ${actor_id} Harvest Type: ${harvestType} \nEnd Date: ${harvestDate}`);
});


