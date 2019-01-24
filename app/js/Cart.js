class Cart {
    constructor(source, container = '#cart'){
        this.source = source;
        this.container = container;
        this.countGoods = 0; // Общее кол-во товаров в корзине
        this.amount = 0; // Общая стоимость товаров в корзине
        this.cartItems = []; // Все товары
        this._init();
    }
    
    _init(){
        this._render();
        fetch(this.source)
            .then(result => result.json())
            .then(data => {
                for (let product of data.contents){
                    this.cartItems.push(product);
                    this._renderItem(product);
                }
                this.countGoods = data.countGoods;
                this.amount = data.amount;
                this._renderSum();
            })
    }
    
    _render(){
        let $cartItemsDiv = $('<div/>', {
            class: 'cart-items'
        });
       
        let $totalPrice = $(`<h2><span>TOTAL</span><span class="sum-price">$${this.amount}</span></h2>`);
        
        $cartItemsDiv.appendTo($(this.container));
        $totalPrice.appendTo($(this.container));
        $(this.container).append($(`<a class="add-to-card" href="checkout.html">Checkout</a>`));
        $(this.container).append($(`<a class="cart-button" href="shopping_cart.html">Go to cart</a>`));
        
        $('.basket').append($(`<div class="cart-quantity hided">${this.countGoods}</div>`));
    }
    
    _renderItem(product){
        let $container = $('<div/>', {
            class: 'drop-backet-link',
            'data-product': product.id_product
        });
        let $details = $('<div/>', {
            class: 'drop-basket-link-details'
        });
        
        $container.append($(`<img src="${product.product_photo}" width="72px" height="85px" alt="foto-min">`));
        $details.append($(`<h3 class="product-name">${product.product_name}</h3>`));
        $details.append($(`<img src="img/stars.png" width="74px" alt="stars">`));
        $details.append($(`<p><span class="product-quantity">${product.quantity}</span> x $${product.price}</p>`));
        
        let $delBtn = $(`<button><img src="img/cancel.png" alt="cancel"></button>`);
        $delBtn.click(() => {
            this._remove(product.id_product)
        });
    
        $details.appendTo($container);
        $container.append($delBtn);
        $container.appendTo($('.cart-items'));
    }
    
    _renderSum(){
        $('.sum-price').text(`$${this.amount}`);
        if (this.countGoods > 0) {
            $('.cart-quantity').addClass('visible').removeClass('hided');
        } else {
            $('.cart-quantity').addClass('hided').removeClass('visible');
        }
        $('.cart-quantity').text(`${this.countGoods}`);
    }
    
    _updateCart(product){
        let $container = $(`div[data-product="${product.id_product}"]`);
        $container.find('.product-quantity').text(product.quantity);
        $container.find('.product-price').text(`$${product.quantity * product.price}`);
    }
    
    addProduct(element) {
        let productId = +$(element).data('id');
        let find = this.cartItems.find(product => product.id_product === productId);
        if(find){
            find.quantity++;
            this.countGoods++;
            this.amount += find.price;
            this._updateCart(find);
        } else {
            let product = {
                id_product: productId,
                product_photo: $(element).data('img'),
                product_name: $(element).data('name'),
                price: +$(element).data('price'),
                quantity: 1
            };
            
            this.cartItems.push(product);
            this._renderItem(product);
            this.amount += product.price;
            this.countGoods += product.quantity;
        }
        
        this._renderSum();
    }
    
    _remove(id){
        let find = this.cartItems.find(product => product.id_product === id);
        if(find.quantity > 1){
            find.quantity--;
            this._updateCart(find);
        } else {
            this.cartItems.splice(this.cartItems.indexOf(find), 1);
            $(`div[data-product="${id}"]`).remove();
        }
        
        this.countGoods--;
        this.amount -= find.price;
        this._renderSum();
    }
}