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