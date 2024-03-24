
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
        airtableHeaders,
        body: JSON.stringify(userInfo)
    }).then((a)=>{
        console.log(a.text)



    }).catch(error=>{
        console.log(`An error occurred while addingUser https://api.airtable.com: ${error}`)
    })

}

const fetchUsers = async () => {

    let result = await fetch(airtableUrl,{
        headers: airtableHeaders,
    }).then((response)=>{
        let body = response.json()

        return body
    }).then((response)=>{

        let userInfo = {}
        let users = response.records


        Object.keys(users).forEach((key) => {
            userInfo[users[key].fields.userID] = [users[key].id,users[key].fields["#songs"]]

        })


        return userInfo

    }).catch(error=>{
        console.log(`An error occurred while fetching https://api.airtable.com: ${error}`)
    });

    return result

}

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




module.exports = { fetchCountry , fetchUsers , addUser , songIncrement};




