const express = require('express')
const SL = require('./ServerLogic');
const path = require('path');
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/landing.html'))
})

app.get('/landing', async  (req , res) => {
  try{
    let data = await SL.getLandingPage();
    if(data.error != 'none'){
      res.send({"error" : data.error})
      return;
  }
    res.send(data);
    return
  } catch(error){
    res.send({"error" : "Service Unnavailable"})
    return;
  }
})

app.get('/cursor/:cursor' , async  (req , res) => {
  try{
    let cursor = req.params.cursor;
    let data = await SL.getCursorPage(cursor);
    if(data.error != 'none'){
      res.send({"error" : data.error})
      return;
  }
    res.send(data);
    return
  } catch(error){
    res.send({"error" : "Service Unnavailable"})
    return;
  }
})


app.get('/ticket/view/:ticket' , (req, res) => {
 res.sendFile(path.join(__dirname, 'static/ticket.html'));
})

app.get('/ticket/:ticket', async (req , res) => {
  try{
    let ticket = req.params.ticket;
    let data = await SL.getTicketInfo(ticket);
    if(data.error != 'none'){
        res.send({"error" : data.error})
        return;
    }
    res.send(data);
    return
  } catch(error){
    res.send({"error" : "Service Unnavailable"})
    return;
  }
})


app.listen(port, () => {
  console.log(`Server up`)
})




/* Daniel - Notes on Project

We need to serve some kind of webpage to the browser

Homepage
Optional  -- Have some kind of login system
Account Page - Displays Tickets
25 Max Per page, user can click through different pages


Server Side
--Simple Express to Serve HTML or React
--Express API To handle data requqests
--Module to handle Zendesk API
--Module to handle Server Logic 


Jest to test 
--Module that handles Zendesk API
--Module that handles Server Side Logic 
-- Express APi that handles Data requests
*/

/*
  I'm thinking we'll get get all the data for a session at once and give the user the option to "refresh"



  Landing (Refresh will also hit this point)
    Gets data returns first page of data

  NextPage (Option 2) -- (Get page given cursor )
    Params: nextPageUrl 
    Returns: data on the next page 
    Errors: url not valid
    Grabs the next page for the server if URL is correct
  
  
  //Will Most likely just be handled on the front end by passing the front end all the data for a ticket at once 
  Ticket
    Params: TicketId
    Returns: All Info about this ticket
    Errors: TicketId does not exist 
    If ticket exists returns ticket. 


      //How would we grow this application in the futrue?
        Add a sign in, multiple people using the viewer to view different tickets 
          This means that no data should really be server wide because it will really depend on the account
          that is using this app.

          No data stays in the server all goes directly to the user. 
        Increase the amount of data that we are viewing 

      //We want to limit the amount of data that has to be sent over initially
        //Say there were 500 tickets (maybe) would we want to load all of them? 
        //No user might only scroll through one or two pages so no point in sending all tickets]
        //Only get tickets for the page when you are on it
        //Use cursor method

      //Updated real time?
        Unless we implement polling or sockets (which we can't) page refresh can only maybe be made when 
        user switches pages. But is this really critical? One theres a chacne this could mess up page
        also the user most likely doesn't need to see ticket changes in the few moments since he switched tabs.
        Best policy is probably just to have a refresh button, and consider having some kind of polling method
        for later. 

      //

*/