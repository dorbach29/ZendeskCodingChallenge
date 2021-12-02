const {getAllTickets,  getTicketCount, evaluatePageBody} = require("../ZendeskHandler");
const tp = require("./tpData");





/* TESTS */


beforeEach(() => {
    tp.resetVal();
});

//Check that all tickets are returne by getAllTickets 
jest.setTimeout(15000);
test("getAllTickets: Number of tickets returned", async () => {
    let ticketCount = await getTicketCount()
    ticketCount = ticketCount.ticketCount;
    let data = await getAllTickets();
    expect(data.error).toBe("none");
    expect(data.tickets.length).toBe(ticketCount);
})
jest.setTimeout(5000);


test("evaluatePageBody: First page has no prev cursor", ()=>{
    evaluatePageBody(tp.val, tp.FirstPageBody)
    expect(tp.val.firstOfStream).toBe(true);
    expect(tp.val.prevCursor).toBe(null);
})

test("evaluatePageBody: First page has next cursor", ()=> {
    evaluatePageBody(tp.val, tp.FirstPageBody);
    expect(tp.val.endOfStream).toBe(false);
    expect(tp.val.nextCursor).toBeTruthy(); 
})

test("evaluatePageBody: First page returns 25 tickets", ()=> {
    evaluatePageBody(tp.val, tp.FirstPageBody);
    expect(tp.val.tickets.length).toBe(25);
})


