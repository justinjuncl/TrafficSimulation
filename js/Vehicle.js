
Vehicle = function ( args ) {

	this.traffic = args.traffic;

	this.isStationary = args.isStationary || false;
	this.isAlerted = false;

	this.length = args.length || 3;
	this.width = args.width || 2;

	this.isTruck = this.length > 3;

	this.minDistance = args.minDistance === undefined ? 2 : args.minDistance;

	this.acceleration = 0;
	this.maxAcceleration = ( 3 / this.length ) * 3;
	this.minAcceleration = - ( 3 / this.length ) * 3;

	this.speed = args.speed || 3;
	this.angle = 0;

	this.safeness = [Date.now() / 1000, Infinity];
	this.pastSafeness = [this.safeness[0] - 0.5, Infinity];
	this.veryPastSafeness = [this.safeness[0] - 1, Infinity];

	this.laneDecision = args.laneDecision === undefined ? 0 : args.laneDecision;
	this.junctionDecision = args.junctionDecision === undefined ? 0 : args.junctionDecision;
	this.wantedLaneDecision = args.wantedLaneDecision === undefined ? 0 : args.wantedLaneDecision;

	this.wantToChangeLane = false;

	this.location = args.location;
	this.lane = args.lane;

	this.pLane = 0;

	this.partialX = args.partialX === undefined ? 0 : args.partialX;
	this.localY = args.localY === undefined ? 0: args.localY;

	this.timeSafeness = 0;
	this.totalTime = 0;

	this.setLocation( this.location, this.lane, this.localY );
};

