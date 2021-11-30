const express = require('express')
const path = require('path');
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/landing.html'))
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

  Endpoints:

  Landing (Refresh will also hit this point)
    Gets data returns first page of data

  Page (option 1)
    Params: page number 
    Returns: data on page
    Errors: page does not exist, data not loaded 
    If data is loaded for the server, returns the data that is on selected page

  NextPage (Option 2)
    Params: None
    Returns: Data on the next page
    Errors: No next page
    If there is a next page, returns the data in that page


  PreviousPage (Option 2)
    Params: None
    Returns: Data on the previous page
    Errors: No next page
    If there is a next page, returns the data in that page

    Ticket
      Params: TicketId
      Returns: All Info about this ticket
      Errors: TicketId does not exist 
      If ticket exists returns ticket. 
*/