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