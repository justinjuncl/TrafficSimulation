var traffic, canvas,
	generator1, generator2, generator3,
	junction1, junction2, junction3;

function init() {

	traffic = new Traffic({
		width: 800,
		height: 700,
		fastForward: 3
	});

	generator1 = traffic.generator({
		x: 100,
		y: 100,
		generationRate: 1.5
	});

	generator2 = traffic.generator({
		x: 640,
		y: 0
	});

	generator3 = traffic.generator({
		x: 740,
		y: 100
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

	traffic.road({
		from: junction3,
		to: generator2
	});

	traffic.road({
		from: junction3,
		to: generator3
	});

	traffic.button({
		label: "Start",
		func: "start"
	});

	traffic.button({
		label: "Pause",
		func: "pause",
	});

}

init();
//traffic.start();
