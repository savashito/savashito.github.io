
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


async function verifySignature(publicKey, message, signature) {
	const enc = new TextEncoder();
	const data = enc.encode(message);
	return await crypto.subtle.verify(
		{
		name: "ECDSA",
		hash: { name: "SHA-256" },
		},
		publicKey,
		signature,
		data
	);
	}
  
	// crypto.subtle.importKey(
	// 	format,        // e.g. "jwk", "spki", "pkcs8", "raw"
	// 	keyData,       // the actual key (ArrayBuffer, JSON, etc.)
	// 	algorithm,     // algorithm object describing how the key is used
	// 	extractable,   // true if the key can be exported later
	// 	keyUsages      // array of allowed uses like ["sign", "verify"]
	// )
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

	async function encryptAndStorePrivateKey(privateKey, passphrase) {
		const encoder = new TextEncoder();
		const salt = crypto.getRandomValues(new Uint8Array(16));
		const iv = crypto.getRandomValues(new Uint8Array(12));
	
		const aesKey = await deriveAesKeyFromPassphrase(passphrase, salt); // creates the key for encrypting the privateKey

		const jwk = await crypto.subtle.exportKey("jwk", privateKey);		
		const plaintext = encoder.encode(JSON.stringify(jwk));	// Get the private key in plain text
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
	
		const salt = new Uint8Array(stored.salt);
		const iv = new Uint8Array(stored.iv);
		const data = new Uint8Array(stored.data);
	
		const aesKey = await deriveAesKeyFromPassphrase(passphrase, salt);
	
		const plaintext = await crypto.subtle.decrypt(
			{ name: "AES-GCM", iv },
			aesKey,
			data
		);
	
		const jwk = JSON.parse(decoder.decode(plaintext));
	
		return await crypto.subtle.importKey(
			"jwk",
			jwk,
			{ name: "ECDSA", namedCurve: "P-256" },
			true,
			["sign"]
		);
	}

////
const message = "hello blockchain world";

(async () => {
	console.log("Decripting ...");
	key = await loadAndDecryptPrivateKey("1234");
	let isValid = await verifySignature(publicKey, message, signature);
	/*
  const { publicKey, privateKey } = await generateKeyPair();

  const signature = await signMessage(privateKey, message);
//   console.log("Signature:", new Uint8Array(signature));
	encryptAndStorePrivateKey(privateKey, "1234");
  let isValid = await verifySignature(publicKey, message, signature);
  console.log("Valid?", isValid);
	isValid = await verifySignature(publicKey, "hello blockchain worlt", signature);
  console.log("Valid?", isValid);
*/
//   await exportPrivateKey(privateKey);
})();
