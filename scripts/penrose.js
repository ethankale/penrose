(function ($) {
// Thanks to many cool sources on the web:
    // http://en.wikipedia.org/wiki/Penrose_tiling
    // http://math.uchicago.edu/~mann/penrose.pdf
    // http://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    // http://stackoverflow.com/questions/3115982/how-to-check-javascript-array-equals
    var Penrose;
    Penrose = function () {
        //----------------------------------------------------------------------
        // Private Properties
        //----------------------------------------------------------------------
        var _settings = {};
        // default settings
        var _defaults = {
            debug: false,
            length: 75, // pixels
            initialRot: 0, // degrees,
            canvasSelector: '',
            startX: 200,
            startY: 200,
        };
        var _canvas;

        //----------------------------------------------------------------------
        // Private Jquery Objects
        //----------------------------------------------------------------------
        // var $_canvas;

        //----------------------------------------------------------------------
        // Public Properties
        //----------------------------------------------------------------------
        var vertices = {};
        var tiles = [];

        //----------------------------------------------------------------------
        // Public Methods
        //----------------------------------------------------------------------

        /**
         * This will initialize the unset private variables and create the
         * manager object.
         *
         * @return void
         */
        this.init = function (options) {
            // Combine our options and our defaults
            _settings = $.extend(true, {}, _defaults, options);
            _canvas = $(_settings.canvasSelector).get(0).getContext("2d");
        };

        this.startTiling = function() {
            var firstTile = new Tile({
                x0: _settings.startX,
                y0: _settings.startY
            });
            firstTile.draw(_canvas);

            tiles.push(firstTile);
            for (var i in firstTile.points) {
                var index = firstTile.points[i][0].toFixed(3) + '_' + firstTile.points[i][1].toFixed(3);
                vertices[index] = {
                    'tile': firstTile,
                    'point': firstTile.pointNames[i]
                }
            }
            console.log(vertices);
        }

        this.stopTiling = function() {
            clearInterval(makingTiles);
        }
    
    };
    var Tile;
    Tile = function(options) {
        /**
         * options
         * shape - Either "dart" or "kite"
         *
         * x0, y0 - Starting point - the "point" of the kite, or the bottom point of a dart facing right
         *
         * rotation - angle of rotation in degrees
         *
         * length - length of the longest side
         */

        //----------------------------------------------------------------------
        // Private Properties
        //----------------------------------------------------------------------
        var _settings = {};
        var _defaults = {
            x0 : 0,
            y0 : 0,
            shape : 'kite',
            rotation: 0,
            length: 75,
            colors: {
                fill:   '#cccccc',
                stroke: '#0000ff',
                arc1:   '#ffff00',
                arc2:   '#800080',
            }
        };
        var points = [];

        /**
         * This will initialize the unset private variables and create the
         * manager object.
         *
         * @return void
         */
        this.init = function () {
            // Combine our options and our defaults
            _settings = $.extend(true, {}, _defaults, options);
            console.log('Tile settings');
            console.log(_settings);
            // A / E
            this.x0       = _settings.x0;
            this.y0       = _settings.y0;
            this.shape    = _settings.shape;
            this.rotation = _settings.rotation;
            this.length   = _settings.length;

            this.shortLen = (this.length / Geometry.phi);
            this.angle     = this.rotation + 36;
            this.antiAngle = this.rotation - 36;

            if (this.shape == "kite") {
                // F
                this.x1 = this.x0 + (this.length * Math.cos(Geometry.degToRad(this.antiAngle)));
                this.y1 = this.y0 + (this.length * Math.sin(Geometry.degToRad(this.antiAngle)));
                // G
                this.x2 = this.x0 + (this.length * Math.cos(Geometry.degToRad(this.rotation)));
                this.y2 = this.y0 + (this.length * Math.sin(Geometry.degToRad(this.rotation)));
                // H
                this.x3 = this.x0 + (this.length * Math.cos(Geometry.degToRad(this.angle)));
                this.y3 = this.y0 + (this.length * Math.sin(Geometry.degToRad(this.angle)));

                this.pointNames = ['E','F','G','H'];
            } else if (this.shape == "dart") {
                // B
                this.x1 = this.x0 + (this.length * Math.cos(Geometry.degToRad(this.angle)));
                this.y1 = this.y0 + (this.length * Math.sin(Geometry.degToRad(this.angle)));
                // C
                this.x2 = this.x1 - (this.length * Math.sin(Geometry.degToRad(54 + this.rotation)));
                this.y2 = this.y1 + (this.length * Math.cos(Geometry.degToRad(54 + this.rotation)));
                // D
                this.x3 = this.x2 + (this.shortLen * Math.sin(Geometry.degToRad(18 + this.rotation)));
                this.y3 = this.y2 - (this.shortLen * Math.cos(Geometry.degToRad(18 + this.rotation)));

                this.pointNames = ['A','B','C','D'];
            }

            this.points = [[this.x0, this.y0], [this.x1, this.y1], [this.x2, this.y2], [this.x3, this.y3]];
            
        };
        
        this.draw = function(canvas) {
            // Template for drawing darts & kites.  Specify the x,y coords of the endpoint
            //  and the rotation; optionally the length of a side and fill & stroke color.
            
            
            canvas.moveTo(this.x0, this.y0);
            canvas.beginPath();
            
            canvas.lineTo(this.x1, this.y1);
            canvas.lineTo(this.x2, this.y2);
            canvas.lineTo(this.x3, this.y3);
            canvas.lineTo(this.x0, this.y0);
            
            canvas.closePath();
            canvas.fillStyle = _settings.colors.fill;
            canvas.fill();
            canvas.strokeStyle = _settings.colors.stroke;
            canvas.stroke();
            
            // Draw the arcs
            
            // Calculating lengths is confusing.  Here's a cheat sheet:
            //
            // len = z(1 + PHI)
            // 
            // Solving for x will make calculating lengths a lot easier (especially for the radius of the arcs)
            // The variable z is the radius of the 144 degree arc for the kite, and the 216 degree arc for the dart
            // Basically, sub for the radii of length 1 in the diagrams here: http://math.uchicago.edu/~mann/penrose.pdf
            // Therefore:
            var z = 1 / ((1 + Geometry.phi) / this.length)
            
            if (this.shape == "kite") {
                canvas.beginPath();
                canvas.strokeStyle = _settings.colors.arc1;
                canvas.arc(this.x0, this.y0, z * Geometry.phi, Geometry.degToRad(this.rotation - 36), Geometry.degToRad(this.rotation + 36));
                canvas.stroke();
                
                canvas.beginPath();
                canvas.strokeStyle = _settings.colors.arc2;
                canvas.arc(this.x2, this.y2, z, Geometry.degToRad(this.rotation + 108), Geometry.degToRad(this.rotation - 108));
                canvas.stroke();
                
            }
            
            if (this.shape == "dart") {
                canvas.beginPath();
                canvas.strokeStyle = _settings.colors.arc2;
                canvas.arc(this.x3, this.y3, z / Geometry.phi, Geometry.degToRad(this.rotation - 108), Geometry.degToRad(this.rotation + 108));
                canvas.stroke();
                
                canvas.beginPath();
                canvas.strokeStyle = _settings.colors.arc1;
                canvas.arc(this.x1, this.y1, z, Geometry.degToRad(this.rotation + 144), Geometry.degToRad(this.rotation - 144));
                canvas.stroke();
                
            }
        }

        this.init(options);
    }
    window.Penrose = Penrose;
    window.Tile = Tile;
}(jQuery));

    
    // var makingTiles = setInterval(addNewTile, 2000);
