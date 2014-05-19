
Button = function ( args ) {

	this.button = document.createElement("input");
	this.button.type = "button";
	this.button.value = args.label;
	this.button.id = args.id;
	this.button.onclick = args.func;

	document.body.appendChild( this.button );

};