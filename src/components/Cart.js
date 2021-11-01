import {settings, templates, classNames, select} from '../js/settings.js';
import CartProduct from './CartProduct.js';
import utils from '../js/utils.js';


class Cart{
  constructor(element){
    const thisCart= this;
    thisCart.products=[];
    thisCart.getElements(element);
    thisCart.initActions();
      
  }
  sendOrder(){
    const thisCart=this;
    const url = settings.db.url + '/' + settings.db.orders;
    const payload = {}; 
    payload.address = thisCart.dom.address.value; 
    payload.phone = thisCart.dom.phone.value;
    payload.totalPrice = thisCart.dom.totalPrice.innerHTML;
    payload.subtotalPrice = thisCart.dom.subtotalPrice.innerHTML; 
    payload.totalNumber = thisCart.dom.totalNumber.innerHTML; 
    payload.deliveryFee = thisCart.dom.deliveryFee.innerHTML; 
    payload.products = []; 
    
    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    
    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse:',parsedResponse);
      });
  }
  add(menuProduct){
    const thisCart=this;
    
    const generatedHTML= templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    thisCart.update();
  }
  getElements(element){
    const thisCart=this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.productList = element.querySelector(select.cart.productList);
    thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
    thisCart.dom.deliveryFee=element.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice=element.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalNumber=element.querySelector(select.cart.totalNumber);
    thisCart.dom.totalPrice=element.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.form= element.querySelector(select.cart.form);
    thisCart.dom.phone=element.querySelector(select.cart.phone);
    thisCart.dom.address=element.querySelector(select.cart.address);
    
  }
  initActions(){
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function(event){
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      thisCart.dom.productList.addEventListener('updated',function(){
        thisCart.update();
      });
      thisCart.dom.productList.addEventListener('remove',function(event){
        thisCart.remove(event.detail.cartProduct);
      });
      thisCart.dom.form.addEventListener('submit',function(event){
        event.preventDefault();
        thisCart.sendOrder();
      });
    });
  }
  remove(cartProduct){
    const thisCart=this;
    cartProduct.dom.wrapper.remove();
    const indexOfProduct = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(indexOfProduct, 1);
    
      
    thisCart.update();
  }
  update(){
    const thisCart=this;
    thisCart.deliveryFee= settings.cart.defaultDeliveryFee;
    thisCart.totalNumber=0;
    thisCart.subtotalPrice=0;
    thisCart.totalPrice=0;
    
    for(let product of thisCart.products){
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.price;
    }
    if(thisCart.totalNumber === 0){
      thisCart.deliveryFee = 0;
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    for (let price of thisCart.dom.totalPrice) {
      price.innerHTML = thisCart.totalPrice;
    }
    
    thisCart.dom.subtotalPrice.innerHTML= thisCart.subtotalPrice;
    
    thisCart.dom.deliveryFee.innerHTML= thisCart.deliveryFee;
    thisCart.dom.totalNumber.innerHTML= thisCart.totalNumber;
  }
}

export default Cart;