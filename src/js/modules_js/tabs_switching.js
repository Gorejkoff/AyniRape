class TabsSwitching {
   constructor(body__buttons, button, tab, execute) {
      this.name_button = button;
      this.body__buttons = document.querySelector(body__buttons);
      this.button = document.querySelectorAll(button);
      this.tab = document.querySelectorAll(tab);
      this.execute = execute;
   }
   init = () => {
      this.body__buttons.addEventListener('click', (event) => {
         if (event.target.closest(this.name_button)) {
            let n = event.target.closest(this.name_button).dataset.button;
            this.button.forEach((e) => { e.classList.toggle('active', e.dataset.button == n) });
            if (this.tab.length > 0) { this.tab.forEach((e) => { e.classList.toggle('active', e.dataset.tab == n) }) }
            if (this.execute) { this.execute(event) };
         }
      })
   }
}

if (document.querySelector('.bestsellers__body')) {
   let tab = new TabsSwitching('.tab', '.tab__button', '.bestsellers__swiper', setValue);
   tab.init();
}

function setValue(event) {
   let parent = event.target.closest('.js-tabs-body');
   if (!parent) return;
   let activeText = parent.querySelector('.active');
   if (!activeText) return;
   let text = parent.querySelector('.js-tabs-text');
   if (!text) return;
   text.innerText = activeText.innerText;
}

if (document.querySelector('.personal__order')) {
   let tab = new TabsSwitching('.personal__order-tab-buttons', '.personal__order-tab-button', '.personal__order-tab');
   tab.init();
}