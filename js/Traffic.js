
Traffic = function ( args ) {

	this.aValue = 4 / 11;
	this.cValue = 2;
	this.eValue = 1;
	this.fValue = 1;
	this.hValue = 1;
	this.kValue = 0.5;
	this.qValue = 1;
	this.rValue = 1;
	this.zValue = 1;
	this.tMinValue = 3;
	this.tMaxValue = 10;
	this.maxVision = 500;

	this.maxAngle = 0.5;

	this.maxSpeed = 27;
	this.initialSpeed = 5;

	this.maxAcceleration = 4;
	this.minAcceleration = -4;
	this.initialAcceleration = 3;

	this.enableLaneChange = true;

	this.vehicles = [];
	this.vehiclesCrashed = [];

	this.roads = [];
	this.junctions = [];
	this.generators = [];

	this.totalTime = 0;

	this.fastForward = args.fastForward || 1;

	this.canvas( args );

};

Traffic.prototype = {

	button: function ( args ) {

		var button = document.createElement("input");

		button.type = "button";
		button.value = args.label;
		button.id = args.id;

		button.onclick = function () {

			switch ( button.value ) {

				case "Start":

					traffic.start();

					break;

				case "Pause":

					traffic.pause();

					break;

				case "Reset Simulation":

					traffic.resetSimulation();

					break;

				case "Current Time Finish":

						alert("r: " + r
							+ "\ntimeFinishToA: " + timeFinishToA
							+ "\ntimeFinishToB: " + timeFinishToB
							+ "\ntimeFinishFroA: " + timeFinishFroA
							+ "\ntimeFinishFroB: " + timeFinishFroB
							+ "\ntimeFinishFroAToB: " + timeFinishFroAToB
							+ "\ntimeFinishTotal: " + timeFinishTotal);


			}

		};

		document.body.appendChild( button );

	},

	canvas: function ( args ) {

		args.traffic = this;
		var canvas = new Canvas( args );
		this.canvas = canvas;
	},

	junction: function ( args ) {

		args.traffic = this;
		var junction = new Junction( args );
		this.junctions.push( junction );
		return junction;

	},

	generator: function ( args ) {

		args.traffic = this;
		var generator = new Generator( args );
		this.generators.push( generator );
		return generator;

	},

	road: function ( args ) {

		args.traffic = this;
		var road = new Road( args );
		this.roads.push( road );
		return road;

	},

	vehicle: function ( args ) {

		args.traffic = this;
		var vehicle = new Vehicle( args );
		this.vehicles.push( vehicle );
		return vehicle;

	},

	start: function () {

		if( !this.running ) {

			var self = this;

			self.lastTime = Date.now();
			self.running = true;

			self.init();
			self.renderBlocks();

			(function run(){
				self.animationFrame = window.requestAnimationFrame(run);
				self.update();
				self.renderVehicles();
			})();

		}

	},

	pause: function () {

		if ( this.running ) {

			this.running = false;
			window.cancelAnimationFrame( this.animationFrame );

		}

	},

	init: function () {

		for ( var j = 0; j < this.junctions.length; j++ ) {

			this.junctions[j].init();

		}

		for ( var g = 0; g < this.generators.length; g++ ) {

			this.generators[g].init();

		}

	},

	update: function () {

		this.currentTime = Date.now();
		this.deltaTime = ( this.currentTime - this.lastTime ) / 1000;
		this.lastTime = this.currentTime;

		this.deltaTime *= this.fastForward;

		this.totalTime += this.deltaTime;

		//console.log(this.deltaTime, this.totalTime);

		document.getElementById('totalTime').innerHTML = this.totalTime;

		for ( var j = 0; j < this.junctions.length; j++ ) {

			this.junctions[j].update( this.deltaTime );

		}

		for ( var g = 0; g < this.generators.length; g++ ) {

			this.generators[g].update( this.deltaTime );

		}

		for ( var r = 0; r < this.roads.length; r++ ) {

			this.roads[r].update( this.deltaTime );

		}

		for ( var v = 0; v < this.vehicles.length; v++ ) {

			this.vehicles[v].update( this.deltaTime );

		}

	},

	reset: function () {

		this.pause();
		this.animationFrame = null;

		this.totalTime = 0;

		this.vehicles = [];
		this.roads = [];
		this.junctions = [];
		this.generators = [];

	},

	resetSimulation: function () {

		this.pause();
		this.animationFrame = null;

		this.totalTime = 0;

		this.vehicles = [];

		for ( var r = 0; r < this.roads.length; r++ ) {

			this.roads[r].init();

		}

		for ( var g = 0; g < this.generators.length; g++ ) {

			this.generators[g].init();

		}

	},

	renderBlocks: function () {

		this.canvas.renderBlocks();

	},

	renderVehicles: function () {

		this.canvas.renderVehicles();

	},

	logConstants: function () {

		console.log("C: " + this.cValue);
		console.log("E: " + this.eValue);
		console.log("F: " + this.fValue);
		console.log("K: " + this.kValue);
		console.log("Z: " + this.zValue);
		console.log("tMin: " + this.tMinValue);
		console.log("tMax: " + this.tMaxValue);
		console.log("Max Vision: " + this.maxVision);

	}

}
