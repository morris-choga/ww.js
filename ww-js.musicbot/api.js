const moment = require("moment-timezone");

let ww_jsDB = "patg3nVCYWdoRthJn.56198a4363e0982055386462c75e70566e51bc2b4bac7cd605b6996a87b51521";
let musicmaniaDB = "patNssNlywzCC848j.dd94531ca825456f8f30256635d6b92de93620e42f574bbc8821c1bb8caa0746"
let airtableUsers = "https://api.airtable.com/v0/appAcgdXpcBoOwP5X/tblk48SN08xOlGQz9"
let airtableBots = "https://api.airtable.com/v0/appAcgdXpcBoOwP5X/tbljbHR3avdBQob3F"
let lastNewsUpdateUrl = "https://api.airtable.com/v0/appxa0XpncVdHR2FT/tblBqXCofrXYsNMTY/recO1lKlb3WpFYto6"

const airtableHeaders = {
    "Authorization": `Bearer ${ww_jsDB}`,
    'Content-Type': 'application/json',

}


const fetchCountry = async (num) => {
    let result = await fetch(`https://lookups.twilio.com/v2/PhoneNumbers/+${num}`, {
        headers: {
            'Authorization': "Basic QUMwYTEyNDRhYzA4Y2Q3Nzc1ZTFhZjhmZjg2ODk2OTNiYjpmMjNhYjU1NTJkM2NiNjUxZjc2ZDhiODhhYjM4YmU4Yg==",
            'Content-Type': 'application/json',
        },
    }).then((response)=>{
        let body = response.json()

        return body}).then((data)=>{
        let country = data.country_code
        return country
    }).catch(error=>{
        console.log(`An error occurred while fetching country: ${error}`)
    })
    return result
}


const addUser = async (userInfo) => {

    let a = await fetch(airtableUsers, {
        method: 'POST',
        headers: airtableHeaders,
        body: JSON.stringify(userInfo)
    }).catch(error=>{
        console.log(`An error occurred while addingUser https://api.airtable.com: ${error}`)
    })

}

const fetchUserRecords = async (url,offset)=>{
    let result = await fetch(`${url}?offset=${offset}`,{
        headers: airtableHeaders,
    }).then((response)=>{
        let body =  response.json()
        return body
    }).then((records)=>{

        return records
    }).catch(error=>{
            console.log(`An error occurred while fetching airtable user records: ${error}`)
        });

    return result;
}

const fetchUsers = async () => {


    let allUserRecords = [];
    let userInfo = {}
    let records = await fetchUserRecords(airtableUsers,0);


    let count = 0;
    while (count < 6 && typeof records === "undefined"){
        records = await fetchUserRecords(airtableUsers,0);
        console.log("fetchUserRecords returned undefined... retrying")
        count++

    }

    while(records.offset){
        allUserRecords = allUserRecords.concat(records.records)
        records = await fetchUserRecords(airtableUsers,records.offset);

    }
    allUserRecords = allUserRecords.concat(records.records)



    Object.keys(allUserRecords).forEach((key) => {

        if (allUserRecords[key]!==undefined){
            userInfo[allUserRecords[key].fields.userID] = [allUserRecords[key].id,allUserRecords[key].fields["#songs"]]
        }



    })



    return userInfo




}
const userSongIncrement = async (id,userID) => {
    let users = await fetchUsers();
    let songsNum = parseInt(users[userID][1]) + 1;

    let addSong = {
        "fields": {"#songs":songsNum}
    }


    let result = await fetch(`${airtableUsers}/${id}`, {
        method: 'PATCH',
        headers: airtableHeaders,
        body: JSON.stringify(addSong)
    })

}
const botSongIncrement = async (id , botID) =>{
    let bots = await fetchBots();
    let songsNum = parseInt(bots[botID][2]) + 1;
    let messagesNum = parseInt(bots[botID][1]) + 1;

    let addSong = {
        "fields": {"#songs":songsNum, "messages":messagesNum}
    }


    let result = await fetch(`${airtableUsers}/${id}`, {
        method: 'PATCH',
        headers: airtableHeaders,
        body: JSON.stringify(addSong)
    })
}
const botMessageIncrement = async (id,botID) =>{
    let bots = await fetchBots();
    let messagesNum = parseInt(bots[botID][1]) + 1;

    let addMessage = {
        "fields": {"messages":messagesNum}
    }


    let result = await fetch(`${airtableUsers}/${id}`, {
        method: 'PATCH',
        headers: airtableHeaders,
        body: JSON.stringify(addMessage)
    })
}

const fetchBots = async () => {


    let allBotsRecords = [];
    let botsInfo = {}
    let records = await fetchUserRecords(airtableBots,0);


    // while(records.offset){
    //     allBotsRecords = allBotsRecords.concat(records.records)
    //     records = await fetchUserRecords(airtableBots,records.offset);
    //
    // }
    let count = 0;
    while (count < 6 && typeof records === "undefined"){
        records = await fetchUserRecords(airtableBots,0)
        console.log("fetchUserRecords returned undefined... retrying")
        count++

    }

    allBotsRecords = allBotsRecords.concat(records.records);




    Object.keys(allBotsRecords).forEach((key) => {
        if (allBotsRecords[key]!==undefined) {
            botsInfo[allBotsRecords[key].fields.botID] = [allBotsRecords[key].id, allBotsRecords[key].fields["messages"], allBotsRecords[key].fields["#songs"]]
        }

    })

    return botsInfo




}

const fetchHiphopDX = async () =>{

    let result = await fetch("http://66.181.46.3:8080/hiphopdx",{
        method: 'GET'
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    }).then((body)=>{

        return  body.json()
    }).then((res)=>{

        return res;
    }).catch(error=>{
        console.log(`An error occurred while fetching hiphopdx news: ${error}`)
    });


    return result;

}

const lastNewsUpdate = async ()=>{

    let result = await fetch(lastNewsUpdateUrl,{
        headers: {
            "Authorization": `Bearer ${musicmaniaDB}`,
            'Content-Type': 'application/json',
        },
    }).then((response)=>{
        let body =  response.json()

        return body
    }).catch(error=>{
        console.log(`An error occurred while fetching lastNews update: ${error}`)
    });

    return result.fields.Update

}

const updateLastNewsTime = async ()=>{

    const isoDate = new Date().toISOString();
    const timezone = "America/Los_Angeles"; // For UTC-7 (PDT during daylight saving)

    const americanDate = moment(isoDate).tz(timezone).format('YYYY-MM-DDTHH:mm:ssZ');

    let update = {
        "fields": {"Update":americanDate}
    }

    let result = await fetch(lastNewsUpdateUrl,{
        method: 'PATCH',
        headers: {
            "Authorization": `Bearer ${musicmaniaDB}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(update)
    }).then((response)=>{
        let body =  response.json()

        return body
    }).catch(error=>{
        console.log(`An error occurred while updating last news: ${error}`)
    });


return result


}


module.exports = { fetchCountry , fetchUsers , addUser , userSongIncrement, botSongIncrement, botMessageIncrement, fetchBots, fetchHiphopDX, lastNewsUpdate,updateLastNewsTime};




