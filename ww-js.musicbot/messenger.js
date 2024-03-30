const {MessageMedia} = require("whatsapp-web.js");
const {fetchUsers, songIncrement} = require("./api");
const fs = require("fs");

let apiUrl = "http://api:5000";
let requestOptions = {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: {},
    redirect: 'follow'
};

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



    if (!Object.keys(songs).length == 0){
        let content = ""

        for (let i = 0; i< songs.length; i++){

            content += `*${i+1}: ${songs[i].artist} - ${songs[i].title}*\n[${songs[i].video_id}~${songs[i].album_id !== undefined ? songs[i].album_id :''}]\n\n`
        }
        content+="Reply this message with song number"
        setTimeout(async ()=>{
            await message.reply(content)
        }, 3000);

    }


}
const sendLyrics =  async (message) => {
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


    if (!Object.keys(lyrics).length == 0){
        let picture = await MessageMedia.fromUrl(lyrics["album_art"], { unsafeMime: true })

        setTimeout(async ()=>{
            await message.reply(picture)
        }, 3000);

        setTimeout(async ()=>{

            await message.reply(lyrics["lyrics"])


        }, 6000);






    }
    else { await message.reply("oops! lyrics for this song are unavailable\nuse !menu for help")}
}

const sendSongInfo =  async (message) => {

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


    if (!Object.keys(songInfo).length == 0){
        let picture = await MessageMedia.fromUrl(songInfo["album_art"], { unsafeMime: true })

        setTimeout(async ()=>{

            (await message.getChat()).sendMessage(picture,{caption: `*Title: ${songInfo.title}*\n*Artist: ${songInfo.artist}*\n*Album: ${songInfo.album}*\n*Year: ${songInfo.year}*`})

            // await message.reply(picture, {caption: `Title: ${songInfo.title}\nArtist: ${songInfo.artist}\nAlbum: ${songInfo.album}\nYear: ${songInfo.year}`})
        }, 3000);


    }
    else { await message.reply("oops! info for this song are unavailable")}
}

const sendSong = async (metadata,message,registeredUsers,userID) => {

    let data = {"video_id": metadata.video_id}
    metadata.album_id === "" ? "" : data["album_id"] = metadata.album_id

    requestOptions.body = JSON.stringify(data)

    let songPath = await fetch(`${apiUrl}/getsong`, requestOptions)
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
            let users = await fetchUsers();
            let songsNum = parseInt(users[userID][1]) + 1;
            await songIncrement(registeredUsers[userID][0], songsNum)


            fs.unlink(songPath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${err.message}`);
                } else {
                    console.log(`${message.body.toLocaleLowerCase()} sent`);

                }
            });


        } catch (e) {
            if (e.code === 'ENOENT'){await message.reply("oops! this song seems to be unavailable\nuse !menu for help")}
            console.log(`An error has occurred while sending media: ${e}`)
        }



    }
}

module.exports = { sendSong , sendLyrics, sendSongInfo, searchSong};