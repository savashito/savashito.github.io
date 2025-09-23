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


document.getElementById('export_preparationForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const packagingType = document.getElementById('packaging-type').value;
  const ExportDate    = document.getElementById('export-date').value;
  const exportPort    = document.getElementById('export-port').value;
  const action_moisture = document.getElementById('moisture').value; // optional
  const gps_location  = document.getElementById('gps').value;
  const ico_number    = document.getElementById('ico-number').value;

  // **NEU**: farm_id sauber lesen (oder null, wenn kein Select da ist)
  const farmEl  = document.getElementById('farm');
  const farm_id = farmEl ? farmEl.value : null;

  if (!key) {
    alert('Please sign up first.');
    return; // **NEU**: abbrechen!
  }
  if (!packagingType || !ExportDate) {
    alert('Please fill out all fields.');
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const nfc_id = urlParams.get("nfc_id");
  const action_type = 'Export Preparation';

  // Freitext wie bisher
  const action_variety_process = exportPort
      ? `${packagingType} | Exporthafen: ${exportPort}`
      : packagingType;

  // **NEU**: Moisture optional → als Zahl oder null
  const moistureValue = action_moisture === '' ? null : Number(action_moisture);

  // **NEU**: o erst JETZT definieren…
  let o = {
    nfc_id,
    actor_id,
    action_type,
    farm_id, // darf null sein
    action_variety_process,
    action_date: ExportDate,
    action_moisture: moistureValue,
    gps_location: gps_location || null
  };

  // …und JETZT optionales Feld anhängen
  if (ico_number) {
    o.ico_number = ico_number;
  }

  // (optional) kurz loggen, was gesendet wird
  console.log('Export payload:', o);

  signMessage(key, JSON.stringify(o))
    .then((signature) => {
      o.signature_base64 = arrayBufferToBase64(signature);
      // benutze dieselbe Funktion/den selben Endpoint wie bisher
      send_to_api("submit_dp_harvesting_entry", o);
      // oder, falls du auf async/json umgestellt hast:
      // send_to_api_async("submit_dp_harvesting_entry", o);
    })
    .catch(err => {
      console.error('Sign failed:', err);
      alert('Signing failed.');
    });
});



