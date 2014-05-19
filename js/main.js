var traffic, canvas, context,
	generator1, destroyer1,
	road1, vehicle1;

function init() {

	traffic = new Traffic({
		canvas: "canvas",
		width: 500,
		height: 500
	});

	generator1 = traffic.generator({
		x: 100,
		y: 100,
		generationRate: 1,
		truckRatio: 0.25,
		maxVehicles: 25,
		carSize: 3,
		truckSize: 5
	});

	destroyer1 = traffic.destroyer({
		x: 300,
		y: 100
	});

	road1 = traffic.road({
		from: generator1,
		to: destroyer1,
		laneCount: 5,
		maxSpeed: 3
	});

}

function render() {

}

init();
traffic.start();