var traffic, canvas,
	generator1, generator2,
	road1,
	button1, button2;

var timeFinishToA = [0, 0],
	timeFinishToB = [0, 0],
	timeFinishFroA = [0, 0],
	timeFinishFroB = [0, 0],
	timeFinishFroAToB = [0, 0],
	timeFinishTotal = [0, 0];

var r = 1;
var startLaneChange = 100;

function init() {

	traffic = new Traffic({
		width: 1200,
		height: 500,
		scale: 1,
		fastForward: 3
	});

	generator1 = traffic.generator({
		x: 100,
		y: 100,
		maxVehicles: Infinity,
		generationRate: 2,
	});

	generator2 = traffic.generator({
		x: 1100,
		y: 100
	});

	road1 = traffic.road({
		from: generator1,
		to: generator2,
		laneCount: 2
	});

	// road2 = traffic.road({
	// 	from: generator2,
	// 	to: generator1
	// });

	button1 = traffic.button({
		label: "Start",
		id: "StartButton",
	});

	button2 = traffic.button({
		label: "Pause",
		id: "PauseButton",
	});

	button3 = traffic.button({
		label: "Reset Simulation",
		id: "ResetSimButton",
	});

	button3 = traffic.button({
		label: "Average Time Finish",
		id: "AveTimeFinButton",
	});

}

init();
traffic.renderBlocks();

generator1.aGen = 2;
generator1.bGen = 3;

generator1.aTime = 0;
generator1.bTime = 0;

generator1.aCount = 0;
generator1.bCount = 0;

generator1.update = function ( deltaTime ) {

	this.aTime += deltaTime;

	if ( this.aTime >= this.aGen ) {

		this.aTime -= this.aGen;
		this.aCount++;

		this.insertIntoLane( 0, 1 );

	}

	this.bTime += deltaTime;

	if ( this.bTime >= this.bGen ) {

		this.bTime -= this.bGen;
		this.bCount++;

		this.insertIntoLane( 1 );

	}

	if ( this.bCount >= startLaneChange ) {

		this.to.enableLaneChangeA = true;

	}

	road1.laneChangeRatio = r / 50;

	if ( timeFinishTotal[1] >= 200 ) {

		logTimeFinish();
		this.aTime = 0;
		this.bTime = 0;
		this.aCount = 0;
		this.bCount = 0;
		r++;

		document.getElementById('r').innerHTML = r;

		timeFinishToA = [0, 0],
		timeFinishToB = [0, 0],
		timeFinishFroA = [0, 0],
		timeFinishFroB = [0, 0],
		timeFinishFroAToB = [0, 0],
		timeFinishTotal = [0, 0];

		traffic.totalTime = 0;

		traffic.vehicles = [];

		road1.init();

		generator1.init();


	}

}

function logTimeFinish () {

	console.log("r: " + r);
	console.log("timeFinishToA: " + timeFinishToA);
	console.log("timeFinishToB: " + timeFinishToB);
	console.log("timeFinishFroA: " + timeFinishFroA);
	console.log("timeFinishFroB: " + timeFinishFroB);
	console.log("timeFinishFroAToB: " + timeFinishFroAToB);
	console.log("timeFinishTotal: " + timeFinishTotal);

}

//traffic.vehicles.forEach( function (element, index, array) { console.log("[" + index + "] " + element.minDistance); } )
