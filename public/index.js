/*

Dom Handlers -- Methods that take in data and put it on the dom
//TODO: Fix username issue at top of the screen
*/

let TicketData = null;
let page = 1; 

const DomHandler =  {

    onLoadPage(){
        const prev = document.getElementById('prev-page');
        const next = document.getElementById('next-page');
        if(TicketData.firstOfStream) prev.disabled = true;
        else prev.disabled =false; 
        if(TicketData.endOfStream) next.disabled = true;
        else next.disabled =false; 
    },

    genList(tickets){
        const list = document.getElementById("ticket-list");
        list.innerHTML = `    <li>
        <div class="ticket-box">
            <div class="list-section subject">Subject</div>
            <div class="list-section requester">Requester</div>
            <div class="list-section requested">Requested</div>
            <div class="list-section priority">Priority</div>
        </div>
    </li>`;
        for(let i = 0; i < tickets.length; i ++){
            this.appendListItem(tickets[i], i);
        }
    },

    appendListItem(ticket, index){
        const ticketList = document.getElementById("ticket-list");
        const listItem = document.createElement('li');
        listItem.index = index; 
        listItem.innerHTML = this.genListItemString(ticket.subject, ticket.user , ticket.created_at, ticket.priortiy);
        ticketList.appendChild(listItem);

    },

    genListItemString(subject, requester, requested, priority){
        return `         
        <div class="ticket-box">
        <div class="list-section subject">${subject}</div>
        <div class="border"></div>
        <div class="list-section requester">${requester}</div>
        <div class="border"></div>                    
        <div class="list-section requested">${requested}</div>
        <div class="border"></div>
        <div class="list-section priority">${priority}</div>
        </div>
        `
    },

    nextClicked(){
        page += 25;
        const ticketCount = document.getElementById("ticket-count");
        ticketCount.innerHTML = `Showing Tickets ${page} - ${page+TicketData.tickets.length-1}`
    },

    prevClicked(){
        page -= 25;
        const ticketCount = document.getElementById("ticket-count");
        ticketCount.innerHTML = `Showing Tickets ${page} - ${page+TicketData.tickets.length-1}`
    },

    genSingleTicketView(){
        
    },

    handlePageNotFound(){

    },
}


const api = {
    
    async getLanding(){
        try{
            let response = await fetch("http://localhost:3000/landing")
            response = await response.json()
            TicketData = response;
            DomHandler.genList(response.tickets);
            DomHandler.onLoadPage();
        } catch (err){
            console.log(err);
        }
    },

    async getNext(){
        try{
            if(!TicketData.endOfStream){
            let response = await fetch(`http://localhost:3000/cursor/${TicketData.nextCursor}`)
            response = await response.json()
            TicketData = response;
            DomHandler.genList(response.tickets);
            DomHandler.nextClicked();
            DomHandler.onLoadPage();
            }
        } catch (err){
            console.log(err);
        }
    },

    async getPrevious(){
        try{
            if(!TicketData.firstOfStream){
            let response = await fetch(`http://localhost:3000/cursor/${TicketData.prevCursor}`)
            response = await response.json()
            TicketData = response;
            DomHandler.genList(response.tickets);
            DomHandler.prevClicked();
            DomHandler.onLoadPage();
            }
        } catch (err){
            console.log(err);
        }
    },

}


api.getLanding();