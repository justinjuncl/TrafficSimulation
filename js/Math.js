
// Fisher-Yates Shuffle

function shuffle ( array ) {

	var m = array.length, t, i;

	// While there remain elements to shuffle
  	while ( m ) {

		// Pick a remaining element
		i = Math.floor( Math.random() * m-- );

		// And swap it with the current element
    	t = array[m];
		array[m] = array[i];
		array[i] = t;

	}

	return array;

}

function randomWeighted ( list, weight ) {

	var totalWieght = weight.reduce(function (prev, cur, i, arr) {

		return prev + cur;

	});

	var random = Math.floor(Math.random() * totalWieght) + 1;
	var sum = 0;

	for (var i = 0; i < list.length; i++) {
		sum += weight[i];
		if (random <= sum) {
			return list[i];
		}
	}

}

function probability ( x ) {

	return ( Math.random() <= x ) ? true : false;

}

// [x] + ( x - [x] )probability

function rA ( x ) {

	var g = Math.floor(x);
	var a = (probability(x - g)) ? 1 : 0;

	return g + a;

}

// Distribution Auxiliary Function

function randomDTA () {

	return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;

}

function randomDistribution ( mean, sD ) {

	return mean + sD * randomDTA();

}
