Rectangle = function ( x, y, width, height ) {

	this.x = x || 0;
	this.y = y || 0;

    this.width = width || 0;
    this.height = height || 0;

};

Rectangle.prototype = {

	offset: function ( dx, dy ) {

        this.x += dx;
        this.y += y;

        return this;

    },

    offsetVector: function ( vector ) {

        return this.offSet( vector.x, vector.y );

    },

    setTo: function (x, y, width, height) {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        return this;

    },



};
