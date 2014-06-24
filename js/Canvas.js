
Canvas = function ( args ) {

	//-------------------------------------------

	this.whiteColor = "#FFFFFF";
	this.blackColor = "#000000";
	this.darkGreyColor = "#555555";
	this.greyColor = "#BFBFBF";
	this.yellowColor = "#F5B753";
	this.redColor = "#FF0000";
	this.blueColor = "#0000FF";
	this.greenColor = "#00FF00";

	this.outlineWidth = 2;
	this.inlineWidth = 0.4;
	this.generatorLength = 5;
	this.signalLength = 3;

	//-------------------------------------------

	this.traffic = args.traffic;

	this.width = args.width;
	this.height = args.height;

	this.canvasBlocks = document.createElement( "canvas" );
	this.canvasBlocks.width = this.width;
	this.canvasBlocks.height = this.height;
	this.canvasBlocks.id = "canvasBlocks";
	document.body.appendChild( this.canvasBlocks );
	this.contextBlocks = this.canvasBlocks.getContext('2d');

	this.canvasVehicles = document.createElement( "canvas" );
	this.canvasVehicles.width = this.width;
	this.canvasVehicles.height = this.height;
	this.canvasVehicles.id = "canvasVehicles";
	document.body.appendChild( this.canvasVehicles );
	this.contextVehicles = this.canvasVehicles.getContext('2d');

	this.sensitivity = args.sensitivity || 1;

	this.scale = 1;

	this.offsetX = 0;
	this.offsetY = 0;

	this.isPanning = false;
	this.isZooming = false;

	this.init();

};

