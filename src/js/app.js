import {settings, select, classNames} from './settings.js';
import Product from '../components/Product.js';
import Cart from '../components/Cart.js';
import Booking from '../components/Booking.js';
  


  
const app = {
  initBooking: function(){
    const thisApp = this;
    const widgetContainer= document.querySelector(select.containerOf.booking);
    const tableReservation = new Booking(widgetContainer);
  },
    initMenu: function(){
      const thisApp=this;
      
      for(let productData in thisApp.data.products){
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
      
      
    },
    initData: function(){
      
      const thisApp = this;
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.products;
      fetch(url)
        .then(function(rawResponse){
          return rawResponse.json();
        })
        .then(function(parsedResponse){
          thisApp.data.products= parsedResponse;
          thisApp.initMenu();
        });
    },
    init: function(){
      const thisApp = this;
      thisApp.initData();
      thisApp.initCart();
      thisApp.initPages();
      thisApp.initBooking();
    },
    activatePage: function(pageId){
      const thisApp = this;
      for(let page of thisApp.pages){
        page.classList.toggle(classNames.pages.active, page.id == pageId);
      }
      for(let link of thisApp.navLinks){
        link.classList.toggle(
          classNames.nav.active,
          link.getAttribute('href') == '#'+ pageId);
      }
    },
    initCart:   function(){
      const thisApp=this;
      
      const cartElem = document.querySelector(select.containerOf.cart);
      
      thisApp.cart = new Cart(cartElem);
      
      thisApp.productList= document.querySelector(select.containerOf.menu);

      thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
      });
      
      
    },
    initPages: function(){ //@To Do: Fix page showing after page's reload 
      const thisApp = this
     
      
      thisApp.pages = document.querySelector(select.containerOf.pages).children;
      thisApp.navLinks = document.querySelectorAll(select.nav.links);
      const idFromHash= window.location.hash.replace('#/', ''); 
      let pageMatchingHash = thisApp.pages[0].id;
      
      for(let page of thisApp.pages){
        if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
        }
        
      }
      for(let link of thisApp.navLinks){
        link.addEventListener("click",function(event){
          const clickedElement=this;
          event.preventDefault();
          const id = clickedElement.getAttribute('href').replace('#','');
          thisApp.activatePage(id);
          
          window.location.hash='#/'+ id
        })
      }
    }
    
};



  
app.init();
  

