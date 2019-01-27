$(document).ready(() => {
    // Создание экземпляра класса Cart
    let cart = new Cart('jsons/getCart.json');
    
    // Добавление товара в корзину
    $('.add').click(e => {
        cart.addProduct(e.currentTarget);
    });
    
    // Создание экземпляра класса отзывов
    if ($('#feedbacks').length) {
        let feedback = new Feedback('jsons/feedback.json');
    }
    
    // Добавление даты в футер
    $('.copyline').html(`&copy&nbsp${new Date().getFullYear()}&nbsp;Brand All Rights Reserved.`);
});
