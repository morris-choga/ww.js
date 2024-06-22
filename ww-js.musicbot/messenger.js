const {MessageMedia} = require("whatsapp-web.js");
const {fetchUsers, userSongIncrement, botMessageIncrement, fetchBotMessages, botSongIncrement} = require("./api");
const fs = require("fs");

// let apiUrl = "http://127.0.0.1:5000";
let apiUrl = "http://api:5000";
let requestOptions = {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    // headersTimeout: 600000,
    body: {},
    redirect: 'follow'
};
let targetClossed = "Protocol error (Runtime.callFunctionOn)"

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
const searchSong =  async (message,client) => {

    requestOptions.body = JSON.stringify({"key": message.body.substring(6)})
    let songs = await fetch(`${apiUrl}/searchsong`, requestOptions)
        .then((response) => {

            if (response.ok) {
                return response.json()
            }
            return "Error"
        }).then((data) => {
            return data
        }).catch(error => console.log('an error has occurred searching for song with fetching https://api:5000/lyrics ', error))



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
                console.log(`Error sending song search message ${error}`)
                if (error.message.includes(targetClossed)) {
                    console.log("This is when the page need to be restarted")
                }


            }

        }, 1);

    } else{
        setTimeout(async ()=>{
            await message.reply("oops! This song seems to be unavailable\nuse !menu for help")
            console.log("An error has occurred while searching song: No object was received or the object was empty")

        }, 1);
    }


}
const searchAlbum = async (message,client)=>{


    requestOptions.body = JSON.stringify({"key": message.body.substring(7)})
    let albums = await fetch(`${apiUrl}/searchalbums`, requestOptions)
        .then((response) => {

            if (response.ok) {
                return response.json()
            }
            return "Error"
        }).then((data) => {
            return data
        }).catch(error => console.log('an error has occurred searching for album with fetching https://api:5000/searchalbums ', error))


    if (typeof albums === "object" && !Object.keys(albums).length == 0){
        let content = ""
        let options = ['1️⃣','2️⃣','3️⃣'];

        for (let i = 0; i< albums.length; i++){

            content += `*${options[i]}: ${albums[i].artist} - ${albums[i].title}*\n[${albums[i].year}~${albums[i].album_id}]\n\n`
        }
        content+="________________________________________\nReply this message with album number"
        setTimeout(async ()=>{

            try {
                // await message.reply(content)
                await client.sendMessage(message._data.from,content)


            } catch (error) {
                console.log(`Error sending album search message ${error}`)
                if (error.message.includes(targetClossed)) {
                    console.log("This is when the page need to be restarted")
                }


            }

        }, 1);

    } else{
        setTimeout(async ()=>{
            console.log("An error has occurred while searching album: No object was received or the object was empty")
            await message.reply("oops! This album seems to be unavailable\nuse !menu for help")
            // await client.sendMessage(message._data.from,"oops! This album seems to be unavailable\nuse !menu for help",{ quotedMessageId:message.id._serialized})

        }, 1);
    }

}
const searchVideo = async (message,client)=>{


    requestOptions.body = JSON.stringify({"key": message.body.substring(7)})
    let albums = await fetch(`${apiUrl}/searchvideos`, requestOptions)
        .then((response) => {

            if (response.ok) {
                return response.json()
            }
            return "Error"
        }).then((data) => {
            return data
        }).catch(error => console.log('an error has occurred searching for video with fetching https://api:5000/searchvideos ', error))


    if (typeof albums === "object" && !Object.keys(albums).length == 0){
        let content = ""
        let options = ['1️⃣','2️⃣','3️⃣'];

        for (let i = 0; i< albums.length; i++){

            content += `*${options[i]}: ${albums[i].author} - ${albums[i].title}*\n[${albums[i].video_id}]\n\n`
        }
        content+="________________________________________\nReply this message with video number"
        setTimeout(async ()=>{

            try {
                // await message.reply(content)
                await client.sendMessage(message._data.from,content)


            } catch (error) {
                console.log(`Error sending video search message ${error}`)
                if (error.message.includes(targetClossed)) {
                    console.log("This is when the page need to be restarted")
                }


            }

        }, 1);

    } else{
        setTimeout(async ()=>{
            console.log("An error has occurred while searching video: No object was received or the object was empty")
            await message.reply("oops! This vodeo seems to be unavailable\nuse !menu for help")
            // await client.sendMessage(message._data.from,"oops! This album seems to be unavailable\nuse !menu for help",{ quotedMessageId:message.id._serialized})

        }, 1);
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
        }).catch(error => console.log('an error has occurred while searching for lyrics with fetching https://api:5000/lyrics ', error))


    if (typeof lyrics === "object" && !Object.keys(lyrics).length == 0){
        let picture = await MessageMedia.fromUrl(lyrics["album_art"], { unsafeMime: true })


        setTimeout(async ()=>{

            try {
                await client.sendMessage(message._data.from,picture,{caption: lyrics["lyrics"]})
                // await client.sendMessage(message._data.from,picture,{caption: lyrics["lyrics"]})
            } catch (error) {
                console.log(`Error sending lyrics message ${error}`)
                if (error.message === 'Protocol error (Runtime.callFunctionOn): Promise was collected') {
                    console.log("This is when the page need to be restarted")
                }

            }

        }, 1);




    }
    else {
        setTimeout(async ()=>{

            try {
                // await client.sendMessage(message._data.from,"unavailable")
                await message.reply("oops! lyrics for this song are unavailable\nuse !menu for help")


            } catch (error) {
                console.log(`Error sending lyrics error message ${error}`)
                if (error.message.includes(targetClossed)) {
                    console.log("This is when the page need to be restarted")
                }

            }

        }, 1);



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
                console.log(`Error sending song info message ${error}`)
                if (error.message.includes(targetClossed)) {
                    console.log("This is when the page need to be restarted")
                }
            }

        }, 1);


    }
    else {
        setTimeout(async ()=>{

            await message.reply("oops! info for this song are unavailable.\nUse !menu for help")
            console.log("An error has occurred while searching song info: No object was received or the object was empty")

        }, 1);

    }

}
const sendSong = async (metadata,message,registeredUsers,userID,client,botClass) => {

    let data = {"video_id": metadata.video_id}
    metadata.album_id === "" ? "" : data["album_id"] = metadata.album_id

    requestOptions.body = JSON.stringify(data)

    let songPath = await fetch(`${apiUrl}/getsong`, requestOptions)
        .then((response) => {
            if (response.status===501){

                return {"Error": "oops... song too long"}
            }

            else if (response.status===502){
                return {"Error": "oops! This song seems to be unavailable"}

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
        }).catch(error => console.log('an error has occurred while fetching to send song with  https://api:5000 ', error))

    if (typeof songPath !== "object") {
        setTimeout(async ()=>{
            try {
                let song = MessageMedia.fromFilePath(songPath)
                // song.mimetype = ""

                setTimeout(async ()=>{

                    try {

                        // await client.client.sendMessage(message._data.from, song,{ sendMediaAsDocument: true ,quotedMessageId:message.id._serialized})
                        await client.client.sendMessage(message._data.from, song,{ quotedMessageId:message.id._serialized})
                        await userSongIncrement(registeredUsers[userID][0],userID);
                        await botSongIncrement(botClass.registeredBots[client.sessionName][0],client.sessionName)

                        console.log(`${message._data.notifyName} received song`);
                        // await message.reply(song)
                    } catch (error) {
                        console.log(`Error sending song message ${error}`)
                        if (error.message.includes(targetClossed)) {
                            console.log("This is when the page need to be restarted")
                        }

                    }

                }, 1);




                fs.unlink(songPath, (err) => {
                    if (err) {
                        console.log(`Error deleting file: ${err.message}`);
                    }
                });





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


        }, 1);






    }
    else if (typeof songPath === "object"){

        setTimeout(async ()=>{
            try {
                await message.reply(songPath.Error)
            } catch (error) {
                if (error.message.include(targetClossed)) {
                    console.log("This is when the page need to be restarted")
                }
                console.log(`Error sending message ${error}`)

            }


        }, 1);
        console.log("An error has occurred while searching song info: No object was received or the object was empty")
    }
}
const sendVideo = async (metadata,message,registeredUsers,userID,client,botClass) => {


    let data = {"video_id": metadata.video_id}


    requestOptions.body = JSON.stringify(data)

    let videoPath = await fetch(`${apiUrl}/getvideo`, requestOptions)
        .then((response) => {
            if (response.status===501){

                return {"Error": "oops... song too long"}
            }

            else if (response.status===502){
                return {"Error": "oops! This song seems to be unavailable"}

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
                // let apiResponse = response.replace("app", "app")

                return apiResponse
            }
        }).catch(error => console.log('an error has occurred while fetching to send video with  https://api:5000 ', error))

    if (typeof videoPath !== "object") {
        setTimeout(async ()=>{
            try {
                let video = MessageMedia.fromFilePath(videoPath)
                // song.mimetype = ""


                setTimeout(async ()=>{

                    try {

                        // await client.client.sendMessage(message._data.from, song,{ sendMediaAsDocument: true ,quotedMessageId:message.id._serialized})
                        await client.client.sendMessage(message._data.from, video,{ quotedMessageId:message.id._serialized})
                        // await userSongIncrement(registeredUsers[userID][0],userID);
                        // await botSongIncrement(botClass.registeredBots[client.sessionName][0],client.sessionName)

                        console.log(`${message._data.notifyName} received video`);
                        // await message.reply(song)
                    } catch (error) {
                        console.log(`Error sending video message ${error}`)
                        if (error.message.includes(targetClossed)) {
                            process.exit(0)
                        }

                    }

                }, 1);




                fs.unlink(videoPath, (err) => {
                    if (err) {
                        console.log(`Error deleting file: ${err.message}`);
                    }
                });





            } catch (e) {
                if (e.code === 'ENOENT'){
                    try {
                        await message.reply("oops! this video seems to be unavailable\nuse !menu for help")
                    } catch (error) {
                        console.log(`Error sending message ${error}`)

                    }

                }

                console.log(`An error has occurred while sending media: ${e}`)
            }


        }, 1);






    }
    else if (typeof videoPath === "object"){

        setTimeout(async ()=>{
            try {
                await message.reply(videoPath.Error)
            } catch (error) {
                if (error.message.include(targetClossed)) {
                    console.log("This is when the page need to be restarted")
                }
                console.log(`Error sending message ${error}`)

            }


        }, 1);
        console.log("An error has occurred while searching song info: No object was received or the object was empty")
    }
}
const sendAlbum = async (metadata,message,registeredUsers,userID,client,botClass)=>{


    let options = {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        // headersTimeout: 600000,
        body: {},
        redirect: 'follow'
    };
    let data = {"album_id": metadata.album_id}


    options.body = JSON.stringify(data)

    let albumPath = await fetch(`${apiUrl}/getalbum`, options)
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
        }).catch(error => console.log('an error has occurred while fetching to send album with  https://api:5000 ', error))


    try {
        let status;
        let count = 1;

        do {
            await new Promise(resolve => setTimeout(resolve, 30000));  // Wait for 30 seconds

            let response = await fetch(`${apiUrl}/get_album_status`,options)

            // status = await response.json();
            status = await response.json();

            console.log(`Album retrying: ${status.status} ${data.album_id}|${count}`);
            count++
        } while (status.status !== 200 && count <= 10);
        // } while (status.status !== 200 && count <= 100);

        let album = MessageMedia.fromFilePath(`/usr/src/app/media/albums/${status.location}.zip`)
        await client.client.sendMessage(message._data.from, album,{ quotedMessageId:message.id._serialized})
    }
    catch (error){
        console.error('Error sending album:', error);
        if (error.message.includes(targetClossed)) {
            process.exit(0);
        }
    }







    // if (typeof albumPath !== "object") {
    //     setTimeout(async ()=>{
    //         try {
    //             let album = MessageMedia.fromFilePath(albumPath)
    //             // song.mimetype = ""
    //
    //             setTimeout(async ()=>{
    //
    //                 try {
    //
    //                     // await client.client.sendMessage(message._data.from, song,{ sendMediaAsDocument: true ,quotedMessageId:message.id._serialized})
    //                     await client.client.sendMessage(message._data.from, album,{ quotedMessageId:message.id._serialized})
    //                     await userSongIncrement(registeredUsers[userID][0],userID);
    //                     await botSongIncrement(botClass.registeredBots[client.sessionName][0],client.sessionName)
    //
    //                     console.log(`${message._data.notifyName} received album`);
    //                     // await message.reply(song)
    //                 } catch (error) {
    //                     console.log(`Error sending album message ${error}`)
    //                     if (error.message.includes(targetClossed)) {
    //                         console.log("This is when the page need to be restarted")
    //                     }
    //
    //                 }
    //
    //             }, 1);
    //
    //
    //
    //
    //             fs.unlink(albumPath, (err) => {
    //                 if (err) {
    //                     console.log(`Error deleting file: ${err.message}`);
    //                 }
    //             });
    //
    //
    //
    //
    //
    //         } catch (e) {
    //             if (e.code === 'ENOENT'){
    //                 try {
    //                     await message.reply("oops! this album seems to be unavailable\nuse !menu for help")
    //                 } catch (error) {
    //                     await message.reply("oops! this song seems to be unavailable\nuse !menu for help")
    //                     console.log(`Error sending message ${error}`)
    //
    //                 }
    //
    //             }
    //
    //             console.log(`An error has occurred while sending media: ${e}`)
    //         }
    //
    //
    //     }, 1);
    //
    //
    //
    //
    //
    //
    // }
    // else if (typeof albumPath === "object"){
    //
    //     setTimeout(async ()=>{
    //         try {
    //             await message.reply(albumPath.Error)
    //         } catch (error) {
    //             if (error.message.include(targetClossed)) {
    //                 console.log("This is when the page need to be restarted")
    //             }
    //             console.log(`Error sending message ${error}`)
    //
    //         }
    //
    //
    //     }, 1);
    //     console.log("An error has occurred while searching album info: No object was received or the object was empty")
    // }


}

