/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  const app = {
    initMenu: function(){

      const thisApp=this;
      console.log('thisApp.data:', thisApp.data);

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }

      
    },
    initData: function(){
      const thisApp = this;
      thisApp.data  = dataSource;
    },
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu();
      
    },
  };
  class Product{
    constructor(id, data){
      const thisProduct= this;
      
      thisProduct.id = id;
      thisProduct.data = data;
      
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();
      console.log('New Product:', thisProduct);
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
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      
    }
    initAccordion() {
      const thisProduct = this;
      console.log(thisProduct);
      thisProduct.accordionTrigger.addEventListener('click', function(event) {
        event.preventDefault();
        const activeProduct = document.querySelector(
          select.all.menuProductsActive
        );
        console.log(thisProduct.element);
        if (activeProduct !== thisProduct.element && activeProduct !== null) {
          activeProduct.classList.remove('active');
        }
        thisProduct.element.classList.toggle('active');
        console.log('clicked');
      });
    }
    initOrderForm(){
      const thisProduct=this;
      console.log(thisProduct);
      
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
    }
    processOrder() {
      const thisProduct = this;
    
      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);
    
      // set price to default price
      let price = thisProduct.data.price; //cena produktu do ktorej musze dodac cene skladnikow lub odjąć 
      console.log(price);
      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        console.log('paramID:', paramId, 'param:',param);
    
        // for every option in this category
        for(let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          console.log(optionId, option);

          // check if there is param with a name of paramId in formData and if it includes optionId
          if(formData[paramId] && formData[paramId].includes(optionId)) {
            // check if the option is not default
            if(option !== true) {
              // add option price to price variable
              price = option.price + price;
            }
          } else {
          // check if the option is default
            if(option == true) {
              // reduce price variable
              price= option.price - price;
            }
          }

        }
            
          
          
      }
      
    
      // update calculated price in the HTML
      thisProduct.priceElem.innerHTML = price;
    }
  }

  app.init();
}


