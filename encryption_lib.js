
async function generateKeyPair() {
	return await crypto.subtle.generateKey(
		{
		name: "ECDSA",
		namedCurve: "P-256",
		},
		true, // extractable (needed if you want to store/export it)
		["sign", "verify"]
	);
}

async function deriveAesKeyFromPassphrase(passphrase, salt) {
	const encoder = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey(
		"raw", encoder.encode(passphrase), { name: "PBKDF2" }, false, ["deriveKey"]
	);

	return await crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt,
			iterations: 100000,
			hash: "SHA-256",
		},
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		true,
		["encrypt", "decrypt"]
	);
}

async function encryptAndStorePrivateKey(object_to_store, passphrase) {
	let {privateKey, actor_id, name} = object_to_store
	const encoder = new TextEncoder();
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const iv = crypto.getRandomValues(new Uint8Array(12));

	const aesKey = await deriveAesKeyFromPassphrase(passphrase, salt); // creates the key for encrypting the privateKey

	const jwk = await crypto.subtle.exportKey("jwk", privateKey);		
	const plaintext = encoder.encode(JSON.stringify({jwk, actor_id, name}));	// Get the private key in plain text
	// console.log("Priv key: "+plaintext);
	// encripts the key
	const ciphertext = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv },
		aesKey,
		plaintext
	);

	const encrypted = {

		salt: Array.from(salt),
		iv: Array.from(iv),
		data: Array.from(new Uint8Array(ciphertext)),
	};
	// Saves the key in local browser storage encripted on entry: ecc-encrypted-key
	localStorage.setItem("ecc-encrypted-key", JSON.stringify(encrypted));
}

	///////
	/// Load private key
async function loadAndDecryptPrivateKey(passphrase) {
		const decoder = new TextDecoder();
		const stored = JSON.parse(localStorage.getItem("ecc-encrypted-key"));
		if (!stored) 
			throw new Error("No encrypted key found");
		// let {key, actor_id, name} = stored
		const salt = new Uint8Array(stored.salt);
		const iv = new Uint8Array(stored.iv);
		const data = new Uint8Array(stored.data);
	
		const aesKey = await deriveAesKeyFromPassphrase(passphrase, salt);
	
		const plaintext = await crypto.subtle.decrypt(
			{ name: "AES-GCM", iv },
			aesKey,
			data
		);
	
		const {jwk, actor_id, name} = JSON.parse(decoder.decode(plaintext));
	
		let key = await crypto.subtle.importKey(
			"jwk",
			jwk,
			{ name: "ECDSA", namedCurve: "P-256" },
			true,
			["sign"]
		);
		return {key, actor_id, name};
	}

async function signMessage(privateKey, message) {
	const enc = new TextEncoder();
	const data = enc.encode(message);
	return await crypto.subtle.sign(
		{
		name: "ECDSA",
		hash: { name: "SHA-256" },
		},
		privateKey,
		data
	);
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
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
  

  async function send_to_api_async(api_endpoint, o) {
	const submitBtn = document.getElementById("submitBtn");
	submitBtn.value = "Submitting...";
	submitBtn.disabled = true;
  
	try {
	  const response = await fetch("https://classy-peony-a6f6e7.netlify.app/.netlify/functions/" + api_endpoint, {
		method: "POST",
		body: JSON.stringify(o),
		headers: {
		  "Content-Type": "text/plain;charset=utf-8",
		}
	  });
  
	  const res = await response.json();
  
	  console.log("Fetch!!");
	  console.log(res);
  
	  if (res.status === "success") {
		alert('Your entry was successfully saved ');
	  } else {
		return res;
		// console.error(res);
		// alert(JSON.stringify(res));
	  }
	  return res;
	} catch (err) {
	//   console.error(err);
	//   alert("Error submitting form.");
	  return { status: "error", message: err.message };
  
	} finally {
	  submitBtn.disabled = false;
	  submitBtn.value = "Submit";
	}
  }


  function send_to_api(api_endpoint, o){
	const submitBtn = document.getElementById("submitBtn");
	submitBtn.value = "Submitting...";
	submitBtn.disabled = true;
	fetch("https://classy-peony-a6f6e7.netlify.app/.netlify/functions/"+api_endpoint, {
	  method: "POST",
	  body: JSON.stringify(o),
	  headers: {
		"Content-Type": "text/plain;charset=utf-8",
	  }
	})
	.then((res) => res.json())
	.then((res) => {
	  console.log("Fetch!!");
	  console.log(res);
	  if (res.status === "success") {
		alert('Your entry was successfully saved, '+actor_name);
		// alert('Your entry was successfully saved, '+actor_name);
		// document.getElementById("signupForm").reset();
	  } else {
		console.error(res);
		alert(res);
	  }
	})
	.catch((err) => {
	  console.error( err);
	  //alert("Error submitting form.");
	})
	.finally(() => {
	  submitBtn.disabled = false;
	  submitBtn.value = "Submit";
	});
  }
  

// const farms_dic = {
// 	"Mbale West": ["Oaxaca", "Guerrero", "Chiapas"],
// 	"Mbale West2": ["Eje cafetero", "Armenia", "Salento"],
// 	"Mbale South": ["Kampala", "Mbale", "Fort Portal"]
//   };  
//   {"id":1,"name":"KAGANDA ESTATE\n \n \n \n ","region":"Mukono, Central Region,","country":"Uganda","address":"Mukono, Central Region,","gps_location":null}

// Populate the country dropdown on page load

////////
// https://classy-peony-a6f6e7.netlify.app/.netlify/functions/get_passport

async function loadFarms() {
	const farms_dic = {}
  try {
    const response = await fetch("https://classy-peony-a6f6e7.netlify.app/.netlify/functions/get_farm_locations");
    if (!response.ok) {
      throw new Error("Failed to fetch farm data");
    }

    const farms = await response.json();

    farms.forEach(farm => {
      const country = farm.country || "Unknown"; // fallback if null
	  

      if (!farms_dic[country]) {
        farms_dic[country] = [];
      }

      farms_dic[country].push({ region: farm.region, name: farm.name, id: farm.id });
    });

    console.log("Farms dictionary:", farms_dic);
  } catch (error) {
    console.error("Error loading farms:", error);
  }
  // Get dropdown elements
	const countrySelect = document.getElementById("country");
	const regionSelect = document.getElementById("region");
	const farmSelect = document.getElementById("farm");

  	console.log("FIll countries ", farms_dic)
	if (countrySelect) {
		countrySelect.innerHTML = '<option value="">-- Select Farm --</option>';
		Object.keys(farms_dic).forEach((country) => {
			console.log(country);
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
		const farm = farms_dic[selectedCountry];
		// Correct this bug
		// Farms should have unique region names for the selected country.

		// Reset region dropdown
		regionSelect.innerHTML = '<option value="">-- Select a farm --</option>';
		farm.forEach((farm) => {
			const option = document.createElement("option");
			option.value = farm.id;
			option.textContent = farm.region;
			regionSelect.appendChild(option);
		});
		});
	}
	  // Update farms dropdown when country changes
	if (countrySelect && farmSelect) {
		countrySelect.addEventListener("change", function () {
		const selectedCountry = this.value;
		const farm = farms_dic[selectedCountry];
		console.log(farm.name)
		// Reset region dropdown
		farmSelect.innerHTML = '<option value="">-- Select a farm --</option>';
		farm.forEach((farm) => {
			const option = document.createElement("option");
			option.value = farm.id;
			option.textContent = farm.name;
			farmSelect.appendChild(option);
		});
		});
	}

}

// Call the function when your page loads or when needed
loadFarms();