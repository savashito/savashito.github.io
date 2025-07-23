
# Harvesting  
- **Farm** (dropdown)  
- **Location**  
- **Date of Harvest**  
- **Coffee Variety:**  
  - Caturra  
  - Bourbon  
  - Typica  
  - Gesha  
- **Weight** (fresh cherries)  
- **Moisture before drying (%)**

- ### After Selection:
- Sign data with private key. [TODO]
- Send REST API request with signed info. [TODO]
- API verifies signature with stored public key. [TODO]
- If valid, adds entry to the passport (Database). [TODO]


# Drying  
- **Farm** (dropdown)  
- **Location**  
- **Date of dry start**  
- **Drying duration**  
- **Weight after drying**  
- **Moisture after drying**

# Processing  
- **Processing location** (dropdown)  
- **Location**  
- **Date of Processing**  
- **Process:**  
  - Fully washed  
  - Natural (sun-dried)  
  - Pulped natural  
- **Moisture after processing (%)**

# Dry Mill  
- **Farm location** (dropdown)  
- **Location**  
- **Date of dry Milling**  
- **Moisture after Milling (%)**  
- **Weight after sorting**

# Export Preparation  
- **Location**  
- **Moisture before packing (%)**  
- **Packaging**  
  - Jute  
  - Jute + grainpro  

# What do you want to log:  
- Harvesting  
- Drying  
- Processing  
- Dry Mill  
- Export Preparation  

---

## Program NFC
- Chiara creates unique URL on `https://savashito.github.io/create_unique_nfc.html`
- Chiara clicks **Submit**:
  - Runs `crypto.randomUUID()` to create `nfc_id`
  - Sends it to DB, creates an entry in table **NFCs**: stores `nfc_id`, `creation_date`, ...
  - Web app responds with URL format:
    ```
    https://savashito.github.io/scanned.html?nfc_id=d61e09c0-801d-4947-a83d-8cac990513fa
    ```

---

## Create Unique URL [✅ Done]
- [✅ Done] Chiara creates unique URL on `https://savashito.github.io/create_unique_url.html` 
- [✅ Done] Chiara fills form and clicks **Submit**:
- [✅ Done] **Creates entries in tables**:
  - Create an entry in db called using actor_id, with everything empty 
      actors {id}
  - create an entre in db called 
      urls {unique_code, actor_id}
- [✅ Done] Checks if **pedro** is available
- [✅ Done] `actor_id = nickname`
- [✅ Done] Uses `crypto.randomUUID()` to create URL with format:
    ```
    http://localhost:8000/signup.html?unique_code=d61e09c0-801d-4947-a83d-8cac990513fa&actor_id=pedro
    ```
- Send it to them

---

## Register One Time
- Send them a unique URL:  
  `http://localhost:8000/signup.html?unique_code=d61e09c0-801d-4947-a83d-8cac990513fa&actor_id=pedro`
- Prompts them to register.

### On Page Load:
- [TODO - 2 demo] Check if local private key exists and notify if they already have one.
- [TODO - 2 demo] Validate `unique_code`, confirm actor does not have a public key in DB.
- [TODO - 2 demo] Ask for phone number
- [TODO - 2 demo] Request agreement for terms and services, and data EU protections laws.
### On Clicking Register:
- [TODO - 2 demo] Check for existing local private key before creating a new one (one user per device).

- ✅ Web app creates public/private key pair stored on their phone.
- [TODO - 2 demo] They send info + phone number + public key to Netlify API.
- ✅ Private key stored in local storage, encrypted (currently no passkey).
- ✅ Name and `actor_id` saved encrypted locally.
- ✅ Public key saved to DB/spreadsheet.
- [TODO - Important] If public key already exists, notify error and do not update.

---

## If Private Key is Lost [TODO - 2 demo]
- [TODO - 2 demo] Replace old public key in **actors** table with the new public key.
- [TODO - 2 demo] Create new table:  
  `old_public_keys` with `actor_id`, `date`, and the `public_key`.
- [TODO - 2 demo] Copy old public key from **actors** to `old_public_keys`.
- [TODO - 2 demo] Send new registration link.
  - [TODO - 2 demo] Actor creates new public/private key pair.

---

## When They Scan
- Open URL:
  ```
  https://savashito.github.io/scanned.html?nfc_id=d61e09c0-801d-4947-a83d-8cac990513fa
  ```
- Extract:
  - [✅ Done] `nfc_id` (Digital Passport ID)
  - [✅ Done] Private key from local storage (decrypted via salt) 
  - [✅ Done] Name and `actor_id` decrypted [Doce]
- Select what to log: [✅ Done]
  - Harvesting  [✅ Done]
  - Drying 
  - Processing  
  - Dry Mill  
  - Export Preparation
- Add pictures of the process

---

## Adopt a Farm (Future Work)
- Satellite tracking.

### Questions:
- What does the farmer gain?
- Will they understand the added value/costs at each step?

---

## REST API
- **Netlify:**  
  [Netlify Functions Log](https://app.netlify.com/projects/classy-peony-a6f6e7/logs/functions/submit)

## DB
- **Supabase:**  
  [Supabase Dashboard](https://supabase.com/dashboard/project/njhxjxpedwojbiosjtme/database/schemas)

## Website
- **GitHub:**  
  [Repo](https://github.com/savashito/savashito.github.io/tree/master)
- **Live:**  
  [https://savashito.github.io/scanned.html](https://savashito.github.io/scanned.html)

---

## NFC Technology  
### Spreadsheets (Deprecated):
- [Google Sheets](https://docs.google.com/spreadsheets/d/1yt5jB-n6HeeBH9zoC-Ts1N5N52ROLiLR1NlGxzdSfjo/edit?gid=0#gid=0)

### Questionnaires (Deprecated):
- [Office Forms](https://forms.office.com/Pages/ResponsePage.aspx?id=NRfG07TZjkSFFGpmsvtQwx2xBCOVdudMsLR15I51VepUNlpOMk5CSkg1Q0tLSExOMTZJWjJZRENBOS4u&fsw=0)

---

## Consumer Website
- One QR code printed 60 times → linked to a single passport.

---

## Visit This Roastery:
[Herr Hase Kaffeeröster - Google Maps](https://www.google.com/maps/place/Herr+Hase+Kaffeer%C3%B6ster+-+Kaffeebar/@51.970148,7.582257,13z/data=!4m6!3m5!1s0x47b9baeb6d6b0e97:0xe466c6366ddce0ca!8m2!3d51.970148!4d7.6208808!16s%2Fg%2F11f5253f29?entry=ttu&g_ep=EgoyMDI1MDcwNi4wIKXMDSoASAFQAw%3D%3D)

---

## Sign Up for University Stuff:
[University of Münster Sports](https://www.uni-muenster.de/Hochschulsport/erstsemester/index.shtml)

---

## Tutorial for LLMs Locally:
[DataCamp Tutorial](https://www.datacamp.com/tutorial/run-llms-locally-tutorial)

---

## AI:
- [KI Verband - Become a Member](https://ki-verband.de/en/become-a-member/)
- [Zoom Meeting](https://us06web.zoom.us/j/89853029531?pwd=4h36ue3baeD8JTbj0vSS5C8Qqb3sJP.1)
- [Eventbrite AI Industry Event](https://www.eventbrite.com/x/the-power-of-german-ai-meet-the-industry-leaders-tickets-1321115464919)
