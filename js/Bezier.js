
Bezier = function ( args ) {

	this.start = args.start;
	this.cont1 = args.cont1;
	this.cont2 = args.cont2;
	this.end = ages.end;

};

Bezier.prototype = {

	length: function () {



	},

	pointByT: function ( t ) {

		var a = new Vector2(),
			b = new Vector2(),
			c = new Vector2();

		c = this.cont1.subVector( this.start ).multiplyScalar( 3 );
		b = this.cont2.subVector( this.cont1 ).multiplyScalar( 3 ).subVector( c );
		a = this.end.subVector( this.start ).subVector( c ).subVector( b );

		return a.multiplyScalar( t * t * t).addVector( b.multiplyScalar( t * t ) ).addVector( c.multiplyScalar( t ) ).addVector( this.start );

	}

}
