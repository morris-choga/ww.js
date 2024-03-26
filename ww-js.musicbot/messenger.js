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
    else { await message.reply("oops! lyrics for this song are unavailable")}
}

const sendSong = async (message,registeredUsers,userID) => {

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
            if (e.code === 'ENOENT'){await message.reply("oops! this song seems to be unavailable")}
            console.log(`An error has occurred while sending media: ${e}`)
        }



    }
}

module.exports = { sendSong , sendLyrics};