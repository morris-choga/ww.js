
let apiKey = "patg3nVCYWdoRthJn.56198a4363e0982055386462c75e70566e51bc2b4bac7cd605b6996a87b51521";
let airtableUrl = "https://api.airtable.com/v0/appAcgdXpcBoOwP5X/tblk48SN08xOlGQz9"
const airtableHeaders = {
    "Authorization": `Bearer ${apiKey}`,
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

    let a = await fetch(airtableUrl, {
        method: 'POST',
        headers: airtableHeaders,
        body: JSON.stringify(userInfo)
    }).catch(error=>{
        console.log(`An error occurred while addingUser https://api.airtable.com: ${error}`)
    })

}

const fetchUserRecords = async (offset)=>{
    let result = await fetch(`${airtableUrl}?offset=${offset}`,{
        headers: airtableHeaders,
    }).then((response)=>{
        let body =  response.json()
        return body
    }).then((records)=>{

        return records
    }).catch(error=>{
            console.log(`An error occurred while fetching https://api.airtable.com: ${error}`)
        });

    return result;
}

const fetchUsers = async () => {


    let allUserRecords = [];
    let userInfo = {}
    let records = await fetchUserRecords(0);


    while(records.offset){
        allUserRecords = allUserRecords.concat(records.records)
        records = await fetchUserRecords(records.offset);

    }
    allUserRecords = allUserRecords.concat(records.records)



    Object.keys(allUserRecords).forEach((key) => {

            userInfo[allUserRecords[key].fields.userID] = [allUserRecords[key].id,allUserRecords[key].fields["#songs"]]


    })


    return userInfo




}
// const fetchBotMessages = async () => {
//
//     let result = await fetch(airtableUrl,{
//         headers: airtableHeaders,
//     }).then((response)=>{
//         let body = response.json()
//
//         return body
//     }).then((response)=>{
//
//         let botMessageInfo = {}
//         let users = response.records
//
//
//         Object.keys(users).forEach((key) => {
//             botMessageInfo[users[key].fields.userID] = [users[key].id,users[key].fields["botMessagesReceived"]]
//
//         })
//
//
//         return botMessageInfo
//
//     }).catch(error=>{
//         console.log(`An error occurred while fetching https://api.airtable.com: ${error}`)
//     });
//
//     return result
//
// }

const songIncrement = async (id , songsNum) => {

    let addSong = {
        "fields": {"#songs":songsNum}
    }


    let result = await fetch(`${airtableUrl}/${id}`, {
        method: 'PATCH',
        headers: airtableHeaders,
        body: JSON.stringify(addSong)
    })

}

// const botMessageIncrement = async (id,botMessagesNum) => {
//     let botMessagesObject = {
//         "fields": {"#botMessagesReceived":botMessagesNum}
//     }
//
//     let result = await fetch(`${airtableUrl}/${id}`, {
//         method: 'PATCH',
//         headers: airtableHeaders,
//         body: JSON.stringify(botMessagesObject)
//     })
//
// }



// (async function (){
//     addUser({
//         "records": [{"fields":{
//                 "userID": "","userName": "","userCountry": "","#songs": 0
//             }
//         }]})
// })()


module.exports = { fetchCountry , fetchUsers , addUser , songIncrement};




