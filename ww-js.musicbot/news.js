const {fetchHiphopDX, lastNewsUpdate, updateLastNewsTime} = require("./api");
const {sendNews} = require("./messenger");
const log = require("qrcode-terminal");


const hiphopDXNews = async (client) =>{

    let news = await fetchHiphopDX().catch((error)=>{

        console.log(`Error: ${error}`)
        return "2024-07-09T08:00:07-07:00"
    })

    const promises = Object.keys(news).map(async (key) => {


        if (news[key][1] > await lastNewsUpdate()){
            await sendNews(client,key,news[key][2],news[key][3])
        }
        else {

            console.log("Old news")
        }


    })


    Promise.all(promises).then(async ()=>{
        await updateLastNewsTime()

    }).catch((error) => {

        console.error("Error occurred hmm:", error);
    })
}


module.exports = { hiphopDXNews};