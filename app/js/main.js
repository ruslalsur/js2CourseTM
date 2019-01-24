$(document).ready(() => {
    // Создание экземпляра класса Cart
    let cart = new Cart('jsons/getCart.json');
    
    // Добавление товара в корзину
    $('.add').click(e => {
        cart.addProduct(e.currentTarget);
    });
});