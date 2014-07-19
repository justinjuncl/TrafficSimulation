
// Junction Array Elements
// 0: North (0, 1)
// 1: East (1, 0)
// 2: South (0, -1)
// 3: West (-1, 0)

Junction = function ( args ) {

	this.traffic = args.traffic;

	this.type = "Junction";

    this.x = args.x;
    this.y = args.y;

    this.inComing = [null, null, null, null];
    this.outGoing = [null, null, null, null];

    this.inComingUnsorted = [];
    this.outGoingUnsorted = [];

};

Junction.prototype = {

	get position () {

		return new Vector2( this.x, this.y );

	},

	get direction () {

		return new Vector2(0, 0);

	},

	get tangent () {

		return new Vector2(0, 0);

	},

	init: function () {

		this.time = 0;

		for ( r = 0; r < this.inComingUnsorted.length; r++ ) {

			var road = this.inComingUnsorted[r];

			switch ( road.direction.x.toString() + road.direction.y.toString() ) {

				case "0-1":

					this.inComing[0] = road;
					break;

				case "-10":

					this.inComing[1] = road;
					break;

				case "01":

					this.inComing[2] = road;
					break;

				case "10":

					this.inComing[3] = road;
					break;

			}

		}

		for ( r = 0; r < this.outGoingUnsorted.length; r++ ) {

			var road = this.outGoingUnsorted[r];

			switch ( road.direction.x.toString() + road.direction.y.toString() ) {

				case "01":

					this.outGoing[0] = road;
					break;

				case "10":

					this.outGoing[1] = road;
					break;

				case "0-1":

					this.outGoing[2] = road;
					break;

				case "-10":

					this.outGoing[3] = road;
					break;

			}

		}

		this.width = 40;//this.inComing[0].width + this.inComing[2].width;
		this.height = 40;//this.inComing[1].width + this.inComing[3].width;

		this.signal = [[], [], [], []];

		for ( r = 0; r < this.inComing.length; r++ ) {

			if ( this.inComing[r] ) {

				for ( l = 0; l < this.inComing[r].laneCount; l++ ) {

					this.signal[r].push( true );

				}

			}

		}


	},

	to: function ( road, decision ) {

		var index = this.inComing.indexOf( road );
		var nextIndex;

		for ( i = 0; i < this.outGoing.length; i++ ) {

			if ( this.outGoing[i] !== null && i !== index ) {

				nextIndex = i;

			}

		}

		return this.outGoing[nextIndex];
//		return this.outGoing[(index + decision + 2) % 4];

	},

	update: function ( deltaTime ) {

		this.time += deltaTime;

	},

	changeSignal: function ( r, l, s ) {

		if ( s !== undefined ) {

			this.signal[r][l] = s;
			this.inComing[r].signal[l] = s;

		} else {

			for ( a = 0; a < this.signal[r].length; a++ ) {

				this.signal[r][a] = l;
				this.inComing[r].signal[a] = l;

			}

		}

	},

	changeRoadSignal: function () {

		for ( r = 0; i < this.inComing.length; r++ ) {

			for ( l = 0; l < this.inComing[r].laneCount; l++ ) {

				this.inComing[r].signal[l] = this.signal[r][l];

			}

		}

	},

};
