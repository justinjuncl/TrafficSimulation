
Generator = function ( args ) {

	this.traffic = args.traffic;

	this.type = "Generator";

	this.x = args.x;
	this.y = args.y;

	this.generationRate = args.generationRate || 1;
	this.truckRatio = args.truckRatio || 0.1;
	this.maxVehicles = args.maxVehicles || 50;

	this.carSize = args.carSize || 3;
	this.truckSize = args.truckSize || 5;

};

Generator.prototype = {

	get position () {

		return new Vector2( this.x, this.y );

	},

	get width () {

		return this.to ? this.to.width : this.from.width;

	},

	get direction () {

		return this.to ? this.to.direction.multiplyScalar( -1 ) : this.from.direction;

	},

	get tangent () {

		return this.to ? this.to.tangent : this.from.tangent;

	},

	insertIntoLane: function ( lane ) {

		var size = ( probability( this.truckRatio ) ) ? this.truckSize : this.carSize;

		if ( !this.to.vehicleAtLocation( lane, size / 2 ) ) {

			this.traffic.vehicle({
				length: size,
				location: this.to,
				lane: lane,
				junctionDecision: randomWeighted([-1, 0, 1], [1, 2, 1]),
				minDistance: randomDistribution( 2, 1 )
			});

		}

	},

	init: function () {

		this.time = 0;
		this.totalTime = 0;
		this.vehiclesCount = 0;

		if (!this.to) {

			return;

		}

		this.direction = this.to.direction;
		this.laneCount = this.to.laneCount;
		this.width = this.to.width;

	},

	update: function ( deltaTime ) {

		if (!this.to) {

			return;

		}

		this.time += deltaTime;
		this.totalTime += deltaTime;

		if ( this.vehiclesCount < this.maxVehicles ) {

			if ( this.time >= this.generationRate ) {

				this.time -= this.generationRate;
				this.vehiclesCount++;

				var randomLane = Math.floor( Math.random() * this.laneCount );
				this.insertIntoLane( randomLane );

			}

		}

	},

}
