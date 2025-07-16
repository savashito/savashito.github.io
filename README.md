
Harvesting: 
    Farm (dropdown)
    location
    Date of Harvest
    Coffee Variety:
        caturra,
        bourbon,
        typica,
        gesha
    Weight (fresh cherries)
    Moisture before drying (%)

Drying:
    Farm (dropdown)
    location 
    Date of dry start
    Drying duration
    Weight after drying
    Moisture after drying 

Processing
    Processing location (dropdown)
    location
    Date of Processing
    Process:
        fully washed, 
        natural (sun-dried), 
        pulped natural
    Moisture after processing (%) 

Dry Mill
    Farm location (dropdown)
    location
    Date of dry Milling
    Moisture after Milling (%) 
    Weight after sorting

Export Preparation:
    location
    moisture before packing (%)
    Packaging 
        Jute, 
        Jute + grainpro

What do you want to log:
    Harvesting,
    Drying,
    Processing,
    Dry Mill,
    Export Preparation




Program NFC:
    Chiara creates unique url on https://savashito.github.io/create_unique_nfc.html
    Chiara click submit button:
        runs crypto.randomUUID() to create nfc_id,
        sends it to db and creates and entry in table NFCs, stores: nfc_id, creation_date, ...
        the web app responds with an url with following format:
            https://savashito.github.io/scanned.html?nfc_id=d61e09c0-801d-4947-a83d-8cac990513fa

Create Unique URL
    Chiara creates unique url on https://savashito.github.io/create_unique_url.html
    Chiara fills form then clicks submint:
    --> Create an entry in tables:
        check if pedro is available,
        actors id = nickname
        use crypto.randomUUID() to create url with the format
        url = ---> http://localhost:8000/signup.html?unique_code=d61e09c0-801d-4947-a83d-8cac990513fa&actor_id=pedro

    Load it to the nfc
    Send this to them


Register one time
    you send them a unique url for them (http://localhost:8000/signup.html?unique_code=d61e09c0-801d-4947-a83d-8cac990513fa&actor_id=pedro)
    this promps them to register.
    When page loads:
        [TODO] Check if local private key exists and notify the error
        [TODO] Check if unique_code is valid, and actor does not have a public key on db.
    when they click register, 
        [TODO] check if local private key exists first, if exists dont create a new one (only one user per device)
        [Done] web application create public and private key which is stored in their phone 
        [Done] they send all their information and the public key to our API. running on Netlify 
        [Done] (save private key in local storaged, but its encripted with salt and passkey) at the moment no passkey 
        [Done] (Save the name and actor_id encrypted localy)
        [Done] public key is uploaded to (spreadsheet/db) 
        [TODO - important] if public key is already on db, notify the error and do not update it.


    What to do if private key is lost
        We replace the old public key stored in actors and replace it with the new public key
        We create a new table called:  
            old_public_keys: has actor_id, date, and the plublic _key 
        copy the old public_key stored in actors, and create a new entry in old_public_keys.
        We send a new link for register. 
            (the actor create a new public and private key.)




When they scan 
    [todo] rename index.html -> scanned.html
    Open a website (https://savashito.github.io/scanned.html?nfc_id=d61e09c0-801d-4947-a83d-8cac990513fa)
        http://localhost:8000/scanned.html?nfc_id=d61e09c0-801d-4947-a83d-8cac990513fa
    We extract the unique nfc_id, which the digital passport id
    We extract private key stored in local storage using the salt. to identify who scanned it. [Done]
    We extract he name and actor_id and decrypted  [Doce]
    What do you want to log: [DONE]
        Harvesting,
        Drying,
        Processing,
        Dry Mill,
        Export Preparation
    After selecting the choise 

    then they sign it using their private key and send an api rest requst with the sign info.
    API resquest/ server will check using the public key (stored in spreadsheet/db) if its valid.
    if valid it add it the entry to the passport.
    
    ---

Adopt a Farm: 
    Future work, satelite traking,

Questions:
    what is the farmer getting out of this? 
    would they know the added value/costs at each step?

-------------

REST API in: 
    netlify
    https://app.netlify.com/projects/classy-peony-a6f6e7/logs/functions/submit
DB in: 
    supabase    
    https://supabase.com/dashboard/project/njhxjxpedwojbiosjtme/database/schemas
Website in:
    github https://github.com/savashito/savashito.github.io/tree/master
    https://savashito.github.io/scanned.html

NFC technology

spreadsheets in (deprecated):
    google
    https://docs.google.com/spreadsheets/d/1yt5jB-n6HeeBH9zoC-Ts1N5N52ROLiLR1NlGxzdSfjo/edit?gid=0#gid=0
Cuestionar in (deprecated):    
    office
    https://forms.office.com/Pages/ResponsePage.aspx?id=NRfG07TZjkSFFGpmsvtQwx2xBCOVdudMsLR15I51VepUNlpOMk5CSkg1Q0tLSExOMTZJWjJZRENBOS4u&fsw=0

    

consumer website
    one qr codes printed 60 times ---> to a single passport 

Visit this roasteziry
https://www.google.com/maps/place/Herr+Hase+Kaffeer%C3%B6ster+-+Kaffeebar/@51.970148,7.582257,13z/data=!4m6!3m5!1s0x47b9baeb6d6b0e97:0xe466c6366ddce0ca!8m2!3d51.970148!4d7.6208808!16s%2Fg%2F11f5253f29?entry=ttu&g_ep=EgoyMDI1MDcwNi4wIKXMDSoASAFQAw%3D%3D
sign up to university stuff:
https://www.uni-muenster.de/Hochschulsport/erstsemester/index.shtml
tutorial for llms locally
https://www.datacamp.com/tutorial/run-llms-locally-tutorial

AI: 
https://ki-verband.de/en/become-a-member/
join: 
https://us06web.zoom.us/j/89853029531?pwd=4h36ue3baeD8JTbj0vSS5C8Qqb3sJP.1

https://www.eventbrite.com/x/the-power-of-german-ai-meet-the-industry-leaders-tickets-1321115464919
