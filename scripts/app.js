"use strict";

//IIFE - Immediately Invoked Functional Expression
(function () {

    function DisplayHomePage(){
        console.log("Called DisplayHomePage() ... ");


        let aboutUsBtn = document.getElementById("AboutUsBtn");
        aboutUsBtn.addEventListener("click", function(){
            location.href = "about.html";
        });

<<<<<<< HEAD
        let MainContent = document.getElementsByName("MainContent")[0];

        //<p id="MainParagraph" class="mt-3">this is my first paragraph
        let MainParagraph=document.createElement('p');
        MainParagraph.setAttribute("id", "MainParagraph");
        MainParagraph.setAttribute("class", "Mt-3");

        //attach to the dom
        MainContent.appendChild(MainParagraph);

        let FirstString = "this is"
        let SecondString = `${FirstString}  is my second paragraph`;
        MainParagraph.textContent = SecondString;

        // Attach to dom
        MainParagraph.appendChild(MainParagraph);

        let DocumentBody = document.body;
        //
        let Article = Document.createElement("article");
        let ArticleParagraph = `<p id="ArticleParagraph" class="mt-3">this is my paragraph</p>`;
        Article.setAttribute("class", "container");
        Article.innerHTML = ArticleParagraph;
        DocumentBody.appendChild(Article);
=======
        let MainContent = document.getElementsByTagName("main")[0];
        //<p id="MainParagraph" class="mt-3">This is my first paragraph</p>
        let MainParagraph = document.createElement("p");
        MainParagraph.setAttribute("id", "MainParagraph");
        MainParagraph.setAttribute("class", "mt-3");
        MainParagraph.textContent = "This is my first paragraph";

        //Attach to the dom
        MainContent.appendChild(MainParagraph);

        let FirstString = "This is";
        let SecondString = `${FirstString} is my second paragraph`;
        MainParagraph.textContent = SecondString;

        //Attach to the dom
        MainContent.appendChild(MainParagraph);

        let DocumentBody = document.body;
        //<article><p></p></article>
        let Article = document.createElement("article");
        let ArticleParagraph = `<p id="ArticleParagraph" class="mt-3">This is my article paragraph</p>`;
        Article.setAttribute("class", "container");
        Article.innerHTML = ArticleParagraph;
        DocumentBody.appendChild(Article);




>>>>>>> 0c3abb2 (commit)
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
    }

    function Start(){
        console.log("Start App...");


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
                DisplayContactPage();
                break;
        }

    }
    window.addEventListener("load", Start);

})()