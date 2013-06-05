//namespace:
this.argunet = this.argunet||{};

argunet.TransitionController = function(defaultTransition){
	this.defaultTransition = defaultTransition || "right";
	
	this.transitions = {};
	this.addTransition = function(t){
		this.transitions[t.name] = t;
	}
	this.next = function(currentSlide, nextSlide, transition){
		var tr = this.transitions[transition];
		if(!tr) tr = this.transitions[this.defaultTransition];
		tr.next(currentSlide, nextSlide);
	};
	this.previous = function(currentSlide, previousSlide, transition){
		var tr = this.transitions[transition];
		if(!tr) tr = this.transitions[this.defaultTransition];
		tr.previous(currentSlide, previousSlide);		
	};
	
	this.addTransition({
			name:"right",
			duration: 500,
			next: function(currentSlide, nextSlide){
				//reset transforms
				$(currentSlide).css("transform","none");
				$(currentSlide).css("left","0px");
				$(nextSlide).css("transform","none");				
				var width = 30+$(currentSlide).parent().innerWidth();
				$(currentSlide).transition({x:(-width)+"px"},this.duration,"linear",function(){this.hide();});
				$(nextSlide).css("left",(width) +"px");
				$(nextSlide).show().transition({x:-width+"px"},this.duration,"linear");
				
			},
			previous: function(currentSlide, previousSlide){
				$(currentSlide).css("transform","none");
				$(currentSlide).css("left","0px");
				$(previousSlide).css("transform","none");						
				var width = 30+$(currentSlide).parent().innerWidth();
				currentSlide.transition({x:(width)+"px"},this.duration,"linear",function(){this.hide();});
				$(previousSlide).css("left",(-width) +"px");
				$(previousSlide).show().transition({x:width+"px"},this.duration,"linear");				
			}
		});
	this.addTransition({
			name:"bottom",
			duration: 600,
			next: function(currentSlide, nextSlide){
				//reset transforms
				$(currentSlide).css("transform","none");
				$(currentSlide).css("top","0px");
				$(nextSlide).css("transform","none");				
				var height = 30+this.currentSlide.parent().outerHeight();
				$(currentSlide).transition({y:(-height)+"px"},this.duration,"linear",function(){this.hide();});
				$(nextSlide).css("top",(height) +"px");
				$(nextSlide).show().transition({y:-height+"px"},this.duration,"linear");
				
			},
			previous: function(currentSlide, previousSlide){
				$(currentSlide).css("transform","none");
				$(currentSlide).css("top","0px");
				$(previousSlide).css("transform","none");						
				var height = 30+this.currentSlide.parent().outerHeight();
				currentSlide.transition({y:(height)+"px"},this.duration,"linear",function(){this.hide();});
				$(previousSlide).css("top",(-height) +"px");
				$(previousSlide).show().transition({y:height+"px"},this.duration,"linear");				
			}
		});
	this.addTransition({
		name:"none",
		next: function(currentSlide, nextSlide){
			$(currentSlide).hide();
			$(nextSlide).show();
		},
		previous: function(currentSlide, previousSlide){
			$(currentSlide).hide();
			$(previousSlide).show();			
		}
	});	

};