const qrcode = require('qrcode-terminal');
const { sendSong , sendLyrics, sendSongInfo, searchSong} = require("./messenger");
const { Client,LocalAuth ,MessageMedia, LinkingMethod } = require('whatsapp-web.js');
const { fetchCountry, fetchUsers, addUser, songIncrement } = require("./api.js");




class Bot{


    constructor(sessionName,range) {
        this.range = range;
        let reInitializeCount = 0
        this.client = new Client({

            // linkingMethod:  new LinkingMethod({
            //     phone: {
            //         number: "+639514176425"
            //     }
            // }),
            authStrategy: new LocalAuth({
                dataPath: "/usr/src/app/songs/sessions",
                clientId: `${sessionName}`
            }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    // '--disable-setuid-sandbox',
                    // '--single-process',
                    // '--disable-gpu'
                ]
            },
            // webVersion: '2.2409.2',
            // webVersionCache: {
            //     type: 'remote',
            //     // remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
            //     remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html'
            // }

        });
        process.on('SIGINT', async () => {
            await this.client.destroy();
            process.exit(0);
        });

        this.client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
        });

        this.client.on('code', (code) => {
            console.log('CODE RECEIVED', code);

        });


        this.client.on('ready', () => {
            console.log('Client is ready!');
        });


        this.client.on('message', async (message) => {
            let userId = (await message.id.participant);
            let song_group = "120363223962652835"
            let test_group = "120363243170575745"
            let lyrics_group =  "120363244367417149"
            let chat_id = (await message.getChat()).id.user



            if((message.body.toLocaleLowerCase().includes("https://")) && (chat_id === test_group || chat_id === lyrics_group || chat_id === song_group)){

                setTimeout(async ()=>{
                    await message.delete(true)
                }, 10000);
            }

            if(userId === undefined ? false : range.includes(parseInt(userId.substring(0, userId.indexOf('@')).charAt(userId.substring(0, userId.indexOf('@')).length - 1)))){



                let options = ["1","2","3"]
                let groupParticipantsNumber = (await message.getChat()).isGroup ? (await message.getChat()).participants.length : 0
                let isGroup = (await message.getChat()).isGroup

                if (message.body.toLocaleLowerCase().startsWith("!get_id ") && message.body.length > 6 && isGroup){
                    console.log(message)
                    console.log(chat_id)
                }



                else if (message.hasQuotedMsg && (chat_id === test_group || chat_id === song_group)){

                    if (message._data.quotedMsg.type === "chat" &&  options.includes(message.body)) {

                        let data = {};
                        let songs = message._data.quotedMsg.body
                        let pos = songs.split("]")
                        let decision = message.body;
                        let userID = (await message.id.participant).substring(0, (await message.id.participant).indexOf('@'))
                        let userName = await message._data.notifyName
                        let userCountry = await fetchCountry(userID)
                        let registeredUsers = await fetchUsers()

                        if (options.includes(decision)) {


                            for (let i = 0; i < pos.length - 1; i++) {
                                if (i + 1 === parseInt(decision)) {
                                    let str = pos[i].slice(pos[i].indexOf("[") + 1)
                                    data["video_id"] = str.slice(0, str.indexOf("~"))
                                    data["album_id"] = str.slice(str.indexOf("~") + 1)
                                }
                            }

                            Object.keys(registeredUsers).includes(userID) ? await (async function () {
                                // 10 > 5 ? await (async function () {

                                if (registeredUsers[userID][1] < 10) {
                                    await sendSong(data,message,registeredUsers,userID)
                                    // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")

                                } else {
                                    message.reply("You have exceeded your daily limit...")
                                }

                            })() : await (async function () {

                                let userInfo = {
                                    "records": [{
                                        "fields": {
                                            "userID": "", "userName": "", "userCountry": "", "#songs": 1,"botMessagesReceived": 0
                                        }
                                    }]
                                }

                                userInfo.records[0].fields.userID = userID
                                userInfo.records[0].fields.userName = userName
                                userInfo.records[0].fields.userCountry = userCountry


                                await addUser(userInfo)
                                await sendSong(data, message, registeredUsers, userID)
                                // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")
                                await sendSong(message,registeredUsers,userID)
                            })()







                        } else {
                            console.log("invalid request option entered")}




                    }


                }



                else if((message.body.toLocaleLowerCase().startsWith("!menu") || message.body.toLocaleLowerCase().startsWith("!help")) && (chat_id === song_group || chat_id === lyrics_group || chat_id === test_group)){
                    await message.reply("*Bot commands*\n\n🤖*!song* (eg !song rihanna diamonds)\n🤖*!lyrics* (eg !lyrics Maroon 5 sugar)\n🤖*!song-info* (eg !song-info eminem not afraid. Get information about a song. )\n\nNB: !song-info can be used to verify if a song exists to avoid requesting and downloading wrong song")
                }


                else if (message.body.toLocaleLowerCase().startsWith("!lyrics ") && message.body.length > 8 && (chat_id === lyrics_group || chat_id === test_group)){
                    await sendLyrics(message,this.client)
                }
                else if (message.body.toLocaleLowerCase().startsWith("!lyrics ") && message.body.length > 8 ){
                    await message.reply("Join the group to request for lyrics \n\nhttps://chat.whatsapp.com/DGeFgy7DRODIIgF68mojTP")
                }

                else if ((message.body.toLocaleLowerCase().startsWith("!song-info ") || message.body.toLocaleLowerCase().startsWith("!song_info ")) && (message.body.length > 11) && (chat_id === lyrics_group || chat_id === song_group)) {
                    await sendSongInfo(message,this.client)

                }

                else if (message.body.toLocaleLowerCase().startsWith("!song ") && message.body.length > 6 && isGroup) {


                    if (chat_id === "120363243170575745" || chat_id === "2348034690865-1596391813" || chat_id === "120363223962652835") {



                        await searchSong(message)
                        // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")

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

            }




        })

        this.client.on("disconnected",(reason)=>{
            console.log(`Client has been disconnected Morris because of ${reason} `);

            if(reInitializeCount < 15 && reason === 'NAVIGATION') {
                reInitializeCount++;
                this.client.initialize();
                return;
            }
        });
    }


    initialize() {
        // Initialize your client here if necessary
        this.client.initialize();
    }




}

