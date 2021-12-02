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