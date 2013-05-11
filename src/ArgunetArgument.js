$(function(){
	$(".argument .conclusion").each(function(){
		if($(this).children(".inference").length == 0){
			$(this).prepend("<span class='inference'></span>");
		}
	});
})