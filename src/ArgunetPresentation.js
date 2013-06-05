//namespace:
this.argunet = this.argunet||{};

argunet.ArgunetPresentation = function(settings){

	this.presentation = (settings && settings.element)? $(settings.element).addClass("argunet presentation") : $(".argunet.presentation").first();
	
	var listeners = (settings && settings.listeners)? settings.listeners : undefined;
	this.stepController = new argunet.StepController(listeners);
	var transition = (settings && settings.transition)? settings.transition : "right";
	this.transitionController = new argunet.TransitionController(transition);

	if(window.location.hash == "#print"){ // print mode
		new argunet.ArgunetPresentationForPrint(this.stepController);
		return;
	}	
	$(this.presentation).find(".print-only").remove();
		
	var that = this;
	this.currentSlideNr = 0;
	this.currentStepNr = 0;
	this.slides = $("section");
	
	
	var menu = $("<div id='menu'><h3>Slides</h3><div class='content'></div></div>").appendTo(this.presentation);
	var navigation = $("<nav id='navigation'><a href='#' class='open'><img src='src/css/images/menu.png' style='height:1em;' /></a><div class='content'><a href='' class='back'><span>Back</span></a> <div class='info'></div> <a href='' class='forward'><span>Forward</span></a> <a href='#print' target='_blank'><img src='src/css/images/printer.png' style='height:1em;' /></a></div></nav> <a class='logo' href='http://www.argunet.org'><img src='src/css/images/argunet-logo.png' style='width:5em'/></a>").appendTo(this.presentation);

	//navigation for touch screens
	$("#navigation .back").click(function(){
		that.previous();
		return false;
	});
	$("#navigation .forward").click(function(){
		that.next();
		return false;
	});
	//nav button
	$(menu).hide();
	$(navigation).children(".content").hide();
	var cont = $(navigation).children(".content");
	$(cont).css("marginRight",-$(cont).outerWidth());
	$(navigation).children(".open").click(function(){
		if(cont.is(":hidden")){
			cont.css('marginRight',-cont.outerWidth());
			cont.show().animate({marginRight: 0});
		}else{
			cont.show().animate({marginRight: -cont.outerWidth()},{complete:function(){cont.hide();}});
		}
		$(menu).toggle();
		return false;
	});
	//menu
	menu.click(function(){
		if($(this).is(".active"))$(this).transition({x:"0px"}).removeClass("active");
		else{
			$(this).transition({x:"-11em"});
			$(this).addClass("active");
		}
	});
	//slide list
	var i=1;

	$(this.slides).each(function(i){
		//if this slide contains no comments, make it full-width
		if($(this).find(".comment").length == 0) $(this).addClass("full-width");
		
		
		$(this).attr("data-slide",(i+1));
		var h1 = $(this).find("h1").get(0);
		var h2 = $(this).find("h2").get(0);
		var h3 = $(this).find("h3").get(0);
		var cssClass = "h3";
		if(h1){
			titleStr = $(h1).text();
			cssClass = "h1";
		}else if(h2){
			titleStr = $(h2).text();
			cssClass = "h2";
		}else if(h3)titleStr = $(h3).text();
		else titleStr = $(this).text().substr(0,20)+"...";
		
		$("#menu .content").append("<a class='slide "+cssClass+"' title='"+titleStr+"' href='#slide-"+(i+1)+"'>"+titleStr+"</a>");
	});
	$("#menu .content .slide").click(function(event){
		event.stopPropagation();
	});
	




	//container for comments (this is necessary because css transitions break position:fixed)
	this.presentation.append("<div class='comments'></div>");
	

	
	this.activateSlide = function(slideNr, stepNr){
		var that = this;
		$(".comments").empty();

		stepNr = stepNr || 0; 

		var activatedSlide = $(this.slides[slideNr-1]);
		var currentSlide = $(this.slides[this.currentSlideNr-1]);
		
		
		//slide links & navigation info
		$("a").filter("[href='#slide-"+this.currentSlideNr+"']").removeClass("active");
		$("a").filter("[href='#slide-"+slideNr+"']").addClass("active");
		$("#navigation .info").html(slideNr+" - "+this.slides.length);
		
		
		if(this.currentSlideNr==0)this.currentSlideNr = slideNr;
		this.steps = this.stepController.getSteps(this.slides[slideNr-1], true);
		
		var comingFromNextSlide = slideNr == this.currentSlideNr-1;
		if(comingFromNextSlide) stepNr = this.steps.length; //if activatedSlide is activated from one slide ahead, we want to activate all steps

		//activate/deactivate steps
		this.updateSteps(stepNr, comingFromNextSlide);

		this.setHash(slideNr, stepNr);
		
		
		//Animation
		if(this.currentSlideNr < slideNr){ 
			this.transitionController.next(currentSlide, activatedSlide);
		}else{ 
			this.transitionController.previous(currentSlide, activatedSlide);
		}
		this.currentSlideNr = slideNr;

	}
	

	
	this.updateSteps = function(stepNr, comingFromNextSlide){
		var that = this;
		if(stepNr == this.currentStepNr+1){
			this.stepController.activateStep(this.steps, stepNr);
		}else if(stepNr == this.currentStepNr-1){
			this.stepController.deactivateStep(this.steps, this.currentStepNr);			
			this.stepController.activateStep(this.steps, stepNr);
		}else{
			this.stepController.deactivateAll(this.steps);
			this.stepController.activateAll(this.steps, stepNr);
		}
		this.currentStepNr = stepNr;

		//scroll to step (if it is not a comment, because comments are not displayed within the scrollable section)
		if(stepNr>0 && !comingFromNextSlide){
			var s = this.steps[stepNr-1];
			if(s && !$(s).is(".comment") && $(s).offset()){
			     $(this.slides[this.currentSlideNr-1]).animate({
			         scrollTop: $(s).offset().top+"px"
			     }, 200);			
			}
		}
	}
	
	//all navigation runs through haschange events for deep linking capability
	$(window).on('hashchange', function() {
		that.getHash();
	});
	this.getHash = function(){
		var str = "slide-";
		var step, slide;
		var hash = window.location.hash;
		
		if(!hash || hash.indexOf(str) != -1 || hash==""){ //if the hash points to a slide or if there is no hash
			slide = hash.substring(str.length+1);
			if(slide=="") slide=1;
			
			step = 0;
			if(slide.indexOf && slide.indexOf("-") != -1){ //does the hash contain a step number
				var parts = slide.split("-");
				slide = parts[0];
				step = parts[1];
			}
	

		}else{ //if the hash points to a custom id
			
			//find element
			var el = $(hash);
			
			//is el a step? Then get the step nr
			step = 0;
			if($(el).is("[data-step]")) step = $(el).attr("data-step") || step;
			
			//find slide el is children of
			slideEl = el.closest("section");
			slide = slideEl.attr("data-slide");
		}
		
		if(this.currentSlideNr != slide){
			this.activateSlide(parseInt(slide), parseInt(step));
		}else if(step >= 0){
			this.updateSteps(parseInt(step));
		}		
		
	}

	this.setHash = function (slide, step){
		var slideStr = "slide-"+slide;
		var stepStr = (step != undefined && step > 0) ? "-"+step : "";
		window.location.hash = slideStr+stepStr;
	}
	this.getHash();	
	
	this.next = function(){
		if(this.currentStepNr < this.steps.length){
			this.setHash(this.currentSlideNr, parseInt(this.currentStepNr)+1);			
		}else if(this.currentSlideNr == this.slides.length){ //cycle
				this.setHash(1);
		}else{
			this.setHash(this.currentSlideNr+1);					
		}
	}
	this.previous = function(){
		if(this.currentStepNr > 0){
			this.setHash(this.currentSlideNr, this.currentStepNr-1);			
		}else if(this.currentSlideNr == 1) { //cycle
			this.setHash(this.slides.length);
		}else{
			this.setHash(this.currentSlideNr-1);
		}
	}	
	
	//	bind arrow and spacebar keys
	$(document).keydown(function(e){
		if (e.keyCode == 37 || e.keyCode == 38) { 
			that.previous();
			return false;
		}else if (e.keyCode == 32 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 9) { 
			that.next();
			return false;
		}
	});	

};