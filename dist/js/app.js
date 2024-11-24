"use strict"
// desktop or mobile (mouse or touchscreen)
const isMobile = {
   Android: function () { return navigator.userAgent.match(/Android/i) },
   BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i) },
   iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i) },
   Opera: function () { return navigator.userAgent.match(/Opera Mini/i) },
   Windows: function () { return navigator.userAgent.match(/IEMobile/i) },
   any: function () {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
   }
};
const isPC = !isMobile.any();
if (isPC) { document.body.classList.add('_pc') } else { document.body.classList.add('_touch') };

// медиазапросы
const MIN1024 = window.matchMedia('(min-width: 1024px)');
const MIN768 = window.matchMedia('(min-width: 768px)');

function throttle(callee, timeout) {
   let timer = null;
   return function perform(...args) {
      if (timer) return;
      timer = setTimeout(() => {
         callee(...args);
         clearTimeout(timer);
         timer = null;
      }, timeout)
   }
}

// window.addEventListener('load', (event) => {});

const HEADER_SEARCH_FORM = document.getElementById('header-search-form');
const HEADER_SEARCH_IMPUT = document.getElementById('header-search-input');
const HEADER_TOP = document.getElementById('header-top');
const HEADER = document.getElementById('header');
const allTabsBlock = document.querySelectorAll('.js-tabs-block');

function setVarHeight() {
   document.body.style.setProperty('--header-h', HEADER.offsetHeight + "px")
   document.body.style.setProperty('--header-top-h', HEADER_TOP.offsetHeight + "px")
}

const varHeight = throttle(setVarHeight, 100);
varHeight();

HEADER_SEARCH_FORM.addEventListener('blur', () => {
   closeSearch();
}, { 'capture': true })


window.addEventListener('resize', () => {
   if (MIN1024.matches) {
      closeMobileMenu();
      closeSearch();
   }
   varHeight();
   if (MIN768.matches && allTabsBlock.length > 0) closeTabsBlockThrottle();
})


// ** ======================= ALL CLICK ======================  ** //
document.documentElement.addEventListener("click", (event) => {
   if (event.target.closest('#button-open-mobile-menu')) {
      openMobileMenu();
   }
   if (event.target.closest('#button-close-mobile-menu')) {
      closeMobileMenu();
   }
   if (event.target.closest('#button-open-search')) {
      openSearch()
   }
   if (event.target.closest('.js-copy-article')) {
      navigator.clipboard.writeText(event.target.closest('.js-copy-article').innerText)
   }
   if (event.target.closest('#basket-button')) {
      openBasket();
   }
   if (event.target.closest('#close-basket')) {
      closeBasket();
   }
   if (event.target.closest('.js-button-tabs')) {
   }
})


function openMobileMenu() {
   document.body.classList.add('is-open-menu');
}
function openSearch() {
   document.body.classList.add('is-open-search');
   HEADER_SEARCH_IMPUT.focus();
}
function closeMobileMenu() {
   document.body.classList.remove('is-open-menu');
}
function closeSearch() {
   document.body.classList.remove('is-open-search');
}
function openBasket() {
   document.body.classList.add('open-basket');
   if (MIN1024.matches) {
      window.scrollTo({
         top: 0,
         left: 0,
         behavior: "smooth"
      })
   }
}
function closeBasket() {
   document.body.classList.remove('open-basket');
}
function closeTabsBlock() {
   allTabsBlock.forEach((e) => { tabs.closeTabs(e) })
}
const closeTabsBlockThrottle = throttle(closeTabsBlock, 100);


// переход фокуса при вводе кода
const INPUTS_CODE = document.querySelectorAll('.enter__code input');
if (INPUTS_CODE.length > 0) {
   INPUTS_CODE.forEach((e, i) => {
      e.addEventListener('input', () => {
         if (e.value.length > 1) { e.value = e.value.slice(0, 1) }
         if (e.value.length == 0 && INPUTS_CODE[i - 1]) { INPUTS_CODE[i - 1].focus() }
         if (e.value.length == 1 && INPUTS_CODE.length > i + 1) { INPUTS_CODE[i + 1].focus() }
      })
   })
   INPUTS_CODE.forEach((e, i) => {
      e.addEventListener('paste', (event) => {
         paste(event.clipboardData.getData('text/plain'));
      })
   })
   function paste(val) {
      INPUTS_CODE.forEach((e, i) => { val[i] ? e.value = val[i] : e.value = "" })
   }
}

