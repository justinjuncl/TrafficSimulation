var traffic, canvas,
	generator1, generator2,
	road1,
	button1, button2;

var timeFinish = [0, 0];

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
		generationRate: traffic.generationRate
	});

	generator2 = traffic.generator({
		x: 1100,
		y: 100
	});

	road1 = traffic.road({
		from: generator1,
		to: generator2,
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

//traffic.vehicles.forEach( function (element, index, array) { console.log("[" + index + "] " + element.minDistance); } )
