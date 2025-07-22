// Country → City Dictionary
const countries_dic = {
    Mexico: ["Oaxaca", "Guerrero", "Chiapas"],
    Colombia: ["Eje cafetero", "Armenia", "Salento"],
    Uganda: ["Kampala", "Mbale", "Fort Portal"]
  };
  
const urlParams = new URLSearchParams(window.location.search);
const unique_code = urlParams.get("unique_code");
const actor_id = urlParams.get("actor_id");

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
// Get dropdown elements
const countrySelect = document.getElementById("country");
const regionSelect = document.getElementById("region");
  
// Populate the country dropdown on page load
if (countrySelect) {
  countrySelect.innerHTML = '<option value="">-- Select Country --</option>';
  Object.keys(countries_dic).forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });
}
  
  // Update region dropdown when country changes
if (countrySelect && regionSelect) {
    countrySelect.addEventListener("change", function () {
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
  

  // Handle signup form
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const name = document.getElementById("actor_name").value;
      const country = document.getElementById("country").value;
      const region = document.getElementById("region").value;
      const gps = document.getElementById("gps").value;
  
      if (!name || !country || !region || !gps ) {
        alert("Please fill out all fields and share your location.");
        return;
      }
      
      /*
      Hello :)
      const params = new URLSearchParams({
        name: name,
        country: country,
        city: city,
        gps: gps
      });

      fetch(`${baseUrl}?${params.toString()}`, {
        method: "GET",
        redirect: "follow",
        mode: "no-cors"
      })
      */
      // this is a message in the code
      // here I am getting the submit button
      // submitBtn.style.pointerEvents = "none"; 
      console.log("Registering...")
      // alert(submitBtn)
      const submitBtn = document.getElementById("submitBtn");
      submitBtn.value = "Registering...";
      submitBtn.disabled = true;
      let { publicKey, privateKey } = await generateKeyPair();
      console.log("Public key and private key created");
      let jwk = await crypto.subtle.exportKey("jwk", publicKey);
      console.log(jwk);
      // we store the private key
      encryptAndStorePrivateKey({privateKey, actor_id, name}, "9732");
      // send_to_api("submit", o);

      fetch("https://classy-peony-a6f6e7.netlify.app/.netlify/functions/submit", {
        // console.log("Sending");
      // fetch("http://localhost:8888/.netlify/functions/submit", {
        // redirect: "follow",
        method: "POST",
        body: JSON.stringify({
          id: actor_id, 
          name, 
          country, 
          region, 
          gps_location: gps,   
          kty: jwk.kty,
          crv: jwk.crv,
          x: jwk.x,
          y: jwk.y,
          ext: jwk.ext
        }),
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
          // "Content-Type": "application/json"
        }
      })
      .then((res) => res.json())
      .then((res) => {
        console.log("Fetch!!");
        console.log(res);
        if (res.status === "success") {
          alert("Signup for "+name+" saved to Google Sheets! ");
          // document.getElementById("signupForm").reset();
        } else {
          console.error(res);
          // alert("Failed to save. Try again.");
        }
      })
      .catch((err) => {
        console.error( err);
        //alert("Error submitting form.");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.value = "Register";
      });
/*      
      .then((res) => res.text())
      .then((resText) => {
        if (resText === "Success") {
          alert("Signup saved to Google Sheets!");
          document.getElementById("signupForm").reset();
        } else {
          console.log(resText);
        }
      })
      */
      /*
      fetch("https://script.google.com/macros/s/AKfycbzSaGogLo5Awiparb3Npga3ADWSUd3N61xsSTSDjs-w1jhJjEJh2WqzGjNvGoZDUZ9A/exec", {
        redirect: "follow",
        method: "POST",
        body: JSON.stringify({name, country, city, gps}),
        headers: {
          // "Content-Type": "text/plain;charset=utf-8",
          "Content-Type": "application/json"
        }
      })
      // .then((res) => res.text())
      // .then((resText) => {
      //   if (resText === "Success") {
      //     alert("Signup saved to Google Sheets!");
      //     document.getElementById("signupForm").reset();
      //   } else {
      //     console.log(resText);
      //   }
      // })
      
        .then((res) => res.json())
        .then((res) => {
          console.log("Fetch!!");
          if (res.status === "success") {
            alert("Signup saved to Google Sheets!");
            document.getElementById("signupForm").reset();
          } else {
            console.error(res);
            // alert("Failed to save. Try again.");
          }
        })
        
        .catch((err) => {
          console.log( err);
          //alert("Error submitting form.");
        });
*/
      // alert(`Name: ${name}\nCountry: ${country}\nCity: ${city}\nGPS: ${gps}`);
    });
  }
  
  