const bot = new Bot("0683",[1,2,3]);
const bot2 = new Bot("3202",[4,5,6]);
// const bot3 = new Bot("client3",7,8,9);
bot.initialize();
bot2.initialize();
// bot3.initialize();


// const client = new Client({
//
//     // linkingMethod:  new LinkingMethod({
//     //     phone: {
//     //         number: "+639514176425"
//     //     }
//     // }),
//     authStrategy: new LocalAuth({
//         dataPath: "/usr/src/app/songs/session",
//         clientId: "client-two"
//     }),
//     puppeteer: {
//         headless: false,
//         args: [
//             '--no-sandbox',
//             // '--disable-setuid-sandbox',
//             // '--single-process',
//             // '--disable-gpu'
//         ]
//     },
//     webVersion: '2.2409.2',
//     webVersionCache: {
//         type: 'remote',
//         // remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
//         remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html'
//     }
//
// });


// client.on('qr', (qr) => {
//     qrcode.generate(qr, { small: true });
// });
//
// client.on('code', (code) => {
//     console.log('CODE RECEIVED', code);
//
// });
//
//
// client.on('ready', () => {
//     console.log('Client is ready!');
// });
//
// client.on("disconnected",()=>{
//     console.log('Client has been disconnected Morris!');
// });




