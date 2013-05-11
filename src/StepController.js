//namespace:
this.argunet = this.argunet||{};

argunet.StepController = function(){
	//get steps for slide
	this.getSteps = function(slide, cloneComments){
		var stepMembers = $(slide).find("[data-step]");
		var steps = [];
		stepMembers.each(function(){
			var step = $(this).data('step');
			if(!steps[step-1])steps[step-1]=[];
			var el = this;
			
			if(cloneComments){ //not for print
				//comments have to be cloned into .comments, because otherwise css transitions break position:fixed for them
				if($(this).is(".comment")) el = $(this).clone().appendTo($(".comments"));
				
				//find out if this step is children of a comment. if so, we have to find the comment clone in .comments
				if($(this).is(".comment *")){
					//get the index position of the comment
					var comment = $(this).closest(".comment");
					var i = comment.find("*").index($(this)); 
	
					el = $(".comments .comment").find("*").get(i); //use it to find the clone
	
				}
			}
			steps[step-1].push(el);
		});		
		steps = $.grep(steps,function(n){ return(n) }); //removes empty steps, that were added because there was a gap
		return steps;
	}
	this.activateStep = function(steps, stepNr){
		var s = steps[stepNr-1];
		var that = this;
		$(s).each(function(){
			if($(this).is(".add")){
				$(this).show();
			}else if($(this).is(".remove")){
				$(this).hide();
			}else if ($(this).is(".highlight")){
				$(this).addClass("active");
			}else if ($(this).is(".substitute")){
				var target = $("#"+$(this).data("target")).hide();
				$(this).show();
			}else if ($(this).is(".comment")){
				$(".comments .comment:visible").hide();
				//$(this).closest("section").find(".comment").hide();
				$(this).show();
			}			
		});
	}
	this.deactivateStep = function(steps, stepNr){
		var s = steps[stepNr-1];
		$(s).each(function(){
			if($(this).is(".add")){
				$(this).hide();
			}else if($(this).is(".remove")){
				$(this).show();
			}else if ($(this).is(".highlight")){
				$(this).removeClass("active");
			}else if ($(this).is(".substitute")){
				var target = $("#"+$(this).data("target")).show();
				$(this).hide();
			}else if ($(this).is(".comment")){
				$(this).hide();
			}			
		});
	}	
	this.activateAll = function(steps, stepNr){
		var that = this;
		if(!stepNr) var stepNr = 0; 
		$(steps).each(function(i, el){
			if(i+1 <= stepNr) that.activateStep(steps, i+1);
		});			

	}
	this.deactivateAll = function(steps){
		var that = this;
		var reversed = $(steps).get().reverse();
		$(reversed).each(function(i, el){
			that.deactivateStep(reversed, i+1);
		});		
	}
	
};