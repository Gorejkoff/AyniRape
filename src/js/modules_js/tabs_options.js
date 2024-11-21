class TabsOpen {
   constructor(options) {
      this.tabBody = options.tabBody;
      this.tabButton = options.tabButton;
      this.tabContent = options.tabContent;
      this.tabContentInner = options.tabContentInner;
      this.tabBodySecond = options.tabBodySecond;
      this.tabButtonSecond = options.tabButtonSecond;
      this.tabContentSecond = options.tabContentSecond;
      this.tabContentInnerSecond = options.tabContentInnerSecond;
      this.pc = document.body.classList.contains('_pc'); // true если dasktop, иначе false. Работает в связке с isMobile
      this.parentTabs = document.querySelector(options.name);
      this.tabsList = this.parentTabs.querySelectorAll(options.tabBody);
      this.tabsListSecond = this.parentTabs.querySelectorAll(options.tabBodySecond);
      this.hover = options.hover == false ? false : true; // реакция табов на hover
      this.closeAllTabs = options.closeAllTabs == true ? true : false; // закрывать все табы
      this.closeClickContent = options.closeClickContent == true ? true : false; // закрыть при клике в области контента таба
      this.externalFunction = options.externalFunction; // внешняя функция для события click
      this.externalFunctionResize = options.externalFunctionResize; // внешняя функция для события resize
   }
   init = () => {
      document.body.addEventListener('click', this.examinationClick);
      this.hover && this.pc && document.body.addEventListener('mouseover', this.examinationHover);
      this.resize();
   };
   examinationClick = (event) => {
      this.externalFunction && this.externalFunction(event);
      if (this.hover && this.pc) return;
      let eventElement = this.closeClickContent ? event.target.closest(this.tabBody) : event.target.closest(this.tabButton);
      if (eventElement && event.target.closest(this.tabBody).classList.contains('active')) {
         this.close(event.target.closest(this.tabBody));
         return;
      }
      if (eventElement && !this.closeAllTabs) {
         this.open(event.target.closest(this.tabBody));
         return;
      }
      if (event.target.closest(this.tabBodySecond)) {
         if (event.target.closest(this.tabBodySecond).classList.contains('active')) {
            this.closeSecond(event.target.closest(this.tabBodySecond));
         } else {
            this.openSecond(event.target.closest(this.tabBodySecond));
         }
         this.open(event.target.closest(this.tabBody));
      }

      if (eventElement) {
         this.tabsList.forEach((element) => {
            element == event.target.closest(this.tabBody) ? this.open(element) : this.close(element);
         });
         return;
      }
      if (!event.target.closest(this.tabContent) && this.closeAllTabs) {
         this.tabsList.forEach(element => this.close(element));
         this.tabsListSecond.forEach(element => this.closeSecond(element));
      }
   }
   examinationHover = (event) => {
      if (event.target.closest(this.tabBody)) {
         this.tabsList.forEach((element) => {
            element == event.target.closest(this.tabBody) ? this.open(element) : this.close(element);
         });
      } else {
         this.tabsList.forEach(element => this.close(element));
      }
      if (event.target.closest(this.tabBodySecond)) {
         this.tabsListSecond.forEach((element) => {
            element == event.target.closest(this.tabBodySecond) ? this.openSecond(element) : this.closeSecond(element);
         });
         this.open(event.target.closest(this.tabBody));
      } else {
         this.tabsListSecond.forEach(element => this.closeSecond(element));
         this.open(event.target.closest(this.tabBody));
      }
   }
   open = (element) => {
      element.querySelector(this.tabContent).style.height = this.getSize(element) + 'px';
      element.classList.add('active');
   };
   openSecond = (element) => {
      element.querySelector(this.tabContentSecond).style.height = this.getSizSecond(element) + 'px';
      element.classList.add('active');
   };
   close = (element) => {
      if (element.querySelector(this.tabContent)) element.querySelector(this.tabContent).style.height = '';
      element.classList.remove('active');
      this.tabsListSecond.forEach(element => this.closeSecond(element));
   };
   closeSecond = (element) => {
      if (element.querySelector(this.tabContentSecond)) element.querySelector(this.tabContentSecond).style.height = '';
      element.classList.remove('active');
   };
   adjustment = () => {
      this.tabsList.forEach((e) => e.classList.contains('active') && this.open(e));
      this.externalFunctionResize && this.externalFunctionResize()
   };
   getSize = (element) => { return element.querySelector(this.tabContentInner).clientHeight };
   getSizSecond = (element) => { return element.querySelector(this.tabContentInnerSecond).clientHeight };
   resize = () => window.addEventListener('resize', this.adjustment);
}

/* if (document.querySelector('.calculator')) {
   new TabsOpen({
      name: '#modal-calculator',
      tabBody: '.js-tab-body',
      tabButton: '.js-tab-button',
      tabContent: '.js-tab-content',
      tabContentInner: '.js-tab-content-inner',
      hover: false,
      closeAllTabs: true,
      closeClickContent: false,
      externalFunction: choise,
   }).init();
}

function choise(event) {
   if (event.target.closest('.js-tabs-value')) {
      let tabBbody = event.target.closest(this.tabBody);
      let tabSelect = tabBbody.querySelector('.js-tab-selected');
      let valueInput = event.target.closest('.js-tabs-value').querySelector('input').value;
      tabSelect.innerHTML = valueInput;
   }
} */


/* if (document.querySelector('.catalog-nav')) {

   const first = new TabsOpen({
      name: '.catalog-nav',
      tabBody: '.catalog-nav__first',
      tabButton: '.catalog-nav__first-button',
      tabContent: '.catalog-nav__second',
      tabContentInner: '.catalog-nav__second-inner',
      tabBodySecond: '.catalog-nav__second-item',
      tabButtonSecond: '.catalog-nav__second-button',
      tabContentSecond: '.catalog-nav__third',
      tabContentInnerSecond: '.catalog-nav__third-inner',
      hover: false,
      closeAllTabs: true,
      closeClickContent: false,
   }).init();
} */
