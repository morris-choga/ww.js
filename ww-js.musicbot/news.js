const {fetchHiphopDX, lastNewsUpdate, updateLastNewsTime} = require("./api");
const {sendNews} = require("./messenger");


const hiphopDXNews = async (client,message) =>{

    let news = await fetchHiphopDX()

    const promises = Object.keys(news).map(async (key) => {


        if (news[key][1] > await lastNewsUpdate()){
            await sendNews(client,key,news[key][2],news[key][3],message)
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