const {MessageMedia} = require("whatsapp-web.js");
const moment = require('moment-timezone');
const schedule = require('node-schedule');
// const { sendSong} = require("./messenger");
const {fetchUsers, fetchBots, fetchHiphopDX,lastNewsUpdate, updateLastNewsTime} = require("./api");
const {sendNews} = require("./messenger");
const {hiphopDXNews} = require("./news");
let apiUrl = "http://127.0.0.1:5000";

let musicmaniaDB = "patNssNlywzCC848j.dd94531ca825456f8f30256635d6b92de93620e42f574bbc8821c1bb8caa0746"


let requestOptions = {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"video_id":"4OY4NefG4qY","album_id": "MPREb_LdaXvqUyYbO"}),
    redirect: 'follow'
};












(async function (){






    // schedule.scheduleJob("* * * * *",()=>{
    //     console.log("ran")
    // })



    await hiphopDXNews(this.client)
    





})()






