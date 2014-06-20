
Traffic = function ( args ) {

	this.kValue = 0.5;
	this.fValue = 1;
	this.eValue = 1;
	this.tMinValue = 3;
	this.tMaxValue = 10;
	this.maxVision = 300;
	this.zValue = 1;
	this.cValue = 2;

	this.vehicles = [];
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

		console.log(this.deltaTime, this.totalTime);

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

		this.vehicles = [];
		this.roads = [];
		this.junctions = [];
		this.generators = [];

		this.totalTime = 0;

	},

	renderBlocks: function () {

		this.canvas.renderBlocks();

	},

	renderVehicles: function () {

		this.canvas.renderVehicles();

	}

}
