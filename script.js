(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const money = value => "CHF " + Number(value || 0).toLocaleString("en-CH", {minimumFractionDigits:2, maximumFractionDigits:2});
  const escapeHTML = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const announce = message => { const live = $("#live-status"); if (live) live.textContent = ""; window.setTimeout(() => { if (live) live.textContent = message; }, 40); };
  const icons = {
    popular:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2Z"></path></svg>',
    burgers:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10a9 9 0 0 1 18 0H3Z"></path><path d="M3 13h18M4 16h16M5 19h14"></path></svg>',
    bowls:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10h18a9 9 0 0 1-18 0Z"></path><path d="M5 6c1-2 3-2 4 0m2-2c1-2 3-1 4 1m2 0 2 1"></path></svg>',
    sides:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 11 2-8h3l1 8m1 0 2-8h3l1 8m1 0 1-8h2l1 8M3 11h18l-2 10H5L3 11Z"></path></svg>',
    drinks:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12l-2 17H8L6 4Z"></path><path d="m9 4 8-3"></path></svg>',
    desserts:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11h16a8 8 0 0 1-16 0Z"></path><path d="M7 7a5 5 0 0 1 10 0M12 2v2"></path></svg>'
  };

  const products = [
    {id:"classic-burger",name:"Classic Burger",category:"Burgers",description:"Beef, cheddar, house sauce",price:12.50,art:"burger",artBg:"#fff0c4",badge:"BUILD YOUR OWN",allergens:"Gluten, milk, sesame",popular:true,tags:["Popular","Halal"],customizable:true},
    {id:"chicken-burger",name:"Chicken Burger",category:"Burgers",description:"Crispy chicken, crunchy slaw",price:13.00,art:"burger",artBg:"#fae5e6",badge:"FAVOURITE",allergens:"Gluten, egg",popular:true,tags:["Popular","Spicy"],customizable:true},
    {id:"veggie-burger",name:"Veggie Burger",category:"Burgers",description:"Plant patty, avocado",price:12.00,art:"burger",artBg:"#e8f2e8",badge:"PLANT FORWARD",allergens:"Please check the verified ingredient list",popular:true,tags:["Popular","Vegan"],customizable:true},
    {id:"poke-bowl",name:"Poke Bowl",category:"Bowls",description:"Rice, salmon, fresh toppings",price:16.00,art:"bowl",artBg:"#eaf1fb",badge:"FRESH PICK",allergens:"Fish, soy, sesame",popular:true,tags:["Popular"],customizable:false},
    {id:"fries",name:"Golden Fries",category:"Sides",description:"Crisp on the outside, fluffy inside",price:4.50,art:"fries",artBg:"#fff1d1",badge:"ADD A SIDE",allergens:"Check preparation for cross-contact",popular:true,tags:["Popular","Vegan"],customizable:false},
    {id:"milkshake",name:"Vanilla Milkshake",category:"Drinks",description:"Creamy vanilla, served chilled",price:5.50,art:"drink",artBg:"#fae5e6",badge:"CHILLED",allergens:"Milk",popular:true,tags:["Popular"],customizable:false},
    {id:"brownie",name:"Chocolate Brownie",category:"Desserts",description:"Rich chocolate, soft centre",price:4.00,art:"brownie",artBg:"#f0e5dc",badge:"SWEET FINISH",allergens:"Gluten, egg; check the verified ingredient list",popular:false,tags:[],customizable:false}
  ];

  const builderSteps = [
    {key:"bun",label:"Bun",title:"Choose your bun",kicker:"THE FOUNDATION",prompt:"Pick the bun that brings it all together.",required:true,multi:false,options:[
      {name:"Brioche",description:"Soft, lightly toasted",price:0,art:"bun",artBg:"#fff0c4"},
      {name:"Sesame",description:"Classic sesame seed bun",price:0,art:"bun",artBg:"#f5e8d6"},
      {name:"Whole wheat",description:"A heartier choice",price:0,art:"bun",artBg:"#e8f2e8"},
      {name:"Gluten-free bun",description:"A gluten-free alternative",price:1.50,art:"bun",artBg:"#eaf1fb"}
    ]},
    {key:"patty",label:"Patty",title:"Choose your patty",kicker:"THE HEART OF IT",prompt:"One patty or a little more? The choice is yours.",required:true,multi:false,options:[
      {name:"Beef patty",description:"Classic, juicy beef",price:0,art:"patty",artBg:"#f4e8df"},
      {name:"Double beef",description:"Twice the beef, extra satisfying",price:3.00,art:"patty",artBg:"#f7e2dc"},
      {name:"Crispy chicken",description:"Crunchy golden chicken",price:0.50,art:"patty",artBg:"#fff0c4"},
      {name:"Plant-based patty",description:"A plant-based option",price:1.00,art:"patty",artBg:"#e8f2e8"}
    ]},
    {key:"sauce",label:"Sauce",title:"Add your sauce",kicker:"A LITTLE EXTRA FLAVOUR",prompt:"Pick one or more sauces, or leave them off.",required:false,multi:true,options:[
      {name:"House sauce",description:"Our signature creamy sauce",price:0,art:"sauce",artBg:"#fff0c4"},
      {name:"Ketchup",description:"Sweet tomato flavour",price:0,art:"sauce",artBg:"#fae5e6"},
      {name:"Mayo",description:"Smooth and creamy",price:0,art:"sauce",artBg:"#f2f0e8"},
      {name:"Smoky BBQ",description:"Sweet, smoky finish",price:0.50,art:"sauce",artBg:"#f0e5dc"},
      {name:"No sauce",description:"Keep it simple",price:0,art:"sauce",artBg:"#f1f1ef"}
    ]},
    {key:"cheese",label:"Cheese",title:"Choose your cheese",kicker:"THE MELTY BIT",prompt:"Give it that final cheesy touch, or skip it.",required:false,multi:false,options:[
      {name:"Cheddar",description:"Bold and familiar",price:0,art:"cheese",artBg:"#fff0c4"},
      {name:"Swiss cheese",description:"Mild and nutty",price:0.75,art:"cheese",artBg:"#f5e8d6"},
      {name:"Plant-based slice",description:"A dairy-free alternative",price:1.25,art:"cheese",artBg:"#e8f2e8"},
      {name:"No cheese",description:"Skip the cheese",price:0,art:"cheese",artBg:"#f1f1ef"}
    ]},
    {key:"veg",label:"Veg",title:"Add your greens",kicker:"FRESH & CRUNCHY",prompt:"Choose the toppings you like. Select as many as you want.",required:false,multi:true,options:[
      {name:"Lettuce",description:"Fresh and crunchy",price:0,art:"veg",artBg:"#e8f2e8",color:"#4a8d52"},
      {name:"Tomato",description:"Juicy tomato slices",price:0,art:"veg",artBg:"#fae5e6",color:"#d95b4e"},
      {name:"Red onion",description:"A little sharpness",price:0,art:"veg",artBg:"#f0e7f2",color:"#9b729a"},
      {name:"Pickles",description:"Tangy and crisp",price:0,art:"veg",artBg:"#e8f2e8",color:"#809c45"},
      {name:"Jalapeños",description:"Bring the heat",price:0.50,art:"veg",artBg:"#fff0c4",color:"#6f9145"}
    ]},
    {key:"meal",label:"Meal",title:"Make it a meal?",kicker:"ROUND IT OUT",prompt:"Add fries and a drink, or keep your burger just as it is.",required:false,multi:false,options:[
      {name:"No meal",description:"Just the burger, please",price:0,art:"meal",artBg:"#f1f1ef"},
      {name:"Classic meal",description:"Golden fries + soft drink",price:5.50,art:"meal",artBg:"#fff0c4"},
      {name:"Sweet potato meal",description:"Sweet potato fries + iced tea",price:7.50,art:"meal",artBg:"#fae5e6"},
      {name:"Light meal",description:"Side salad + water",price:6.50,art:"meal",artBg:"#e8f2e8"}
    ]},
    {key:"review",label:"Review",title:"Ready to make it yours?",kicker:"FINAL CHECK",prompt:"Review your choices and total before adding to your order.",required:true,multi:false,options:[]}
  ];

  const state = {
    view:"welcome",previousView:"menu",dining:"dine-in",category:"Popular",filters:new Set(),search:"",
    cart:[],selectedProduct:null,builderProduct:null,builderStep:0,editingItemId:null,
    selections:defaultSelections(),pendingUpsells:new Set(),tipPercent:0,customTip:0,discount:0,promoCode:"",
    payment:"card",language:"en",sound:false,highContrast:false,reduceMotion:false,largeText:false,nextOrder:125
  };

  function defaultSelections(){
    return {bun:"Brioche",patty:"Beef patty",sauce:["House sauce"],cheese:"Cheddar",veg:["Lettuce","Tomato"],meal:"No meal"};
  }
  function getProduct(id){return products.find(item=>item.id===id);}
  function selectedChoice(stepKey){
    const step=builderSteps.find(item=>item.key===stepKey);
    if(!step)return [];
    const value=state.selections[stepKey];
    return step.multi?(Array.isArray(value)?value:[]):(value?[value]:[]);
  }
  function optionByName(stepKey,name){
    const step=builderSteps.find(item=>item.key===stepKey);
    return step?step.options.find(option=>option.name===name):null;
  }
  function extraPrice(){
    return builderSteps.filter(step=>step.key!=="review").reduce((total,step)=>{
      return total+selectedChoice(step.key).reduce((sum,name)=>sum+((optionByName(step.key,name)||{}).price||0),0);
    },0);
  }
  function builderUnitPrice(){return (state.builderProduct?.price||0)+extraPrice();}
  function getUnitPrice(item){return item.unitPrice==null?(item.basePrice||0):item.unitPrice;}
  function cartSubtotal(){return state.cart.reduce((sum,item)=>sum+getUnitPrice(item)*item.quantity,0);}
  function tipAmount(){
    if(state.customTip>0)return state.customTip;
    return Math.round(cartSubtotal()*state.tipPercent)/100;
  }
  function cartTotal(){return Math.max(0,cartSubtotal()-state.discount+tipAmount());}
  function cartQuantity(){return state.cart.reduce((sum,item)=>sum+item.quantity,0);}
  function formatStepSummary(selections){
    const labels=[];
    builderSteps.filter(step=>step.key!=="review").forEach(step=>{
      const values=Array.isArray(selections[step.key])?selections[step.key]:[selections[step.key]];
      const picked=values.filter(Boolean).filter(v=>!(step.key==="meal"&&v==="No meal"));
      if(picked.length)labels.push(step.label+": "+picked.join(", "));
    });
    return labels.join(" · ");
  }
  function customItemDescription(item){
    if(!item.customization)return item.product?.description||"";
    return formatStepSummary(item.customization);
  }
  function artMarkup(kind,bg="#fff0c4",extraClass=""){
    const burger='<div class="food-burger" aria-hidden="true"><span class="food-shadow"></span><span class="bun-top"></span><span class="sesame sesame-a"></span><span class="sesame sesame-b"></span><span class="sesame sesame-c"></span><span class="lettuce"></span><span class="tomato"></span><span class="cheese"></span><span class="patty"></span><span class="bun-bottom"></span></div>';
    let art=burger;
    if(kind==="bowl")art='<div class="food-plate-small" aria-hidden="true"><div class="food-bowl"></div></div>';
    if(kind==="fries")art='<div class="food-fries" aria-hidden="true"></div>';
    if(kind==="drink")art='<div class="food-drink" aria-hidden="true"></div>';
    if(kind==="brownie")art='<div class="food-brownie" aria-hidden="true"><span></span><span></span><span></span><span></span></div>';
    return '<div class="product-art '+extraClass+'" style="--art-bg:'+bg+'">'+art+'</div>';
  }
  function smallArtMarkup(product){
    if(!product)return "";
    if(product.art==="burger")return '<div class="rail-item-art" style="--art-bg:'+product.artBg+'">'+artMarkup("burger",product.artBg,"rail-product-art")+'</div>';
    return '<div class="rail-item-art" style="--art-bg:'+product.artBg+'">'+(product.art==="fries"?'<div class="food-fries" aria-hidden="true"></div>':product.art==="drink"?'<div class="food-drink" aria-hidden="true"></div>':product.art==="bowl"?'<div class="food-bowl" aria-hidden="true"></div>':'<div class="food-brownie" aria-hidden="true"></div>')+'</div>';
  }
  function optionArt(option){
    if(option.art==="bun"||option.art==="patty")return artMarkup("burger",option.artBg,"option-food-art");
    if(option.art==="sauce")return '<div class="option-art" style="--art-bg:'+option.artBg+'"><div class="sauce-samples"><span style="background:'+(option.name==="Ketchup"?"#d95143":option.name==="Mayo"?"#fffdf2":option.name==="Smoky BBQ"?"#7d4a31":option.name==="No sauce"?"#d9d9d6":"#efc16e")+'"></span><span style="background:#f2c879"></span></div></div>';
    if(option.art==="cheese")return '<div class="option-art" style="--art-bg:'+option.artBg+'"><div class="cheese-slice"></div></div>';
    if(option.art==="veg")return '<div class="option-art" style="--art-bg:'+option.artBg+'"><div class="ingredient-stack">'+Array.from({length:4},()=>'<span class="ingredient-dot" style="background:'+(option.color||"#6a9855")+'"></span>').join("")+'</div></div>';
    if(option.art==="meal")return '<div class="option-art" style="--art-bg:'+option.artBg+'"><div class="meal-illustration"><span class="mini-fries"></span><span class="mini-drink"></span></div></div>';
    return artMarkup("burger",option.artBg,"option-food-art");
  }

  function showView(name,focusHeading=true){
    const target=$('[data-view="'+name+'"]');
    if(!target)return;
    $$("[data-view]").forEach(view=>{
      const active=view===target;
      view.hidden=!active;
      view.classList.toggle("is-active",active);
      view.setAttribute("aria-hidden",active?"false":"true");
    });
    state.view=name;
    if(name==="menu")renderMenu();
    if(name==="builder")renderBuilder();
    if(name==="cart")renderCart();
    if(name==="payment")renderPayment();
    if(name==="upsell")renderUpsells();
    if(name==="thanks")renderThanks();
    updateChrome();
    if(focusHeading){
      window.requestAnimationFrame(()=>{
        const title=target.querySelector("h1");
        if(title){title.setAttribute("tabindex","-1");title.focus({preventScroll:true});}
      });
    }
    announce(viewAnnouncement(name));
  }
  function viewAnnouncement(name){
    const messages={welcome:"Welcome to OrderMonkey. Touch to start ordering.",dining:"Choose dine in or takeaway.",menu:"Menu. Browse categories and select an item.",quickview:"Item details opened.",builder:"Customise your item. Step "+(state.builderStep+1)+" of 7.",added:"Item added to your order.",upsell:"Optional extras. Add any side or drink, or continue without extras.",cart:"Review your order and total.",payment:"Choose a payment method. This is a demonstration and will not charge you.",thanks:"Order confirmed. Order number "+state.lastOrderNumber+".",};
    return messages[name]||"Screen updated.";
  }
  function updateChrome(){
    const count=cartQuantity();
    const menuCount=$("#menu-cart-count");if(menuCount)menuCount.textContent=count;
    const lang=state.language.toUpperCase();
    ["#language-label","#language-label-dining","#language-label-menu"].forEach(selector=>{const el=$(selector);if(el)el.textContent=selector==="#language-label-dining"?languageName(state.language):lang;});
    $$("[data-sound-label]").forEach(el=>el.textContent=state.sound?"Sound on":"Sound off");
    $$('[data-action="sound"]').forEach(el=>el.setAttribute("aria-pressed",state.sound?"true":"false"));
    document.body.classList.toggle("high-contrast",state.highContrast);
    document.body.classList.toggle("reduce-motion",state.reduceMotion);
    document.body.classList.toggle("large-text",state.largeText);
  }
  function languageName(code){return ({en:"English",de:"Deutsch",fr:"Français",it:"Italiano"})[code]||"English";}
  function resetBuilder(product,existingItem=null){
    state.builderProduct=product;
    state.builderStep=0;
    state.editingItemId=existingItem?existingItem.id:null;
    state.selections=existingItem?.customization?JSON.parse(JSON.stringify(existingItem.customization)):defaultSelections();
    showView("builder");
  }
  function openProduct(productId){
    const product=getProduct(productId);if(!product)return;
    state.selectedProduct=product;state.previousView=state.view;
    $("#quickview-category").textContent=product.category.toUpperCase();
    $("#quickview-title").textContent=product.name;
    $("#quickview-description").textContent=product.description;
    $("#quickview-price").textContent=money(product.price);
    $("#quickview-allergens").textContent=product.allergens;
    $("#quickview-art").innerHTML=artMarkup(product.art,product.artBg,"quickview-product-art");
    $("#quickview-art").style.setProperty("--art-bg",product.artBg);
    const customize=$('[data-action="quickview-customize"]');
    customize.hidden=!product.customizable;
    const add=$('[data-action="quickview-add"]');
    add.textContent=product.customizable?"Add as is":"Add to order";
    showView("quickview",false);
    const close=$('[data-action="close-quickview"]');if(close)close.focus();
  }
  function addProductAsIs(product){
    const existing=state.cart.find(item=>item.productId===product.id&&!item.customization);
    let added=existing;
    if(existing) existing.quantity++;
    else {
      added={id:"item-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),productId:product.id,name:product.name,basePrice:product.price,unitPrice:product.price,quantity:1,product,customization:null};
      state.cart.push(added);
    }
    showAdded(added);
  }
  function addBuilderItem(){
    const product=state.builderProduct;
    if(!product)return;
    const customization=JSON.parse(JSON.stringify(state.selections));
    const item={id:state.editingItemId||("item-"+Date.now()+"-"+Math.random().toString(36).slice(2,7)),productId:product.id,name:product.name,basePrice:product.price,unitPrice:product.price+extraPrice(),quantity:1,product,customization};
    if(state.editingItemId){
      const index=state.cart.findIndex(line=>line.id===state.editingItemId);
      if(index>=0){item.quantity=state.cart[index].quantity;state.cart[index]=item;}
      else state.cart.push(item);
    }else state.cart.push(item);
    state.editingItemId=null;
    showAdded(item);
  }
  function showAdded(item){
    state.lastAddedId=item.id;
    $("#added-item-name").textContent=item.name;
    $("#added-item-details").textContent=customItemDescription(item)||item.product.description;
    $("#added-item-price").textContent=money(getUnitPrice(item));
    $("#added-subtotal").textContent=money(cartSubtotal());
    $("#added-thumbnail").innerHTML=artMarkup(item.product.art,item.product.artBg,"added-art");
    showView("added");
  }
  function goToUpsell(){
    state.pendingUpsells=new Set();
    showView("upsell");
  }
  function resetOrder(){
    state.cart=[];state.category="Popular";state.filters=new Set();state.search="";
    state.selectedProduct=null;state.builderProduct=null;state.builderStep=0;state.editingItemId=null;
    state.selections=defaultSelections();state.pendingUpsells=new Set();state.tipPercent=0;state.customTip=0;state.discount=0;state.promoCode="";
    const search=$("#menu-search");if(search)search.value="";
    const promo=$("#promo-code");if(promo)promo.value="";
    showView("welcome");
    announce("New order started.");
  }

  function renderCategories(){
    const list=$("#category-list");if(!list)return;
    const categories=[["Popular","popular"],["Burgers","burgers"],["Bowls","bowls"],["Sides","sides"],["Drinks","drinks"],["Desserts","desserts"]];
    list.innerHTML=categories.map(([name,iconKey])=>'<button class="category-button '+(state.category===name?"is-active":"")+'" type="button" data-category="'+name+'" aria-pressed="'+(state.category===name?"true":"false")+'">'+icons[iconKey]+'<span>'+name+'</span></button>').join("");
  }
  function productMatches(product){
    const categoryMatch=state.category==="Popular"?product.popular:product.category===state.category;
    const query=state.search.trim().toLowerCase();
    const queryMatch=!query||(product.name+" "+product.description+" "+product.category).toLowerCase().includes(query);
    const filtersMatch=Array.from(state.filters).every(filter=>{
      if(filter==="Popular")return product.popular;
      return product.tags.includes(filter);
    });
    return categoryMatch&&queryMatch&&filtersMatch;
  }
  function renderMenu(){
    renderCategories();
    const grid=$("#menu-grid");if(!grid)return;
    const visible=products.filter(productMatches);
    grid.innerHTML=visible.length?visible.map(product=>{
      return '<article class="product-card" style="--art-bg:'+product.artBg+'">'+
        '<button type="button" class="product-open" data-action="open-product" data-product-id="'+product.id+'" aria-label="View '+escapeHTML(product.name)+', '+money(product.price)+'">'+
          artMarkup(product.art,product.artBg,"card-art")+
          (product.badge?'<span class="product-chip">'+escapeHTML(product.badge)+'</span>':"")+
          '<span class="product-title">'+escapeHTML(product.name)+'</span>'+
          '<span class="product-description">'+escapeHTML(product.description)+'</span>'+
        '</button>'+
        '<div class="product-bottom"><span class="product-price">'+money(product.price)+'</span><button class="btn btn-dark product-action" type="button" data-action="open-product" data-product-id="'+product.id+'">'+(product.customizable?"Customise":"View item")+' <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7"></path></svg></button></div>'+
      '</article>';
    }).join(""):'<div class="empty-results"><strong>No items found.</strong><p>Try a different category or clear your search.</p><button class="btn btn-outline" type="button" data-action="clear-filters">Clear filters</button></div>';
    renderRailCart();
  }
  function renderRailCart(){
    const container=$("#rail-items");if(!container)return;
    const count=cartQuantity();
    $("#rail-count").textContent=count+" "+(count===1?"item":"items");
    $("#rail-subtotal").textContent=money(cartSubtotal());
    $("#rail-checkout").disabled=count===0;
    if(!state.cart.length){
      container.innerHTML='<div class="empty-cart"><span class="empty-bag" aria-hidden="true">＋</span><strong>Your order starts here</strong><p>Add something delicious to see it here.</p></div>';
      return;
    }
    container.innerHTML=state.cart.map(item=>{
      const product=item.product||getProduct(item.productId);
      return '<div class="rail-item">'+smallArtMarkup(product)+'<div class="rail-item-copy"><strong>'+escapeHTML(item.quantity+' × '+item.name)+'</strong><small>'+escapeHTML(item.customization?formatStepSummary(item.customization):product.description)+'</small></div><span class="rail-item-price">'+money(getUnitPrice(item)*item.quantity)+'</span></div>';
    }).join("");
  }

  function builderArt(step,option){
    if(option.art==="burger"||option.art==="bun"||option.art==="patty")return artMarkup("burger",option.artBg,"option-art-shell");
    if(option.art==="sauce")return '<div class="option-art" style="--art-bg:'+option.artBg+'"><div class="sauce-samples"><span style="background:'+(option.name==="Ketchup"?"#d95143":option.name==="Mayo"?"#fffdf2":option.name==="Smoky BBQ"?"#7d4a31":option.name==="No sauce"?"#d9d9d6":"#efc16e")+'"></span><span style="background:#f2c879"></span></div></div>';
    if(option.art==="cheese")return '<div class="option-art" style="--art-bg:'+option.artBg+'"><div class="cheese-slice"></div></div>';
    if(option.art==="veg")return '<div class="option-art" style="--art-bg:'+option.artBg+'"><div class="ingredient-stack">'+[0,1,2,3].map(()=>'<span class="ingredient-dot" style="background:'+(option.color||"#6a9855")+'"></span>').join("")+'</div></div>';
    if(option.art==="meal")return '<div class="option-art" style="--art-bg:'+option.artBg+'"><div class="meal-illustration"><span class="mini-fries"></span><span class="mini-drink"></span></div></div>';
    return artMarkup("burger",option.artBg,"option-art-shell");
  }
  function renderStepNav(){
    $("#step-list").innerHTML=builderSteps.map((step,index)=>{
      const selected=selectedChoice(step.key).length>0;
      const current=index===state.builderStep;
      return '<li><button type="button" class="step-nav '+(selected&& !current?"is-complete":"")+'" data-step-index="'+index+'" '+(current?'aria-current="step"':"")+'>'+
        '<span class="step-number">'+(selected&&!current?'✓':index+1)+'</span><span><span class="step-label">'+step.label+'</span><span class="step-sub">'+(current?"CURRENT STEP":selected?"CHOICE SELECTED":step.required?"REQUIRED":"OPTIONAL")+'</span></span></button></li>';
    }).join("");
  }
  function renderBuilderOptions(){
    const step=builderSteps[state.builderStep];
    const container=$("#builder-options");
    container.classList.toggle("review-options",step.key==="review");
    if(step.key==="review"){
      container.innerHTML=builderSteps.filter(item=>item.key!=="review").map(item=>{
        const chosen=selectedChoice(item.key).filter(name=>!(item.key==="meal"&&name==="No meal"));
        const choices=chosen.length?chosen.join(", "):"No selection";
        const cost=chosen.reduce((sum,name)=>sum+((optionByName(item.key,name)||{}).price||0),0);
        return '<div class="review-row"><div><strong>'+escapeHTML(item.label)+'</strong><span>'+escapeHTML(choices)+'</span></div><span class="review-price">'+(cost>0?"+ ":"")+money(cost)+'</span></div>';
      }).join("");
      return;
    }
    container.innerHTML=step.options.map((option,index)=>{
      const selected=step.multi?selectedChoice(step.key).includes(option.name):state.selections[step.key]===option.name;
      const selectLabel=step.multi?(selected?"Selected":"Add choice"):(selected?"Selected":"Select");
      return '<button type="button" class="builder-option" data-choice-key="'+step.key+'" data-choice-name="'+escapeHTML(option.name)+'" aria-pressed="'+(selected?"true":"false")+'" aria-label="'+escapeHTML(option.name+', '+money(option.price)+', '+selectLabel)+'">'+
        '<span class="option-selected"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg> SELECTED</span>'+
        builderArt(step,option)+
        '<span class="option-title">'+escapeHTML(option.name)+'</span>'+
        '<span class="option-description">'+escapeHTML(option.description)+'</span>'+
        '<span class="option-price"><span>'+(option.price>0?"+ "+money(option.price):"Included")+'</span><small>'+selectLabel+'</small></span>'+
      '</button>';
    }).join("");
  }
  function renderBuilderPreview(){
    const product=state.builderProduct;if(!product)return;
    $("#builder-product-name").textContent=product.name;
    $("#builder-base-price").textContent=money(product.price);
    $("#preview-name").textContent=product.name;
    $("#preview-food").innerHTML=artMarkup("burger",product.artBg,"preview-burger-art");
    const total=builderUnitPrice();
    $("#preview-total").textContent=money(total);
    $("#builder-footer-total").textContent=money(total);
    const selected=builderSteps.filter(step=>step.key!=="review").flatMap(step=>{
      return selectedChoice(step.key).filter(name=>!(step.key==="meal"&&name==="No meal")).map(name=>({step:step.label,name}));
    });
    $("#preview-choice-count").textContent=selected.length+" "+(selected.length===1?"choice":"choices");
    $("#preview-summary").innerHTML=selected.length?selected.map(item=>'<div class="preview-summary-row"><span>'+escapeHTML(item.step)+'</span><strong>'+escapeHTML(item.name)+'</strong></div>').join(""):'<p class="preview-empty">Your choices will appear here.</p>';
  }
  function renderBuilder(){
    if(!state.builderProduct)return;
    const step=builderSteps[state.builderStep];
    $("#step-count-label").textContent="STEP "+(state.builderStep+1)+" OF "+builderSteps.length;
    $("#builder-kicker").textContent=step.kicker;
    $("#builder-title").textContent=step.title;
    $("#builder-prompt").textContent=step.prompt;
    $("#step-required-label").textContent=(step.required?"REQUIRED":"OPTIONAL")+" · "+(step.multi?"PICK ANY":"PICK ONE");
    $("#step-badge").textContent=(state.builderStep+1)+" / "+builderSteps.length;
    $("#progress-fill").style.width=((state.builderStep+1)/builderSteps.length*100)+"%";
    $("#builder-next").innerHTML=state.builderStep===builderSteps.length-1?'Add to order <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7"></path></svg>':'Next: '+builderSteps[state.builderStep+1].label+' <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7"></path></svg>';
    $("#builder-back").textContent=state.builderStep===0?"Back":"Previous step";
    $("#builder-note").innerHTML=step.key==="review"?'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="m8 12 3 3 5-6"></path></svg><span>Everything look right? Add your item to the order when you are ready.</span>':'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5m0-8h.01"></path></svg><span>Tap any option to select it. Selected choices are labelled and highlighted.</span>';
    renderStepNav();renderBuilderOptions();renderBuilderPreview();
  }
  function stepSelectionReady(step){
    return !step.required||selectedChoice(step.key).length>0;
  }

  function renderUpsells(){
    const options=["fries","milkshake","brownie"];
    $("#upsell-grid").innerHTML=options.map(id=>{
      const product=getProduct(id);const selected=state.pendingUpsells.has(id);
      return '<button type="button" class="upsell-card" data-upsell-id="'+id+'" aria-pressed="'+(selected?"true":"false")+'" style="--art-bg:'+product.artBg+'">'+
        '<span class="upsell-art">'+(product.art==="fries"?'<div class="food-fries" aria-hidden="true"></div>':product.art==="drink"?'<div class="food-drink" aria-hidden="true"></div>':'<div class="food-brownie" aria-hidden="true"><span></span><span></span><span></span></div>')+'</span>'+
        '<span class="upsell-title">'+escapeHTML(product.name)+'</span><span class="upsell-description">'+escapeHTML(product.description)+'</span>'+
        '<span class="option-price"><span>'+money(product.price)+'</span><small>'+(selected?"✓ Added":"Tap to add")+'</small></span></button>';
    }).join("");
  }
  function renderCart(){
    $("#cart-service").textContent=state.dining==="takeaway"?"TAKEAWAY":"DINE IN";
    $("#cart-items-count").textContent=cartQuantity()+" "+(cartQuantity()===1?"item":"items");
    $("#cart-items").innerHTML=state.cart.length?state.cart.map(item=>{
      const product=item.product||getProduct(item.productId);
      const desc=customItemDescription(item);
      return '<article class="cart-line" data-cart-item="'+item.id+'">'+
        '<div class="cart-thumb" style="--art-bg:'+product.artBg+'">'+(product.art==="burger"?'<div class="food-burger" aria-hidden="true"><span class="food-shadow"></span><span class="bun-top"></span><span class="sesame sesame-a"></span><span class="sesame sesame-b"></span><span class="sesame sesame-c"></span><span class="lettuce"></span><span class="tomato"></span><span class="cheese"></span><span class="patty"></span><span class="bun-bottom"></span></div>':product.art==="fries"?'<div class="food-fries" aria-hidden="true"></div>':product.art==="drink"?'<div class="food-drink" aria-hidden="true"></div>':product.art==="bowl"?'<div class="food-bowl" aria-hidden="true"></div>':'<div class="food-brownie" aria-hidden="true"></div>')+'</div>'+
        '<div class="cart-line-details"><h2 class="cart-line-title">'+escapeHTML(item.name)+'</h2><p class="cart-line-description">'+escapeHTML(desc||product.description)+'</p><div class="cart-line-actions">'+(item.customization?'<button class="mini-btn" type="button" data-action="edit-cart-item" data-cart-id="'+item.id+'">Edit</button>':"")+'<button class="mini-btn remove" type="button" data-action="remove-cart-item" data-cart-id="'+item.id+'">Remove</button></div></div>'+
        '<div class="cart-line-price"><strong>'+money(getUnitPrice(item)*item.quantity)+'</strong><div class="quantity-control" aria-label="Quantity for '+escapeHTML(item.name)+'"><button type="button" data-action="qty-dec" data-cart-id="'+item.id+'" aria-label="Decrease '+escapeHTML(item.name)+' quantity">−</button><span aria-live="polite">'+item.quantity+'</span><button type="button" data-action="qty-inc" data-cart-id="'+item.id+'" aria-label="Increase '+escapeHTML(item.name)+' quantity">+</button></div></div></article>';
    }).join(""):'<div class="empty-cart-main"><span class="empty-bag" aria-hidden="true">＋</span><h2>Your order is empty</h2><p>Add something delicious from the menu to continue.</p><button type="button" class="btn btn-primary" data-go="menu">Browse menu</button></div>';
    renderCartTotals();renderRailCart();
    $$("[data-tip]").forEach(btn=>{
      const selected=btn.dataset.tip==="custom" ? state.customTip>0 : Number(btn.dataset.tip)===state.tipPercent && state.customTip===0;
      btn.classList.toggle("is-selected",selected);btn.setAttribute("aria-pressed",selected?"true":"false");
    });
  }
  function renderCartTotals(){
    const subtotal=cartSubtotal(),tip=tipAmount(),total=cartTotal();
    $("#cart-subtotal").textContent=money(subtotal);
    $("#cart-tax").textContent="Included";
    $("#cart-discount").textContent="− "+money(state.discount);
    $("#discount-row").hidden=state.discount<=0;
    $("#cart-tip").textContent=money(tip);
    $("#tip-row").hidden=tip<=0;
    $("#cart-total").textContent=money(total);
    $("#cart-payment-button").disabled=state.cart.length===0;
  }
  function renderPayment(){
    const total=money(cartTotal());
    $("#payment-total").textContent=total;$("#terminal-amount").textContent=total;$("#demo-amount").textContent=total;
    $$("[data-payment]").forEach(btn=>{
      const selected=btn.dataset.payment===state.payment;btn.classList.toggle("is-selected",selected);btn.setAttribute("aria-checked",selected?"true":"false");
    });
    const instructions={
      card:["Tap or insert your card","Follow the prompts on the payment terminal. This demo will not charge a card."],
      twint:["Open TWINT on your phone","A real deployment would show the payment provider's verified QR code here. This demo does not initiate a payment."],
      counter:["Pay at the counter","Take your order number to the team at the counter. This demo simply confirms the order."]
    }[state.payment];
    $("#terminal-instruction-title").textContent=instructions[0];
    $("#terminal-instruction").textContent=instructions[1];
  }
  function renderThanks(){
    $("#thanks-order-number").textContent="#"+String(state.lastOrderNumber||state.nextOrder).padStart(4,"0");
    $("#thanks-service").textContent=state.dining==="takeaway"?"Takeaway":"Dine in";
  }

  function showDialog(id){
    const dialog=$("#"+id);if(!dialog)return;
    if(typeof dialog.showModal==="function")dialog.showModal();
    else dialog.setAttribute("open","");
  }
  function closeDialog(id){
    const dialog=$("#"+id);if(!dialog)return;
    if(typeof dialog.close==="function"&&dialog.open)dialog.close();else dialog.removeAttribute("open");
  }
  function doAction(action,element){
    switch(action){
      case "home": resetOrder();break;
      case "language": showDialog("language-dialog");break;
      case "accessibility": $("#high-contrast-toggle").checked=state.highContrast;$("#reduce-motion-toggle").checked=state.reduceMotion;showDialog("accessibility-dialog");break;
      case "sound": state.sound=!state.sound;updateChrome();announce(state.sound?"Sound enabled in the interface. No audio clip is configured in this prototype.":"Sound is off.");break;
      case "allergens": showDialog("allergen-dialog");break;
      case "close-language": closeDialog("language-dialog");break;
      case "close-accessibility": closeDialog("accessibility-dialog");announce("Accessibility settings saved.");break;
      case "close-allergens": closeDialog("allergen-dialog");break;
      case "close-loyalty": closeDialog("loyalty-dialog");break;
      case "close-tip": closeDialog("tip-dialog");break;
      case "close-payment": closeDialog("payment-dialog");break;
      case "loyalty": showDialog("loyalty-dialog");break;
      case "skip-loyalty": closeDialog("loyalty-dialog");announce("Continuing as a guest.");break;
      case "loyalty-demo": closeDialog("loyalty-dialog");announce("Member sign-in is a prototype. Continuing as a guest.");break;
      case "close-quickview": showView(state.previousView||"menu");break;
      case "open-product": openProduct(element.dataset.productId);break;
      case "quickview-add": if(state.selectedProduct){addProductAsIs(state.selectedProduct);}break;
      case "quickview-customize": if(state.selectedProduct){resetBuilder(state.selectedProduct); }break;
      case "cancel-builder": state.editingItemId=null;showView("menu");announce("Customisation cancelled. Your existing order is unchanged.");break;
      case "builder-back":
        if(state.builderStep>0){state.builderStep--;renderBuilder();announce("Step "+(state.builderStep+1)+": "+builderSteps[state.builderStep].label);}
        else {state.editingItemId=null;showView("menu");}
        break;
      case "builder-next":{
        const step=builderSteps[state.builderStep];
        if(state.builderStep===builderSteps.length-1){addBuilderItem();break;}
        if(!stepSelectionReady(step)){announce("Choose an option before continuing.");return;}
        state.builderStep++;renderBuilder();announce("Step "+(state.builderStep+1)+" of "+builderSteps.length+": "+builderSteps[state.builderStep].label);break;
      }
      case "upsell-checkout":
        state.pendingUpsells.forEach(id=>{const product=getProduct(id);if(product)addProductAsItem(product);});
        state.pendingUpsells=new Set();showView("cart");announce("Optional extras added. Review your order.");break;
      case "apply-promo":{
        const code=$("#promo-code").value.trim().toUpperCase();
        if(code==="SAVE5"){state.discount=5;state.promoCode=code;$("#promo-message").textContent="CHF 5.00 discount applied.";announce("Promo code applied: five Swiss francs off.");}
        else if(code==="WELCOME10"){state.discount=Math.round(cartSubtotal()*0.10*100)/100;state.promoCode=code;$("#promo-message").textContent="10% demo discount applied.";announce("Demo promo code applied.");}
        else{state.discount=0;state.promoCode="";$("#promo-message").textContent="That demo code was not recognised. Try SAVE5 or WELCOME10.";announce("Promo code not recognised.");}
        renderCartTotals();break;
      }
      case "custom-tip": showDialog("tip-dialog");break;
      case "save-tip":{
        const amount=Math.max(0,Number($("#custom-tip").value)||0);
        state.customTip=Math.round(amount*100)/100;state.tipPercent=0;closeDialog("tip-dialog");renderCart();announce("Tip updated to "+money(state.customTip)+".");break;
      }
      case "confirm-payment": if(!state.cart.length){announce("Your order is empty.");return;}showDialog("payment-dialog");break;
      case "finish-demo-payment":
        closeDialog("payment-dialog");state.lastOrderNumber=state.nextOrder++;showView("thanks");announce("Demo order "+state.lastOrderNumber+" confirmed. No payment was processed.");break;
      case "print-receipt": announce("Print receipt requested. In this prototype, use your browser's print dialog.");window.print();break;
      case "new-order": resetOrder();break;
      case "cancel-order":
        if(window.confirm("Cancel this order and return to the welcome screen? Your current items will be cleared."))resetOrder();
        break;
      case "remove-cart-item":{
        const item=state.cart.find(line=>line.id===element.dataset.cartId);state.cart=state.cart.filter(line=>line.id!==element.dataset.cartId);
        renderCart();announce(item?item.name+" removed from the order.":"Item removed.");break;
      }
      case "qty-inc": changeQuantity(element.dataset.cartId,1);break;
      case "qty-dec": changeQuantity(element.dataset.cartId,-1);break;
      case "edit-cart-item":{
        const item=state.cart.find(line=>line.id===element.dataset.cartId);
        if(!item||!item.customization){announce("This item cannot be customised in this demo.");return;}
        resetBuilder(item.product||getProduct(item.productId),item);break;
      }
      case "clear-filters":
        state.category="Popular";state.filters=new Set();state.search="";$("#menu-search").value="";$$("[data-filter]").forEach(btn=>btn.setAttribute("aria-pressed","false"));renderMenu();announce("Menu filters cleared.");break;
      case "go-menu":showView("menu");break;
    }
  }
  function addProductAsItem(product){
    const existing=state.cart.find(item=>item.productId===product.id&&!item.customization);
    if(existing)existing.quantity++;
    else state.cart.push({id:"item-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),productId:product.id,name:product.name,basePrice:product.price,unitPrice:product.price,quantity:1,product,customization:null});
  }
  function changeQuantity(id,change){
    const item=state.cart.find(line=>line.id===id);if(!item)return;
    item.quantity+=change;
    if(item.quantity<=0)state.cart=state.cart.filter(line=>line.id!==id);
    renderCart();announce(item.name+" quantity "+Math.max(0,item.quantity)+".");
  }
  function chooseBuilderOption(element){
    const step=builderSteps.find(item=>item.key===element.dataset.choiceKey);if(!step)return;
    const name=element.dataset.choiceName;
    if(step.multi){
      const current=Array.isArray(state.selections[step.key])?state.selections[step.key]:[];
      if(name==="No sauce"){state.selections[step.key]=current.includes(name)?[]:[name];}
      else {
        const next=current.filter(value=>value!=="No sauce");
        state.selections[step.key]=next.includes(name)?next.filter(value=>value!==name):next.concat(name);
      }
    }else state.selections[step.key]=name;
    renderBuilder();announce(name+(selectedChoice(step.key).includes(name)?" selected.":" removed."));
  }
  function setLanguage(code){
    state.language=code;
    $$(".language-option").forEach(btn=>{const selected=btn.dataset.language===code;btn.classList.toggle("is-selected",selected);btn.setAttribute("aria-pressed",selected?"true":"false");});
    updateChrome();
    announce("Language set to "+languageName(code)+". Full translations are not included in this prototype.");
  }
  function applyViewNavigation(view){
    if(view==="upsell"){goToUpsell();return;}
    if(view==="menu")renderMenu();
    if(view==="cart"&&state.cart.length===0){announce("Your order is empty. Add an item to continue.");showView("menu");return;}
    showView(view);
  }

  document.addEventListener("click",event=>{
    const element=event.target.closest("button,a,[data-action],[data-go]");
    if(!element)return;
    if(element.dataset.go){event.preventDefault();applyViewNavigation(element.dataset.go);return;}
    if(element.dataset.action){event.preventDefault();doAction(element.dataset.action,element);return;}
    if(element.hasAttribute("data-category")){
      state.category=element.dataset.category;renderMenu();announce(state.category+" category selected.");return;
    }
    if(element.hasAttribute("data-filter")){
      const key=element.dataset.filter;
      if(state.filters.has(key)){state.filters.delete(key);element.setAttribute("aria-pressed","false");}
      else{state.filters.add(key);element.setAttribute("aria-pressed","true");}
      renderMenu();announce(key+" filter "+(state.filters.has(key)?"on":"off")+".");return;
    }
    if(element.hasAttribute("data-dining")){
      state.dining=element.dataset.dining;
      $$("[data-dining]").forEach(btn=>{const selected=btn.dataset.dining===state.dining;btn.classList.toggle("is-selected",selected);btn.setAttribute("aria-pressed",selected?"true":"false");});
      announce(state.dining==="dine-in"?"Dine in selected.":"Takeaway selected.");return;
    }
    if(element.hasAttribute("data-choice-key")){chooseBuilderOption(element);return;}
    if(element.hasAttribute("data-step-index")){
      const index=Number(element.dataset.stepIndex);
      if(index<=state.builderStep||stepSelectionReady(builderSteps[state.builderStep])){state.builderStep=index;renderBuilder();announce("Step "+(index+1)+" of "+builderSteps.length+": "+builderSteps[index].label);}
      return;
    }
    if(element.hasAttribute("data-upsell-id")){
      const id=element.dataset.upsellId;
      if(state.pendingUpsells.has(id))state.pendingUpsells.delete(id);else state.pendingUpsells.add(id);
      renderUpsells();announce(getProduct(id).name+(state.pendingUpsells.has(id)?" selected as an extra.":" removed from extras."));return;
    }
    if(element.hasAttribute("data-tip")){
      if(element.dataset.tip==="custom"){showDialog("tip-dialog");return;}
      state.tipPercent=Number(element.dataset.tip)||0;state.customTip=0;renderCartTotals();$$("[data-tip]").forEach(btn=>{const selected=btn.dataset.tip!=="custom"&&Number(btn.dataset.tip)===state.tipPercent;btn.classList.toggle("is-selected",selected);btn.setAttribute("aria-pressed",selected?"true":"false");});announce(state.tipPercent?state.tipPercent+" percent tip selected.":"No tip selected.");return;
    }
    if(element.hasAttribute("data-payment")){
      state.payment=element.dataset.payment;renderPayment();announce(element.querySelector("strong")?.textContent+" selected.");return;
    }
    if(element.hasAttribute("data-language")){setLanguage(element.dataset.language);return;}
    if(element.hasAttribute("data-text-size")){
      state.largeText=element.dataset.textSize==="large";$$("[data-text-size]").forEach(btn=>btn.setAttribute("aria-pressed",btn.dataset.textSize===element.dataset.textSize?"true":"false"));updateChrome();announce(state.largeText?"Large text enabled.":"Standard text size enabled.");return;
    }
  });

  $("#menu-search").addEventListener("input",event=>{state.search=event.target.value;renderMenu();});
  $("#high-contrast-toggle").addEventListener("change",event=>{state.highContrast=event.target.checked;updateChrome();announce(state.highContrast?"High contrast enabled.":"High contrast disabled.");});
  $("#reduce-motion-toggle").addEventListener("change",event=>{state.reduceMotion=event.target.checked;updateChrome();announce(state.reduceMotion?"Reduced motion enabled.":"Reduced motion disabled.");});
  $("#tip-dialog").addEventListener("close",()=>{const tip=$("#custom-tip");if(tip)tip.value=state.customTip.toFixed(2);});
  ["accessibility-dialog","language-dialog","allergen-dialog","loyalty-dialog","tip-dialog","payment-dialog"].forEach(id=>{
    const dialog=$("#"+id);dialog?.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
  });
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"&&state.view==="quickview"){showView(state.previousView||"menu");announce("Item details closed.");}
  });

  function init(){
    renderMenu();renderBuilder();renderCart();renderPayment();renderUpsells();updateChrome();
    $$("[data-view]").forEach(view=>{const active=view.dataset.view==="welcome";view.hidden=!active;view.setAttribute("aria-hidden",active?"false":"true");});
  }
  init();
})();