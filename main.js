var traffic, canvas,
	generator1,
	junction1, junction2, junction3;

function init() {

	traffic = new Traffic({
		width: 500,
		height: 500,
		fastForward: 3
	});

	generator1 = traffic.generator({
		x: 100,
		y: 100,
		generationRate: 1.5
	});

	junction1 = traffic.junction({
		x: 100,
		y: 640
	});

	junction2 = traffic.junction({
		x: 640,
		y: 640
	});

	junction3 = traffic.junction({
		x: 640,
		y: 100
	});

	traffic.link(
		generator1,
		junction1
	);

	traffic.link(
		junction1,
		junction2
	);

	traffic.link(
		junction2,
		junction3
	);

	traffic.link(
		junction3,
		generator1
	);

	traffic.button({
		label: "Start",
		func: "start",
	});

	traffic.button({
		label: "Pause",
		func: "pause"
	});

	traffic.button({
		label: "Reset",
		func: "resetSimulation"
	});

}

init();
//traffic.start();
