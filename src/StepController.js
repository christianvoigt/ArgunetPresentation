//namespace:
this.argunet = this.argunet||{};

argunet.StepController = function(){
	this.stepHandler = {};
	
	this.addStepHandler = function(handler){
		this.stepHandler[handler.id] = handler;
	}
	this.removeStepHandler = function(id){
		delete this.stepHandler[id];
	}
	//default handlers
	this.addStepHandler({
		id : "add",
		activate : function(el){
			$(el).show();
		},
		deactivate : function(el){
			$(el).hide();
		}
	});
	this.addStepHandler({
		id : "remove",
		activate : function(el){
			$(el).hide();
		},
		deactivate : function(el){
			$(el).show();
		}
	});
	this.addStepHandler({
		id : "highlight",
		activate : function(el){
			$(el).addClass("active");
		},
		deactivate : function(el){
			$(el).removeClass("active");
		}		
	});
	this.addStepHandler({
		id : "substitute",
		activate : function(el){
			$("#"+$(el).data("target")).hide();
			$(el).show();
		},
		deactivate : function(el){
			$("#"+$(el).data("target")).show();
			$(el).hide();
		}		
	});
	this.addStepHandler({
		id : "comment",
		activate : function(el){
			$(el).show();
		},
		deactivate : function(el){
			$(el).hide();
		}		
	});	
	
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
			var stepElement = this;
			$.each(that.stepHandler,function(key,handler){
				if($(stepElement).is("."+key)){
					handler.activate(stepElement);
				}
			});		
		});
	}
	this.deactivateStep = function(steps, stepNr){
		var s = steps[stepNr-1];
		var that = this;
		$(s).each(function(){
			var stepElement = this;
			$.each(that.stepHandler,function(key,handler){
				if($(stepElement).is("."+key)){
					handler.deactivate(stepElement);
				}
			});		
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