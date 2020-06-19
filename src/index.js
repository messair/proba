import style from "./css/index.scss"
import style2 from "./css/index2.scss"

var logged = false; // user logged in or not
// SHOWS MENU
document.getElementById("menu").onclick = () => showHide("navigation");
// ACCOUNT MANAGER
document.getElementById("accountBtn").onclick = () => showHide("loginBox");
document.getElementById("registerBtn").onclick = () => showFirstElHideSecEl("registerBox", "loginBox");
document.getElementById("closeRegBtn").onclick = () => {
    hide("registerBox");
    show("loginBox");
};
// CHECKING LOGIN AND PASSWORD FROM DATA.JSON
const logData = require("./data.json"); //imports data from json file
document.getElementById("loginBtn").onclick = () => {
    event.preventDefault();
    var typedLogin = document.getElementById("login").value;
    var typedPwd = document.getElementById("pwd").value;
    logData.keys.forEach(key => {
        if ((typedLogin == key.login) && (typedPwd == key.pwd)) {
            logged = true;
            hide("loginBox");
        };
    });
};
document.getElementById("logoutBtn").onclick = () => logOut();
document.getElementById("closeBtn").onclick = () => hide("loginBox");
//CHECKING AVAILIBLE FLIGHTS
const flightsData = require("./flightsData.json");
let flightObj;
let airplaneSize = 0;
var ticketCounter;
var flightAvailable;
var connectionInfo;
var ticketList;
var blockBtnFunction;
//LOADING INPUTS INTO OBJ
document.getElementById("searchBtn").onclick = () => {
    event.preventDefault();
    ticketCounter = 0;
    flightAvailable = 0;
    if (airplaneSize != 0) {
        hide(airplaneSize);
        hide("flightParameters");
    };
    flightObj = {
        departure: document.getElementById("departure").value,
        destination: document.getElementById("destination").value,
        date: document.getElementById("date").value,
        passengers: document.getElementById("passengers").value,
    };
    //CHECKS THE DATE (max 1 year from today)
    var dateControl = document.querySelector('input[type="date"]')
    var todayDate = new Date();
    var yearMs = 3155695000000;
    if ((dateControl.valueAsNumber - todayDate.getTime()) < 0) {
        document.getElementById("flightInfo").innerHTML = "We are sorry. You can book a ticket at least one day in advance.";
        blockBtnFunction = 1;
    } else if ((dateControl.valueAsNumber - todayDate.getTime()) < yearMs) {
        //SEARCHING FOR MATCH WITH AVAILIBLE FLIGHTS FROM JSON
        flightsData.flights.forEach((item, index) => {
            if ((item.from.toUpperCase() == flightObj.departure.toUpperCase()) && (item.to.toUpperCase() == flightObj.destination.toUpperCase())) {
                document.getElementById("flightInfo").innerHTML = "<div>From: " + item.from + "</div><div> To: " + item.to + "</div><div>Date: " + item.date + "</div><div> Time: " + item.time + "</div>";
                airplaneSize = item.flightType;
                flightAvailable = 1;
                connectionInfo = flightsData.flights[index];
                ticketList = [];
                blockBtnFunction = 0;
            };
        });
        if (flightAvailable == 0) {
            document.getElementById("flightInfo").innerHTML = "We are deeply sorry but we do not provide that connection.";
            blockBtnFunction = 1;
        };
    } else {
        document.getElementById("flightInfo").innerHTML = "Booking service allows reservation approximately one year in advance. Please choose another date.";
        blockBtnFunction = 1;
    };
};
//SEAT PICKUP SHOW/HIDE
document.getElementById("flightInfo").onclick = () => {
    if (blockBtnFunction == 0) {
        showHide("flightParameters");
        if (flightAvailable != 0) {
            if (logged == true) { timeOut(180000); showHide(airplaneSize); } else show("loginBox");
        };
    };
    //CREATES PLANE SEATS ARRAY

    //1. PREMIUM SEATS
    var insteadOfArray = "rect[id^=\"p" + airplaneSize + "\"]";
    document.querySelectorAll(insteadOfArray).forEach((item) => {
        item.onclick = () => {
            item.classList.contains("pickSeat") ? updateTicketList(item, "pickSeat", 1.3) : ((ticketCounter == flightObj.passengers) ? alert("You have picked chosen passengers seat number.") : show("ticketNotification"));
            document.getElementById("submitTicket").onclick = () => {
                var firstName = document.getElementById("ticketFirstName").value;
                var lastName = document.getElementById("ticketLastName").value;
                var extraOptions = 0;
                if (document.getElementById("vip").checked) {
                    var vip = document.getElementById("vip").value;
                    extraOptions = extraOptions + Number(vip);
                };
                if (document.getElementById("xlLuggage").checked) {
                    var xlLuggage = document.getElementById("xlLuggage").value;
                    extraOptions = extraOptions + Number(xlLuggage);
                };
                if (firstName.length > 2 && lastName.length > 2) {
                    updateTicketList(item, "pickSeat", 1.3, firstName, lastName, extraOptions);
                    hide("ticketNotification");
                    (ticketCounter == flightObj.passengers) ? show("checkoutBtn") : hide("checkoutBtn");
                } else alert("Your name or last name are to short.");
                console.log(ticketCounter);
            };
        };
    });
    //2. CHEAP SEATS
    var insteadOfArray = "rect[id^=\"" + airplaneSize + "\"]";
    document.querySelectorAll(insteadOfArray).forEach((item) => {
        item.onclick = () => {
            item.classList.contains("pickCheapSeat") ? updateTicketList(item, "pickCheapSeat", 1) : ((ticketCounter == flightObj.passengers) ? alert("You have picked chosen passengers seat number.") : show("ticketNotification"));
            document.getElementById("submitTicket").onclick = () => {
                var firstName = document.getElementById("ticketFirstName").value;
                var lastName = document.getElementById("ticketLastName").value;
                var extraOptions = 0;
                if (document.getElementById("vip").checked) {
                    var vip = document.getElementById("vip").value;
                    extraOptions = extraOptions + Number(vip);
                };
                if (document.getElementById("xlLuggage").checked) {
                    var xlLuggage = document.getElementById("xlLuggage").value;
                    extraOptions = extraOptions + Number(xlLuggage);
                };
                if (firstName.length > 2 && lastName.length > 2) {
                    updateTicketList(item, "pickCheapSeat", 1, firstName, lastName, extraOptions);
                    hide("ticketNotification");
                    (ticketCounter == flightObj.passengers) ? show("checkoutBtn") : hide("checkoutBtn");
                } else alert("Your name or last name are to short.");
                console.log(ticketCounter);
            };
        };
    });
};
document.getElementById("closeTicketBtn").onclick = () => hide("ticketNotification");
document.getElementById("checkoutBtn").onclick = () => {
    clearTimeout();
    hide(airplaneSize);
    hide("booking");
    hide("flightInfo");
    hide("checkoutBtn");
    show("asideNav");
};
document.getElementById("pickSeatsReturnBtn").onclick = () => {
    timeOut(60000);
    show(airplaneSize);
    show("booking");
    show("flightInfo");
    show("checkoutBtn");
    hide("asideNav");
};
document.getElementById("purchaseBtn").onclick = () => {
    alert("You have successfully purchased your tickets. Safe journeys.");
    window.location.reload(true);
};

