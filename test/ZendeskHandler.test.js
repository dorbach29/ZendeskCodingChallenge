const {getAllTickets,  getTicketCount, asyncGet} = require("../ZendeskHandler");





/* TESTS */




//Check that all tickets are returne by getAllTickets 
jest.setTimeout(15000);
test("Number of tickets returned", async () => {
    let ticketCount = await getTicketCount()
    ticketCount = ticketCount.ticketCount;
    let data = await getAllTickets();
    expect(data.error).toBe("none");
    expect(data.tickets.length).toBe(ticketCount);
})
jest.setTimeout(5000);


