//namespace:
this.argunet = this.argunet||{};

argunet.ArgunetBrowserPlugin = function(){
	//load ArgunetBrowser 
	this.argunetLoader = lightningjs.require("argunet", "src/lib/ArgunetBrowser/ArgunetBrowser.embed.min.js");	
	
	this.browsers = [];

	var that = this;
	
	//Find all map elements
	$(".argument-map").each(function(i, val){
		
		var browserId = i+1;
		$(this).data("browser-id", browserId);
		var height = $(this).innerHeight();
		var debateUrl = $(this).data("src");
		var firstNode = $(this).data("node");
		
		that.browsers.push({steps:[this]});
		
		//find all steps for this browser
		$(this).closest("section").children(".select-node, .graph-depth").each(function(){
			var browserIdForStep = $(this).data("browser")? $("#"+$(this).data.browser).data("browser-id") : $(this).prevAll(".argument-map").first().data("browser-id") || $(this).closest(".argument-map").first().data("browser-id");
			if(browserIdForStep == browserId){
				that.browsers[browserId-1].steps.push(this);
			}
		});

		that.browsersLoaded = 0;
		that.argunetLoader("createArgunetBrowser",{htmlElement: this, debateUrl:debateUrl,firstNode:firstNode,cssUrl:"src/lib/ArgunetBrowser/ArgunetBrowser.min.css", height:height}).then(function(argunetBrowser){
			that.browsers[that.browsersLoaded].browser = argunetBrowser;
			
			//activate steps if there already is an active step
			if(that.browsers[that.browsersLoaded].activeStep){
				var stepIndex = that.findStepIndexForBrowser(that.browsers[that.browsersLoaded].activeStep, that.browsersLoaded+1);
				var i = 0;
				while(i<stepIndex){
					i++;
					var step = that.browsers[that.browsersLoaded].steps[i];
					that.activate(step, $(step).is(".select-node")? ".select-node" : ".graph-depth");
				}
			}
			
			that.browsersLoaded++;
		}, function(error){
			console.log("Failed to load Argunet Browser: "+error);
		});

	});
	
	//Step Listener interface
	this.events = [".select-node", ".graph-depth"];
	this.activate = function(element, event){
		var id = $(element).data("browser")? $("#"+$(element).data.browser).data("browser-id") : $(element).prevAll(".argument-map").first().data("browser-id") || $(element).closest(".argument-map").first().data("browser-id");
		var browserReady = this.browsers[id-1] && this.browsers[id-1].browser;
		if(browserReady && event == ".select-node"){
			var node = $(element).data("node");
			this.browsers[id-1].browser.selectNode(node);
		}else if(browserReady && event == ".graph-depth"){
			var depth = $(element).data("depth");
			this.browsers[id-1].browser.setGraphDepth(depth);				
		}
		this.browsers[id-1].activeStep = element;
	};
	this.deactivate = function(element, event){
		var id = $(element).data("browser")? $("#"+$(element).data.browser).data("browser-id") : $(element).prevAll(".argument-map").first().data("browser-id") || $(element).closest(".argument-map").first().data("browser-id");
		var stepIndex = this.findStepIndexForBrowser(element, id);
			while(stepIndex > 0){
				stepIndex--;
				var prevStep = this.browsers[id-1].steps[stepIndex];
				if($(prevStep).is(event)){
					this.activate(prevStep, ".select-node");
					this.browsers[id-1].activeStep = prevStep;
					stepIndex = 0;
				}else if($(prevStep).is(".argument-map")){
					var browserReady = this.browsers[id-1] && this.browsers[id-1].browser;
					if(browserReady && event == ".select-node") this.browsers[id-1].browser.selectNode($(prevStep).data("node"));
					else if(browserReady && event == ".graph-depth") this.browsers[id-1].browser.setGraphDepth(1);	

					this.browsers[id-1].activeStep = prevStep;
				}
			}
	};
	this.findStepIndexForBrowser = function(element, id){
		//find step in browserSteps
		var stepIndex = 0;
		$.each(this.browsers[id-1].steps, function(i){
			if($(this).get(0) === $(element).get(0)){
				stepIndex = i;
				return false;
			}
		});		
		return stepIndex;
	}
};