// PRE-DEFINED ACTIONS BELOW

class Ticket {
    constructor(flightData, date, seadId, priceCoefficient, firstName, lastName, extraOptions) {
        this.flightData = flightData;
        this.seatId = seadId;
        this.date = date;
        this.price = flightData.price * priceCoefficient + extraOptions;
        this.firstName = firstName;
        this.lastName = lastName;
    };
    toHtlm() {
        return `<div class="ticketBorder"><div>Ticket owner: ${this.firstName} ${this.lastName}<div class="ticketClass"><div>From: ${this.flightData.from}</div><div>To: ${this.flightData.to}</div><div>Date: ${this.date}</div><div>Seat ID: ${this.seatId}</div><div>Price: ${this.price}</div></div></div></div>`
    };
};

var getTotalPrice = (tickets) => {
    var totalPrice = 0;
    tickets.forEach(ticket => {
        totalPrice += ticket.price;
    });
    return totalPrice;
};

var updateTicketList = (item, seatClassName, priceCoeff, firstName, lastName, extraOptions) => {
    if (item.classList.contains(seatClassName)) {
        item.classList.remove(seatClassName);
        ticketCounter = ticketCounter - 1;
        hide("checkoutBtn");
        ticketList.splice(ticketList.indexOf(item.id), 1);
    } else if (ticketCounter < flightObj.passengers) {
        item.classList.add(seatClassName);
        ticketCounter = ticketCounter + 1;
        // ADDING TICKET TO ARRAY
        ticketList.push(new Ticket(connectionInfo, flightObj.date, item.id, priceCoeff, firstName, lastName, extraOptions));
    };
    var ticketListHtlm = [];
    ticketList.forEach(ticket => {
        ticketListHtlm.push(ticket.toHtlm());
    });
    show("flightParameters");
    document.getElementById("flightParameters").innerHTML = `<div>Ticket summary: </div>` + ticketListHtlm.join(" ") + "<div>Price total: </div>" + getTotalPrice(ticketList);
};

var show = (item) => {
    if (document.getElementById(item).classList.contains("disappear")) { document.getElementById(item).classList.remove("disappear") };
};
var hide = (item) => {
    if (document.getElementById(item).classList.contains("disappear")) { } else { document.getElementById(item).classList.add("disappear") };
};
var showHide = (item) => {
    document.getElementById(item).classList.contains("disappear") ? show(item) : hide(item);
};
var showFirstElHideSecEl = (elementToShow, elementToHide) => {
    document.getElementById(elementToShow).classList.contains("disappear") ? (show(elementToShow) && hide(elementToHide)) :
        (hide(elementToShow) && show(elementToHide))
};
var logOut = () => {
    event.preventDefault();
    logged == true ? logged = false && alert("You have been logged out.") : alert("You must be logged in to log out.")
};

var timeOut = (time) => {
    setTimeout(() => { alert("Your time for seat pick up expired."); window.location.reload(true); }, time);
};
