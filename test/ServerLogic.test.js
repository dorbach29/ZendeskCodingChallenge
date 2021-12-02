const SL = require('../ServerLogic');
const data = require('./ServerLogicData');


beforeEach(() => {
    data.resetSampleResponse();
})


//Test end bounds (1 and 25) name should be "The Customer" and "Daniel Orbach"
test("addUserInfo: First and Last Ticket Given Correct name", ()=>{
    SL.addUserInfo(data.sample.tickets, data.sample.users);
    expect(data.sample.tickets[0].user).toBe("The Customer");
    expect(data.sample.tickets[24].user).toBe("Daniel Orbach");
})



//Test Each ticket is given username
test("addUserInfo: Each User given a username", ()=>{
    SL.addUserInfo(data.sample.tickets, data.sample.users);
    for(let i = 0; i < data.sample.tickets.length; i++){
        expect(data.sample.tickets[i].user).toBeTruthy();
    }
})



//Test Invalid TicketId returns proper error
jest.setTimeout(15000);
test("getTicketPage: Returns correct error for malformated data", async ()=>{
   let response1 = await SL.getTicketInfo(' ');
   expect(response1.error).toBe('Invalid Request');

})

test("getTicketInfo: Returns correct error for malformated data", async ()=>{
    let response1 = await SL.getCursorPage();
    let response2 = await SL.getCursorPage('\\');
    expect(response1.error).toBe('Invalid Request');
    expect(response2.error).toBe("Invalid Request")
})
jest.setTimeout(5000);

//Ensuring fill ticket info correctly populates data
test("fillTicketInfo: correctly populates info", () => {
    let ticketInfo = {users : new Map()}
    SL.fillTicketInfo(ticketInfo, { ticket : data.sample.tickets[0], users : data.sample.users });
    expect(ticketInfo.user).toBe("The Customer");
    expect(ticketInfo.description).toBe("Hi there,\n\nI’m sending an email because I’m having a problem setting up your new product. Can you help me troubleshoot?\n\nThanks,\n The Customer\n\n");
    expect(ticketInfo.tags).toEqual(["sample","support","zendesk"]);
    expect(ticketInfo.subject).toBe("Sample ticket: Meet the ticket");
})