var traffic, canvas,
	generator1, generator2,
	road1,
	button1, button2;

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
		maxVehicles: 20,
		generationRate: 1
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

	traffic.vehicle({
		location: road1,
		lane: 0,
		localY : 800,
		isStationary: true
	});

	traffic.vehicle({
		location: road1,
		lane: 0,
		localY : 500,
		isStationary: true
	});

	traffic.vehicle({
		location: road1,
		lane: 0,
		localY : 200,
		isStationary: true
	});

}

init();
traffic.renderBlocks();

//traffic.vehicles.forEach( function (element, index, array) { console.log("[" + index + "] " + element.minDistance); } )
