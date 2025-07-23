// Country → City Dictionary
const action_dic = {
  'Harvesting':'harvesting.html',
  'Drying':'drying.html',
  'Processing':'processing.html',
  'Dry Mill':'',
  'Export Preparation':''
  };
  
const urlParams = new URLSearchParams(window.location.search);
const nfc_id = urlParams.get("nfc_id");

/*
function isIdNotValid(id){
  // TODO Need to query the data base to check if the id is valid
  return id.length!=36; 
}

if(isIdNotValid(id)){
  alert("Your id is not valid");
  // TODO should add contact information to get in touch with Chiara
  // Could redirect to contact page
}
*/

let actor_id=''
let actor_name=''
let key=''

loadAndDecryptPrivateKey("9732")
.then((decrypted_data) => {
  actor_id= decrypted_data.actor_id
  key = decrypted_data.key
  actor_name = decrypted_data.name
  console.log(actor_id);
  const welcomeName = document.getElementById("welcome-name");
  welcomeName.innerHTML = `Welcome ${actor_id}`
  // welcomeName.innerHTML = `Welcome ${actor_name}`
    // {key, actor_id, name}
  });

// Get dropdown elements

const actionSelect = document.getElementById("action");
  
// Populate the country dropdown on page load
if (actionSelect) {
  actionSelect.innerHTML = '<option value="">-- Select an Action --</option>';
  
  Object.keys(action_dic).forEach((action) => {
    const option = document.createElement("option");
    option.value = action;
    option.textContent = action;
    actionSelect.appendChild(option);
  });
}
  
  // Update region dropdown when country changes
/*
if (actionSelect) {
    actionSelect.addEventListener("change", function () {
      const selectedCountry = this.value;
      const cities = countries_dic[selectedCountry] || [];
  
      // Reset region dropdown
      regionSelect.innerHTML = '<option value="">-- Select region --</option>';
      cities.forEach((region) => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
      });
    });
}
*/
  


  
  // Handle signup form
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const action = actionSelect.value;
      // harvesting.html
      if (!action) {
        alert("Please select a valid action");
        return;
      }
      window.location.href = action_dic[action] +"?nfc_id="+nfc_id
     
    });
  }
  
  