import { templates, select } from "../js/settings.js";
import utils from "../js/utils.js"
import AmountWidget from "./AmountWidget.js"

class Booking{
  constructor(widgetContainer){
    const thisBooking= this;
    thisBooking.render(widgetContainer);
    thisBooking.initWidgets();



  }

  render(widgetContainer){
    const thisBooking=this;
    thisBooking.dom={};
    thisBooking.dom.wrapper=widgetContainer;
    const generatedHTML= templates.bookingWidget();
    thisBooking.widgetContainer= utils.createDOMFromHTML(generatedHTML); 
    widgetContainer.appendChild(thisBooking.widgetContainer)

    thisBooking.dom.peopleAmount= document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount=document.querySelector(select.booking.hoursAmount);
    
  }
  initWidgets(){
    const thisBooking=this;
    thisBooking.peopleAmount= new AmountWidget(thisBooking.dom.peopleAmount)
    thisBooking.hoursAmount= new AmountWidget( thisBooking.dom.hoursAmount)
  }

}

export default  Booking;