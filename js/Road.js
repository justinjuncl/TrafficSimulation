
Road = function ( args ) {

	this.traffic = args.traffic;

	this.type = "Road";

	this.from = args.from;
	this.to = args.to;

	this.laneCount = args.laneCount || 5;
	this.laneWidth = args.laneWidth || 4;
	this.maxSpeed = args.maxSpeed || 27;

	this.init();

};

Road.prototype = {

	get width () {

		return this.laneWidth * this.laneCount;

	},

	get vector() {

		return new Vector2( this.to.x - this.from.x, this.to.y - this.from.y );

	},

	get length() {

		return this.vector.length;

	},

	get direction() {

		return this.vector.normal;

	},

	get tangent() {

		return this.vector.tangent;

	},

	get position() {

		return this.from.position;

	},

	delta: function ( vehicle ) {

		var array = this.lane[vehicle.lane];
		var index = array.indexOf( vehicle );

		if ( index < array.length - 1 ) {

			return array[index + 1].localY - vehicle.maxLocalY;

		} else {

			if ( this.signal[vehicle.lane] ) {

				return this.traffic.maxVision;

			} else {

				return this.length - vehicle.maxLocalY;

			}

		}

	},

	gamma: function ( vehicle ) {

		var array = this.lane[vehicle.lane];
		var index = array.indexOf( vehicle );

		if ( index > 0 ) {

			return vehicle.localY - array[index - 1].maxLocalY;

		} else {

			return vehicle.localY;

		}

	},

	deltaAtLocation: function ( lane, y ) {

		if ( this.vehicleAtLocation( lane, y ) ) {

			return 0;

		} else {

			var array = this.lane[lane];

			if ( array.length === 0 ) {

				if ( this.signal[lane] ) {

					return this.traffic.maxVision;

				} else {

					return this.length - y;

				}
			}

			if ( y >= array[array.length - 1].maxLocalY ) {

				if ( this.signal[lane] ) {

					return this.traffic.maxVision;

				} else {

					return this.length - y;

				}

			}

			if ( y < array[0].localY ) return array[0].localY - y;

			for ( i = 0; i < array.length - 1; i++ ) {

				vehicle = array[i];
				vehicleFront = array[i + 1];

				if ( vehicle.maxLocalY < y && y <= vehicleFront.localY ) {

					return vehicleFront.localY - y;

				}

			}

			debug;

		}

	},

	gammaAtLocation: function ( lane, y ) {

		if ( this.vehicleAtLocation( lane, y ) ) {

			return 0;

		} else {

			var array = this.lane[lane];

			if ( !array[0] ) return y;

			if ( y < array[0].localY ) return y;

			if ( y > array[array.length - 1].maxLocalY ) return y - array[array.length - 1].maxLocalY;

			for ( i = 0; i < array.length - 1; i++ ) {

				vehicle = array[i];
				vehicleFront = array[i + 1];

				if ( vehicle.maxLocalY < y && y < vehicleFront.localY ) {

					return y - vehicle.maxLocalY;

				}

			}

		}

	},

	vehicleFront: function ( vehicle ) {

		var array = this.lane[vehicle.lane];
		var index = array.indexOf( vehicle );

		return array[index + 1];

	},

	vehicleBehind: function ( vehicle ) {

		var array = this.lane[vehicle.lane];
		var index = array.indexOf( vehicle );

		return array[index - 1];

	},

	vehicleAtLocation: function ( lane, y ) {

		var array = this.lane[lane];

		if ( array.length === 0 ) return null;

		for ( i = 0; i < array.length; i++ ) {

			vehicle = array[i];

			if ( vehicle.localY <= y && y < vehicle.maxLocalY ) {

				return vehicle;

			}

		}

		return null;

	},

	vehicleFrontLocation: function ( lane, y ) {

		var array = this.lane[lane];

		if ( array.length === 0 ) return null;

		if ( y > array[array.length - 1].maxLocalY ) return null;

		if ( y < array[0].localY ) return array[0];

		for ( i = 0; i < array.length - 1; i++ ) {

			vehicle = array[i];
			vehicleFront = array[i + 1];

			if ( vehicle.maxLocalY < y && y < vehicleFront.localY ) {

				return vehicleFront;

			}

		}

		return null;

	},

	vehicleBehindLocation: function ( lane, y ) {

		var array = this.lane[lane];

		if ( !array[0] ) return null;

		if ( y < array[0].localY ) return null;

		if ( y > array[array.length - 1].maxLocalY ) return array[array.length - 1];

		for ( i = 0; i < array.length - 1; i++ ) {

			vehicle = array[i];
			vehicleFront = array[i + 1];

			if ( vehicle.maxLocalY < y && y < vehicleFront.localY ) {

				return vehicle;

			}

		}

		return null;

	},

	init: function () {

		this.lane = [];

		this.signal = [];

		for (var i = 0; i < this.laneCount; i++ ) {

			this.signal.push(true);

		}

		for (var i = 0; i < this.laneCount; i++) {

			this.lane.push( [] );

		}

		if ( this.to.type == "Generator" ) {

			this.to.from = this;

		}

		if ( this.from.type == "Generator" ) {

			this.from.to = this;

		}

		if ( this.from.type == "Junction" ) {

			this.from.outGoing.push(this);

		}

		if ( this.to.type == "Junction" ) {

			this.to.inComing.push(this);

		}

	},

	update: function ( deltaTime ) {

	},

};
