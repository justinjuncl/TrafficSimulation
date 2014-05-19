
Canvas = function ( args ) {

	this.canvas = document.createElement( args.canvas );

	this.width = args.width;
	this.height = args.height;
	this.widthHalf = Math.floor( this.width );
	this.heightHalf = Math.floor( this.height );

	this.canvas.width = this.width;
	this.canvas.height = this.height;

	this.context = this.canvas.getContext('2d');

	this.clearColor = "#000000";

	document.body.appendChild( this.canvas );

};

Canvas.prototype = {

	clear: function () {

		this.context.setTransform( 1, 0, 0, -1, this.widthHalf, this.heightHalf );

	},

	render: function ( system, camera ) {

		clear();

	},

	renderElement: function ( element ) {

		switch ( element.getName() ) {



		}

	}

}