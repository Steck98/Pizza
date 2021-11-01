import {select, classNames, templates} from '../js/settings.js';
import AmountWidget from '../components/AmountWidget.js';
import utils from '../js/utils.js';

class Product{
  constructor(id, data){
    const thisProduct= this;
    thisProduct.id = id;
    thisProduct.data = data; 
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
   
  }
  addToCart(){
    const thisProduct=this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    console.log(thisProduct.name);
    console.log(thisProduct.amount);
    const event = new CustomEvent('add-to-cart', {
      bubbles :true,
      detail:{
        product: thisProduct.prepareCartProduct(),
      },
      
    });
    thisProduct.element.dispatchEvent(event);
  }
  prepareCartProductParams() {
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.dom.form);
    const params = {};
    for(let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      params[paramId] = {
        label: param.label,
        options: {}
      };
      for(let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        // console.log(option); 
        if(optionSelected) {
          params[paramId].options[optionId] = option.label;
        }
      }
    }
  
    return params;
  }
  prepareCartProduct(){
    const thisProduct=this;
    
    const productSummary= {
      id : thisProduct.id,
      name : thisProduct.data.name,
      amount : thisProduct.amountWidget.value,
      priceSingle : thisProduct.data.price,
      price : thisProduct.priceSingle * thisProduct.amountWidget.value,
      params : thisProduct.prepareCartProductParams(),
    };
      
    return productSummary;
  
  }
  renderInMenu(){
    const thisProduct=this;
    const generatedHTML= templates.menuProduct(thisProduct.data);
    thisProduct.element= utils.createDOMFromHTML(generatedHTML);
    const menuContainer= document.querySelector(select.containerOf.menu);
    menuContainer.appendChild(thisProduct.element);
  }
  getElements(){
    const thisProduct = this;
    thisProduct.dom={};
    thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.dom.form = thisProduct.element.querySelector(select.menuProduct.form);     
    thisProduct.dom.formInputs = thisProduct.dom.form.querySelectorAll(select.all.formInputs);     
    thisProduct.dom.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);    
    thisProduct.dom.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);    
    thisProduct.dom.imageWrapper= thisProduct.element.querySelector(select.menuProduct.imageWrapper);   
    thisProduct.dom.amountWidgetElem= thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }
  initAccordion() {
    const thisProduct = this;
    thisProduct.dom.accordionTrigger.addEventListener('click', function(event) {
      event.preventDefault();
      const activeProduct = document.querySelector(
        select.all.menuProductsActive
      );
      if (activeProduct !== thisProduct.element && activeProduct !== null) {
        activeProduct.classList.remove('active');
      }
      thisProduct.element.classList.toggle('active');
    });
  }
  initOrderForm(){
    const thisProduct=this;  
    thisProduct.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });
    for(let input of thisProduct.dom.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }
    thisProduct.dom.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  processOrder() {
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.dom.form);
    let price = thisProduct.data.price; 
    for(let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      for(let optionId in param.options) {
        const option = param.options[optionId];
        if(formData[paramId] && formData[paramId].includes(optionId)) {
          if(option.default !== true) {
            price = option.price + price; 
          }
        } else {
          if(option.default == true) {
            price = price - option.price;
          }
        }
        const optionImage = thisProduct.dom.imageWrapper.querySelector('.'+ paramId + '-'+ optionId);
        if(optionImage){
          if (formData[paramId] && formData[paramId].includes(optionId)) {
            optionImage.classList.add(classNames.menuProduct.imageVisible);
          } else {
            optionImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }
    thisProduct.priceSingle= price;
    price *= thisProduct.amountWidget.value;
    thisProduct.dom.priceElem.innerHTML = price;
  }
  initAmountWidget(){
    const thisProduct=this;
    thisProduct.amountWidget= new AmountWidget(thisProduct.dom.amountWidgetElem);
    thisProduct.dom.amountWidgetElem.addEventListener('updated', function (){
      thisProduct.processOrder();
    });
  } 
}

export default Product;