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
			if(typeof listener.init === 'function'){
				listener.init();
			}
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
				},
				init : function(){
					$(".add-from-here-on").each(function(){
						$(this).addClass("add");
						$(this).nextAll(":not(ul,ol,dl)").addClass("add");
						$(this).nextAll("ul,ol,dl").children("li,dt,dd").addClass("add");
					});
					$(".add-all").each(function(){
						$(this).children(":not(ul,ol,dl)").addClass("add");
						$(this).children("ul,ol,dl").children("li,dt,dd").addClass("add");
					});

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
				},
				init: function(el){
					var i = 1; 
					$(".substitute").not("[data-target]").each(function(){ //if no target is given, we will take the previous element
						var id = "argunet-substitution-target-"+i;
						$(this).data("target",id)
						$(this).prev().attr("id",id);
						i++;
					});
				}
			},
			comment: {
				events : [".comment", ".no-comment"],
				activate : function(el){
					if($(el).is(".comment")){
						$(el).show();
						$(el).siblings(".comment").not(":hidden").hide();				
					}else if($(el).is(".no-comment")){
						$(el).siblings(".comment").not(":hidden").hide();
					}
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

	this.addStepNrsToElements = function(){ 
		var stepClasses = "";
		$.each(this.stepListeners,function(key, value){
			if(stepClasses!="") stepClasses+=", ";
			stepClasses+= key;
		});

		var slides = $("section");
		$(slides).each(function(){
			var stepElements = $(this).find(stepClasses);
			var after = {};
			var atOnceWith = {};
			var steps = [];
			


			$(stepElements).each(function(i, val){
				if($(this).is("[data-after]")){
					var id = $(this).data("after");
					if(!after[id]) after[id] = [];
					after[id].push(this);
				}else if($(this).is("[data-at-once-with]")){
					var id = $(this).data("at-once-with");
					if(!atOnceWith[id]) atOnceWith[id] = [];
					atOnceWith[id].push(this);
				}else{
					steps.push(this);
				}
			});		
			
			var setStepNr = function(el, nr){
				el.dataset.step = nr;
				var id = $(el).attr("id");
				
				if(id){
					if(atOnceWith[id]){
						$.each(atOnceWith[id], function(){
							nr = setStepNr(this, nr); //recursive to get chains of elements that were ordered manually
						});
					}else if(after[id]){
						nr++;
						$.each(after[id], function(){
							nr = setStepNr(this, nr); //recursive to get chains of elements that were ordered manually
						});						
					}
				}
				return nr;
			};
			
			var stepNr = 1;
			$(steps).each(function(i, val){
				stepNr = setStepNr(this,stepNr);
				stepNr++;
			});
		});
	};

	if($("[data-step]").length == 0){ //only add step nrs automatically, if there aren't already some
		this.addStepNrsToElements();
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
				if($(this).is(".comment, .no-comment")) el = $(this).clone().appendTo($(".comments"));

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