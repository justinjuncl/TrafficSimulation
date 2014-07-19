
Vector2 = function ( x, y ) {

	this.x = x || 0;
	this.y = y || 0;

};

Vector2.prototype = {

	add: function ( v1, v2 ) {

		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;

		return this;

	},

	sub: function ( v1, v2 ) {

		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;

		return this;

	},

	addVector: function ( v ) {

		this.x += v.x;
		this.y += v.y;

		return this;
	},

	subVector: function ( v ) {

		this.x -= v.x;
		this.y -= v.y;

		return this;
	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;

		return this;

	},

    divideScalar: function ( s ) {

        if ( s !== 0 ) {

            this.x /= s;
            this.y /= s;

        } else {

            this.x = 0;
            this.y = 0;

        }

        return this;

    },

    translate: function (x, y) {

        this.x += x;
        this.y += y;
    },

	isEqual: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) );

	},

    isPerpendicular: function ( v ) {

        return ( this.x * v.x + this.y * v.y === 0 );

    },

    get lengthSquared () {

        return this.x * this.x + this.y + this.y;

    },

    get length () {

        return Math.sqrt( this.x * this.x + this.y * this.y );

    },

    normalize: function () {

        return this.divideScalar( this.length );

    },

	get clone () {

		return new Vector2( this.x, this.y );

	},

    get normal () {

        return this.clone.normalize();

    },

    // 0 1
    // -1 0

    get tangent () {

        return new Vector2( this.normal.y, -this.normal.x );

    },

    get angleRad () {

        return Math.acos( this.x / this.length );
    },

    get angleDeg () {

        return this.angleRad * 180 / Math.PI;

    },

    left: function ( v ) {

        return new Vector2( -v.y, v.x );

    },

    straight: function ( v ) {

        return v;

    },

    right: function ( v ) {

        return new Vector2( v.y, -v.x );

    }

};
