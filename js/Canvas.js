
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

	this.canvasContainer = document.createElement( "div" );
	this.canvasContainer.id = "canvasContainer";
	this.traffic.trafficContainer.appendChild( this.canvasContainer );

	this.canvasBlocks = document.createElement( "canvas" );
	this.canvasBlocks.width = this.width;
	this.canvasBlocks.height = this.height;
	this.canvasBlocks.id = "canvasBlocks";
	this.canvasContainer.appendChild( this.canvasBlocks );
	this.contextBlocks = this.canvasBlocks.getContext('2d');

	this.canvasVehicles = document.createElement( "canvas" );
	this.canvasVehicles.width = this.width;
	this.canvasVehicles.height = this.height;
	this.canvasVehicles.id = "canvasVehicles";
	this.canvasContainer.appendChild( this.canvasVehicles );
	this.contextVehicles = this.canvasVehicles.getContext('2d');

	this.sensitivity = args.sensitivity || 1;

	this.scale = args.scale || 1;

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

		this.contextBlocks.setTransform( 1, 0, 0, -1, 0, 0 );
		this.contextVehicles.setTransform( 1, 0, 0, -1, 0, 0 );

		this.contextBlocks.translate( 0, -this.height );
		this.contextVehicles.translate( 0, -this.height );

		canvas = this;

		window.addEventListener( "mousedown", mouseDownListener, false );
		window.addEventListener( "mouseup", mouseUpListener, false );
		window.addEventListener( "mousemove", mouseMoveListener, false );

        window.addEventListener( "wheel", wheelListener, false );

		window.addEventListener( "keydown", keyDownListener, false );
		window.addEventListener( "keyup", keyUpListener, false );

	},

	clearBlocks: function () {

		this.contextBlocks.save();
		this.contextBlocks.setTransform( 1, 0, 0, 1, 0, 0 );
		this.contextBlocks.clearRect( 0, 0, this.width, this.height );
		this.contextBlocks.restore();

	},

	clearVehicles: function () {

		this.contextVehicles.save();
		this.contextVehicles.setTransform( 1, 0, 0, 1, 0, 0 );
		this.contextVehicles.clearRect( 0, 0, this.width, this.height );
		this.contextVehicles.restore();

	},

	renderBlocks: function () {

		this.clearBlocks();

		this.renderJunctions();
		this.renderGenerators();
		this.renderRoads();

	},

	// ------------------------------------------
	// Junctions
	// ------------------------------------------

	renderJunctions: function () {

		var junctions = this.traffic.junctions;

		this.contextBlocks.save();
		this.contextBlocks.fillStyle = this.darkGreyColor;
		for ( var j = 0; j < junctions.length; j++ ) {

			this.renderJunctionOutline( junctions[j] );

		}
		this.contextBlocks.restore();

		this.contextBlocks.save();
		this.contextBlocks.fillStyle = this.greyColor;
		for ( var j = 0; j < junctions.length; j++ ) {

			this.renderJunction( junctions[j] );

		}
		this.contextBlocks.restore();

	},

	renderJunction: function ( junction ) {

		var position = junction.position;

		this.contextBlocks.fillRect( position.x - 20, position.y - 20, 40, 40 );

	},

	renderJunctionOutline: function ( junction ) {

		var position = junction.position;
		var o = this.outlineWidth;

		this.contextBlocks.fillRect( position.x - 20 - o, position.y - 20 - o, 40 + 2 * o, 40 + 2 * o );

	},

	// ------------------------------------------
	// Generators
	// ------------------------------------------

	renderGenerators: function () {

		var generators = this.traffic.generators;

		this.contextBlocks.save();
		this.contextBlocks.fillStyle = this.darkGreyColor;
		for ( var g = 0; g < generators.length; g++ ) {

			this.renderGeneratorOutline( generators[g] );

		}
		this.contextBlocks.restore();

		this.contextBlocks.save();
		this.contextBlocks.fillStyle = this.yellowColor;
		for ( var g = 0; g < generators.length; g++ ) {

			this.renderGenerator( generators[g] );

		}
		this.contextBlocks.restore();

	},

	renderGenerator: function ( generator ) {

		if ( generator.to === undefined ) return;

		// var start = generator.position;
		// var end = generator.direction.multiplyScalar( this.generatorLength )
		// 							.addVector( generator.tangent.multiplyScalar( generator.width + this.outlineWidth ) );

		// this.contextBlocks.fillRect( start.x, start.y, end.x, end.y );

		var position = generator.position;

		this.contextBlocks.fillRect( position.x - 20, position.y - 20, 40, 40 );

	},

	renderGeneratorOutline: function ( generator ) {

		var position = generator.position;
		var o = this.outlineWidth;

		this.contextBlocks.fillRect( position.x - 20 - o, position.y - 20 - o, 40 + 2 * o, 40 + 2 * o );

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

function mouseDownListener ( e ) {

    getMousePosition( e );

    var button = e.button;

	switch ( button ) {

		case 0:

			canvas.isPanning = true;

			canvas.panStartX = canvas.mouseX;
			canvas.panStartY = canvas.mouseY;

			break;

		default:

			break;

	}

}

function mouseUpListener ( e ) {

	var button = e.button;

	switch ( button ) {

		case 0:

			canvas.isPanning = false;

			break;

		default:

			break;

	}

}

function mouseMoveListener ( e ) {

	getMousePosition( e );

    var canvasChanged = false;

	if ( canvas.isPanning ) {
        
        var T = canvas.contextBlocks.getTransform();

		var panDeltaX = ( canvas.mouseX - canvas.panStartX ) / T.a;
		var panDeltaY = ( canvas.mouseY - canvas.panStartY ) / T.a;

        canvas.panStartX = canvas.mouseX;
        canvas.panStartY = canvas.mouseY;

		canvas.contextBlocks.translate( panDeltaX, -panDeltaY );
		canvas.contextVehicles.translate( panDeltaX, -panDeltaY );

        canvasChanged = true;

	}

	if ( canvas.isZooming ) {

        var T = canvas.contextBlocks.getTransform();

		canvas.zoomDeltaY = canvas.mouseY - canvas.zoomStartY;

		var factor = Math.pow( 1.1, -canvas.zoomDeltaY / 200 );
        factor = Math.max( 0.99, Math.min( 1.01, factor ) );

        var point = {
            x: ( canvas.zoomStartX - T.e ) / T.a,
            y: ( canvas.zoomStartY - T.f ) / T.d
        };

        canvas.contextBlocks.translate( point.x, point.y );
        canvas.contextBlocks.scale( factor, factor );
        canvas.contextBlocks.translate( -point.x, -point.y);

        canvas.contextVehicles.translate( point.x, point.y);
        canvas.contextVehicles.scale( factor, factor );
        canvas.contextVehicles.translate( -point.x, -point.y);

        canvasChanged = true;

	}

    if ( canvasChanged ) {

        canvas.renderBlocks();

        if ( !canvas.traffic.running ) canvas.renderVehicles();

    }

}

function wheelListener ( e ) {

    var T = canvas.contextBlocks.getTransform();

    var point = {
        x: ( canvas.mouseX - T.e ) / T.a,
        y: ( canvas.mouseY - T.f ) / T.d
    };

    var factor = Math.pow( 1.001, -e.deltaY );

    canvas.contextBlocks.translate( point.x, point.y);
    canvas.contextBlocks.scale( factor, factor );
    canvas.contextBlocks.translate( -point.x, -point.y);

    canvas.contextVehicles.translate( point.x, point.y);
    canvas.contextVehicles.scale( factor, factor );
    canvas.contextVehicles.translate( -point.x, -point.y);

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

			canvas.zoomStartX = canvas.mouseX;
			canvas.zoomStartY = canvas.mouseY;

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
