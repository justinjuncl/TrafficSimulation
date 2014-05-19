
Array.prototype.contains = function(element) {
	var i = this.length;
	while (i--) {
		if (this[i] === element) {
			return true;
		}
	}
	return false;
}


Destroyer = function ( args ) {

	this.type = "Destroyer";

	this.x = args.x;
	this.y = args.y;

};

Destroyer.prototype = {

	init: function () {

		this.time = 0;

		this.direction = this.from.direction;
		this.laneCount = this.from.laneCount;
		this.width = this.from.width;

		this.lane = [];

		for ( var l = 0; l < this.laneCount; l++ ) {

			this.lane.push( [] );

		}

	},

	update: function ( deltaTime ) {

		var vInD = [];

		for ( var l = 0; l < this.laneCount; l++ ) {

		  vInD.concat( this.lane[l] );

		}

		var vehicles = this.traffic.vehicles;

		vehicles.foreach(function( element, index, array ) {

			if (vInD.contains(element)) {

				array.splice( index, 1 );

			}

		});

		this.lane = [];

		for ( var l = 0; l < this.laneCount; l++ ) {

			this.lane.push( [] );

		}

		this.time += deltaTime;

	},

	render: function () {

	}

}
