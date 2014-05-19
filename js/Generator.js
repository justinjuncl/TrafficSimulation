
Generator = function ( args ) {

	this.type = "Generator";

	this.x = args.x;
	this.y = args.y;

	this.generationRate = args.generationRate;
	this.truckRatio = args.truckRatio;
	this.maxVehicles = args.maxVehicles;

	this.carSize = args.carSize;
	this.truckSize = args.truckSize;

};

Generator.prototype = {

	get position () {

		return new Vector2( this.x, this.y );

	},

	init: function () {

		this.lane = []

		this.time = 0;

		this.direction = this.to.direction;
		this.laneCount = this.to.laneCount;
		this.width = this.to.width;

	},

	generateVehicle: function ( location, lane, size ) {

		return new this.traffic.vehicle({
			length: size,
			width: 2,
			location: location,
			lane: lane,
			localY: size / 2
		})

	},

	insertIntoLane: function ( lane ) {

		var size = ( probability( this.truckRatio ) ) ? this.truckSize : this.carSize;

		if ( !this.to.vehicleAtLocation( lane, size ) ) {

			this.generateVehicle( this.to, lane, size );

		}

	},

	update: function ( deltaTime ) {

		var randomLane = Math.floor( Math.random() * this.laneCount );

		//this.insertIntoLane( randomLane );

		this.time += deltaTime;

	},

	render: function () {

	}

}