Canvas.prototype = {

	get widthHalf () {

		return Math.floor( this.width );

	},

	get heightHalf () {

		return Math.floor( this.height );

	},

	get roads () {

		return this.traffic.roads;

	},

	get junctions () {

		return this.traffic.junctions;

	},

	get generators () {

		return this.traffic.generators;

	},

	interpolate: function ( start, end, percent ) {

		return Math.floor( start + ( end - start ) * percent );

	},

	vehicleColor: function ( a ) {

		var colors = [[255, 0, 0], [0, 0, 0], [0, 0, 255]];

		if ( a >= 0 ) {

			var r = this.interpolate( colors[1][0], colors[2][0], a );
			var g = this.interpolate( colors[1][1], colors[2][1], a );
			var b = this.interpolate( colors[1][2], colors[2][2], a );

		} else {

			a = -a;

			var r = this.interpolate( colors[1][0], colors[0][0], a );
			var g = this.interpolate( colors[1][1], colors[0][1], a );
			var b = this.interpolate( colors[1][2], colors[0][2], a );

		}

		return "rgb( " + r + ", " + g + ", " + b + " )";

	},

	init: function () {

		this.contextBlocks.setTransform( 1, 0, 0, 1, 0, 0 );

		this.contextVehicles.setTransform( 1, 0, 0, 1, 0, 0 );

		canvas = this;

		window.addEventListener( "mousemove", mouseMoveListener, false );
		window.addEventListener( "keydown", keyDownListener, false );
		window.addEventListener( "keyup", keyUpListener, false );

	},

	clearBlocks: function () {

		this.contextBlocks.save();
		this.contextBlocks.setTransform( 1, 0, 0, 1, 0, 0 );
		this.contextBlocks.clearRect( 0, 0, this.width, this.height );
		this.contextBlocks.restore();

		this.contextBlocks.fillRect(0, 0, 10, 10);

	},

	clearVehicles: function () {

		this.contextVehicles.save();
		this.contextVehicles.setTransform( 1, 0, 0, 1, 0, 0 );
		this.contextVehicles.clearRect( 0, 0, this.width, this.height );
		this.contextVehicles.restore();

	},

	renderBlocks: function () {

		this.clearBlocks();

		this.renderRoads();
		this.renderJunctions();
		this.renderGenerators();

	},

	// ------------------------------------------
	// Junctions
	// ------------------------------------------

	renderJunctions: function ( ) {

	},

	renderJunction: function ( junction ) {

	},

	// ------------------------------------------
	// Generators
	// ------------------------------------------

	renderGenerators: function () {

		var generators = this.traffic.generators;

		this.contextBlocks.save();
		this.contextBlocks.fillStyle = this.yellowColor;
		for ( var g = 0; g < generators.length; g++ ) {

			this.renderGenerator( generators[g] );

		}
		this.contextBlocks.restore();

	},

	renderGenerator: function ( generator ) {

		if ( generator.to === undefined ) return;

		var start = generator.position;
		var end = generator.direction.multiplyScalar( this.generatorLength )
									.addVector( generator.tangent.multiplyScalar( generator.width + this.outlineWidth ) );

		this.contextBlocks.fillRect( start.x, start.y, end.x, end.y );


	},

	// ------------------------------------------
	// Roads
	// ------------------------------------------

	renderRoads: function () {

		var roads = this.traffic.roads;

		this.contextBlocks.save();
		this.contextBlocks.fillStyle = this.greyColor;
		for ( var r = 0; r < roads.length; r++ ) {

			this.renderRoad( roads[r] );

		}
		this.contextBlocks.restore();

		this.contextBlocks.save();
		for ( var r = 0; r < roads.length; r++ ) {

			this.renderRoadSignal( roads[r] );

		}
		this.contextBlocks.restore();

		this.contextBlocks.save();
		this.contextBlocks.strokeStyle = this.yellowColor;
		this.contextBlocks.lineWidth = this.inlineWidth;
		for ( var r = 0; r < roads.length; r++ ) {

			this.renderRoadOutlineLeft( roads[r] );

		}
		this.contextBlocks.restore();

		this.contextBlocks.save();
		this.contextBlocks.strokeStyle = this.darkGreyColor;
		this.contextBlocks.lineWidth = this.outlineWidth;
		for ( var r = 0; r < roads.length; r++ ) {

			this.renderRoadOutlineRight( roads[r] );

		}
		this.contextBlocks.restore();

		this.contextBlocks.save();
		this.contextBlocks.strokeStyle = this.whiteColor;
		this.contextBlocks.lineWidth = this.inlineWidth;
		for ( var r = 0; r < roads.length; r++ ) {

			this.renderRoadLanes( roads[r] );

		}
		this.contextBlocks.restore();

	},

	renderRoad: function ( road ) {

		var start = road.position;
		var end = road.vector.addVector( road.tangent.multiplyScalar( road.width ) );

		this.contextBlocks.fillRect( start.x, start.y, end.x, end.y );

	},

	renderRoadSignal: function ( road ) {

		var start = road.position.addVector( road.vector );
		var end = road.direction.multiplyScalar( this.signalLength )
							.addVector( road.tangent.multiplyScalar( road.laneWidth ) );

		for (var i = 0; i < road.laneCount; i++) {

			this.contextBlocks.fillStyle = road.signal[i] ? this.greenColor : this.redColor;
			this.contextBlocks.fillRect( start.x, start.y, end.x, end.y );

			start.addVector( road.tangent.multiplyScalar( road.laneWidth ) );

		}

	},

	renderRoadOutlineLeft: function ( road ) {

		var start = road.position.addVector( road.tangent.multiplyScalar( -this.inlineWidth/2 ) );
		var end = start.clone.addVector( road.vector );

		this.contextBlocks.beginPath();
		this.contextBlocks.moveTo( start.x, start.y );
		this.contextBlocks.lineTo( end.x, end.y );
		this.contextBlocks.stroke();

	},

	renderRoadOutlineRight: function ( road ) {

		var start = road.position.addVector( road.tangent.multiplyScalar( -this.outlineWidth/2 ) )
									.addVector( road.tangent.multiplyScalar( road.width + this.outlineWidth ) );
		var end = start.clone.addVector( road.vector );

		this.contextBlocks.beginPath();
		this.contextBlocks.moveTo( start.x, start.y );
		this.contextBlocks.lineTo( end.x, end.y );
		this.contextBlocks.stroke();

	},

	renderRoadLanes: function ( road ) {

		var start = road.position.addVector( road.tangent.multiplyScalar( road.laneWidth ) );
		var end = start.clone.addVector( road.vector );

		for ( var l = 0; l < road.lane.length - 1; l++ ) {

			this.contextBlocks.beginPath();
			this.contextBlocks.moveTo( start.x, start.y );
			this.contextBlocks.lineTo( end.x, end.y );
			this.contextBlocks.stroke();

			start.addVector( road.tangent.multiplyScalar( road.laneWidth ) );
			end.addVector( road.tangent.multiplyScalar( road.laneWidth ) );

		}

	},

	// ------------------------------------------
	// Veicles
	// ------------------------------------------

	renderVehicles: function () {

		this.clearVehicles();

		var vehicles = this.traffic.vehicles;

		for ( var v = 0; v < vehicles.length; v++ ) {

			this.contextVehicles.save();
			this.contextVehicles.fillStyle = this.vehicleColor( vehicles[v].color );
			this.renderVehicle( vehicles[v] );
			this.contextVehicles.restore();

		}

	},

	renderVehicle: function ( vehicle ) {

		var start = vehicle.globalPosition;
		var end = vehicle.direction.multiplyScalar( vehicle.length )
										.addVector( vehicle.tangent.multiplyScalar( vehicle.width ) );

		this.contextVehicles.fillRect( start.x, start.y, end.x, end.y );

	}

}

