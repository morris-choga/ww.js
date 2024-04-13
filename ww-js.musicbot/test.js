const {MessageMedia} = require("whatsapp-web.js");
const { sendSong} = require("./messenger");
const {fetchUsers, songIncrement} = require("./api");
let apiUrl = "http://127.0.0.1:5000";
let requestOptions = {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"video_id":"4OY4NefG4qY","album_id": "MPREb_LdaXvqUyYbO"}),
    redirect: 'follow'
};














(async function (){
//
//
//     // let a = [{"a":0},{"b":2}]
//     // //
//     // //
//     // let tempRegisteredUsers = [{"c":3},{"d":4}];
//     //
//     // a = a.concat(tempRegisteredUsers)
//     // console.log(a)
//
//
//     // let registeredUsers = {"morris":26, "munashe":23}
    let registeredUsers = await fetchUsers()

    let a = []

    Object.keys(registeredUsers).forEach((key) => {
        a.push(key)


    })
    // console.log(a.length)


    // for (let a = 0; a < keys.length; a++){
    //
    //     tempRegisteredUsers.push(keys[a])
    //
    // }
//     // console.log(tempRegisteredUsers.length)
//
//
//
//
})()