// перемещение блоков при адаптиве
// data-da=".class,3,768" 
// класс родителя куда перемещать
// порядковый номер в родительском блоке куда перемещается начиная с 0 как индексы массива
// ширина экрана min-width
// два перемещения: data-da=".class,3,768,.class2,1,1024"
const ARRAY_DATA_DA = document.querySelectorAll('[data-da]');
ARRAY_DATA_DA.forEach(function (e) {
   const dataArray = e.dataset.da.split(',');
   const addressMove = searchDestination(e, dataArray[0]);
   const addressMoveSecond = dataArray[3] && searchDestination(e, dataArray[3]);
   const addressParent = e.parentElement;
   const listChildren = addressParent.children;
   const mediaQuery = window.matchMedia(`(min-width: ${dataArray[2]}px)`);
   const mediaQuerySecond = dataArray[5] && window.matchMedia(`(min-width: ${dataArray[5]}px)`);
   for (let i = 0; i < listChildren.length; i++) { !listChildren[i].dataset.n && listChildren[i].setAttribute('data-n', `${i}`) };
   mediaQuery.matches && startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray);
   if (mediaQuerySecond && mediaQuerySecond.matches) moving(e, dataArray[4], addressMoveSecond);
   mediaQuery.addEventListener('change', () => { startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray) });
   if (mediaQuerySecond) mediaQuerySecond.addEventListener('change', () => {
      if (mediaQuerySecond.matches) { moving(e, dataArray[4], addressMoveSecond); return; };
      startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray);
   });
});

function startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray) {
   if (mediaQuery.matches) { moving(e, dataArray[1], addressMove); return; }
   if (listChildren.length > 0) {
      for (let z = 0; z < listChildren.length; z++) {
         if (listChildren[z].dataset.n > e.dataset.n) {
            listChildren[z].before(e);
            break;
         } else if (z == listChildren.length - 1) {
            addressParent.append(e);
         }
      }
      return;
   }
   addressParent.prepend(e);
};

function searchDestination(e, n) {
   if (e.classList.contains(n.slice(1))) { return e }
   if (e.parentElement.querySelector(n)) { return e.parentElement.querySelector(n) };
   return searchDestination(e.parentElement, n);
}

function moving(e, order, addressMove) {
   if (order == "first") { addressMove.prepend(e); return; };
   if (order == "last") { addressMove.append(e); return; };
   if (addressMove.children[order]) { addressMove.children[order].before(e); return; }
   addressMove.append(e);
}



