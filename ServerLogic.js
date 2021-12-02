const ZH = require('./ZendeskHandler');
const fs = require("fs"); // For generating test data



/*
Adds requesters name to each ticket
*/
function addUserInfo(tickets, users){
    for(let i = 0; i < tickets.length; i ++){
        tickets[i].user = users.get(tickets[i].requester_id).name;
    }
    return 
}




/*
    Gets first page of tickets, complete with the requesters name for each ticket
*/
async function getLandingPage(){
    try{
        const data = await ZH.getFirstPage();
        if(data.error != "none"){
            if(data.statusCode == 503){
                return {
                    error : "API Down"
                }
            }
            return {
                error : data.error,
            }
        } 
        //fs.appendFile("Data.txt", JSON.stringify(data),  (err) => {} ) For testing purposes
        addUserInfo(data.tickets, data.users);
        return data; 
    } catch (err){
            console.log(err);
            return {
                error : err,
            }
    }
}; 

/*
    Get's page of tickets specified by cursor where cursor is the specified index 
*/
async function getCursorPage(cursor){
    try  {
        const data = await ZH.getTicketPage(cursor);
        if(data.error != "none"){
            if(data.statusCode == 503){
                return {
                    error : "API Down"
                }
            }
            return {
                error : data.error,
            }
        } 
        addUserInfo(data.tickets, data.users);
        return data; 
    }
    catch (err){
        console.log(err);
        return {
            error : err,
        }
    }
}

/**
 * Ticket Data
 *  Acts as a sort of cache for the Tickets on users zendesk account, saving them in local stroage w
 */


async function f(){
    let data = await getLandingPage();
}

f();

module.exports = {
    addUserInfo,
    getCursorPage,
    getLandingPage,
}