Vehicle.prototype = {

	get localX () {

		return this.partialX + this.location.laneWidth * ( this.lane + 0.5 ) - ( this.width * 0.5 );

	},

	get centerLocalX () {

		return this.localX + ( this.width / 2 );

	},

	get maxLocalX () {

		return this.localX + this.width;

	},

	get centerLocalY () {

		return this.localY + ( this.length / 2 );

	},

	set centerLocalY ( y ) {

		this.localY = y - ( this.length / 2 );

	},

	get maxLocalY () {

		return this.localY + this.length;

	},

	get globalPosition () {

		return this.location.position.addVector( this.direction.multiplyScalar( this.localY ) )
											.addVector( this.tangent.multiplyScalar( this.localX ) );

	},

	get centerGlobalPosition () {

		var position = this.globalPosition;

		return position.addVector( this.direction.multiplyScalar( this.length / 2 ) )
						.addVector( this.tangent.multiplyScalar( this.width / 2 ) );

	},

	get maxGlobalPosition () {

		var position = this.globalPosition;

		return position.addVector( this.direction.multiplyScalar( this.length ) )
						.addVector( this.tangent.multiplyScalar( this.width ) );

	},

	get delta () {

		if ( this.isAlerted && this.futureFrontVehicle ) {

			return this.futureFrontVehicle.localY - this.maxLocalY;

		} else {

			return this.location.delta( this );

		}

	},

	get gamma () {

		return this.location.gamma( this );

	},

	deltaSide: function ( i ) {

		if ( i === 0 ) {

			return this.delta;

		} else {

			return this.location.deltaAtLocation( this.lane + i, this.localY + this.length );

		}

	},

	gammaSide: function ( i ) {

		if ( i === 0 ) {

			return this.gamma;

		} else {

			return this.location.gammaAtLocation( this.lane + i, this.localY);

		}

	},

	get vehicleFront () {

		return this.location.vehicleFront( this );

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

	get direction () {

		return this.location.direction;

	},

	get tangent () {

		return this.location.tangent;

	},

	get velocity () {

		return this.direction.multiplyScalar( this.speed );

	},

	get color () {

		return this.acceleration / this.maxAcceleration;

	},

	get angle () {

		if ( this.laneDecision === 0 ) {

			return 0;

		} else {

			//if ( this.traffic.aValue * this.location.laneWidth / this.speed >= 0.7 ) debug;
			return Math.asin( this.traffic.aValue * this.location.laneWidth / this.speed );

		}

	},

	get speedX () {

		return Math.sin( this.angle ) * this.speed;

	},

	get speedY () {

		return Math.cos( this.angle ) * this.speed;

	},

	get maxSpeed () {

		return ( 3 / this.length ) * this.location.maxSpeed;

	},

	removeVehicle: function () {

		var array = this.traffic.vehicles;
		var index = array.indexOf(this);

		array.splice( index, 1 );

	},

	removeLocation: function () {

		switch ( this.location.type ) {

			case "Road":

				var location = this.location;
				var lane = this.lane;
				var index = location.lane[ lane ].indexOf( this );

				if ( index === -1 ) break;

				location.lane[ lane ].splice( index, 1 );

				break;

			default:

				break;

		}

	},

	setLocation: function ( location, lane, localY ) {

		switch ( location.type ) {

			case "Road":

				this.removeLocation();

				this.localY = localY;
				this.location = location;
				this.lane = lane;

				if (location.lane[lane].length === 0) {
					location.lane[lane].unshift( this );
					break;
				}

				if ( this.localY < location.lane[lane][0].localY ) {

					location.lane[lane].unshift( this );
					break;

				}

				if ( this.localY > location.lane[lane][location.lane[lane].length - 1].localY ) {

					location.lane[lane].push( this );
					break;

				}

				for ( i = 0; i < location.lane[lane].length - 1; i++ ) {
					if ( location.lane[lane][i].localY < this.localY && this.localY < location.lane[lane][i + 1].localY ) {
						location.lane[ lane ].splice( i + 1, 0, this);
						break;
					}
				}

			case "Junction":

				this.location = location;

				break;

			case "Generator":

				if ( this.location.type === "Road") this.removeLocation();
				this.removeVehicle();

				break;

			default:

				break;

		}

	},

	updateLane: function ( deltaTime ) {

		if ( this.location.type !== "Road" ) return;
		if ( this.laneDecision === 0 ) return;

		this.partialX += this.speedX * deltaTime * this.laneDecision;

		var vehicleSideBehind = this.location.vehicleBehindLocation( this.lane + this.laneDecision, this.localY );

		if ( vehicleSideBehind ) {

			if ( !vehicleSideBehind.isAlerted ) {

				vehicleSideBehind.isAlerted = true;
				vehicleSideBehind.futureFrontVehicle = this;

				this.futureBehindVehicle = vehicleSideBehind;
				this.futureFrontVehicle = vehicleSideBehind.vehicleFront;

			}

		}

		if ( this.partialX >= this.location.laneWidth ) {

			this.partialX = 0;
			this.setLocation( this.location, this.lane + this.laneDecision, this.localY );

			var vehicleBehind = this.location.vehicleBehind( this );

			if ( vehicleBehind ) {

				vehicleBehind.isAlerted = false;
				vehicleBehind.futureFrontVehicle = null;
				this.futureBehindVehicle = null;
				this.futureFrontVehicle = null;

			}

		} else if ( this.partialX <= -this.location.laneWidth ) {

			this.partialX = 0;
			this.setLocation( this.location, this.lane + this.laneDecision, this.localY );

			var vehicleBehind = this.location.vehicleBehind( this );

			if ( vehicleBehind ) {

				vehicleBehind.isAlerted = false;
				vehicleBehind.futureFrontVehicle = null;
				this.futureBehindVehicle = null;
				this.futureFrontVehicle = null;

			}

		}

		this.laneDecision = 0;
		this.wantedLaneDecision = 0;

	},

	attractivenessLaneDecision: function ( i ) {

		if ( this.lane + i < 0 || this.lane + i >= this.location.laneCount || ( this.deltaSide( i ) === 0 ) ) {

			return -1;

		} else {

			var deltaSide = this.deltaSide( i );
			var vehicleSideFront = this.location.vehicleFrontLocation( this.lane + i, this.localY);
			var sF = ( vehicleSideFront ) ? vehicleSideFront.speed : 0;
			var sM = this.maxSpeed;

			var truckState = this.isTruck ? 0 :
							( vehicleSideFront ?
								( vehicleSideFront.isTruck ? 1 : 0 ) :
								0 );

			var pLane;

			pLane = 1 - ( sF / sM ) * Math.pow( this.delta / deltaSide , this.traffic.hValue );
			pLane = Math.pow( pLane, this.traffic.qValue + this.traffic.rValue * truckState );

			if (isNaN(pLane)) debug;
			return pLane;

		}

	},

	isSafeLaneDecision: function ( i ) {

		if ( this.lane + i < 0 || this.lane + i >= this.location.laneCount ) {

			return false;

		}

		if ( this.location.vehicleAtLocation( this.lane + i, this.localY ) ) {

			return false;

		}

		var vehicleSideBehind = this.location.vehicleBehindLocation( this.lane + i, this.localY );

		if ( !vehicleSideBehind ) {

			return true;

		}

		var s = vehicleSideBehind.speed;

		if ( s > this.speed ) {

			return false;

		}

		if ( this.gammaSide( i ) <= s * s * 81 / 1250 ) {

			return false;

		}

		return true;

	},

	updateLaneDecision: function ( deltaTime ) {

		if ( this.junctionDecision === 0 ) {

			var a = [this.attractivenessLaneDecision( -1 ), this.attractivenessLaneDecision( 0 ), this.attractivenessLaneDecision( 1 )];

			// wLDI - wantedLaneDecisionIndex = wantedLaneDecision + 1
			var wLDI = a.indexOf(Math.max.apply(null, a));

			if (wLDI === -1) debug;

			if ( a[wLDI] === a[1] ) {

				wLDI = 1;

			}

			this.wantedLaneDecision = wLDI - 1;

		} else {

			this.wantedLaneDecision = this.junctionDecision;

		}

		if ( !this.wantToChangeLane ) {

			var pLane;

			if ( this.junctionDecision === 0) {

				if ( this.vehicleFront || this.futureFrontVehicle ) {

					pLane = this.attractivenessLaneDecision( this.wantedLaneDecision );

				if (isNaN(pLane)) debug;

				} else {

					pLane = 0;

				}

				this.timeLaneChange = ( 1 - pLane ) * this.traffic.tMinValue + pLane * this.traffic.tMaxValue;

			} else {

				var l = this.location.length;

				var n = ( this.wantedLaneDecision > 0 ) ? this.location.laneCount - 1 - this.lane : this.lane;
				//var d = this.location.length - this.maxLocalY;

				if ( n === 0 ) n = 1;

				pLane = Math.pow( this.maxLocalY / l, 1 / n );

				if (isNaN(pLane)) debug;

				this.timeLaneChange = this.traffic.tMinValue / Math.pow( 1 - pLane, this.traffic.zValue);

			}

			this.pLane = pLane;

			if ( probability( pLane ) ) {
				this.wantToChangeLane = true;
			} else {
				this.wantedLaneDecision = 0;
			}

		}

		if ( this.isSafeLaneDecision( this.wantedLaneDecision ) ) {

			this.laneDecision = this.wantedLaneDecision;

		} else {

			this.laneDecision = 0;

		}

		if ( this.timeLaneChange > 0 ) {

			this.timeLaneChange -= deltaTime;

		} else {

			this.timeLaneChange = 0;
			this.wantedLaneDecision = 0;
			this.laneDecision = 0;
			this.wantToChangeLane = false;

		}

	},

	get safetyDistance () {

		var sl = this.speed * this.speed * 81 / 625;

		return ( this.length / 3 ) * sl;

	},

	updateSpeed: function ( deltaTime ) {

		var s = this.speed;
		var sF = ( this.vehicleFront ) ? this.vehicleFront.speed : 0;
		var sF = ( this.futureFrontVehicle ) ? this.futureFrontVehicle.speed : 0;
		var sM = this.maxSpeed;

		//---------------------------------------
		// Calculating safenessValue

		var newSafenessValue;

		if ( this.delta > this.traffic.maxVision ) {

			newSafenessValue = Infinity;

		} else {

			var nSVAux = this.delta - this.minDistance - this.safetyDistance - ( s - sF );
			newSafenessValue = (nSVAux > 0) ? this.traffic.kValue * nSVAux: nSVAux;

		}

		//---------------------------------------

		//---------------------------------------
		// Calculating newAcceleration

		var newAcceleration;

		if ( s < sM - this.traffic.eValue ) {

			newAcceleration = this.maxAcceleration * Math.pow( 1 - s / sM, this.traffic.fValue );

		} else if ( sM - this.traffic.eValue <= s && s <= sM + this.traffic.eValue ) {

			newAcceleration = 0;

		} else if ( sM + this.traffic.eValue < s ) {

			newAcceleration = this.maxAcceleration * ( 1 - s / sM )

		}

		// if ( probability(0.1) ) newAcceleration = 0;

		//---------------------------------------

		//---------------------------------------
		// Getting oldSafenessValue

		var newSafeness = [Date.now() / 1000, newSafenessValue];

		var veryPastTime = Math.abs( newSafeness[0] - this.veryPastSafeness[0] - 1 );
		var pastTime = Math.abs( newSafeness[0] - this.pastSafeness[0] - 1 );

		var oldSafenessValue = ( veryPastTime < pastTime ) ? this.veryPastSafeness[1] : this.pastSafeness[1];

		//---------------------------------------
		// Calculating acceleration for lane decision

		var p = this.pLane;
		var a = ( probability(p) ) ? 1 : 0;
		var laneAcceleration = a * Math.pow( p, this.traffic.cValue ) * s;

		//---------------------------------------

		newAcceleration = Math.min( oldSafenessValue - s, newAcceleration);

		if ( this.laneDecision !== 0 ) {

			newAcceleration = Math.min( -laneAcceleration, newAcceleration );

		}

		newAcceleration = Math.max( this.minAcceleration, newAcceleration );

		newAcceleration = randomDistribution( newAcceleration, 1 );

		var newSpeed = s + newAcceleration * deltaTime;
		newSpeed = Math.max( 0, newSpeed );

		this.speed = newSpeed;
		this.acceleration = ( newSpeed - s ) / deltaTime;

		this.timeSafeness += deltaTime;

		if ( this.timeSafeness >= 0.5 ) {

			this.timeSafeness -= 0.5;
			this.veryPastSafeness = this.pastSafeness;
			this.pastSafeness = this.safeness;
			this.safeness = newSafeness;

		}

	},

	updateLocation: function ( deltaTime ) {

		switch ( this.location.type ) {

			case "Road":

				var newLocalY = this.localY + this.speedY * deltaTime;
				var diff = newLocalY - this.location.length;

				if ( diff < 0 ) {

					this.localY = newLocalY;

				} else {

					this.setLocation( this.locationTo, this.lane, diff );

					if (this.futureBehindVehicle) this.futureBehindVehicle.futureFrontVehicle = null;

					timeFinish[0] = ( this.totalTime + timeFinish[0] * timeFinish[1] ) / ++timeFinish[1];

				}

				break;

			default:

				break;

		}

	},

	update: function ( deltaTime ) {

		if ( this.isStationary ) return;

		if ( this.traffic.enableLaneChange && this.localY > 300 ) {
		this.updateLaneDecision( deltaTime );	// Update Lane Decision
		this.updateLane( deltaTime );			// Update Lane
		}

		this.updateSpeed( deltaTime );			// Update Speed
		this.updateLocation( deltaTime );		// Update Location

		this.totalTime += deltaTime;

	},

};