  /*
  Author:  Ismail Abouamal
  Date: June 9, 2023.
  This is the JavaScript code manipulating the DOM in contactUS.HTML. All functions are documented.
  */
(function() {
    "use strict";
  
    function init() {
      id('contactUsForm').addEventListener("submit", function(evt) {
        evt.preventDefault(); 
        submitComment();
      });
    }
  
    /**
     * Submits a comment to the server.
     */
    function submitComment() {
        const data = new FormData(id('contactUsForm'));
        const url = '/contact'; 

        fetch(url, {
          method: 'POST',
          body: data
        })
          .then(resp => resp.text())
          .then(displaySubmittedMessage)
          .catch(error => {
            console.error('Error:', error);
          });
     
    }

    /**
       * Displays a message to the user when the form is submitted.
       * @param {*} response 
       */
    function displaySubmittedMessage(response){
        let message = response;
        id('contact-form-cont').parentNode.innerHTML = `${message}`;
    }
  
  
    init();
  })();