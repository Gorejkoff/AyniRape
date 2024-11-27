if (document.querySelector('#personal')) {
   const formItem = document.forms.personal
   const listInputs = formItem.querySelectorAll('.input');
   const buttonEdit = document.getElementById('personal-edit');
   const buttonSave = document.getElementById('personal-save');

   document.body.addEventListener('click', (event) => {

      if (event.target.closest('#personal-edit')) {
         edit();
      }
      if (event.target.closest('#personal-save')) {
         save();
      }

   })

   function edit() {
      listInputs.forEach(element => {
         element.disabled = false;
      });
      buttonEdit.style.display = "none";
      buttonSave.style.display = "flex";
   }
   function save() {
      listInputs.forEach(element => {
         element.disabled = true;
      });
      buttonEdit.style.display = "flex";
      buttonSave.style.display = "none";
   }


}