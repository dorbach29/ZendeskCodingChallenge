

/*
Grab the ticket id of the current page being viewed
*/
function getId(){
    let pathArray = window.location.pathname.split('/');
    return pathArray[pathArray.length -1];
}

//Display error message on html
function handleError(error){
    document.getElementById('attributes').innerHTML = `
        <h3 class='text-white'>${error}</h3>
    `
}

//Generate an attribute element given the attribute key and the ticket which it pertains to
function generateAttribute(ticket, key){
    if(key =='error') return;
    let div = document.createElement('div');
    div.innerHTML = `    
    <h3 class="text-white">${key}</h3>
    <div class="bk-oat">
        <p class="para">${ticket[key]}</p> 
    </div>
    `
    document.getElementById("attributes").appendChild(div);
}

//Poppulate html page with the given ticket's data
function populatePage(ticket){
    Object.keys(ticket).forEach(key => {
        generateAttribute(ticket, key);
    })
    document.getElementById("ticket-id").innerHTML = 
    `Ticket Id: ${getId()} `
}


//Load Ticket Data upon html being opened
async function getTicketData(){
    try{
        let TicketInfo = await fetch(`http://localhost:3000/ticket/${getId()}`)
        TicketInfo = await TicketInfo.json();
        document.getElementById('attributes').innerHTML ='';
        if(TicketInfo.error != "none"){
            handleError(TicketInfo.error);
            return;
        }
        populatePage(TicketInfo);
    } catch( err) {
        console.log(err)
    }
}

getTicketData();