if (document.querySelector('.filter')) {
   // переменные
   const FORM_FILTER = document.forms.filter;
   const INPUTS_CHECK = FORM_FILTER && FORM_FILTER.querySelectorAll('input[type="checkbox"],input[type="radio"]');
   const INPUTS_NUMBER = FORM_FILTER && FORM_FILTER.querySelectorAll('input[type="number"]')
   const VERTICAL_INDICATOR = document.querySelector('.filter__vertical-indicator');
   const FILTER = document.querySelector('.filter');

   // двойной ползунок
   const INPUT_MAX = document.querySelector('.filter__max');
   const INPUT_MIN = document.querySelector('.filter__min');
   const SPIN_MAX = document.querySelector('.spin-max');
   const SPIN_MIN = document.querySelector('.spin-min');
   const PRICE_RANGE = document.querySelector('.track-range');
   const MAX_VALUE = Number(INPUT_MAX.max);
   const MIN_VALUE = Number(INPUT_MIN.min);
   let mouseX;
   let spinMove = false;
   let spinWidth = SPIN_MAX.offsetWidth;
   let rangeStart = PRICE_RANGE.getBoundingClientRect().left;
   let rangeWidth = PRICE_RANGE.offsetWidth - spinWidth;
   let maxRange = MAX_VALUE - MIN_VALUE;

   (function () {
      INPUT_MAX.value = INPUT_MAX.max;
      INPUT_MIN.value = INPUT_MAX.min;
      SPIN_MAX.ondragstart = function () { return false };
      SPIN_MIN.ondragstart = function () { return false };
      setGradient();
   })();

   isPC && document.addEventListener('mousemove', mousemove);
   isPC && SPIN_MAX.addEventListener('mousedown', startEvent);
   isPC && SPIN_MIN.addEventListener('mousedown', startEvent);
   isPC && document.addEventListener('mouseup', andEvent);
   !isPC && document.addEventListener('touchmove', mousemove);
   !isPC && SPIN_MAX.addEventListener('touchstart', startEvent);
   !isPC && SPIN_MIN.addEventListener('touchstart', startEvent);
   !isPC && document.addEventListener('touchend', andEvent);

   INPUT_MAX.addEventListener('change', () => {
      validationInput(INPUT_MAX);
      setRange(INPUT_MAX, SPIN_MAX);
   });
   INPUT_MIN.addEventListener('change', () => {
      validationInput(INPUT_MIN);
      setRange(INPUT_MIN, SPIN_MIN);
   });

   function startEvent(event) {
      !MIN1366.matches && getProperties(); // MIN... медиазапрос при какой ширине меняется длинна ползунка, необходимо создать эту переменную
      !isPC ? mouseX = event.changedTouches[0].clientX : false;
      if (event.target.closest('.spin-max')) {
         spinMove = true;
         SPIN_MAX.style.zIndex = 2;
         SPIN_MIN.style.zIndex = 1;
         moveRange(SPIN_MAX, INPUT_MAX)
      }
      if (event.target.closest('.spin-min')) {
         spinMove = true;
         SPIN_MIN.style.zIndex = 2;
         SPIN_MAX.style.zIndex = 1;
         moveRange(SPIN_MIN, INPUT_MIN)
      }
   }

   function andEvent() { spinMove = false };
   function mousemove(event) { isPC ? mouseX = event.clientX : mouseX = event.changedTouches[0].clientX };

   function validationInput(input) {
      const val = input.value;
      if (val < MIN_VALUE) input.value = MIN_VALUE;
      if (val > MAX_VALUE) input.value = MAX_VALUE;
      if (INPUT_MAX == input && Number(INPUT_MAX.value) < Number(INPUT_MIN.value)) { input.value = INPUT_MIN.value };
      if (INPUT_MIN == input && Number(INPUT_MIN.value) > Number(INPUT_MAX.value)) { input.value = INPUT_MAX.value };
   }

   function setRange(imput, spin) {
      let offsetSpin = (imput.value - MIN_VALUE) / maxRange;
      spin.style.left = offsetSpin * rangeWidth + 'px';
      setGradient();
      checkClearButton();
   }

   function setGradient() {
      PRICE_RANGE.style.setProperty('--minGradient', ((INPUT_MIN.value - MIN_VALUE) / maxRange * 100).toFixed(1) + '%');
      PRICE_RANGE.style.setProperty('--maxGradient', ((INPUT_MAX.value - MIN_VALUE) / maxRange * 100).toFixed(1) + '%');
   }

   function moveRange(spin, input) {
      if (!spinMove) return;
      let offsetLeft = mouseX - rangeStart - spinWidth / 2;
      if (offsetLeft < 0) { offsetLeft = 0 };
      if (offsetLeft > rangeWidth) { offsetLeft = rangeWidth };
      let value = Number((MIN_VALUE + offsetLeft / rangeWidth * maxRange).toFixed());
      if (INPUT_MAX == input && value < Number(INPUT_MIN.value)) { value = INPUT_MIN.value };
      if (INPUT_MIN == input && value > Number(INPUT_MAX.value)) { value = INPUT_MAX.value };
      input.value = value;
      setRange(input, spin);
      requestAnimationFrame(() => moveRange(spin, input))
   }

   function getProperties() {
      spinWidth = SPIN_MAX.offsetWidth;
      rangeStart = PRICE_RANGE.getBoundingClientRect().left;
      rangeWidth = PRICE_RANGE.offsetWidth - spinWidth;
      maxRange = MAX_VALUE - MIN_VALUE;
      setRange(INPUT_MAX, SPIN_MAX);
      setRange(INPUT_MIN, SPIN_MIN);
   }

   window.addEventListener('resize', () => {
      getProperties();
   })

   function clearFilter() {
      INPUTS_CHECK.forEach((e) => { e.checked = false });
      if (VERTICAL_INDICATOR) { VERTICAL_INDICATOR.style.setProperty('--indicator-height', '0px') };
      INPUTS_NUMBER.forEach((e) => {
         if (e.name == "range_min") { e.value = e.min };
         if (e.name == "range_max") { e.value = e.max };
         getProperties();
      })
      checkClearButton();
   }

   function openFilterCategory(element) {
      const parent = element.closest('.filter__block');
      parent.classList.toggle('open-category');
      if (!parent.querySelector('.filter__list-hidden')) return;
      if (parent.classList.contains('open-category')) {
         setTimeout(() => { parent.querySelector('.filter__list-hidden').style.overflowY = "auto" }, 300)
      } else {
         parent.querySelector('.filter__list-hidden').style.overflowY = "";
      }
   }

   function checkInputIndicator(list) {
      list.forEach((e) => {
         if (e.querySelector('input').checked) {
            VERTICAL_INDICATOR.style.setProperty('--indicator-height', e.clientHeight / 2 + e.offsetTop + 'px')
         }
      })
   }

   if (VERTICAL_INDICATOR) {
      const filter_check = VERTICAL_INDICATOR.querySelectorAll('.filter__check');
      VERTICAL_INDICATOR.addEventListener('click', (event) => {
         checkInputIndicator(filter_check);
      })
   }

   FORM_FILTER.addEventListener('change', (event) => {
      checkClearButton()
   })

   function checkClearButton() {
      FILTER.classList.add('clear-hidden');
      clearMarking();
      INPUTS_CHECK.forEach((e) => {
         if (e.checked) {
            showClearButton();
            addMarking(e);
         }
      });
      INPUTS_NUMBER.forEach((e) => {
         if (e.name == "range_min" && e.value !== e.min) {
            showClearButton();
            addMarking(e);
         };
         if (e.name == "range_max" && e.value !== e.max) {
            showClearButton();
            addMarking(e);
         };
      })
   }
   function showClearButton() {
      FILTER.classList.remove('clear-hidden')
   }
   function addMarking(e) {
      let el = e.closest('.filter__block').querySelector('.filter__category');
      el && el.classList.add('mark');
   }
   function clearMarking() {
      document.querySelectorAll('.mark').forEach((e) => { e.classList.remove('mark') })
   }
   document.addEventListener('click', (event) => {
      // открывает вкладки фильтра
      if (event.target.closest('.filter__category')) {
         openFilterCategory(event.target.closest('.filter__category'))
      }
      // очистка фильтров
      if (event.target.closest('.filter__clear')) {
         clearFilter();
      }
   })


}    

