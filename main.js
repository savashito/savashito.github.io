document.getElementById('harvestForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const harvestType = document.getElementById('harvest-type').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
  
    if (!harvestType || !startDate || !endDate) {
      alert('Please fill out all fields.');
      return;
    }
  
    alert(`Harvest Type: ${harvestType}\nStart Date: ${startDate}\nEnd Date: ${endDate}`);
  });
  
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

    const name = document.getElementById("name").value;
    const country = document.getElementById("country").value;
    const city = document.getElementById("city").value;
    const gps = document.getElementById("gps").value;

    if (!name || !country || !city || !gps) {
      alert("Please fill out all fields and share your location.");
      return;
    }

    alert(`Name: ${name}\nCountry: ${country}\nCity: ${city}\nGPS: ${gps}`);
  });
}
