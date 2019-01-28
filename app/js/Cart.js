class Cart {
    constructor(source, container = '#cart', container2 = '#cart-max') {
        this.source = source;
        this.container = container;
        this.containerMax = container2;
        this.countGoods = 0; // Общее кол-во товаров в корзине
        this.amount = 0; // Общая стоимость товаров в корзине
        this.cartItems = []; // Все товары
        this._init();
    }
    
    _init(){
        this._render();
        if ($(this.containerMax).length) {
            this._renderMax();
        }
        
        if (!localStorage.getItem('cart_items')) {
            fetch(this.source)
                .then(result => result.json())
                .then(data => {
                    for (let product of data.contents) {
                        this.cartItems.push(product);
                        this._renderItem(product);
                        this._renderItemMax(product);
                    }
            
                    this.countGoods = data.countGoods;
                    this.amount = data.amount;
    
                    // localStorage.setItem('cart_items', JSON.stringify(this.cartItems));
                    // localStorage.setItem('cart_amount', JSON.stringify(this.amount));
                    // localStorage.setItem('cart_count_goods', JSON.stringify(this.countGoods));
                    this._storageUpdate();
                    this._renderSum();
                })
        } else {
            this.cartItems = JSON.parse(localStorage.getItem('cart_items'));
            for (let product of this.cartItems) {
                this._renderItem(product);
                this._renderItemMax(product);
            }
            this.amount = JSON.parse(localStorage.getItem('cart_amount'));
            this.countGoods = JSON.parse(localStorage.getItem('cart_count_goods'));
            this._renderSum();
        }
    }
    
    // обновление локального хранилища
    _storageUpdate() {
        localStorage.setItem('cart_items', JSON.stringify(this.cartItems));
        localStorage.setItem('cart_amount', JSON.stringify(this.amount));
        localStorage.setItem('cart_count_goods', JSON.stringify(this.countGoods));
    }
    
    // отображение маленькой корзины
    _render() {
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
    
    // отображение не маленькой корзины
    _renderMax() {
            let $cartItemRow = $('<div/>', {
                class: 'product-list-row'
            });
            
            // отображение заголовка не маленькой корзины
            let cartHead = ['product details', 'unite price', 'quantity', 'shipping', 'subtotal', 'action'];
            for (let header of cartHead) {
                $cartItemRow.append($(`<div class="product-list-col">${header}</div>`));
            }
            $cartItemRow.appendTo($(this.containerMax));
    }
    
    // отображение единицы товара в маленькой корзине
    _renderItem(product) {
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
            this._remove(product.id_product);
        });
    
        $details.appendTo($container);
        $container.append($delBtn);
        $container.appendTo($('.cart-items'));
    }

    // отображение единицы товара в не маленькой корзине
    _renderItemMax(product) {
        let $container = $('<div/>', {
            class: 'product-list-row',
            'data-product': product.id_product
        });
        
        // взаимодействие с контролером изменения количества товара в корзине
        let $quanControl = $(`<input class="quantity" data-id="${product.id_product}" type="number" min="1" max="99" placeholder="1">`);
        $quanControl.val(product.quantity);
        $quanControl.change((e) => {
            let $currentVal = $(e.target).val();
            if ($currentVal > product.quantity) {
                this.addProduct($(e.target));
            } else {
                this._remove($(e.target).data('id'));
            }
    
            $('.sub-total').find($(`p[data-id="${product.id_product}"]`).text(`$${product.quantity * product.price}`));
            $('.summary-text p span').text(`$${product.quantity * product.price}`);
        });
    
        let $containerPD = $(`<div class="product-list-col"></div>`);
        let $containerTD = $(`<div class="details-text"></div>`);
        let $containerTG = $(`<div class="details-text-group"></div>`);
        $containerTG.append(`<p>Color: <span>Red</span></p><p>Size: <span>Xll</span></p>`);
        $containerTD.append(`<a href="single_page.html" class="zh3"> Mango People T-shirt </a>`);
        $containerTD.append($containerTG);
        $containerPD.append(`<a href="single_page.html"><img src="${product.product_photo}" width="100px" height="116px"alt="foto-min"></a>`)
        $containerPD.append($containerTD);
        $container.append($containerPD);
    
        $container.append($(`<div class="product-list-col"><p>$${product.price}</p></div>`));
        $container.append($(`<div class="product-list-col"></div>`).append($quanControl));
        $container.append($(`<div class="product-list-col"><p>free</p></div>`));
        $container.append($(`<div class="product-list-col"><p data-id="${product.id_product}" class="sub-total">$${product.quantity * product.price}</p></div>`));
        
        let $cancelBtn = $(`<button id="cancelBtn"><img src="img/cancel.png" width="20px" alt="cancel"></button>`);
        $cancelBtn.click(() => {
            this._remove(product.id_product);
            
            $('.sub-total').find($(`p[data-id="${product.id_product}"]`).text(`$${product.quantity * product.price}`));
            $('.summary-text p span').text(`$${product.quantity * product.price}`);
        });
        $container.append($(`<div class="product-list-col"></div>`).append($cancelBtn));
        
        $container.appendTo($(this.containerMax));
    }
    
    _renderSum(){
        $('.sum-price').text(`$${this.amount}`);
        $('.summary-text h3 span').text(`$${this.amount}`);
        $('.summary-text p span').text(`$${this.amount}`);
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
        $container.find('.quantity').val(product.quantity);
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
            if (this.containerMax.length) {
                this._renderItemMax(product);
            }
            
            this.amount += product.price;
            this.countGoods += product.quantity;
        }
        
        this._storageUpdate();
        // localStorage.setItem('cart_items', JSON.stringify(this.cartItems));
        // localStorage.setItem('cart_amount', JSON.stringify(this.amount));
        // localStorage.setItem('cart_count_goods', JSON.stringify(this.countGoods));
        this._renderSum();
       
    }
    
    _remove(id) {
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
        
        this._storageUpdate();
        // localStorage.setItem('cart_items', JSON.stringify(this.cartItems));
        // localStorage.setItem('cart_amount', JSON.stringify(this.amount));
        // localStorage.setItem('cart_count_goods', JSON.stringify(this.countGoods));
        this._renderSum();
    }
    
    clearCart() {
        this.cartItems.length = 0;
        this.amount = 0;
        this.countGoods = 0;
        this._storageUpdate();
        this._renderSum();
        $(this.container).remove();
        $(this.containerMax).remove();
    }
}