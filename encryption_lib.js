
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
  