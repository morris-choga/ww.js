const {MessageMedia} = require("whatsapp-web.js");
const {fetchUsers, userSongIncrement, botMessageIncrement, fetchBotMessages} = require("./api");
const fs = require("fs");

// let apiUrl = "http://127.0.0.1:5000";
let apiUrl = "http://api:5000";
let requestOptions = {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: {},
    redirect: 'follow'
};

// const searchSong =  async (message) => {
//
//     requestOptions.body = JSON.stringify({"key": message.body.substring(6)})
//     let songs = await fetch(`${apiUrl}/searchsong`, requestOptions)
//         .then((response) => {
//
//             if (response.ok) {
//                 return response.json()
//             }
//             return "Error"
//         }).then((data) => {
//             return data
//         }).catch(error => console.log('an error has occurred while fetching https://api:5000/lyrics ', error))
//
//
//
//     if (typeof songs === "object" && !Object.keys(songs).length == 0){
//         let content = ""
//         let options = ['1️⃣','2️⃣','3️⃣'];
//
//         for (let i = 0; i< songs.length; i++){
//
//             content += `*${options[i]}: ${songs[i].artist} - ${songs[i].title}${songs[i].album_id !== undefined ? "" : "(converted from video)"}*\n[${songs[i].video_id}~${songs[i].album_id !== undefined ? songs[i].album_id :''}]\n\n`
//         }
//         content+="________________________________________\nReply this message with song number"
//         setTimeout(async ()=>{
//
//             try {
//                 await message.reply(content)
//             } catch (error) {
//                 console.log(`Error sending message ${error}`)
//
//             }
//
//         }, 10000);
//
//     } else{
//         setTimeout(async ()=>{
//             console.log("An error has occurred while searching song: No object was received or the object was empty")
//
//         }, 10000);
//     }
//
//
// }
const searchSong =  async (message) => {

    requestOptions.body = JSON.stringify({"key": message.body.substring(6)})
    let songs = await fetch(`${apiUrl}/searchsong`, requestOptions)
        .then((response) => {

            if (response.ok) {
                return response.json()
            }
            return "Error"
        }).then((data) => {
            return data
        }).catch(error => console.log('an error has occurred while fetching https://api:5000/lyrics ', error))



    if (typeof songs === "object" && !Object.keys(songs).length == 0){
        let content = ""
        let options = ['1️⃣','2️⃣','3️⃣'];

        for (let i = 0; i< songs.length; i++){

            content += `*${options[i]}: ${songs[i].artist} - ${songs[i].title}${songs[i].album_id !== undefined ? "" : "(converted from video)"}*\n[${songs[i].video_id}~${songs[i].album_id !== undefined ? songs[i].album_id :''}]\n\n`
        }
        content+="________________________________________\nReply this message with song number"
        setTimeout(async ()=>{

            try {
                // await message.reply(content)
                await client.sendMessage(message._data.from,content)


            } catch (error) {
                console.log(`Error sending message ${error}`)

            }

        }, 10000);

    } else{
        setTimeout(async ()=>{
            console.log("An error has occurred while searching song: No object was received or the object was empty")

        }, 10000);
    }


}
const sendLyrics =  async (message,client) => {
    requestOptions.body = JSON.stringify({"key": message.body.substring(8)})
    let lyrics = await fetch(`${apiUrl}/lyrics`, requestOptions)
        .then((response) => {


            if (response.ok) {
                return response.json()
            }
            return "Error"
        }).then((data) => {
            return data
        }).catch(error => console.log('an error has occurred while fetching https://api:5000/lyrics ', error))


    if (typeof lyrics === "object" && !Object.keys(lyrics).length == 0){
        let picture = await MessageMedia.fromUrl(lyrics["album_art"], { unsafeMime: true })


        setTimeout(async ()=>{

            try {
                // await client.sendMessage(message._data.from,picture,{caption: lyrics["lyrics"],quotedMessageId:message.id._serialized})
                await client.sendMessage(message._data.from,picture,{caption: lyrics["lyrics"]})
            } catch (error) {
                console.log(`Error sending message ${error}`)

            }

        }, 10000);




    }
    else {
        setTimeout(async ()=>{

            try {
                // await client.sendMessage(message._data.from,"unavailable")
                await message.reply("oops! lyrics for this song are unavailable\nuse !menu for help")


            } catch (error) {
                console.log(`Error sending message ${error}`)

            }

        }, 10000);



        console.log("An error has occurred while searching lyrics: No object was received or the object was empty")
    }
}
const sendSongInfo =  async (message,client) => {

    requestOptions.body = JSON.stringify({"key": message.body.substring(11)})
    let songInfo = await fetch(`${apiUrl}/getsonginfo`, requestOptions)
        .then((response) => {


            if (response.ok) {
                return response.json()
            }
            return "Error"
        }).then((data) => {
            return data
        }).catch(error => console.log('an error has occurred while fetching https://api:5000/getsonginfo', error))


    if (typeof songInfo === "object" && !Object.keys(songInfo).length == 0){
        let picture = await MessageMedia.fromUrl(songInfo["album_art"], { unsafeMime: true })


        setTimeout(async ()=>{
            try {
                await client.sendMessage(message._data.from,picture,{caption: `*Title: ${songInfo.title}*\n*Artist: ${songInfo.artist}*\n*Album: ${songInfo.album}*\n*Year: ${songInfo.year}*`})

            } catch (error) {
                console.log(`Error sending message ${error}`)
            }

        }, 10000);


    }
    else {
        setTimeout(async ()=>{

            await message.reply("oops! info for this song are unavailable.\nUse !menu for help")
            console.log("An error has occurred while searching song info: No object was received or the object was empty")
        }, 10000);

    }

}
const sendSong = async (metadata,message,registeredUsers,userID) => {

    let data = {"video_id": metadata.video_id}
    metadata.album_id === "" ? "" : data["album_id"] = metadata.album_id

    requestOptions.body = JSON.stringify(data)

    let songPath = await fetch(`${apiUrl}/getsong`, requestOptions)
        .then((response) => {
            if (response.status===501){
                return {"Error": "oops... song too long"}
            }
            else{
                if (response.ok) {
                    return response.text()
                }
            }

        }).then((data) => {
            if (typeof data === "object"){
                return data
            }
            else {
                let response = data
                let apiResponse = response.replace("api", "app")
                return apiResponse
            }
        }).catch(error => console.log('an error has occurred while fetching https://api:5000 ', error))

    if (typeof songPath !== "object") {
        setTimeout(async ()=>{
            try {
                let song = MessageMedia.fromFilePath(songPath)

                setTimeout(async ()=>{



                }, 10000);

                try {
                    await client.sendMessage(message._data.from,song)
                    // await message.reply(song)
                } catch (error) {
                    console.log(`Error sending message ${error}`)

                }

                fs.unlink(songPath, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${err.message}`);
                    } else {
                        console.log(`${message._data.notifyName} received song`);

                    }
                });

                await userSongIncrement(registeredUsers[userID][0],userID)



            } catch (e) {
                if (e.code === 'ENOENT'){
                    try {
                        await message.reply("oops! this song seems to be unavailable\nuse !menu for help")
                    } catch (error) {
                        console.log(`Error sending message ${error}`)

                    }

                }

                console.log(`An error has occurred while sending media: ${e}`)
            }


        }, 10000);






    }
    else if (typeof songPath === "object"){

        setTimeout(async ()=>{
            try {
                await message.reply(songPath.Error)
            } catch (error) {
                console.log(`Error sending message ${error}`)

            }


        }, 10000);
        console.log("An error has occurred while searching song info: No object was received or the object was empty")
    }
}



module.exports = { sendSong , sendLyrics, sendSongInfo, searchSong};