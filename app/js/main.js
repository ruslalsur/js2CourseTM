$(document).ready(() => {
    // Создание экземпляра класса Cart
    let cart = new Cart('jsons/getCart.json');
    
    // Добавление товара в корзину
    $('.add').click(e => {
        cart.addProduct(e.currentTarget);
    });
    
    $('.cart-button-control .cart-button').click(() => {
        cart.clearCart();
    });
    
    // Создание экземпляра класса отзывов
    if ($('#feedbacks').length) {
        let feedback = new Feedback('jsons/feedback.json');
    }
    
    // Добавление даты в футер
    $('.copyline').html(`&copy&nbsp${new Date().getFullYear()}&nbsp;Brand All Rights Reserved.`);
    
    // Инициализация слайдера на странице одного товара
    if ($('.sl-carousel').length) {
        $('.sl-carousel').slick({
            autoplay: true,
            autoplaySpeed: 2000,
            arrows: false,
        });
    }
});