function getMousePosition ( e ) {

	var bRect = canvas.canvasVehicles.getBoundingClientRect();
	canvas.mouseX = (e.clientX - bRect.left) * (canvas.width/bRect.width);
	canvas.mouseY = (e.clientY - bRect.top) * (canvas.height/bRect.height);

}

function mouseMoveListener ( e ) {

	getMousePosition( e );

	if ( canvas.isPanning ) {

		var panDeltaX = canvas.mouseX - canvas.panStartX;
		var panDeltaY = canvas.mouseY - canvas.panStartY;

		canvas.offsetX += panDeltaX;
		canvas.offsetY += panDeltaY;

		canvas.contextBlocks.translate( panDeltaX, panDeltaY );
		canvas.contextVehicles.translate( panDeltaX, panDeltaY );

	}

	if ( canvas.isZooming ) {

		var zoomDeltaY = canvas.mouseY - canvas.zoomStartY;

		canvas.scale *= Math.pow( 1.4, -zoomDeltaY / 200 );

		canvas.offsetX = canvas.zoomStartX - canvas.scale * canvas.zoomStartX;
		canvas.offsetY = canvas.zoomStartY - canvas.scale * canvas.zoomStartY;

		canvas.contextBlocks.setTransform(canvas.scale, 0, 0, canvas.scale, canvas.offsetX, canvas.offsetY);

		canvas.contextVehicles.setTransform(canvas.scale, 0, 0, canvas.scale, canvas.offsetX, canvas.offsetY);

	}

	canvas.panStartX = canvas.mouseX;
	canvas.panStartY = canvas.mouseY;

	// canvas.zoomStartX = canvas.mouseX;
	// canvas.zoomStartY = canvas.mouseY;

	canvas.renderBlocks();

	if ( !canvas.traffic.running ) canvas.renderVehicles();

}

function keyDownListener ( e ) {

	var code = e.keyCode;

	switch ( code ) {

		case 49:

			canvas.isPanning = true;

			canvas.panStartX = canvas.mouseX;
			canvas.panStartY = canvas.mouseY;

			break;

		case 50:

			canvas.isZooming = true;

			canvas.zoomStartX = canvas.mouseX;// - canvas.offsetX;
			canvas.zoomStartY = canvas.mouseY;// - canvas.offsetY;

			break;

		case 51:

			canvas.isRotating = true;

			canvas.rotStartX = canvas.mouseX;
			canvas.rotStartY = canvas.mouseY;

		default:

			break;

	}


}

function keyUpListener ( e ) {

	var code = e.keyCode;

	switch ( code ) {

		case 49:

			canvas.isPanning = false;

			break;

		case 50:

			canvas.isZooming = false;

			break;

		default:

			break;

	}

}
