
Road = function ( args ) {

	this.type = "Road";

	this.laneCount = args.laneCount;
	this.laneWidth = args.laneWidth;
	this.maxSpeed = args.maxSpeed;

	this.from = args.from;
	this.to = args.to;

};

Road.prototype = {

	get width () {

		return this.laneWidth * this.laneCount;

	},

	init: function () {

		this.lane = [];

		for (var i = 0; i < this.laneCount; i++) {

			this.lane.push( [] );

		}

		if ( this.to.type == "Generator" || this.to.type == "Destroyer" ) {

			this.to.from = this;

		}

		if ( this.from.type == "Generator" || this.from.type == "Destroyer" ) {

			this.from.to = this;

		}

		if ( this.from.type == "Junction" ) {

			this.from.outGoing.push(this);

		}

		if ( this.to.type == "Junction" ) {

			this.to.inComing.push(this);

		}

	},

	render: function () {

	},

	delta: function ( lane, vehicle ) {

		var array = this.lane[lane];
		var index = array.indexOf( vehicle );

		if ( index === array.length - 1 ) {

			return this.length - vehicle.maxY();

		} else {

			return array[index + 1].minY() - vehicle.maxY();

		}

	},

	gamma: function ( lane, vehicle ) {

		var array = this.lane[lane];
		var index = array.indexOf( vehicle );

		if ( index === 0 ) {

			return vehicle.minY();

		} else {

			return vehicle.minY() - array[index - 1].maxY();

		}

	},

	deltaY: function ( lane, y ) {

		if ( this.vehicleAtLocation( lane, laneWidth / 2, y ) ) {

			return 0;

		} else {

			var array = this.lane[lane];

			for ( i = 0; i < array.length; i++ ) {

				vehicle = array[i];
				vehicleNext = array[i + 1];

				if ( vehicle.maxY < y && y < vehicleNext.minY ) {

					return vehicleNext.minY - y;

				}

			}

		}

		return this.length - y;

	},

	gammaY: function ( lane, y ) {

		if ( this.vehicleAtLocation( lane, y ) ) {

			return 0;

		} else {

			var array = this.lane[lane];

			for ( i = 0; i < array.length; i++ ) {

				vehicle = array[i];
				vehicleNext = array[i + 1];

				if ( vehicle.maxY < y && y < vehicleNext.minY ) {

					return y - vehicle.maxY;

				}

			}

		}

		return y;

	},

	vehicleAtLocation: function ( lane, y ) {

		var array = this.lane[lane];

		for ( i = 0; i < array.length; i++ ) {

			vehicle = array[i];

			if ( vehicle.minY <= y && y <= vehicle.maxY ) {

				return vehicle;

			}

		}

		return null;

	},

	vehicleBehindLocation: function ( lane, y ) {

		var array = this.lane[lane];

		for ( i = 0; i < array.length; i++ ) {

			vehicle = array[i];
			vehicleNext = array[i + 1];

			if ( vehicle.maxY < y && y < vehicleNext.minY ) {

				return vehicle;

			}

		}

		return null;

	},

	get vector() {

		return new Vector2( this.to.x - this.from.x, this.to.y - this.from.y );

	},

	get length() {

		return this.vector.length;

	},

	get direction() {

		return this.vector.normal;

	}

};
