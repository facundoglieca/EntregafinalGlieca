let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHtml = document.querySelector('.list-product');
let listCartHtml = document.querySelector('.list-cart');
let iconCartSpan = document.querySelector('.icon-cart span');


let listProducts = [];
let carts = [];

iconCart.addEventListener('click', ()=> {
    body.classList.toggle('show-cart')
})

closeCart.addEventListener('click', ()=> {
    body.classList.toggle('show-cart')
})

const addDataToHtml = () =>{
    listProductHtml.innerHTML = '';
    if(listProducts.length > 0){
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                    <img src="${product.image}" alt="" srcset="">
                    <h2>${product.name}</h2>
                    <div class="price">${product.price}</div>
                    <button class="add-cart">AGREGAR</button>`;
            listProductHtml.appendChild(newProduct);
        })
    }
}

listProductHtml.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('add-cart')){
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Tu producto se agrego correctamente 😊",
        showConfirmButton: false,
        timer: 1500
      });
})

const addToCart = (product_id) => {
    let positionProduct = carts.findIndex((value) => value.product_id == product_id)
    if(carts.length <= 0 ){
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    }else if(positionProduct < 0){
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        carts[positionProduct].quantity = carts[positionProduct].quantity + 1;
    }
    addCartToHtml();
    addCartToMemory();
}

const addCartToMemory = ()=> {
    localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHtml = ()=> {
    listCartHtml.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id
            let orderProduct = listProducts.findIndex((value)=> value.id == cart.product_id);
            let info = listProducts[orderProduct];
            newCart.innerHTML = `
            <div class="image">
                <img src="${info.image}" alt="" srcset="">
            </div>
            <div class="name">
                ${info.name}
            </div>
            <div class="total-price">
                ${info.price * cart.quantity}
            </div>
            <div class="quantity">
                <span class="menos"> < </span>
                <span>${cart.quantity}</span>
                <span class="mas"> > </span>
            </div>`;
            listCartHtml.appendChild(newCart);
        }) 
    }
    iconCartSpan.innerText = totalQuantity;
}

listCartHtml.addEventListener('click', (event)=> {
    let positionClick = event.target;
    if(positionClick.classList.contains('menos') || positionClick.classList.contains('mas')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'menos';
        if(positionClick.classList.contains('mas')){
            type = 'mas';
        }
        changeQuantity(product_id, type);
    }
})

const changeQuantity = (product_id, type) => {
    let positionItemcart = carts.findIndex((value)=> value.product_id == product_id);
    if(positionItemcart >= 0){
        switch(type) {
            case 'mas':
                carts[positionItemcart].quantity = carts[positionItemcart].quantity + 1;
                break;
            default:
                let valueChange = carts[positionItemcart].quantity - 1;
                if(valueChange > 0){
                    carts[positionItemcart].quantity = valueChange;
                }else{
                    carts.splice(positionItemcart, 1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHtml();
}

const initApp = () => {
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data;
        addDataToHtml();

        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHtml();
        }
    })
}
initApp();