const sendServerRestart = async (botClass,client)=>{
    await client.sendMessage(botClass.test_group+"@g.us","BOT PERIODICALLY RESTARTING")

     setTimeout(async ()=>{


            try {
                await client.sendMessage(botClass.lyrics_group+"@g.us","BOT PERIODICALLY RESTARTING")
            } catch (error) {
                console.log(`Error sending Server restart message ${error}`)
                if (error.message === 'Protocol error (Runtime.callFunctionOn): Promise was collected') {
                    console.log("This is when the page need to be restarted")
                }

            }

        }, 8000);

     setTimeout(async ()=>{


            try {
                 await client.sendMessage(botClass.song_group+"@g.us","BOT PERIODICALLY RESTARTING")
            } catch (error) {
                console.log(`Error sending Server restart message ${error}`)
                if (error.message === 'Protocol error (Runtime.callFunctionOn): Promise was collected') {
                    console.log("This is when the page need to be restarted")
                }

            }

        }, 4000);






}

const getPlaylist = async (message)=>{
    requestOptions.body = JSON.stringify({"playlist": message.body.substring(10)})

    let playlist = await fetch(`${apiUrl}/playlist`, requestOptions)
        .then((response) => {

            if (response.ok) {
                return response.json()
            }
            return "Error"
        }).then((data) => {
            return data
        }).catch(error => console.log('an error has occurred while getting playlist https://api:5000/searchalbums ', error))

    console.log(playlist)

}



module.exports = { sendSong, sendAlbum , sendVideo, sendLyrics, sendSongInfo, searchSong, searchAlbum, searchVideo, sendServerRestart, getPlaylist};