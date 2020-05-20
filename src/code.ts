// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".

figma.showUI(__html__);
figma.ui.resize(320,300);


// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'get-count') {
    const node = figma.currentPage.selection; 
    const selectcount = node.length;
    figma.ui.postMessage(selectcount);
  }

  if (msg.type === 'create-rectangles') {
    
    const node = figma.currentPage.selection; 
    const SelectCount = node.length;
    const MerchantData = msg.data;
    for (let i = 0; i < SelectCount; i++){
      FindandFillImage(node[i],"#HeroImage", MerchantData[i].HeroImage);
      FindandFillImage(node[i],"#MerchantLogo", MerchantData[i].Logo);
      FindandFill(node[i],'#MerchantName',MerchantData[i].name);
    }
  

    
    //const newFills = [];
        //const newPaint = JSON.parse(JSON.stringify(node.fills[0]))
       // const imageHash = figma.createImage(msg.data).hash
       // newFills.push({ type: "IMAGE", scaleMode: "FIT", imageHash })
       // console.log(newFills)
      
      
     // node.fills = newFills
   

  }//End of create-rectangles 

  if (msg.type === 'text-change'){
    const node = figma.currentPage.selection; 
    const principle =msg.principle;
    const term = msg.term;
    const apr = msg.apr;
    const monthlypayment = MonthlyPayment(principle,term,apr);
    const total = term * monthlypayment;
    const interest = total - principle;
    console.log("pinciple is", principle, "term is", term, "apr is", apr, "Monthlypayment", monthlypayment);

    
    //Fill values for term cards
    node.forEach((element) =>{
      FindandFill(element,'#APR',apr);
      FindandFill(element,'#MonthlyPayment',monthlypayment);
      FindandFill(element,'#Total',total);
      FindandFill(element,'#Interest',interest);
      FindandFill(element,'#Term',term);
      FindandFill(element,'#TermMonth',term);
    })

    //Fill term card with relevant number
    node.forEach((element)=>{
      FindandChangeColor(element,'#TermColor',term);
      FindandChangeColor(element,'/ month',term);
      FindandChangeColor(element,'#MonthlyPayment',term);
      FindandChangeColor(element,'#TermMonth',term);
    })

  }  // End of text-change msg 

  
  //Function to calculate monthly payment
  function MonthlyPayment(princicle, termInMonth, rate) {
    const monthlyRate = rate*30 /366/100 + 1;
    let sumEachMonthRate = 0;
    for (let i = 0; i < termInMonth - 1; i++) {
      sumEachMonthRate += Math.pow(monthlyRate, i);
    }
    const MP = princicle * Math.pow(monthlyRate, termInMonth) / (sumEachMonthRate + 1);
    return MP
  }

  //Given a certain layer name, fill the desired content 
  function FindandFill (range, LayerName,FillValue){
    if(range.type != 'RECTANGLE'){
      const Nodes = range.findAll(range => range.type === "TEXT" && range.name === LayerName)
      Nodes.forEach(async (element) => {
        if (element.type === "TEXT" ){
          await figma.loadFontAsync(element.fontName as FontName)
          if(LayerName === '#APR'){
            element.characters = `${FillValue}%`;
          }else if (LayerName === '#Term' || LayerName === "#TermMonth"){
            element.characters = `${FillValue} month`;
          }else if (LayerName ==='#MonthlyPayment' || LayerName ==='#Interest' || LayerName ==='#Total'){
            element.characters = `$${FillValue.toFixed(2)}`;
          }else{
            element.characters = FillValue;
          }
        }
      })
    }
  } // End of FindandFill function

  function FindandChangeColor(range, LayerName,term){
    const Colornodes = range.findAll(range => range.name === LayerName);
    Colornodes.forEach((element) =>{
      if (element.type == "RECTANGLE" || element.type === "TEXT"  ){
        const fills = clone(element.fills)
        console.log(term)
        if (term == 3){
          fills[0].color = {r: 15/255, g: 156/255, b: 237/255};
        }else if (term == 6){
          fills[0].color = {r: 15/255, g: 114/255, b: 229/255};
        }else{
          fills[0].color = {r: 88/255, g: 70/255, b: 228/255};
        }
        element.fills = fills;
      }
    })
  }

  function FindandFillImage(range,LayerName,ImageData){
    const newFills = [];
    const node = range.findOne(range =>  range.name === LayerName)
    console.log(node);
    if (node){
      if (node.type === "RECTANGLE" || node.type === "ELLIPSE" || node.type === "FRAME") {
        const imageHash = figma.createImage(ImageData).hash
        newFills.push({ type: "IMAGE", scaleMode: "FIT", imageHash })
        node.fills = newFills;
      }
    }
    //const newPaint = JSON.parse(JSON.stringify(node.fills[0]))
  }
  
  function clone(val) {
    return JSON.parse(JSON.stringify(val))
  }




  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
 //figma.closePlugin();
};   




