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
    
    // Генерация менюшек
    const $browseContainer = $('.browse');
    fetch('jsons/browse_menu.json')
        .then(result => {
            return result.json();
        })
        .then(menuData => {
            let menuItems = [];
            for (let menuItem of menuData) {
                menuItems.push(new MenuItem(menuItem));
            }
            
            let browseMenu = new Menu('', '', menuItems);
            $browseDropBox = $('<div>', {class: 'drop-box-browse'});
            $browseDropBox.html(browseMenu.render());
            $browseContainer.append($browseDropBox);
        })
        .catch(errors => console.log(errors));
    
    const $navContainer = $('.nav');
    fetch('jsons/mega_menu.json')
        .then(result => {
            return result.json();
        })
        .then(menuData => {
            let menuItems = [];
            for (let menuItem of menuData) {
                menuItems.push(new MenuItem(menuItem));
            }
            
            let mainMenu = new Menu('menu', 'drop-box', menuItems);
            $navContainer.html(mainMenu.render());
        })
        .catch(errors => console.log(errors));
});
