

/*
Grab the ticketId of the current page being viewed
*/
function getId(){
    let pathArray = window.location.pathname.split('/');
    return pathArray[pathArray.length -1];
}



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

function populatePage(ticket){
    Object.keys(ticket).forEach(key => {
        generateAttribute(ticket, key);
    })
}

async function getTicketData(){
    try{
        let TicketData = await fetch(`http://localhost:3000/ticket/${getId()}`)
        TicketData = await TicketData.json();
        document.getElementById('attributes').innerHTML ='';
        //TODO: Handle Errors
        populatePage(TicketData);
        console.log(TicketData);
    } catch( err) {
        console.log(err)
    }
}

getTicketData();