// client.on('message', async (message) => {
//
//
//     let songGroup = "120363223962652835"
//     let test_Group = "120363243170575745"
//     let lyrics_Group =  "120363244367417149"
//
//     let options = ["1","2","3"]
//     let groupParticipantsNumber = (await message.getChat()).isGroup ? (await message.getChat()).participants.length : 0
//     let isGroup = (await message.getChat()).isGroup
//
//     if (message.body.toLocaleLowerCase().startsWith("!get_id ") && message.body.length > 6 && isGroup){
//         console.log(message)
//         console.log((await message.getChat()).id.user)
//     }
//
//     else if((message.body.toLocaleLowerCase().includes("https://")) && ((await message.getChat()).id.user === "120363243170575745" || (await message.getChat()).id.user === "120363244367417149" || (await message.getChat()).id.user === "120363223962652835")){
//
//         setTimeout(async ()=>{
//             await message.delete(true)
//         }, 10000);
//     }
//
//     else if (message.hasQuotedMsg && ((await message.getChat()).id.user === "120363243170575745" || (await message.getChat()).id.user === "120363223962652835")){
//
//         if (message._data.quotedMsg.type === "chat" &&  options.includes(message.body)) {
//
//             let data = {};
//             let songs = message._data.quotedMsg.body
//             let pos = songs.split("]")
//             let decision = message.body;
//             let userID = (await message.id.participant).substring(0, (await message.id.participant).indexOf('@'))
//             let userName = await message._data.notifyName
//             let userCountry = await fetchCountry(userID)
//             let registeredUsers = await fetchUsers()
//
//             if (options.includes(decision)) {
//
//
//                 for (let i = 0; i < pos.length - 1; i++) {
//                     if (i + 1 === parseInt(decision)) {
//                         let str = pos[i].slice(pos[i].indexOf("[") + 1)
//                         data["video_id"] = str.slice(0, str.indexOf("~"))
//                         data["album_id"] = str.slice(str.indexOf("~") + 1)
//                     }
//                 }
//
//                 Object.keys(registeredUsers).includes(userID) ? await (async function () {
//                 // 10 > 5 ? await (async function () {
//
//                     if (registeredUsers[userID][1] < 10) {
//                         console.log(registeredUsers[userID])
//                         console.log(registeredUsers[userID][1])
//                         await sendSong(data,message,registeredUsers,userID)
//                         // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")
//
//                     } else {
//                         message.reply("You have exceeded your daily limit...")
//                     }
//
//                 })() : await (async function () {
//
//                     let userInfo = {
//                         "records": [{
//                             "fields": {
//                                 "userID": "", "userName": "", "userCountry": "", "#songs": 0
//                             }
//                         }]
//                     }
//
//                     userInfo.records[0].fields.userID = userID
//                     userInfo.records[0].fields.userName = userName
//                     userInfo.records[0].fields.userCountry = userCountry
//
//
//                     await addUser(userInfo)
//                     await sendSong(data, message, registeredUsers, userID)
//                     // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")
//                     await sendSong(message,registeredUsers,userID)
//                 })()
//
//
//
//
//
//
//
//             } else {
//                 console.log("invalid request option entered")}
//
//
//
//
//         }
//
//
//     }
//
//
//
//     else if((message.body.toLocaleLowerCase().startsWith("!menu") || message.body.toLocaleLowerCase().startsWith("!help")) && ((await message.getChat()).id.user === "120363243170575745" || (await message.getChat()).id.user === "120363244367417149" || (await message.getChat()).id.user === "120363223962652835")){
//         await message.reply("*Bot commands*\n\n🤖*!song* (eg !song rihanna diamonds)\n🤖*!lyrics* (eg !lyrics Maroon 5 sugar)\n🤖*!song-info* (eg !song-info eminem not afraid. Get information about a song. )\n\nNB: !song-info can be used to verify if a song exists to avoid requesting and downloading wrong song")
//     }
//
//
//     else if (message.body.toLocaleLowerCase().startsWith("!lyrics ") && message.body.length > 8 && ((await message.getChat()).id.user === "120363244367417149" || (await message.getChat()).id.user === "120363243170575745")){
//         await sendLyrics(message,client)
//     }
//     else if (message.body.toLocaleLowerCase().startsWith("!lyrics ") && message.body.length > 8 ){
//         await message.reply("Join the group to request for lyrics \n\nhttps://chat.whatsapp.com/DGeFgy7DRODIIgF68mojTP")
//     }
//
//     else if ((message.body.toLocaleLowerCase().startsWith("!song-info ") || message.body.toLocaleLowerCase().startsWith("!song_info ")) && (message.body.length > 11) && ((await message.getChat()).id.user === "120363223962652835" || (await message.getChat()).id.user === "120363243170575745")) {
//         await sendSongInfo(message,client)
//
//     }
//
//     else if (message.body.toLocaleLowerCase().startsWith("!song ") && message.body.length > 6 && isGroup) {
//
//
//         if ((await message.getChat()).id.user === "120363243170575745" || (await message.getChat()).id.user === "2348034690865-1596391813" || (await message.getChat()).id.user === "120363223962652835") {
//
//
//
//             await searchSong(message)
//             // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")
//
//         }
//
//
//         else if (groupParticipantsNumber < 11) {
//             setTimeout(async () => {
//                 await message.reply(`The music bot only works in a group with at least 10 participants. Please add ${11 - (await message.getChat()).participants.length} more people to the group`)
//             }, 5000);
//         } else if (groupParticipantsNumber >= 11) {
//
//             await message.reply("Join the group to request for songs \n\nhttps://chat.whatsapp.com/F1l3b5zU8N652cm0gmUuUS")
//
//
//         }
//
//     }
//
//     else if (message.body.toLocaleLowerCase().startsWith("!song ") && message.body.length > 6 && !isGroup){
//
//         await message.reply("For now the bot can only work in a group chat. Please add me in a group to  request for songs...")
//
//
//     }
//
//     else if (message.body.toLocaleLowerCase().startsWith("!album ") && message.body.length > 7 && isGroup) {
//
//         await message.reply("Album request is still in development...")
//
//
//     }
//
//
// })

// client.initialize();

