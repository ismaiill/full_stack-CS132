  /*
  Author:  Ismail Abouamal
  Date: June 9, 2023.
  This is the JavaScript code manipulating the DOM in procduct.HTML. All functions are documented.
  */
(function() {
    "use strict";
    
    /* Module global variable to keep track on the current tutoros populating the 'product' page.
    */
    let tutors;

    async function init() {
      const filerButton = id("filter-button");
      id('specialty').addEventListener('change',updatePreferences);
      id('write-review').addEventListener('click', displayReviewForm);
      filerButton.addEventListener("click",applyFilter);
      getAllTutors();

      for (let i = 1; i <= 5; i++) {
      qs(`label[for=star${i}]`).addEventListener('mouseenter', function() {
        showStars(i);
      });
      qs(`label[for=star${i}]`).addEventListener('mouseleave', function() {
        hideStars(i);
      });
      }
    
      
    }
    
   /**
   * Returns a JSON file containting the list of available tutors.
   */
    async function getAllTutors(){
        let url = "/tutors";
        try {
          let resp = await fetch(url);
          resp = checkStatus(resp);
          tutors = await resp.json();
          populateTutors(tutors);
        } catch (err) {
          console.log('We can not get the list of tutors. Please try again')
        }
    }


   /**
   * Returns a JSON file containting the list of tutors based on their specialty
   * @param specialty - specialty of the tutor.
   */
   async function getSpecTutors(specialty){
    let url = `/TutorSpec?specialty=${specialty}`;
    try {
      let resp = await fetch(url);
      resp = checkStatus(resp);
      tutors = await resp.json();
      populateTutors(tutors);
    } catch (err) {
      console.log('We can not get the list of tutors. Please try again')
    }
  }

  /**
   * Returns a JSON file containting the the specific information of the tutor 'name'.
   * @param name -  name of the tutor
   */
  async function getTutorInfo(name){

      let url = `/tutors/${name}`;
      try {
        let resp = await fetch(url);
        resp = checkStatus(resp);
        const data = await resp.json();
        console.log(data)
      } catch (err) {
        console.log('Tutor info is not available')
      }
  }

  /**
   * Populate the poduct.HTML page with the list of tutors.
   * @param {string} tutors - list of tutors
   */
  function  populateTutors(tutors){
    id('results').innerHTML = ''
    for (let key in tutors) {
      createTutorCard(key);
    }
  }

  /**
   * Create a card for each tutor. The card contains the name and button to learn more about the tutor.
   * @param {string} key - tutors nickname
   */
  function createTutorCard(key){

    const imagePath= tutors[key].image_path;
    const imageUrl = `http://localhost:8000/${imagePath}`;
    const imageElement = document.createElement('img');
    const TutorCard = document.createElement('article');
    const title = document.createElement('p');
    const MoreInfo =  document.createElement('div');
    const specialty = document.createElement('p');
    const MoreInfoButton = document.createElement('button');
    MoreInfoButton.addEventListener('click',() => displayTutorInfo(key));
    MoreInfoButton.innerHTML ='Learn More ';
    MoreInfoButton.setAttribute('id','submit-button');
    MoreInfo.appendChild(MoreInfoButton);
    TutorCard.classList.add('tutor');
    MoreInfo.classList.add('more-info');


    imageElement.src = imageUrl;
    imageElement.alt = key;
    title.innerHTML = `Name: ${tutors[key].fullName}`;
    specialty.innerHTML = `Specialty: ${tutors[key].specialty}`;
    TutorCard.appendChild(imageElement);
    TutorCard.appendChild(title);
    TutorCard.appendChild(specialty);
    TutorCard.appendChild(MoreInfo);
    id('results').appendChild(TutorCard);
  }

  /**
   * Apply the filer 'specialty' to get the tutors that match the users pereference.
   */
  function applyFilter(){
    const selectedSpecialty =  qs('select').value;
    getSpecTutors(selectedSpecialty);
    console.log(`/TutorSpec?specialty=${selectedSpecialty}`);

  }

  /*
  * Update the the HTML code of the specialty search bar.s
  */
  function updatePreferences(){
    const oldSpecialty = qs('option[selected]');
    const selectedSpecialty = qs('select').value;
    oldSpecialty.removeAttribute('selected');
    const newSelection = qs(`option[value="${selectedSpecialty}"]`);
    newSelection.setAttribute('selected', ''); 
  }

  /**
   * Displays the tutors information page ('aka profile page ').
   */
  function displayTutorInfo(key) {
    const tutorInfo = tutors[key];
    const imagePath= tutorInfo.image_path;
    const imageUrl = `http://localhost:8000/${imagePath}`;
    id('products-view').classList.add('hide');
    id('search-bar-container').classList.add('hide');
    id('single-view').classList.remove('hide')
    let image = id('single-view').querySelector('img');
    let title = id('single-view').querySelector('h3');
    let MoreInfo = id('single-view').querySelector('ul');

    image.src = imageUrl;
    image.alt = key;
    title.innerHTML = `${tutorInfo.fullName}`;
    MoreInfo.children[0].textContent = ` Education: ${tutorInfo.education}.`;
    MoreInfo.children[1].textContent = ` Years of Experience: ${tutorInfo.yearsOfExperience} years.`;
    MoreInfo.children[2].textContent = ` Rate: $ ${tutorInfo.ratePerHour}/hr.`;
    MoreInfo.children[3].textContent = ` Teaching Format: ${tutorInfo.teachingFormat}.`;
    MoreInfo.children[4].textContent = ` Specialty: ${tutorInfo.specialty}.`;
  
    let Reviews = tutorInfo.reviews;
    for (let i = 0; i < Reviews.length; i++){
      let NewReview =  document.createElement('div');
      NewReview.setAttribute('class','review-entry');

      let NameSection = document.createElement('section');
      NameSection.innerHTML = Reviews[i].name + ':';
      let NameDiv = document.createElement('div');
      NameDiv.appendChild(NameSection);
      NewReview.appendChild (NameDiv);
      
      let ReviewSection = document.createElement('section');
      ReviewSection.innerHTML = `&ldquo; ${Reviews[i].review} &rdquo;`;
      let ReviewDiv = document.createElement('div');
      ReviewDiv.appendChild(ReviewSection);
      NewReview.appendChild (ReviewDiv);


      let Stars = createStars(Reviews[i].rating);
      NewReview.appendChild (Stars);      


      id('reviews').appendChild(NewReview);
    }
    id('AboutMe').innerHTML = tutorInfo.AboutMe;
  }

  /**
   * helper function to create the desired number of stars for the review section.
   * @param {int} rating - rating
   * @returns - Div element containing the 'rating' number of stars.
   */
  function createStars (rating){
    let RatingDiv = document.createElement('div');
    for (let i = 1; i <= rating; i++){
      let fullStar = document.createElement('span');
      fullStar.innerHTML = '&#9734'
      fullStar.setAttribute('class','full-star');
      RatingDiv.appendChild(fullStar);
    }

    if (rating < 5){
      for (let i = rating; i <= 5; i++){
        let EmptyStar = document.createElement('span');
        EmptyStar.innerHTML = `&#9734`
        RatingDiv.appendChild(EmptyStar);
      }
    }
    return RatingDiv; 

  }

  /**
   * Displays the review form.
   */
  function displayReviewForm(){
   qs('#single-view > div:first-child').classList.remove('hide');
   let tutorNickName = qs('#tutor-profil-left img').alt;
   id('tutorNickName').value = tutorNickName;

  }

  /**
   * Hides the review form.
   */
  function removeReviewForm(){
    qs('#single-view > div:first-child').classList.toggle('hide');
  }

  /**
   * Shows stars when the mouse hovers over the stars area.
   * @param {int} rating - rating of the tutor  
   */ 
  function showStars(rating){

    resetStars();
    for (let i = 1; i <= rating; i++) {
      qs(`label[for=star${i}]`).classList.add('full-star');
    }
  }

  /**
   * Hide stars when the mouse leaves the stars area.
   * @param {int} rating - rating of the tutor  
   */
  function hideStars(rating){
    for (let i = 1; i <= rating; i++) {
      qs(`label[for=star${i}]`).classList.remove('full-star');
    }
    const checkedRadio = qs("input[type='radio']:checked");
    if (checkedRadio !== null) {
    console.log(checkedRadio.value);
    fillStars(checkedRadio.value);
      }
  }

/**
 * Fills the stars when the user clicks on a given star.
 * @param {int} rating - rating of the tutor  
 */
  function fillStars(rating) {
    resetStars();
    for (let i = 1; i <= rating; i++) {
      qs(`label[for=star${i}]`).classList.add('full-star');
    }

  }

  /**
   * helper function to reset the stars that are not filled.
   */
  function resetStars(){
    for (let i = 1; i <= 5; i++) {
      qs(`label[for=star${i}]`).classList.remove('full-star');
    }
  }

    init();
})();