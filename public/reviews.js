  /*
  Author:  Ismail Abouamal
  Date: June 9, 2023.
  This is the JavaScript code manipulating the DOM the review seciton in products.HTML. All functions are documented.
  */

(function() {
    "use strict";
  
    function init() {
      id('reviewForm').addEventListener("submit", function(evt) {
        evt.preventDefault();
        submitReview(); 
      });
      
    }
  
    /**
     * Submits a comment to the server.
     */
    function submitReview() {
      
      const reviewdata = new FormData(id('reviewForm'));
      const url = '/review'; 

      fetch(url, {
        method: 'POST',
        body: reviewdata
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
        id('contact-form-cont').parentNode.innerHTML = `Thanks you for submitting your review!`;
    }
  
    init();
  })();