//namespace:
this.argunet = this.argunet||{};

argunet.StepController = function(settings){
	var that = this;
	this.stepListeners = {};
	
	this.addStepListener = function(listener){
		if(listener.events && listener.activate && listener.deactivate){
			$(listener.events).each(function(){
				that.stepListeners[this] = that.stepListeners[this] || [];
				that.stepListeners[this].push(listener);
			});
		}else{
			throw "Object does not implement the step listener interface (listener.events, listener.activate(element), listener.deactivate(element)";
		}
	}
	this.removeStepListener = function(listener){
		$(listener.events).each(function(){
			var listeners = this.stepListeners[this];
			$(listeners).each(function(i, val){
				if(listener === this) listeners.splice(i,1);
			});
		});
	}
	//default listeners
	this.defaultHandlers = {
	add: {
		events : [".add"],
		activate : function(el){
			$(el).show();
		},
		deactivate : function(el){
			$(el).hide();
		}
	},
	remove: {
		events : [".remove"],
		activate : function(el){
			$(el).hide();
		},
		deactivate : function(el){
			$(el).show();
		}
	},
	highlight: {
		events : [".highlight"],
		activate : function(el){
			$(el).addClass("active");
		},
		deactivate : function(el){
			$(el).removeClass("active");
		}		
	},
	substitute: {
		events : [".substitute"],
		activate : function(el){
			$("#"+$(el).data("target")).hide();
			$(el).show();
		},
		deactivate : function(el){
			$("#"+$(el).data("target")).show();
			$(el).hide();
		}		
	},
	comment: {
		events : [".comment"],
		activate : function(el){
			$(el).show();
		},
		deactivate : function(el){
			$(el).hide();
		}		
	}
	};	
	
	var stringSetting = false;
	if(settings){
		$(settings).each(function(){
			if(jQuery.type(this) === "string"){ //default steps are explicitly set in settings
				stringSetting = true;
				var defaultHandler = that.defaultHandlers[this];
				if(defaultHandler) that.addStepListener(defaultHandler);
				else throw this+" is not the name of a default step listener";
			}else{
				that.addStepListener(this);
			}
		});
	}
	
	if(!settings || settings.length == 0 || !stringSetting){ //if the default settings are not customized, activate them
		settings = ["add", "remove", "highlight", "substitute", "comment"];		
		$(settings).each(function(){
				that.addStepListener(that.defaultHandlers[this]);
		});
	}
	
	
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
			$.each(that.stepListeners,function(key,listeners){
				if($(stepElement).is(key)){
					$(listeners).each(function(){
						this.activate(stepElement, key);
					});
				}
			});		
		});
	}
	this.deactivateStep = function(steps, stepNr){
		var s = steps[stepNr-1];
		var that = this;
		$(s).each(function(){
			var stepElement = this;
			$.each(that.stepListeners,function(key,listeners){
				if($(stepElement).is(key)){
					$(listeners).each(function(){
						this.deactivate(stepElement, key);
					});
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