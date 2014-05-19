
Traffic = function ( args ) {

	this.pBreak = 0.5;
	this.pChoose = 0.5;

	this.vehicles = [];
	this.roads = [];
	this.junctions = [];
	this.generators = [];
	this.destroyers = [];

	this.canvas = new Canvas( args );
	this.canvas.traffic = this;

	this.engine = new Engine();

	this.totalTime = 0;

};

Traffic.prototype = {

	junction: function ( args ) {

		var junction = new Junction( args );
		junction.traffic = this;
		this.junctions.push( junction );
		return junction;

	},

	generator: function ( args ) {

		var generator = new Generator( args );
		generator.traffic = this;
		this.generators.push( generator );
		return generator;

	},

	destroyer: function ( args ) {

		var destroyer = new Destroyer( args );
		destroyer.traffic = this;
		this.destroyers.push( destroyer );
		return destroyer;

	},

	road: function ( args ) {

		var road = new Road( args );
		road.traffic = this;
		this.roads.push( road );
		return road;

	},

	vehicle: function ( args ) {

		var vehicle = new Vehicle( args );
		vehicle.traffic = this;
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

		this.running = false;
		window.cancelAnimationFrame( this.animationFrame );

	},

	init: function () {

		for ( var r = 0; r < this.roads.length; r++ ) {

			this.roads[r].init();

		}

		for ( var j = 0; j < this.junctions.length; j++ ) {

			this.junctions[j].init();

		}

		for ( var g = 0; g < this.generators.length; g++ ) {

			this.generators[g].init();

		}

		for ( var d = 0; d < this.destroyers.length; d++ ) {

			this.destroyers[d].init();

		}

	},

	update: function () {

		this.currentTime = Date.now();
		this.deltaTime = ( this.currentTime - this.lastTime ) / 1000;
		this.lastTime = this.currentTime;

		this.totalTime += this.deltaTime;

		console.log(this.deltaTime, this.totalTime);

		for ( var j = 0; j < this.junctions.length; j++ ) {

			this.junctions[j].update( this.deltaTime );

		}

		for ( var g = 0; g < this.generators.length; g++ ) {

			this.generators[g].update( this.deltaTime );

		}

		for ( var d = 0; d < this.destroyers.length; d++ ) {

			this.destroyers[d].update( this.deltaTime );

		}

		for ( var r = 0; r < this.roads.length; r++ ) {

			this.roads[r].update( this.deltaTime );

		}

		for ( var v = 0; v < this.vehicles.length; v++ ) {

			this.vehicles[v].update( this.deltaTime );

		}

	},

	renderBlocks: function () {

		for ( var j = 0; j < this.junctions.length; j++ ) {

			this.junctions[j].render();

		}

		for ( var g = 0; g < this.generators.length; g++ ) {

			this.generators[g].render();

		}

		for ( var d = 0; d < this.destroyers.length; d++ ) {

			this.destroyers[d].render();

		}

		for ( var r = 0; r < this.roads.length; r++ ) {

			this.roads[r].render();

		}

	},

	renderVehicles: function () {

		for ( var v = 0; v < this.vehicles.length; v++ ) {

			this.vehicles[v].render();

		}

	}

}
