
Vehicle = function ( args ) {

	this.length = args.length;
	this.width = args.width;

	this.acceleration = 0;
	this.speed = args.speed;

	this.laneDecision = args.laneDecision;
	this.junctionDecision = args.junctionDecision;

	this.location = args.location;
	this.lane = args.lane;

	this.localY = args.localY;
	this.partialX = 0;

	this.setLocation(this.location, this.lane, this.localY);

	this.time = 0;

};

Vehicle.prototype = {

	get localX () {

		return this.location.laneWidth * ( this.lane + 0.5 ) + this.partialX;

	},

	get minLocalX () {

		return this.localX - ( this.width / 2 );

	},

	get maxLocalX () {

		return this.localX + ( this.width / 2 );

	},

	get minLocalY () {

		return this.localY - ( this.length / 2 );

	},

	set minLocalY ( y ) {

		this.localY = y + ( this.length / 2 );

	},

	get maxLocalY () {

		return this.localY + ( this.length / 2 );

	},

	get globalPosition () {

		return this.location.from.position.addVector( this.location.direction.multiplyScalar( this.localY ) );

	},

	get delta () {

		return this.location.delta(this.lane, this);

	},

	get gamma () {

		return this.location.gamma(this.lane, this);

	},

	get locationTo () {

		switch ( this.location.type ) {

			case "Road":

				return this.location.to;

				break;

			case "Junction":

				return this.location.to( this.location, this.junctionDecision );

				break;

			default:

				break;

		}

	},

	get locationFrom () {

		switch ( this.location.type ) {

			case "Road":

				return this.location.from;

				break;

			case "Junction":

				return this.location.locationsFrom;

				break;

			default:

				break;

		}

	},

	get vector () {

		return this.location.direction;
	},

	get velocity () {

		return this.vector.multiplyScalar( this.speed );

	},

	get color () {

		var a = this.acceleration;

	},

	get speedX () {

		return ( this.laneDecision === 0 ) ? 0 : this.laneDecision * this.speed * 0.1;

	},

	removeVehicle: function () {

		var array = this.traffic.vehicles;
		var index = array.indexOf(this);

		array.splice( index, 1 );

	},

	removeLocation: function () {

		switch ( this.location.type ) {

			case "Road":

				var road = this.location;
				var lane = this.lane();
				var index = road.lane[ lane ].indexOf( this );

				this.location.lane[ lane ].splice( index, 1 );

				break;

			case "Junction":

				break;

			default:

				break;

		}

		this.location = null;

	},

	setLocation: function ( location, lane, localY ) {

		if ( !location || !lane || !localY ) {

			return;

		}

		switch ( location.type ) {

			case "Road":

				//Fall through

			case "Destroyer":

				this.localY = localY;

				if ( this.location === location && this.lane === lane ) {
					// Do nothing to road array if on same lane and road
				} else {

					this.removeLocation();
					this.location = location;
					this.lane = lane;

					for ( i = 0; i < location.lane[ lane ].length; i++ ) {
						if ( i.localY < this.localY ) {
							this.location.splice( i + 1, 0, this);
						}
					}

				}

				break;

			case "Junction":

				this.removeLocation();
				this.location = location;

				break;

			default:

				break;

		}

	},

	translateHorizontally: function ( pX ) {


	},

	updateLane: function () {

		if ( this.partialX >= this.location.laneWidth / 2) {

			this.partialX -= this.location.laneWidth / 2;

			this.setLocation(this.location, this.lane + this.laneDecision, this.localY );

		}

	},

	canChangeLane: function ( i ) {

		if ( this.road.vehicleAtLocation( this.lane + i, this.localY ) ) {

			return false;

		}

		var vehicleSide = this.road.vehicleAtLocation( this.lane + i, this.localY );

		if ( vehicleSide.delta <= this.delta ) {

			return false;

		}

		if ( !this.road.vehicleBehindLocation( this.lane + i, this.localY) ) {

			return true;

		}

		var vehicleSideBehind = this.road.vehicleBehindLocation( this.lane + i, this.localY );

		if ( cehicleSideBehind.speed > this.speed ) {

			return false;

		}

		if ( this.road.gammaY( this.lane + i, this.localY ) <= v * v * 81 / 1250 ) {

			return false;

		}

		return true;

	},

	updateLaneDecision: function () {

		if ( this.laneDecision !== 0  || this.delta >= this.road.maxSpeed ) {

			return;

		}

		var n = 0;

		if ( this.canChangeLane( -1 ) ) {

			n += 1;

		}

		if ( this.canChangeLane( 1 ) ) {

			n += 2;

		}

		if ( n === 3 ) {

			switch ( this.junctionDecision ) {

				case 0:

					n = ( probability( this.traffic.pChoose ) ) ? 1 : 2;

					break;

				case -1:

					n = 1;

					break;

				case 1:

					n = 2;

					break;

				default:

					break;

			}

		}

		// ----------------
		// Implement pGo
		var pGo = 0.5;
		// ----------------

		if ( n !== 0 ) {

			n = ( probability( pGo ) ) ? 0 : n;

		}

		switch (n) {

			case 0:

				this.laneDecision = 0;

				break;

			case 1:

				this.laneDecision = -1;

				break;

			case 2:

				this.laneDecision = 1;

				break;

			default:

				break;

		}

	},

	updateSpeed: function ( deltaTime ) {

		var s = this.speed;

		var saftyDistance = this.delta + s - ( v * v * 81 / 625);

		var newSpeed = Math.min(s + this.acceleration, this.location.maxSpeed, saftyDistance);

		if (probability(this.traffic.pBreak) && newSpeed > 0) {
			newSpeed--;
		}

		this.speed = newSpeed;

		this.acceleration = ( newSpeed - s ) / deltaTime;

	},

	updateLocation: function ( deltaTime ) {

		switch ( this.location.type ) {

			case "Road":

				// Fall through

			case "Junction":

				var newLocalY = this.localY + this.speed * deltaTime;
				var diff = newLocalY - this.location.length;

				if ( diff < 0 ) {

					this.setLocation( this.location, this.lane, newLocalY );

				} else {

					this.setLocation( this.locationTo, this.lane, diff );

				}

				this.partialX += this.speedX * deltaTime;

				break;

			default:

				break;

		}

	},

	update: function ( deltaTime ) {

		this.updateLane();
		this.updateLaneDecision();
		this.updateSpeed( deltaTime );
		this.updateLocation( deltaTime );

		this.time += deltaTime;

	},

	render: function () {

	}

};
