const {getAllTickets, asyncGet} = require("../ZendeskHandler");

/*
ACCOUNT SPECIFIC TESTING VARIABLES


expectedTicketCount - total tickets on a zendesk account;

user : {
    user_name : existing user's user_name
    user_id : existing user (same as above) users id
}

*/
const expectedTicketCount = 101;
const user =  {
    user_name : "Daniel Orbach" , 
    user_id : "1267161330189"
}


/* TESTS */



//Check correct user is returned 

//Check ticket count 
jest.setTimeout(10000);
test("Number of tickets returned", async () => {
   let data = await getAllTickets();
   expect(data.error).toBe("none");
   expect(data.tickets.length).toBe(expectedTicketCount);
})
jest.setTimeout(5000);


//Check no user is returned if it gives wrong user

//Check last ticket