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
const MAX1024 = window.matchMedia('(max-width: 1023.98px)');

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
   if (!MAX1024.matches) {
      closeMobileMenu();
      closeSearch();
   }
   varHeight();
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
}
function closeBasket() {
   document.body.classList.remove('open-basket');
}



