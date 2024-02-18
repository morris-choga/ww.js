const qrcode = require('qrcode-terminal');
const { Client,LocalAuth ,MessageMedia, Buttons } = require('whatsapp-web.js');
console.log("hello there")

const client = new Client({
    authStrategy: new LocalAuth(),
     puppeteer: {
           headless: true,
           args: ['--no-sandbox']
           }

});
process.on('SIGINT', async () => {
    await this.client.destroy();
    process.exit(0);
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});


client.on('ready', () => {
    console.log('Client is ready!');
});

const fs = require('fs');


let requestOptions = {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: {},
    redirect: 'follow'
};

let apiKey = "patg3nVCYWdoRthJn.56198a4363e0982055386462c75e70566e51bc2b4bac7cd605b6996a87b51521";
let airtableUrl = "https://api.airtable.com/v0/appAcgdXpcBoOwP5X/tblk48SN08xOlGQz9"
let apiUrl = "http://api:5000";

let addSong = {
    "fields": {"#songs":10}
}

userInfo = {
    "records": [{"fields":{
            "userID": "","userName": "","userCountry": "","#songs": 1
        }
    }]}

async function fetchCountry(num){
    let result = await fetch(`https://lookups.twilio.com/v2/PhoneNumbers/+${num}`, {
        headers: {
            'Authorization': "Basic QUMwYTEyNDRhYzA4Y2Q3Nzc1ZTFhZjhmZjg2ODk2OTNiYjpmMjNhYjU1NTJkM2NiNjUxZjc2ZDhiODhhYjM4YmU4Yg==",
            'Content-Type': 'application/json',
        },
    }).then((response)=>{
        let body = response.json()

        return body}).then((data)=>{
        let country = data.country_code
        return country
    }).catch(error=>{
        console.log(`An error occurred while fetching country: ${error}`)
    })
    return result
}

async  function songIncrement(id){


    let result = await fetch(`${airtableUrl}/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(addSong)
    })

}


async function fetchUsers(){

    let result = await fetch(airtableUrl,{
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    }).then((response)=>{
        let body = response.json()

        return body
    }).then((response)=>{

        let userInfo = {}
        let users = response.records


        Object.keys(users).forEach((key) => {
            userInfo[users[key].fields.userID] = [users[key].id,users[key].fields["#songs"]]

        })

        return userInfo

    }).catch(error=>{
        console.log(`An error occurred while fetching https://api.airtable.com: ${error}`)
    });

    return result

}

async function addUser(){

    await fetch(airtableUrl, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            'Content-Type': 'application/json',

        },
        body: JSON.stringify(userInfo)
    }).catch(error=>{
        console.log(`An error occurred while addingUser https://api.airtable.com: ${error}`)
    })
}

async function addUser(){

    await fetch(airtableUrl, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            'Content-Type': 'application/json',

        },
        body: JSON.stringify(userInfo)
    }).catch(error=>{
        console.log(`An error occurred while addingUser https://api.airtable.com: ${error}`)
    })
}

client.initialize();

