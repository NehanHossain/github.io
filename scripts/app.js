"use strict";

//IIFE - Immediately Invoked Functional Expression
(function () {

    function CheckLogin(){
        console.log("[INFO] Checking user login status.");

        const loginNav = document.getElementById("login")

        if(!loginNav){
            console.warn("[WARNING] loginNav element not found! Skipping CheckLogin().");
            return;
        }

        const userSession = sessionStorage.getItem("user");

        if(userSession) {
            loginNav.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
            loginNav.href = "#";

            loginNav.addEventListener("click", (event) => {
                event.preventDefault();
                sessionStorage.removeItem("user");
                location.href = "login.html";
            });
        }
    }


    /**
     * Update the navigation bar to highlight the current active page
     */
    function updateActiveNavLink(){
        console.log("[INFO] UpdateActiveNavLink() called...");

        //current page loaded in browser
        const currentPage = document.title.trim();
        const navLinks = document.querySelectorAll("nav a");

        navLinks.forEach(link => {
           if (link.textContent.trim() === currentPage) {
               link.classList.add("active");
           } else {
               link.classList.remove("active");
           }
        });
    }

    /**
     * Dynamically loads the header from the header.html into the current page
     * @returns {Promise<void>}
     */
    function LoadHeader(){
            console.log("[INFO] LoadHeader() called...");

            return fetch("header.html")
            .then(response => response.text())
            .then(data => {
                document.querySelector('header').innerHTML = data;
                updateActiveNavLink();
            })
                .catch (error => console.log("[ERROR] Unable to load header ", error));
    }

    function DisplayLoginPage(){
        console.log("[INFO] DisplayLoginPage() called...");

        const messageArea = document.getElementsByClassName("messageArea");
        const loginButton = document.getElementsByClassName("loginButton");
        const cancelButton = document.getElementsByClassName("cancelButton");

        //hide the message initially
        messageArea.style.display = "none";

        if(!loginButton){
            console.error("[ERROR] loginButton not found in the DOM...");
            return;
        }

        loginButton.addEventListener("click", async (event ) => {

            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            try {

                const response = await fetch("data/users.json");

                if(!response.ok) {
                    throw new Error(`HTTP error Status: ${response.statusText}`);
                }

                const jsonData = await response.json();
                const users = jsonData.users;


                if(!Array.isArray(users)){
                    throw new Error(`[ERROR] JSON data does not contain a valid data users array`);
                }

                let success = false;
                let authenticatedUser = null;

                for(const user of users){

                    if(user.Username === username && user.Password === password){
                        success = true;
                        authenticatedUser = user;
                        break;
                    }
                }

                if(success){
                    sessionStorage.setItem("user", JSON.stringify( {
                        DisplayName: authenticatedUser.DisplayName,
                        EmailAddress: authenticatedUser.EmailAddress,
                        Username: authenticatedUser.Username,
                    }));

                    messageArea.style.display = "none";
                    messageArea.classList.remove("alert, alert-danger");
                    location.href = "contact-list.html";
                }else{

                    messageArea.style.display = "block";
                    messageArea.classList.add("alert, alert-danger")
                    messageArea.textContent = "Invalid username or password. Please try again";

                    document.getElementById("username").focus();
                    document.getElementById("username").select();
                }

            }catch(error) {
                console.error("[ERROR] Failure to login", error);
            }

        });

        cancelButton.addEventListener("click", async (event ) => {
            document.getElementById("loginForm").reset();
            location.href = "index.html";
        });




    }


    function DisplayRegisterPage(){
        console.log("[INFO] DisplayRegisterPage() called...");
    }

    function handleCancelClick(){
        location.href = "contact-list.html";

    }

    function handleEditClick(event, contact, page){
        // prevent default form submission
        event.preventDefault();

        if (!validateForm()){
            alert("Form contains errors. Please correct them before submitting");
            return;
        }


        //retrieve values from form input
        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        //update contact
        contact.fullName = fullName;
        contact.contactNumber = contactNumber;
        contact.emailAddress = emailAddress;

        //Save the updated contact data with new values
        localStorage.setItem(page, contact.serialize());

        //redirect
        location.href = "contact-list.html";
    }


    function handleAddClick(event){
        // prevent default form submission
        event.preventDefault();

        if (!validateForm()){
            alert("Form contains errors. Please correct them before submitting");
            return;
        }


        //retrieve values from form input
        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        AddContact(fullName, contactNumber, emailAddress);

        //redirect
        location.href = "contact-list.html";

    }

    function attachValidationListeners(){
        console.log("[INFO] attaching validation listeners...");

        Object.keys(VALIDATION_RULES).forEach((fieldID) => {

            const field = document.getElementById(fieldID);

            if(!field){
                console.warn(`[WARN] field '${fieldID}' not found. Skipping listener attachment`);
                return;
            }

            addEventListenersOnce(fieldID, "input", () => validateInput(fieldID))

        });
    }

    function addEventListenersOnce(elementId, event, handler){

        const element = document.querySelector(elementId);

        if(element){
            // remove any existing event listener before attempting to modify
            element.removeEventListener(event,handler);

            element.addEventListener(event,handler);
        }else{
            console.warn(`[WARN] element with Id '${elementId}' not found`);
        }
    }

    function validateForm(){
        return(
            validateInput("fullName") &&
                validateInput("contactNumber") &&
                validateInput("emailAddress")
        );
    }

    function validateInput(fieldID){
        const field = document.getElementById(fieldID);
        const errorElement = document.getElementById(`${fieldID}_error`);
        const rule = VALIDATION_RULES[fieldID];

        if (!field || !errorElement || !rule) {
            console.warn(`[WARN] Validation rule not found for: ${fieldID}`);
            return false;
        }

        if(field.regex.test(field.value)){
            errorElement.textContent = "The field is required";
            errorElement.style.display = "block";
            return false;
        }

        errorElement.textContent = "";
        errorElement.style.display = "none";
        return true;
    }

    const VALIDATION_RULES = {
        fullName: {
            regex: /^[A-Za-z\s]+$/,      // allows for only letters and spaces
            errorMessage: "Full name must only contain letters and spaces."
        },

        contactNumber: {
            regex: /^\d{3}-\d{4}-\d{4}$/,
            errorMessage: "Contact Number must be in format ###-###-####"
        },
        emailAddress: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: "Email address must be a valid email address"
        }


    }

    function AddContact(fullName, contactNumber, emailAddress){
        console.log("[DEBUG] AddContact() triggered.")

        if(!validateForm()){
            alert("Form contains errors. Please correct them before submitting");
            return;
        }

        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize())
        {
            let key = `contact_${Date.now()}`;
            localStorage.setItem(key, contact.serialize());
            console.log(`[INFO] contact added ${key} `);
        }else{
            console.error("[ERROR] contact serialization failed");
        }

        location.href = "contact-list.html";
    }

    function DisplayEditPage() {
        console.log("DisplayEditPage called...");

        const page = location.hash.substring(1);
        const editButton = document.getElementById("editButton");


        switch (page) {
            case "add": {
                //Update the browser and titles
                document.title = "Add Contact";
                document.querySelector("main > h1").textContent = "Add Contact";

                if (editButton) {
                    editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i>Add Contact</button>`;
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-success");

                    //attach the event listeners
                    addEventListenersOnce("editButton", "click", handleAddClick);
                    addEventListenersOnce("cancelButton", "click", handleEditClick);

                }
                break;
            }
            default: {
                // Edit a existing contact
                const contact = new core.Contact();
                const contactData = localStorage.getItem(page);

                //Reconstructed the contact form localStorage
                if (contactData) {
                    contact.deserialize(contactData);
                }

                //repopulate form fields with existing contact details
                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("emailAddress").value = contact.emailAddress;

                if (editButton) {
                    editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i>Add Contact</button>`;
                    editButton.classList.remove("btn-success");
                    editButton.classList.add("btn-primary");

                    //attach the event listeners
                    addEventListenersOnce("editButton", "click",
                        (event) => handleEditClick(event, contact, page));
                    addEventListenersOnce("cancelButton", "click", handleCancelClick);
                    break;
                }
            }
        }
    }

    async function DisplayWeather(){
        const apiKey = "c6a945e0f9d8bb8019299c3a5c1eac78";
        const city = "Oshawa";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {

            const response = await fetch(url);

            if(!response.ok){
                throw new Error("Failed to fetch weather data");
            }


            const data = await response.json();
            console.log("Weather API response: ", data);

            const weatherDataElement = document.getElementById("weather-data");

            weatherDataElement.innerHTML = `<strong>City: </strong> ${data.name}<br>
                                            <strong>Temperature: </strong> ${data.main.temp} °C<br>
                                            <strong>Weather: </strong> ${data.weather[0].description}<br>`

        } catch (error) {

            console.error("Error fetching weather data", error);
            document.getElementById("weather-data").textContent = "Unable to fetch weather data at this time";
        }

    }

    function DisplayContactListPage(){
        console.log("Called DisplayContactListPage() ...");

        if(localStorage.length > 0){

            let contactList = document.getElementById("contactList");
            let data = "";

            let keys = Object.keys(localStorage);

            let index = 1;
            for(const key of keys){

                if(key.startsWith("contact_")){

                    let contactData = localStorage.getItem(key);

                    try{
                        //console.log(contactData);
                        let contact = new core.Contact();
                        contact.deserialize(contactData);
                        data += `<tr>
                                    <th scope="row" class="text-center">${index}</th>
                                    <td>${contact.fullName}</td>
                                    <td>${contact.contactNumber}</td>
                                    <td>${contact.emailAddress}</td>
                                    <td class="text-center">
                                        <button value="${key}" class="btn btn-warning btn-sm edit">
                                        <i class="fa-solid fa-pen-to-square"></i> Edit</button>
                                    </td>
                                    <td class="text-center">
                                        <button value="${key}" class="btn btn-danger btn-sm delete">
                                        <i class="fa-solid fa-trash"></i> Delete</button>
                                    </td>
                                 </tr>`;
                        index++;

                    }catch(error){
                        console.error("Error de-serializing contact data", error);
                    }
                }else{
                    console.warn(`Skipping on-contact key: ${key}`);
                }
            }
            contactList.innerHTML = data;
        }
        const addButton = document.getElementById("addButton");
        addButton.addEventListener("click", (e) => {
            location.href = "edit.html#add";
        });


        const deleteButtons = document.querySelectorAll("button.delete");
        deleteButtons.forEach(button => {
            button.addEventListener("click", function () {

                if(confirm("Delete contact, please confirm.")){
                    localStorage.removeItem(this.value);
                    location.href = "contact-list.html";
                }

            });
        });

        const editButtons = document.querySelectorAll("button.edit");
        editButtons.forEach(button => {
            button.addEventListener("click", function () {
                location.href = "edit.html#" + this.value;
            });
        });


    }

    function DisplayHomePage(){
        console.log("Called DisplayHomePage() ... ");


        let aboutUsBtn = document.getElementById("AboutUsBtn");
        aboutUsBtn.addEventListener("click", () => {
            location.href = "about.html";
        });

        DisplayWeather();

        document.querySelector("main").insertAdjacentHTML(
            "beforeend",
            `<p id="MainParagraph" class="mt-5">This is my first paragraph</p>`
        );

        document.body.insertAdjacentHTML(
            "beforeend",
            `<article class="container">
                    <p id="ArticleParagraph" class=mt-3">This is my article paragraph</p>
                  </article>`
        );
    }

    function DisplayAboutPage(){
        console.log("Called DisplayAboutPage() ... ");
    }

    function DisplayProductsPage(){
        console.log("Called DisplayProductsPage() ... ");
    }

    function DisplayServicesPage(){
        console.log("Called DisplayServicesPage() ... ");
    }

    function DisplayContactPage(){
        console.log("Called DisplayContactPage() ... ");

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function(){

            if(subscribeCheckbox.checked)
            {
               AddContact(
                   document.getElementById("fullName").value,
                   document.getElementById("contactNumber").value,
                   document.getElementById("emailAddress").value
               )
            }
            alert("Form successfully submitted");
        });

    }

    async function Start()
    {
        console.log("Start App...");
        console.log(`Current document title is ${document.title}`);

        //LoadHeader first, then run CheckLogin
        await LoadHeader().then( () => {
            CheckLogin();
        });

        switch(document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "Products":
                DisplayProductsPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "Contact":
                attachValidationListeners();
                DisplayContactPage();
                break;
            case "Contact List":
                DisplayContactListPage();
                break;
            case "Edit Contact":
                attachValidationListeners();
                DisplayEditPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Register":
                DisplayRegisterPage();
                break;
            default:
                console.error("No matching case for page title");
        }

    }
    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM is fully loaded and parsed");
        Start();
    });

})()