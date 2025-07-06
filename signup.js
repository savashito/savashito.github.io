// Country → City Dictionary
const countries_dic = {
    Mexico: ["Oaxaca", "Guerrero", "Chiapas"],
    Colombia: ["Eje cafetero", "Armenia", "Salento"],
    Uganda: ["Kampala", "Mbale", "Fort Portal"]
  };
  
  // Get dropdown elements
  const countrySelect = document.getElementById("country");
  const citySelect = document.getElementById("city");
  
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
  
  // Update city dropdown when country changes
  if (countrySelect && citySelect) {
    countrySelect.addEventListener("change", function () {
      const selectedCountry = this.value;
      const cities = countries_dic[selectedCountry] || [];
  
      // Reset city dropdown
      citySelect.innerHTML = '<option value="">-- Select City --</option>';
      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
    });
  }
  

// GPS location function
function getLocation() {
    const gpsInput = document.getElementById("gps");
  
    if (!navigator.geolocation) {
      gpsInput.value = "Geolocation not supported";
      return;
    }
  
    gpsInput.value = "Locating...";
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        gpsInput.value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      },
      () => {
        gpsInput.value = "Unable to retrieve location";
      }
    );
  }
  
  // Handle signup form
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const name = document.getElementById("farm_name").value;
      const country = document.getElementById("country").value;
      const city = document.getElementById("city").value;
      const gps = document.getElementById("gps").value;
  
      if (!name || !country || !city || !gps) {
        alert("Please fill out all fields and share your location.");
        return;
      }

      const baseUrl = "https://script.google.com/macros/s/AKfycbzSaGogLo5Awiparb3Npga3ADWSUd3N61xsSTSDjs-w1jhJjEJh2WqzGjNvGoZDUZ9A/exec";

      const params = new URLSearchParams({
        name: name,
        country: country,
        city: city,
        gps: gps
      });

/*
      fetch(`${baseUrl}?${params.toString()}`, {
        method: "GET",
        redirect: "follow",
        mode: "no-cors"
      })*/
      const submitBtn = document.getElementById("submitBtn");
      console.log("Registrando...")
      submitBtn.disabled = true;
      submitBtn.value = "Registering...";
      fetch("https://classy-peony-a6f6e7.netlify.app/.netlify/functions/submit", {
      // fetch("http://localhost:8888/.netlify/functions/submit", {
        // redirect: "follow",
        method: "POST",
        body: JSON.stringify({name, country, city, gps}),
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
  
  