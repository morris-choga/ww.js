const qrcode = require('qrcode-terminal');
const { Client,LocalAuth ,MessageMedia, LinkingMethod } = require('whatsapp-web.js');


const client = new Client({

    // linkingMethod:  new LinkingMethod({
    //     phone: {
    //         number: "+639514176425"
    //     }
    // }),
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

// client.on('code', (code) => {
//     console.log('CODE RECEIVED', code);
//
// });


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




userInfo = {
    "records": [{"fields":{
            "userID": "","userName": "","userCountry": "","#songs": 0
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

async  function songIncrement(id , songsNum){

    let addSong = {
        "fields": {"#songs":songsNum}
    }


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

// async function addUser(){
//
//     await fetch(airtableUrl, {
//         method: 'POST',
//         headers: {
//             "Authorization": `Bearer ${apiKey}`,
//             'Content-Type': 'application/json',
//
//         },
//         body: JSON.stringify(userInfo)
//     }).catch(error=>{
//         console.log(`An error occurred while addingUser https://api.airtable.com: ${error}`)
//     })
// }

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


async function sendSong(message,registeredUsers,userID) {


    requestOptions.body = JSON.stringify({"key": message.body.substring(6)})
    let songPath = await fetch(apiUrl, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.text()
            }
            return "Error"
        }).then((data) => {
            let response = data
            let apiResponse = response.replace("api", "app")
            return apiResponse
        }).catch(error => console.log('an error has occurred while fetching https://api:5000 ', error))

    if (typeof songPath !== "undefined" && songPath !== "Error") {


        try {
            let song = MessageMedia.fromFilePath(songPath)
            await message.reply(song)
            let songsNum = registeredUsers[userID][1] + 1
            // addSong.fields["#songs"] = registeredUsers[userID][1] + 1
            await songIncrement(registeredUsers[userID][0], songsNum)
        } catch (e) {
            await message.reply("oops! this song seems to be unavailable")
            console.log(`An error has occurred while sending media: ${e}`)
        }

        fs.unlink(songPath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err.message}`);
            } else {
                console.log(`${message.body.toLocaleLowerCase()} sent`);
            }
        });

    }
}







client.on('message', async (message) => {



    let groupParticipantsNumber = (await message.getChat()).isGroup ? (await message.getChat()).participants.length : 0
    let isGroup = (await message.getChat()).isGroup

    if (message.body.toLocaleLowerCase().startsWith("!get_id ") && message.body.length > 6 && isGroup){
        console.log((await message.getChat()).id.user)
    }


    if (message.body.toLocaleLowerCase().startsWith("!song ") && message.body.length > 6 && isGroup) {


        if ((await message.getChat()).id.user === "120363213455576189" || (await message.getChat()).id.user === "2348034690865-1596391813" || (await message.getChat()).id.user === "120363223962652835") {

            let userID = (await message.id.participant).substring(0,(await message.id.participant).indexOf('@'))
            let userName = await message._data.notifyName
            let userCountry = await fetchCountry(userID)
            let registeredUsers =await fetchUsers()




            Object.keys(registeredUsers).includes(userID) ? await (async function () {

                if (registeredUsers[userID][1] < 10) {
                    await sendSong(message,registeredUsers,userID)
                    // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")

                } else {
                    message.reply("You have exceeded your daily limit...")
                }

            })():await  (async function () {
                userInfo.records[0].fields.userID = userID
                userInfo.records[0].fields.userName = userName
                userInfo.records[0].fields.userCountry = userCountry
                await addUser()
                // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")
                await sendSong(message,registeredUsers,userID)
            })()



        }


        else if (groupParticipantsNumber < 11) {
            setTimeout(async () => {
                await message.reply(`The music bot only works in a group with at least 10 participants. Please add ${11 - (await message.getChat()).participants.length} more people to the group`)
            }, 5000);
        } else if (groupParticipantsNumber >= 11) {

            await message.reply("Join the community to request for songs \n\nhttps://chat.whatsapp.com/Fpe6qovwQtACtZWumjfMBt")


        }

    }

    else if (message.body.toLocaleLowerCase().startsWith("!song ") && message.body.length > 6 && !isGroup){

        await message.reply("For now the bot can only work in a group chat. Please add me in a group to  request for songs...")


    }

    else if (message.body.toLocaleLowerCase().startsWith("!album ") && message.body.length > 7 && isGroup) {

        await message.reply("Album request is still in development...")


    }

})

client.initialize();

