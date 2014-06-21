
Vehicle = function ( args ) {

	this.traffic = args.traffic;

	this.isStationary = args.isStationary || false;

	this.length = args.length || 3;
	this.width = args.width || 2;

	this.minDistance = args.minDistance === undefined ? 2 : args.minDistance;

	this.acceleration = 0;
	this.maxAcceleration = 3;
	this.minAcceleration = -4;

	this.speed = args.speed || 3;

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

	this.time = 0;
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

		var futureFrontVehicle = this.futureFrontVehicle;

		if ( futureFrontVehicle ) {

			return futureFrontVehicle.localY - this.maxLocalY;

		} else {

			return this.location.delta( this );

		}

	},

	get gamma () {

		return this.location.gamma( this );

	},

	deltaSide: function ( i ) {

		return this.location.deltaAtLocation( this.lane + i, this.localY + this.length );

	},

	gammaSide: function ( i ) {

		return this.location.gammaAtLocation( this.lane + i, this.localY);

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

	get speedX () {

		return 1;

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

				this.removeVehicle();

				break;

			default:

				break;

		}

	},

	updateLane: function ( deltaTime ) {

		if ( this.location.type !== "Road" ) return;
		if ( this.laneDecision === 0 ) return;
		if ( this.lane + this.laneDecision < 0 || this.lane + this.laneDecision >= this.location.laneCount ) return;

		this.partialX += this.speedX * deltaTime * this.laneDecision;

		var vehicleSideBehind = this.location.vehicleBehindLocation( this.lane + this.laneDecision, this.localY );

		if ( vehicleSideBehind ) {

			if ( !vehicleSideBehind.futureFrontVehicle )

				vehicleSideBehind.futureFrontVehicle = this;

		}

		if ( this.partialX >= this.location.laneWidth ) {

			this.partialX -= this.location.laneWidth;
			this.setLocation( this.location, this.lane + this.laneDecision, this.localY );

			if ( this.location.vehicleBehind( this ) ) {

				this.location.vehicleBehind( this ).futureFrontVehicle = null;

			}

		} else if ( this.partialX <= -this.location.laneWidth ) {

			this.partialX += this.location.laneWidth;
			this.setLocation( this.location, this.lane + this.laneDecision, this.localY );

			if ( this.location.vehicleBehind( this ) ) {

				this.location.vehicleBehind( this ).futureFrontVehicle = null;

			}

		}

		this.laneDecision = 0;
		this.wantedLaneDecision = 0;

	},

	attractivenessLaneDecision: function ( i, deltaTime ) {

		if ( this.lane + i < 0 || this.lane + i >= this.location.laneCount ) {

			return -1;

		} else {

			var deltaSide = this.deltaSide( i );
			var vehicleSideFront = this.location.vehicleFrontLocation( this.lane + i, this.localY);
			var sideFrontSpeed = ( vehicleSideFront ) ? vehicleSideFront.speed : 0;

			var sM = this.location.maxSpeed;

			return sM * deltaSide - sideFrontSpeed * deltaTime;

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

			var a = [this.attractivenessLaneDecision( -1, deltaTime ), this.attractivenessLaneDecision( 0, deltaTime ), this.attractivenessLaneDecision( 1, deltaTime )];

			// wLDI - wantedLaneDecisionIndex = wantedLaneDecision + 1
			var wLDI = a.indexOf(Math.max.apply(null, a));

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

				if ( this.location.vehicleFront( this ) ) {

					var sF = this.location.vehicleFront( this ).speed;
					var sM = this.location.maxSpeed;

					pLane = 1 - ( sF / sM ) * ( this.delta / this.deltaSide( this.wantedLaneDecision ) );

				} else {

					pLane = 0;

				}

				this.timeLaneChange = ( 1 - pLane ) * this.traffic.tMinValue + pLane * this.traffic.tMaxValue;

			} else {

				var l = this.location.length;
				var n = ( this.wantedLaneDecision > 0 ) ? this.location.laneCount - 1 - this.lane : this.lane;
				//var d = this.location.length - this.maxLocalY;

				pLane = ( ( this.maxlocalY ) / l ) ^ ( 1 / n );

				this.timeLaneChange = this.traffic.tMinValue / ( ( 1 - pLane ) ^ this.traffic.zValue);

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

		return this.speed * this.speed * 81 / 625;

	},

	updateSpeed: function ( deltaTime ) {

		var s = this.speed;
		var sF = ( this.location.vehicleFront( this ) ) ? this.location.vehicleFront( this ).speed : 0;
		var sM = this.location.maxSpeed;

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

			newAcceleration = this.maxAcceleration * ( ( 1 - s / sM ) ^ this.traffic.fValue );

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
		var laneAcceleration = a * ( p ^ this.traffic.cValue ) * s;

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

		if ( this.time >= 0.5 ) {

			this.time -= 0.5;
			this.veryPastSafeness = this.pastSafeness;
			this.pastSafeness = this.safeness;
			this.safeness = newSafeness;

		}

	},

	updateLocation: function ( deltaTime ) {

		switch ( this.location.type ) {

			case "Road":

				var newLocalY = this.localY + this.speed * deltaTime;
				var diff = newLocalY - this.location.length;

				if ( diff < 0 ) {

					//this.setLocation( this.location, this.lane, newLocalY );

					this.localY = newLocalY;

				} else {

					this.removeLocation();
					this.setLocation( this.locationTo, this.lane, diff );

				}

				break;

			default:

				break;

		}

	},

	update: function ( deltaTime ) {

		if (this.isStationary) return;

		this.updateLaneDecision( deltaTime );
		this.updateLane( deltaTime );
		this.updateSpeed( deltaTime );
		this.updateLocation( deltaTime );

		this.time += deltaTime;
		this.totalTime += deltaTime;

	},

};