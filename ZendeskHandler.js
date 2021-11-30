const https = require("https");
require('dotenv').config()
const SUBD = process.env.SUBD


/*
Module that handles calls to the Zendesk API
*/

/*
-Get list of all tickets 
    https://zccdanielorbach.zendesk.com/api/v2/incremental/tickets?start_time=0

    using cursor:
    https://zccdanielorbach.zendesk.com/api/v2/incremental/tickets/cursor.json?start_time=0
    --If there are more to see it will inform us
-Get info for individual ticket
    https://zccdanielorbach.zendesk.com/api/v2/tickets/91.json
    91 is the ticket id


-Get User Info
    https://zccdanielorbach.zendesk.com/api/v2/users/0.json
    Where 0 is the id
    return 404 when no user is found 


*/


/*
    Grabs all tickets for a Zendesk account, takes paging into account 

*/
async function getAllTickets(){
    //Return Value
    const val = {
        error : "none",
        tickets : [], 
    }
    const options =  { headers : { 
        'Authorization': 'Basic ' + Buffer.from(process.env.ZEN_USER + ':' + process.env.ZEN_PASS).toString('base64'),
    }};
    let nextUrl = `https://${SUBD}.zendesk.com/api/v2/incremental/tickets/cursor.json?start_time=0`;
    try {
        let cont = true; 
        while(cont){
            let response = await asyncGet(nextUrl, options);
            console.log(response)
            if(response.statusCode != 200){
                //TODO: Handle Errors
            };
            cont = !response.body.end_of_stream;
            nextUrl = response.body.after_url; 
            val.tickets.push(...response.body.tickets);
        }
    } catch (err){
        console.log("Error:");
        console.log(err);
        //TODO: Handle Errors
    }
    return val;
}

/*
Wrapper for https.get method 
Params: Url, Options
Returns a promise that resolves with:
Error
Response : {
    statusCode
    headers
    body
}
*/
function asyncGet(url , options){
    return new Promise((resolve, reject) => {
        https.get(url, options, (res) => {
            res.setEncoding('utf-8');
            let response = {
                statusCode : res.statusCode, 
                headers : res.headers,
                body : ''
            }
            res.on('data', function (chunk) {
                    response.body += chunk;
            }); 
            res.on('end', ()=>{
                response.body = JSON.parse(response.body);
                resolve(response);
            }); 
        }).on("error" , (err) => {
            reject(err);
        })
    })
}









async function tester(){
    try {
        console.log((await getAllTickets()).tickets);
    } catch (e){

    }
}

tester();