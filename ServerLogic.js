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
    Grabs nessecary data from data (ticket returned by getTicketInfo) and puts it in ticketInfo
    data must be populated with a users map
*/
function fillTicketInfo(ticketInfo, data){
    ticketInfo.tags = data.ticket.tags;
    ticketInfo.user = data.users.get(data.ticket.requester_id).name;
    ticketInfo.priority = data.ticket.priority;
    ticketInfo.subject = data.ticket.subject;
    ticketInfo.description = data.ticket.description;
    ticketInfo.createdAt = data.ticket.created_at;
    ticketInfo.updatedAt = data.ticket.updated_at;  
}




/*
    Gets first page of tickets, complete with the requesters name for each ticket
*/
async function getLandingPage(){
    try{
        const data = await ZH.getFirstPage();
        if(data.error != "none"){
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

/**
 * Returns the tickets pointed to by cursor, fills in names of requesters
 * @param {cursor} cursor 
 */
async function getCursorPage(cursor){
    try  {
        const data = await ZH.getTicketPage(cursor);
        if(data.error != "none"){
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
 * Returns the data for the specified ticket, appends the users name
 * 
 * @param {Number} ticket  ticket number to use 
 */
async function getTicketInfo(ticket){
    try  {
        const ticketInfo = {
            error : 'none',
        }
        const data = await ZH.getTicketInfo(ticket);
        if(data.error != "none"){
            return ({
                error : data.error,
            })
        } 
        fillTicketInfo(ticketInfo, data); 
        return ticketInfo; 
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
    let data = await getCursorPage('\'');
    console.log(data);
}

//f();

module.exports = {
    addUserInfo,
    fillTicketInfo,
    getCursorPage,
    getLandingPage,
    getTicketInfo,
}