/* открывает, закрывает модальные окна. */
/*
добавить классы
js-modal-hidden - родительский контейнер модального окна который скрывается и показывается, задать стили скрытия
js-modal-visible - задать стили открытия
js-modal-close - кнопка закрытия модального окна находится внутри js-modal-hidde
кнопка открытия, любая:
js-modal-open - кнопка открытия модального окна
data-modal_open="id" - id модального окна
если надо что бы окно закрывалось при клике на пустое место (фон), добавляется атрибут js-modal-stop-close.
js-modal-stop-close - атрибут указывает на поле, при клике на которое не должно происходить закрытие окна, 
т.е. контейнер контента, при этом внешний родительский контейнет помечается атрибутом js-modal-close.
допускается дополнительно кнопка закрытия внутри js-modal-stop-close.
*/
document.addEventListener('click', (event) => {
   if (event.target.closest('.js-modal-open')) { openModal(event) }
   if (event.target.closest('.js-modal-close')) { testModalStopClose(event) }
})
function openModal(event) {
   console.log('open');
   let modalElement = event.target.closest('.js-modal-open').dataset.modal_open;
   if (typeof modalElement !== "undefined" && document.querySelector(`#${modalElement}`)) {
      document.querySelector(`#${modalElement}`).classList.add('js-modal-visible');
      document.body.classList.add('body-overflow')
   }
}
function testModalStopClose(event) {
   if (event.target.closest('.js-modal-stop-close') &&
      event.target.closest('.js-modal-stop-close') !==
      event.target.closest('.js-modal-close').closest('.js-modal-stop-close')) {
      return
   }
   closeModal(event);
}
function closeModal(event) {
   console.log('close');

   event.target.closest('.js-modal-hidden').classList.remove('js-modal-visible');
   if (!document.querySelector('.js-modal-visible')) {
      document.body.classList.remove('body-overflow');
   }
}
if (document.querySelector('.basket__count')) {
   document.body.addEventListener('click', (event) => {
      if (event.target.closest('.basket__dicrement')) {
         const input = event.target.closest('.basket__count').querySelector('input');
         input.value = Number(input.value) - 1;
         validationQuantityBasket(input);
      }
      if (event.target.closest('.basket__increment')) {
         const input = event.target.closest('.basket__count').querySelector('input');
         input.value = Number(input.value) + 1;
      }
   })

   // проверка количесва товара в корзине
   const QUANTITY_BASKET = document.querySelectorAll('.basket__count input');
   QUANTITY_BASKET.forEach((e) => {
      e.addEventListener('input', () => validationQuantityBasket(e))
   })
   function validationQuantityBasket(e) {
      if (e.value < 1) { e.value = 1; }
   }
}
// js-tabs-body - тело вкладки
// js-tabs-hover - работает hover на ПК, отключает клик на ПК, для touchscreen надо раставить js-tabs-click или js-tabs-toggle
// js-tabs-closing - вместе с js-tabs-bod закрыть вкладку при событии вне данной вкладки
// js-tabs-click - открыть при клике (зона клика)
// js-tabs-toggle - открыть или закрыть при клике (зона клика)
// js-tabs-shell - оболочка скрывающая js-tabs-inner
// js-tabs-inner - оболочка контента
// 
//  работает в связке с определением touchscreen  (isPC)


