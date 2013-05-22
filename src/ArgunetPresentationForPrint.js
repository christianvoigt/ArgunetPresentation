//namespace:
this.argunet = this.argunet||{};

argunet.ArgunetPresentationForPrint = function(stepController){
	
//presentation presentation
var presentation = $(".argunet.presentation");
presentation.removeClass("presentation").addClass("print");


presentation.find(".no-print").remove();
presentation.find(".print-only").show();
presentation.find(".print-as-add").removeClass("substitute").addClass("add");


//create extra slides for steps
$(presentation).children("section").each(function(slideIndex, el){
	//$(this).prepend("<div class='slide-nr'>"+(slideIndex+1)+"</div>");
	var slide = this;
	var lastSlide = slide;
	var steps = stepController.getSteps(slide, false);
	
	stepController.deactivateAll(steps);
	
	$(steps).each(function(i,el){
		var stepNr = steps.length-i;
		
		var noprintElements = $(slide).find(":not(.print)[data-step='"+stepNr+"']");
		$(noprintElements).each(function(){
			if(stepNr-1>0){
				this.dataset.step= stepNr-1;
			}
		});
		if($(slide).find(".print[data-step='"+(stepNr-1)+"']").length >0){
			$(noprintElements).addClass("print");
		}
	});
	
	var printSteps =$(slide).find(":not(.print)[data-step='1']");
	printSteps.each(function(){
		delete this.dataset.step;
	});
	stepController.activateStep([printSteps], 1);		
	
	//update steps 
	steps = stepController.getSteps(slide, false);

	$(steps).each(function(i,el){
		var stepNr = i+1;
		//presentation slide
		var slideForStep = $(slide).clone();
		//change ids, so they stay unique
		$(slideForStep).find("*").each(function(){
			if($(this).is("[id]")) $(this).attr("id",$(this).attr("id")+stepNr);
			
			if($(this).is(".substitute"))this.dataset.target = this.dataset.target+stepNr;
		});

		slideForStep.insertAfter($(lastSlide));
		$(slideForStep).prepend("<div class='slide-nr'></div>");
		$(slideForStep).find(".slide-nr").append((i+1));
		lastSlide = slideForStep;
		
		//get cloned steps
		var clonedSteps = stepController.getSteps(slideForStep, false);
		
		//deactivate all steps
		stepController.deactivateAll(clonedSteps);
		//activate alls steps up to the current one
		stepController.activateAll(clonedSteps, i+1)
	});
});
window.print();
};