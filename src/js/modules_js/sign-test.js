if (document.querySelector('#registration')) {


   const REGISTRATION_BUTTON = document.getElementById('registration-button');
   const registration = document.getElementById('registration');
   const code = document.getElementById('code');


   REGISTRATION_BUTTON.addEventListener('click', (event) => {
      event.preventDefault();
      registration.style.display = "none";
      code.style.display = "flex";
   })



}