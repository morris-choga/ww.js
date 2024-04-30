const qrcode = require('qrcode-terminal');
const { sendSong , sendLyrics, sendSongInfo, searchSong} = require("./messenger");
const { Client,LocalAuth} = require('whatsapp-web.js');
const { fetchCountry, fetchUsers, addUser,botMessageIncrement } = require("./api.js");
const {fetchBots, botSongIncrement} = require("./api");




class Bot{
    messageCount = 0;


    constructor(sessionName,range) {

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
                    '--autoplay-policy=user-gesture-required',
                    '--disable-background-networking',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-breakpad',
                    '--disable-client-side-phishing-detection',
                    '--disable-component-update',
                    '--disable-default-apps',
                    '--disable-dev-shm-usage',
                    '--disable-domain-reliability',
                    '--disable-features=AudioServiceOutOfProcess',
                    '--disable-hang-monitor',
                    '--disable-ipc-flooding-protection',
                    '--disable-notifications',
                    '--disable-offer-store-unmasked-wallet-cards',
                    '--disable-popup-blocking',
                    '--disable-print-preview',
                    '--disable-prompt-on-repost',
                    '--disable-renderer-backgrounding',
                    '--disable-setuid-sandbox',
                    '--disable-speech-api',
                    '--disable-sync',
                    '--hide-scrollbars',
                    '--ignore-gpu-blacklist',
                    '--metrics-recording-only',
                    '--mute-audio',
                    '--no-default-browser-check',
                    '--no-first-run',
                    '--no-pings',
                    '--no-sandbox',
                    '--no-zygote',
                    '--password-store=basic',
                    '--use-gl=swiftshader',
                    '--use-mock-keychain',
                    '--allow-insecure-localhost',
                    '--disable-setuid-sandbox',
                    '--single-process',
                    '--disable-gpu'
                ]
            },
            // webVersion: '2.3000.1012750699',
            // webVersionCache: {
            //     type: 'remote',
            //     // remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
            //     remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1012750699-alpha.html'
            // }

        });
        process.on('SIGINT', async () => {
            await this.client.destroy();
            process.exit(0);
        });
        //
        // this.client.on('qr', (qr) => {
        //     qrcode.generate(qr, { small: true });
        // });

        let pairingCodeRequested = false;
        this.client.on('qr', async (qr) => {
            // NOTE: This event will not be fired if a session is specified.
            qrcode.generate(qr, { small: true });

            // paiuting code example
            const pairingCodeEnabled = true;
            if (pairingCodeEnabled && !pairingCodeRequested) {
                const pairingCode = await this.client.requestPairingCode('13156288660'); // enter the target phone number
                console.log('Pairing code enabled, code: '+ pairingCode);
                pairingCodeRequested = true;
            }
        });

        this.client.on('loading_screen', (percent, message) => {
            // console.log('LOADING SCREEN', percent, message);
            switch (percent){
                case "25":
                    console.log(`bot ${sessionName} 25%`);
                    break;
                case "50":
                    console.log(`bot ${sessionName} 50%`);
                    break;
                case "75":
                    console.log(`bot ${sessionName} 75%`);
                    break;
                case "100":
                    console.log(`bot ${sessionName} 100%`);
                    break;
            }
        });


        this.client.on('ready', () => {
            console.log(`bot ${sessionName} ready!`);
        });


        this.client.on('message', async (message) => {
            let userId = (await message.id.participant);
            let song_group = "120363223962652835"
            let test_group = "120363243170575745"
            let lyrics_group =  "120363244367417149"
            let chat_id = (await message.getChat()).id.user
            let message_body = message.body.toLocaleLowerCase()
            let groupParticipantsNumber = (await message.getChat()).isGroup ? (await message.getChat()).participants.length : 0
            let registeredBots = await fetchBots()

            if (message_body.startsWith("!ping")){
                console.log(`pong from ${sessionName}`)





            }

            if((message_body.includes("https://")) && !message_body.includes("request") && (chat_id === test_group || chat_id === lyrics_group || chat_id === song_group)){

                setTimeout(async ()=>{

                    try {
                        await message.delete(true)

                    } catch (error) {
                        console.log(`Error deleting message ${error}`)

                    }


                }, 10000);


            }

            if ((message_body.startsWith("!song") || message_body.startsWith("!lyrics")) && message.body.length > 6 && !(await message.getChat()).isGroup){

                await message.reply("For now the bot can only work in a group chat. Please add me in a group to  request for songs...")
                // this.messageCount++;
                await botMessageIncrement(registeredBots[sessionName][0],sessionName)


            }

            if((await message.getChat()).isGroup && (chat_id !== song_group && chat_id !== lyrics_group && chat_id !== test_group ) && (message_body.startsWith("!song") || message_body.startsWith("!lyrics"))){

                if (groupParticipantsNumber < 11) {
                    setTimeout(async () => {
                        await message.reply(`The music bot only works in a group with at least 10 participants. Please add ${11 - (await message.getChat()).participants.length} more people to the group`)
                        // this.messageCount++;
                        await botMessageIncrement(registeredBots[sessionName][0],sessionName)
                    }, 5000);
                }

                else {

                    await message.reply("Join the group to request for songs \n\nhttps://chat.whatsapp.com/F1l3b5zU8N652cm0gmUuUS")
                    // this.messageCount++;
                    await botMessageIncrement(registeredBots[sessionName][0],sessionName)


                }

            }




            if(userId === undefined ? false : range.includes(parseInt(userId.substring(0, userId.indexOf('@')).charAt(userId.substring(0, userId.indexOf('@')).length - 1)))){


                let options = ["1","2","3"]
                let isGroup = (await message.getChat()).isGroup

                if (message_body.startsWith("id")&& isGroup){

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

                                    await sendSong(data,message,registeredUsers,userID,this)
                                    // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")


                                } else {
                                    await message.reply("You have exceeded your daily limit...")

                                }

                            }).call(this) : await (async function () {

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

                                // await sendSong(data, message, registeredUsers, userID)
                                // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")
                                await sendSong(data, message, registeredUsers, userID,this)

                            }).call(this)







                        } else {
                            console.log("invalid request option entered")}




                    }
                    // this.messageCount++;
                    await botSongIncrement(registeredBots[sessionName][0],sessionName)


                }



                else if((message_body.startsWith("!menu") || message_body.startsWith("!help")) && (chat_id === song_group || chat_id === lyrics_group || chat_id === test_group)){
                    await message.reply("*Bot commands*\n\n🤖*!song* (eg !song rihanna diamonds)\n🤖*!lyrics* (eg !lyrics Maroon 5 sugar)\n🤖*!song-info* (eg !song-info eminem not afraid. Get information about a song. )\n\nNB: !song-info can be used to verify if a song exists to avoid requesting and downloading wrong song")
                    // this.messageCount++;
                    await botMessageIncrement(registeredBots[sessionName][0],sessionName)
                }


                else if (message_body.startsWith("!lyrics ") && message.body.length > 8 && (chat_id === lyrics_group || chat_id === test_group)){
                    await sendLyrics(message,this.client)
                    // this.messageCount++;
                    await botMessageIncrement(registeredBots[sessionName][0],sessionName)
                }
                else if (message_body.startsWith("!lyrics ") && message.body.length > 8 ){
                    await message.reply("Join the group to request for lyrics \n\nhttps://chat.whatsapp.com/DGeFgy7DRODIIgF68mojTP")
                    // this.messageCount++;
                    await botMessageIncrement(registeredBots[sessionName][0],sessionName)
                }

                else if ((message_body.startsWith("!song-info ") || message_body.startsWith("!song_info ")) && (message.body.length > 11) && (chat_id === lyrics_group || chat_id === song_group)) {
                    await sendSongInfo(message,this.client)
                    // this.messageCount++;
                    await botMessageIncrement(registeredBots[sessionName][0],sessionName)

                }

                else if (message_body.startsWith("!song ") && message.body.length > 6 && isGroup) {

                    if (chat_id === test_group  || chat_id === song_group) {

                        await searchSong(message,this.client)
                        await botMessageIncrement(registeredBots[sessionName][0],sessionName)
                        // this.messageCount++;
                        // await message.reply("The bot is undergoing maintenance. Contact the admin to offer support for the project 😊")

                    }




                }



                else if (message_body.startsWith("!album ") && message.body.length > 7 && isGroup) {



                    await message.reply("Album request is still in development...")
                    // this.messageCount++;
                    await botMessageIncrement(registeredBots[sessionName][0],sessionName)


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

    getMessageCount(){
        return this.messageCount
    }
    initialize() {
        // Initialize your client here if necessary
        this.client.initialize();
    }




}
// ~CHIECHIE🍃❤‍🔥's number

const bot1 = new Bot("8573",[0,1,2,4,5]);
// const bot2 = new Bot("9554",[3,5,6]);
const bot3 = new Bot("8660",[3,6,7,8,9]);





bot1.initialize();
// bot2.initialize();
bot3.initialize();



