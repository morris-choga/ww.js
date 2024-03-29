const qrcode = require('qrcode-terminal');
const { sendSong , sendLyrics, sendSongInfo, searchSong} = require("./messenger");
const { Client,LocalAuth ,MessageMedia, LinkingMethod } = require('whatsapp-web.js');
const { fetchCountry, fetchUsers, addUser, songIncrement } = require("./api.js");





//
// (async function (){
// //     console.log(await fetchUsers())
// //     console.log(await fetchCountry("48503374165"))
// // })()
//



const client = new Client({

    // linkingMethod:  new LinkingMethod({
    //     phone: {
    //         number: "+639514176425"
    //     }
    // }),
    authStrategy: new LocalAuth({dataPath: "/usr/src/app/songs/session"}),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    }, webVersion: '2.2409.2',
    // webVersionCache: {
    //     type: 'remote',
    //     remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html'
    // }

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




client.on('message', async (message) => {


    // song group "120363223962652835"
    // test group 120363243170575745
    // lyrics 120363244367417149


    let groupParticipantsNumber = (await message.getChat()).isGroup ? (await message.getChat()).participants.length : 0
    let isGroup = (await message.getChat()).isGroup

    if (message.body.toLocaleLowerCase().startsWith("!get_id ") && message.body.length > 6 && isGroup){
        console.log((await message.getChat()).id.user)
    }
    else if((message.body.toLocaleLowerCase().startsWith("!menu") || message.body.toLocaleLowerCase().startsWith("!help")) && ((await message.getChat()).id.user === "120363243170575745" || (await message.getChat()).id.user === "120363244367417149" || (await message.getChat()).id.user === "120363223962652835")){
        await message.reply("*Bot commands*\n\n🤖*!song* (eg !song rihanna diomonds)\n🤖*!lyrics* (eg !lyrics Maroon 5 sugar)\n🤖*!song-info* (eg !song-info eminem not afraid. Get information about a song. )\n\nNB: !song-info can be used to verify if a song exists to avoid requesting and downloading wrong song")
    }


    else if (message.body.toLocaleLowerCase().startsWith("!lyrics ") && message.body.length > 8 && (await message.getChat()).id.user === "120363244367417149"){
        await sendLyrics(message)
    }
    else if (message.body.toLocaleLowerCase().startsWith("!lyrics ") && message.body.length > 8 ){
        await message.reply("Join the group to request for lyrics \n\nhttps://chat.whatsapp.com/DGeFgy7DRODIIgF68mojTP")
    }

    else if ((message.body.toLocaleLowerCase().startsWith("!song-info ") || message.body.toLocaleLowerCase().startsWith("!song_info ")) && (message.body.length > 11) && ((await message.getChat()).id.user === "120363223962652835" || (await message.getChat()).id.user === "120363243170575745")) {
        await sendSongInfo(message)

    }

    else if (message.body.toLocaleLowerCase().startsWith("!song ") && message.body.length > 6 && isGroup) {


        if ((await message.getChat()).id.user === "120363243170575745" || (await message.getChat()).id.user === "2348034690865-1596391813" || (await message.getChat()).id.user === "120363223962652835") {

            let userID = (await message.id.participant).substring(0,(await message.id.participant).indexOf('@'))
            let userName = await message._data.notifyName
            let userCountry = await fetchCountry(userID)
            let registeredUsers =await fetchUsers()




            Object.keys(registeredUsers).includes(userID) ? await (async function () {

                if (registeredUsers[userID][1] < 10) {
                    await searchSong(message)
                    // await sendSong(message,registeredUsers,userID)
                    // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")

                } else {
                    message.reply("You have exceeded your daily limit...")
                }

            })():await  (async function () {

                let userInfo = {
                    "records": [{"fields":{
                            "userID": "","userName": "","userCountry": "","#songs": 0
                        }
                    }]}

                userInfo.records[0].fields.userID = userID
                userInfo.records[0].fields.userName = userName
                userInfo.records[0].fields.userCountry = userCountry


                await addUser(userInfo)
                // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")
                await sendSong(message,registeredUsers,userID)
            })()



        }


        else if (groupParticipantsNumber < 11) {
            setTimeout(async () => {
                await message.reply(`The music bot only works in a group with at least 10 participants. Please add ${11 - (await message.getChat()).participants.length} more people to the group`)
            }, 5000);
        } else if (groupParticipantsNumber >= 11) {

            await message.reply("Join the group to request for songs \n\nhttps://chat.whatsapp.com/F1l3b5zU8N652cm0gmUuUS")


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

