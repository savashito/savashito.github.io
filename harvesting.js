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


document.getElementById('harvestForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const harvestType = document.getElementById('harvest-type').value;
    const harvestDate = document.getElementById('harvest-date').value;
    const action_weight = document.getElementById('weight').value;
    const action_moisture = document.getElementById('moisture').value;
    const gps_location = document.getElementById('gps').value;
    if(!key){
      alert('Please sign up first.');
    }
    if (!harvestType || !harvestDate) {
      alert('Please fill out all fields.');
      return;
    }
  const urlParams = new URLSearchParams(window.location.search);
  const nfc_id = urlParams.get("nfc_id");
  const action_type = 'Harvesting';
  const farm_id = '1';
  // const icn_number = 'jojo';
  const action_variety_process = harvestType;
  const action_date = harvestDate;
    
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

const farms_dic = {
  "Mbale West": ["Oaxaca", "Guerrero", "Chiapas"],
  "Mbale West2": ["Eje cafetero", "Armenia", "Salento"],
  "Mbale South": ["Kampala", "Mbale", "Fort Portal"]
};




// Get dropdown elements
const farmSelect = document.getElementById("farm");
console.log(farmSelect)
// Populate the country dropdown on page load
if (farmSelect) {
  farmSelect.innerHTML = '<option value="">-- Select Farm --</option>';
  Object.keys(farms_dic).forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    farmSelect.appendChild(option);
  });
}
  


