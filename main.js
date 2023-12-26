// Script for handling the side menu
var menuOpen = false; // Variable to track whether the menu is open

function openmenu() {
    var sideMenu = document.getElementById("sidemenu");
    var overlay = document.getElementById("overlay");
    if (!menuOpen) {
        sideMenu.style.right = "0"; // Show the side menu
        overlay.style.display = "block"; // Display the overlay
        menuOpen = true;
    } else {
        sideMenu.style.right = "-200px"; // Hide the side menu
        overlay.style.display = "none"; // Hide the overlay
        menuOpen = false;
    }
}

function closemenu() {
    var sideMenu = document.getElementById("sidemenu");
    var overlay = document.getElementById("overlay");
    sideMenu.style.right = "-200px"; // Hide the side menu
    overlay.style.display = "none"; // Hide the overlay
    menuOpen = false;
}

// Script for handling tab switching
var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname) {
    for (tablink of tablinks) {
        tablink.classList.remove("active-link");
    }
    for (tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab");
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}

// Script for handling form submission
const scriptURL = 'https://script.google.com/macros/s/AKfycbzkmyTU2TRszcGC6hj-gIRNOMLatG70mvt_O8636gzs-nqcsrNDM3Te9JVeGAO_AK5QzA/exec'
const form = document.forms['submit-to-google-sheet']
const msg = document.getElementById("msg")

form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            msg.innerHTML = "Message sent Successfully..."
            setTimeout(function () {
                msg.innerHTML = ""
            }, 5000)
            form.reset()
        })
        .catch(error => console.error('Error!', error.message))
})
