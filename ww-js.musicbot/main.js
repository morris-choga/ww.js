const qrcode = require('qrcode-terminal');
const { sendSong, sendAlbum , sendLyrics, sendSongInfo, sendVideo, searchSong, searchAlbum, searchVideo, sendServerRestart,getPlaylist} = require("./messenger");
const { hiphopDXNews} = require("./news");
const { Client,LocalAuth} = require('whatsapp-web.js');
const { fetchCountry, fetchUsers, addUser,botMessageIncrement } = require("./api.js");
const {fetchBots} = require("./api");
const schedule = require('node-schedule');

//    "whatsapp-web.js": "github:pedroslopez/whatsapp-web.js#webpack-exodus"




class Bot{
    messageCount = 0;
    static registeredBots;
    static registeredUsers;
    song_group = "120363223962652835"
    test_group = "120363243170575745"
    lyrics_group =  "120363244367417149"
    general_group =  "120363243929787149"


    constructor(sessionName,range) {
        this.sessionName = sessionName;
        let reInitializeCount = 0
        this.client = new Client({


            // linkingMethod:  new LinkingMethod({
            //     phone: {
            //         number: "+639514176425"
            //     }
            // }),

            authStrategy: new LocalAuth({
                dataPath: "/usr/src/app/media/sessions",
                clientId: `${sessionName}`
            }),
            puppeteer: {
                headless: true,
                // executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
                // executablePath: "/usr/src/app/chrome/google-chrome",
                args: [
                    '--no-sandbox',
                    '--no-experiments',
                    '--hide-scrollbars',
                    '--disable-plugins',
                    '--disable-infobars',
                    '--disable-translate',
                    '--disable-pepper-3d',
                    '--disable-extensions',
                    '--disable-dev-shm-usage',
                    '--disable-notifications',
                    '--disable-setuid-sandbox',
                    '--disable-crash-reporter',
                    '--disable-smooth-scrolling',
                    '--disable-login-animations',
                    '--disable-dinosaur-easter-egg',
                    '--disable-accelerated-2d-canvas',
                    '--disable-rtc-smoothness-algorithm',
                    "--disable-setuid-sandbox",
                    "--disable-gpu"
                ]
            },
            // webVersion: '2.3000.1012750699',
            // webVersionCache: {
            //     type: 'remote',
            //     // remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
            //     remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1012750699-alpha.html'
            // }

        });




        process.on('exit', async (code) => {
            console.log(`Process exited with code ${code} Morris`);

        });

        process.on('SIGINT', async () => {
            console.log("SIGNINT called... now exiting!\nBye Morris")
            await this.client.destroy();
            process.exit(0);
        });


        let pairingCodeRequested = false;
        this.client.on('qr', async (qr) => {
            // NOTE: This event will not be fired if a session is specified.
            qrcode.generate(qr, { small: true });


            const pairingCodeEnabled = true;
            if (pairingCodeEnabled && !pairingCodeRequested) {
                const pairingCode = await this.client.requestPairingCode('13156366159'); // enter the target phone number
                // const pairingCode = await this.client.requestPairingCode('13156366159'); // enter the target phone number
                console.log('Pairing code enabled, code: '+ pairingCode);
                pairingCodeRequested = true;
            }
        })

        this.client.on('loading_screen', (percent, message) => {
            console.log('LOADING SCREEN', percent, sessionName);
            // switch (percent){
            //     case "0":
            //         console.log(`bot ${sessionName} 0%`);
            //         break;
            //     case "50":
            //         console.log(`bot ${sessionName} 50%`);
            //         break;
            //     case "75":
            //         console.log(`bot ${sessionName} 75%`);
            //         break;
            //     case "100":
            //         console.log(`bot ${sessionName} 100%`);
            //         break;
            // }
        });

        this.client.on('ready', () => {
            console.log(`bot ${sessionName} ready!`);


        });



        this.client.on('message', async (message) => {

            // console.log(message._data.viewMode)
            //
            // if(message._data.viewMode){
            //
            //     console.log("VIEW ONCE DETECTED")
            // }


            let chat = (await message.getChat().catch((error)=>{
                console.log(error)
            }))
            // let (await message.id.participant) = (await message.id.participant);
            let user = chat.id.user
            let message_body = message.body.toLocaleLowerCase()

            let isGroup = chat.isGroup
            // let groupParticipantsNumber = isGroup ? chat.participants.length : 0

            // console.log(Bot.registeredBots === undefined ? "registeredBots undefined" : "registeredBots defined")
            // console.log(Bot.registeredUsers === undefined ? "registeredUsers undefined" : "registeredUsers defined")

            Bot.registeredBots === undefined ? Bot.registeredBots = await fetchBots() : "";   //TEST THIS
            Bot.registeredUsers === undefined ?  Bot.registeredUsers = await fetchUsers() : ""; //TEST THIS



            //If a new user is added, the program is likely to break when he/she requests for a song because their records don't exist on the online database


            if (message_body.startsWith("!ping")){
                console.log(`pong from ${sessionName}`)









            }

            if (message_body.startsWith("!playlist ") && message.body.length > 10){
                console.log("testing playlist")
                await getPlaylist(message)

            }

            if((message_body.includes("https://")) && !message_body.includes("request") && (user === this.general_group || user === this.test_group || user === this.lyrics_group || user === this.song_group)){

                setTimeout(async ()=>{

                    try {
                        console.log("Message deleted")
                        await message.delete(true)


                    } catch (error) {
                        console.log(`Error deleting message ${error}`)

                    }


                }, 5000);


            }

            if ((message_body.startsWith("!song") || message_body.startsWith("!lyrics")) && message.body.length > 6 && !isGroup){

                await message.reply("For now the bot can only work in a group chat. Please add me in a group to  request for songs...")
                // this.messageCount++;
                await botMessageIncrement(Bot.registeredBots[sessionName][0],sessionName)


            }  //problem





            if(isGroup && (user !== this.song_group && user !== this.lyrics_group && user !== this.test_group ) && (message_body.startsWith("!video") || message_body.startsWith("!song") || message_body.startsWith("!lyrics"))){



                if (chat.participants.length < 11) {


                    setTimeout(async () => {
                        await message.reply(`The music bot only works in a group with at least 10 participants. Please add ${11 - chat.participants.length} more people to the group`)
                        // this.messageCount++;
                        await botMessageIncrement(Bot.registeredBots[sessionName][0],sessionName)
                    }, 5000);
                }

                else {

                    await message.reply("Join the chat to request for songs \n\nhttps://chat.whatsapp.com/F1l3b5zU8N652cm0gmUuUS")
                    // this.messageCount++;
                    await botMessageIncrement(Bot.registeredBots[sessionName][0],sessionName)


                }

            }

            if (message_body.startsWith("!lyrics ") && message.body.length > 8 && (user === this.lyrics_group || user === this.test_group)){
                console.log("Lyrics called")
                await sendLyrics(message,this.client)
                // this.messageCount++;
                await botMessageIncrement(Bot.registeredBots[sessionName][0],sessionName)
            }


            if((await message.id.participant) === undefined ? false : range.includes(parseInt((await message.id.participant).substring(0, (await message.id.participant).indexOf('@')).charAt((await message.id.participant).substring(0, (await message.id.participant).indexOf('@')).length - 1)))){


                let options = ["1","2","3"]
                

                if (message_body.startsWith("id")&& isGroup){

                    console.log(user)
                }



                else if (message.hasQuotedMsg && (user === this.test_group || user === this.song_group)){

                    if (message._data.quotedMsg.type === "chat" &&  options.includes(message.body)) {

                        let data = {};
                        let searchedResults = message._data.quotedMsg.body
                        let pos = searchedResults.split("]")

                        let decision = message.body;
                        let userID = (await message.id.participant).substring(0, (await message.id.participant).indexOf('@'))
                        // let await message._data.notifyName = await message._data.notifyName
                        // let await fetchCountry(userID) = await fetchCountry(userID)

                        if (options.includes(decision) && searchedResults.includes("song number")) {


                            for (let i = 0; i < pos.length - 1; i++) {
                                if (i + 1 === parseInt(decision)) {
                                    let str = pos[i].slice(pos[i].indexOf("[") + 1)
                                    data["video_id"] = str.slice(0, str.indexOf("~"))
                                    data["album_id"] = str.slice(str.indexOf("~") + 1)
                                }
                            }

                            Object.keys(Bot.registeredUsers).includes(userID) ? await (async function () {

                                let userSongs = await fetchUsers();
                                // if (Bot.registeredUsers[userID][1] < 10) {
                                if (userSongs[userID][1] < 10) {

                                    await sendSong(data,message,Bot.registeredUsers,userID,this,Bot)
                                    // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")


                                } else {
                                    await message.reply("You have exceeded your daily limit...")

                                }

                            }).call(this) : await (async function () {

                                let userInfo = {
                                    "records": [{
                                        "fields": {
                                            "userID": "", "userName": "", "userCountry": "", "#songs": 0,"botMessagesReceived": 0
                                        }
                                    }]
                                }

                                userInfo.records[0].fields.userID = userID
                                userInfo.records[0].fields.userName = await message._data.notifyName
                                userInfo.records[0].fields.userCountry = await fetchCountry(userID)


                                await addUser(userInfo)
                                console.log(`User ${userInfo.records[0].fields.userName = await message._data.notifyName} added to database`)
                                Bot.registeredUsers = await fetchUsers();


                                // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")
                                await sendSong(data, message, Bot.registeredUsers, userID,this,Bot)

                            }).call(this)







                        }

                        else if (options.includes(decision) && searchedResults.includes("album number")){



                            for (let i = 0; i < pos.length - 1; i++) {
                                if (i + 1 === parseInt(decision)) {
                                    let str = pos[i].slice(pos[i].indexOf("[") + 1)
                                    // data["video_id"] = str.slice(0, str.indexOf("~"))
                                    data["album_id"] = str.slice(str.indexOf("~") + 1)
                                }
                            }

                            Object.keys(Bot.registeredUsers).includes(userID) ? await (async function () {

                                let userSongs = await fetchUsers();
                                // if (Bot.registeredUsers[userID][1] < 10) {
                                if (userSongs[userID][1] < 10) {

                                    await sendAlbum(data,message,Bot.registeredUsers,userID,this,Bot)
                                    // await sendSong(data,message,Bot.registeredUsers,userID,this,Bot)
                                    // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")


                                } else {
                                    await message.reply("You have exceeded your daily limit...")

                                }

                            }).call(this) : await (async function () {

                                let userInfo = {
                                    "records": [{
                                        "fields": {
                                            "userID": "", "userName": "", "userCountry": "", "#songs": 0,"botMessagesReceived": 0
                                        }
                                    }]
                                }

                                userInfo.records[0].fields.userID = userID
                                userInfo.records[0].fields.userName = await message._data.notifyName
                                userInfo.records[0].fields.userCountry = await fetchCountry(userID)


                                await addUser(userInfo)
                                console.log(`User ${userInfo.records[0].fields.userName = await message._data.notifyName} added to database`)
                                Bot.registeredUsers = await fetchUsers();


                                // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")
                                await sendSong(data, message, Bot.registeredUsers, userID,this,Bot)

                            }).call(this)






                        }

                        else if (options.includes(decision) && searchedResults.includes("video number")){



                            for (let i = 0; i < pos.length - 1; i++) {
                                if (i + 1 === parseInt(decision)) {
                                    data["video_id"] = pos[i].slice(pos[i].indexOf("[") + 1)
                                    // data["video_id"] = str.slice(0, str.indexOf("]"))
                                    // data["album_id"] = str.slice(str.indexOf("~") + 1)
                                }
                            }


                            Object.keys(Bot.registeredUsers).includes(userID) ? await (async function () {

                                let userSongs = await fetchUsers();
                                // if (Bot.registeredUsers[userID][1] < 10) {
                                if (userSongs[userID][1] < 10) {

                                    await sendVideo(data,message,Bot.registeredUsers,userID,this,Bot)
                                    // await sendSong(data,message,Bot.registeredUsers,userID,this,Bot)
                                    // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")


                                } else {
                                    await message.reply("You have exceeded your daily limit...")

                                }

                            }).call(this) : await (async function () {

                                let userInfo = {
                                    "records": [{
                                        "fields": {
                                            "userID": "", "userName": "", "userCountry": "", "#songs": 0,"botMessagesReceived": 0
                                        }
                                    }]
                                }

                                userInfo.records[0].fields.userID = userID
                                userInfo.records[0].fields.userName = await message._data.notifyName
                                userInfo.records[0].fields.userCountry = await fetchCountry(userID)


                                await addUser(userInfo)
                                console.log(`User ${userInfo.records[0].fields.userName = await message._data.notifyName} added to database`)
                                Bot.registeredUsers = await fetchUsers();


                                // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")
                                await sendSong(data, message, Bot.registeredUsers, userID,this,Bot)

                            }).call(this)






                        }
                        else {
                            console.log("invalid request option entered")}




                    }



                }



                else if((message_body.startsWith("!menu") || message_body.startsWith("!help")) && (user === this.song_group || user === this.lyrics_group || user === this.test_group)){
                    await message.reply("*Bot commands*\n\n🤖*!song* (eg !song rihanna diamonds)\n🤖*!video* (eg !video how to install whatsapp) (temporarily unavailable)\n🤖*!album* (eg !metro booming heroes & villains) (temporarily unavailable)\n🤖*!lyrics* (eg !lyrics Maroon 5 sugar)\n🤖*!song-info* (eg !song-info eminem not afraid. Get information about a song.)")
                    // this.messageCount++;
                    await botMessageIncrement(Bot.registeredBots[sessionName][0],sessionName)
                }



                else if (message_body.startsWith("!lyrics ") && message.body.length > 8 && user !== this.lyrics_group){
                    await message.reply("Join the chat to request for lyrics \n\nhttps://chat.whatsapp.com/DGeFgy7DRODIIgF68mojTP")
                    // this.messageCount++;
                    await botMessageIncrement(Bot.registeredBots[sessionName][0],sessionName)
                }

                else if ((message_body.startsWith("!song-info ") || message_body.startsWith("!song_info ")) && (message.body.length > 11) && (user === this.lyrics_group || user === this.song_group)) {
                    await sendSongInfo(message,this.client)
                    // this.messageCount++;
                    await botMessageIncrement(Bot.registeredBots[sessionName][0],sessionName)

                }

                else if (message_body.startsWith("!song ") && message.body.length > 6 && isGroup) {

                    if (user === this.test_group  || user === this.song_group) {

                        await searchSong(message,this.client)
                        await botMessageIncrement(Bot.registeredBots[sessionName][0],sessionName)

                        // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")

                    }




                }

                // else if (message_body.startsWith("!album ") && message.body.length > 7 && isGroup) {
                //     if (user === this.test_group || user === this.song_group) {
                //         await searchAlbum(message,this.client)
                //
                //         //dont forget to increment bot message
                //
                //     }
                //
                //
                //
                //
                // }


                // else if (message_body.startsWith("!video ") && message.body.length > 7 && isGroup) {
                //     if (user === this.test_group || user === this.song_group ) {
                //         await searchVideo(message,this.client)
                //         // await message.reply("This feature is currently unavailable")
                //
                //         //dont forget to increment bot message
                //
                //     }
                //
                //
                //
                //
                // }




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

    getMessageCount(){
        return this.messageCount
    }
    initialize() {




        this.client.initialize().catch(reason => {
            console.log("Client stopped Morris: "+ reason)
            }



        )

        // if (this.sessionName ==="6159"){
        //
        //     schedule.scheduleJob("0 * * * *",async ()=>{
        //         console.log("Job scheduled for "+this.sessionName)
        //         await hiphopDXNews(this.client)
        //
        //     })
        // }



    }




}



//rue
const bot1 = new Bot("8827",[0,1,2,3,4]);
//eminembot
const bot2 = new Bot("6159",[5,6,7,8,9]);
//Chichie
const bot3 = new Bot("8573",[9]);

// 263 78 024 8827





bot1.initialize();
bot2.initialize();
// bot3.initialize();



