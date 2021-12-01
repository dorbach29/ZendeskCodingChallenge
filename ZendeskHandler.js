const https = require("https");
require('dotenv').config()
const SUBD = process.env.SUBD


/*
Module that handles calls to the Zendesk API
*/

/*
-Get info for individual ticket
    https://zccdanielorbach.zendesk.com/api/v2/tickets/91.json
    91 is the ticket id





/**
 * Basic Wrapper for https.get method 
 * Params: Url, Options
 * Returns a promise that resolves with:
 * Error or
 * Response : {
 *  statusCode
 *  headers
 *  body
 * }
 * 
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

/**
 * Returns the info corresponding to an individual ticket 
 * 
 */
//TODO: Handle for NUll case when no ticket is returned
async function getTicketInfo(ticketId){
    const val = {
        error : "none",
        statusCode : 200,
        ticket: null,
    }

    const url = `https://${SUBD}.zendesk.com/api/v2/tickets/${ticketId}.json`
    try{
        let response = await asyncGet(url);
        if(response.statusCode != 200){
            val.statusCode = response.statusCode;
            val.error = response.body.error
            return val;
        }
        val.ticket = response.body;
        return val;
    } catch (err){
        console.log(err)
        val.error = err;
        return val; 
    }
}

/**
 * Returns the ticket count in the users account
 * Accessed via val.ticketCount
 */
async function getTicketCount(){
    const val = {
        error : "none",
        statusCode : 200,
        ticketCount : 0,
    }

    const url = `https://${SUBD}.zendesk.com/api/v2/users/me.json?include=open_ticket_count`
    try{
        let response = await asyncGet(url);
        if(response.statusCode != 200){
            val.statusCode = response.statusCode;
            val.error = response.body.error
            return val;
        }
        val.ticketCount = response.body.open_ticket_count[response.body.user.id];
        return val;
    } catch (err){
        console.log(err)
        val.error = err;
        return val; 
    }
}


/*
    Grabs all tickets for a Zendesk account, takes paging into account .
    Sideloads users associated with these tickets.
    Returns  {
        error: appropriate error (or null)
        statusCode : statusCode of http response
        users: map containing user_id's as keys and userinfo as responses
        tickets: list of tickets
    }
*/
async function getAllTickets(){
    //Return Value
    const val = {
        error : "none",
        statusCode : 200,
        tickets : [], 
        users : new Map(),
    }
    let nextUrl = `https://${SUBD}.zendesk.com/api/v2/incremental/tickets/cursor.json?start_time=0&per_page=100&include=users`;
    try {
        let cont = true; 
        while(cont){
            let response = await asyncGet(nextUrl);
            if(response.statusCode != 200){
                val.statusCode = response.statusCode;
                val.error = response.body.error
                return val;
            };
            //Checking if there are more ticketss
            cont = !response.body.end_of_stream;
            nextUrl = response.body.after_url; 

            //Pushing Tickets and adidng users
            val.tickets.push(...response.body.tickets);
            for(let i = 0; i < response.body.users.length; i ++){
                let user = response.body.users[i];
                val.users.set(user.id, user);
            }

        }
        return val;
    } catch (err){
        console.log("Error:");
        console.log(err);
        val.error = err;
        return val;
    }
}


//Dummy used for testing 
async function f() {
    let data = await getTicketInfo(91);
    console.log(data.ticket);
}

//f();


module.exports = {
    getAllTickets,
    getTicketCount,
    getTicketInfo,
    asyncGet,
}