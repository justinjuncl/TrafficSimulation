// Junction Array Elements
// 0: North (0, 1)
// 1: East (1, 0)
// 2: South (0, -1)
// 3: West (-1, 0)

//Auxiliary function for sort function
function convertAngle ( angle ) {

	switch ( angle ) {

		case 90:

			return 0;

		case 0:

			return 90;

		case 270:

			return 180;

		case 180:

			return 270;

	}


}

//Custom sort function for roads array

function sortArray ( a, b ) {

	var angleA = a.direction.angleDeg;
	var angleB = b.direction.angleDeg;

	angleA = convertAngle(angleA);
	angleB = convertAngle(angleB);

	return angleA - angleB;

}


Junction = function ( args ) {

	this.type = "Junction";

    this.x = args.x;
    this.y = args.y;

    this.inComing;
    this.outGoing;

};

Junction.prototype = {

	init: function () {

		this.time = 0;

		this.inComing.sortArray(sort);
		this.outGoing.sortArray(sort);

		this.width = this.inComing[0].width + this.inComing[2].width;
		this.height = this.inComing[1].width + this.inComing[3].width;

	},

	to: function ( road, decision ) {

		var index = this.inComing.indexOf( road );

		return this.outGoing[(index + decision + 2) % 4];

	},

	update: function ( deltaTime ) {

		this.time += deltaTime;

	}

};