class Tabs {
   constructor() {
      this.listClosingTabs = document.querySelectorAll('.js-tabs-closing');
      this.listHover = document.querySelectorAll('.js-tabs-hover');
      this.listTabsBody = document.querySelectorAll('.js-tabs-body');
   };
   init = () => {
      document.body.addEventListener('click', this.eventClick);
      if (isPC) document.body.addEventListener('mouseover', this.eventMouseOver)
      window.addEventListener('resize', this.resize);
   };
   eventMouseOver = (event) => {
      if (event.target.closest('.js-tabs-hover')) this.openTabs(event);
      this.closeAllHover(event);
   };
   eventClick = (event) => {
      if (isPC && event.target.closest('.js-tabs-hover')) return;
      this.closeAll(event);
      if (event.target.closest('.js-tabs-click')) this.openTabs(event);
      if (event.target.closest('.js-tabs-toggle')) this.toggleTabs(event);
   };
   openTabs = (event) => {
      const body = event.target.closest('.js-tabs-body');
      if (!body) return;
      body.classList.add('js-tabs-open');
      this.setHeight(body);
   };
   closeTabs = (body) => {
      body.classList.remove('js-tabs-open');
      this.clearHeight(body);
   };
   closeAll = (event) => {
      const body = event.target.closest('.js-tabs-body');
      if (this.listClosingTabs.length == 0 && body) return;
      this.listClosingTabs.forEach((e) => { if (e !== body) this.closeTabs(e); })
   };
   closeAllHover = (event) => {
      const body = event.target.closest('.js-tabs-hover');
      if (this.listHover.length == 0 && body) return;
      this.listHover.forEach((e) => { if (e !== body) this.closeTabs(e) })
   };
   setHeight = (body) => {
      const heightValue = body.querySelector('.js-tabs-inner').offsetHeight;
      body.querySelector('.js-tabs-shell').style.height = heightValue + "px";
   };
   clearHeight = (body) => { body.querySelector('.js-tabs-shell').style.height = "" }
   toggleTabs = (event) => {
      const body = event.target.closest('.js-tabs-body');
      if (body.classList.contains('js-tabs-open')) {
         this.closeTabs(body);
         return;
      }
      this.openTabs(event);
   };
   throttle = () => {
      let timer = null;
      return () => {
         if (timer) return;
         timer = setTimeout(() => {
            const unlocked = document.querySelectorAll('.js-tabs-open');
            unlocked.forEach((e) => { this.setHeight(e) })
            clearTimeout(timer);
            timer = null;
         }, 100)
      }
   };
   resize = this.throttle();
}
const tabs = new Tabs();
tabs.init();







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
   let tab_1 = new TabsSwitching('.bestsellers__nav', '.bestsellers__button', '.bestsellers__swiper', setValue);
   tab_1.init();
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