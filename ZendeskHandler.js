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
function asyncGet(url){
    const options =  { headers : { 
        'Authorization': 'Basic ' + Buffer.from(process.env.ZEN_USER + ':' + process.env.ZEN_PASS).toString('base64'),
    }};
    return new Promise((resolve, reject) => {
        if(!url) reject("Missing URL");
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


/*
    Grabs all tickets for a Zendesk account, takes paging into account 
    Returns  {
        error: appropriate error (or null)
        tickets: list of tickets
    }
*/
async function getAllTickets(){
    //Return Value
    const val = {
        error : "none",
        statusCode : 200,
        tickets : [], 
    }
    let nextUrl = `https://${SUBD}.zendesk.com/api/v2/incremental/tickets/cursor.json?start_time=0&per_page=100`;
    try {
        let cont = true; 
        while(cont){
            let response = await asyncGet(nextUrl);
            if(response.statusCode != 200){
                val.statusCode = response.statusCode;
                val.error = response.body.error
                return val;
            };
            //Checking if there are
            cont = !response.body.end_of_stream;
            nextUrl = response.body.after_url; 
            val.tickets.push(...response.body.tickets);
        }
        return val;
    } catch (err){
        console.log("Error:");
        console.log(err);
        val.error = err;
        return val;
    }
}











module.exports = {
    getAllTickets,
    asyncGet,
}