# Eucalyptus

# TODO

save tree and push transactions to firebase

firebase retrieve transactions within date range

firebase add callbacks to set and push, when successful display a toast

var toast=function(msg){
  $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>"+msg+"</h3></div>")
	.css({ display: "block", 
		   opacity: 0.90, 
		   position: "fixed",
		   padding: "7px",
		   "text-align": "center",
		   width: "270px",
		   left: ($(window).width() - 284)/2,
		   top: $(window).height()/2 })
	.appendTo( $.mobile.pageContainer ).delay( 1500 )
	.fadeOut( 400, function(){
	  $(this).remove();
	});
}

Save final version of index as complete HTML (Ctrl-S) and run through W3C validator