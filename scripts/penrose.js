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
        var _makingTiles;

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
                y0: _settings.startY,
                shape: 'dart'
            });
            // firstTile.draw(_canvas);

            // tiles.push(firstTile);
            var index;
            var vg;
            for (var i in firstTile.points) {
                index = firstTile.points[i][0].toFixed(3) + '_' + firstTile.points[i][1].toFixed(3);
                if (!vertices[index]) {
                    vg = new VertexGroup({x: firstTile.points[i][0], y: firstTile.points[i][1]});
                    vertices[index] = vg;
                }
                vertices[index].addVertex(firstTile.pointNames[i], firstTile);
            }
            var secondTile = new Tile({
                x0: _settings.startX,
                y0: _settings.startY,
                shape: 'kite'
            });
            secondTile.draw(_canvas);
            for (var i in secondTile.points) {
                index = secondTile.points[i][0].toFixed(3) + '_' + secondTile.points[i][1].toFixed(3);
                if (!vertices[index]) {
                    vg = new VertexGroup({x: secondTile.points[i][0], y: secondTile.points[i][1]});
                    vertices[index] = vg;
                }
                vertices[index].addVertex(secondTile.pointNames[i], secondTile);
            }
            
            console.log(vertices);

            // _makingTiles = setInterval(addTile, 1000);
            
        }

        addTile = function() {
            console.log('adding a tile');
            for (var i in vertices) {
                var vg = vertices[i];
                if (!vg.isComplete()) {
                    console.log(vg);
                    window.vg = vg;
                    vg.checkComplete();
                }
            }
        }

        this.stopTiling = function() {
            clearInterval(_makingTiles);
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
                arc1:   '#42B364',
                arc2:   '#C10313',
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
            if (!options.colors || !options.colors.fill) {
                if (_settings.shape == 'kite') {
                    _settings.colors.fill = '#F2F2F2';
                } else {
                    _settings.colors.fill = '#E0E0E0';
                }
            }
            console.log('Tile settings');
            console.log(_settings);
            // A / H
            this.x0       = _settings.x0;
            this.y0       = _settings.y0;
            
            this.x01 = this.x0 + 100;
            this.y01 = this.y0;
            this.shape    = _settings.shape;
            this.rotation = _settings.rotation;
            this.length   = _settings.length;

            this.shortLen = (this.length / Geometry.phi);
            this.angle     = this.rotation + 36;
            this.antiAngle = this.rotation - 36;

            if (this.shape == "kite") {
                // B
                this.x1 = this.x0 + (this.length * Math.cos(Geometry.degToRad(this.antiAngle)));
                this.y1 = this.y0 + (this.length * Math.sin(Geometry.degToRad(this.antiAngle)));
                // C
                this.x2 = this.x1 + (this.shortLen * Math.sin(Geometry.degToRad(18 + this.rotation)));
                this.y2 = this.y1 + (this.shortLen * Math.cos(Geometry.degToRad(18 + this.rotation)));
                // D
                this.x3 = this.x2 + (this.shortLen * Math.sin(Geometry.degToRad(this.rotation - 18)));
                this.y3 = this.y2 + (this.shortLen * Math.cos(Geometry.degToRad(this.rotation - 18)));
                // console.log('B', this.x1, this.y1);
                // console.log('C', this.x2, this.y2);
                // console.log('D', this.x3, this.y3);

                this.pointNames = ['A','B','C','D'];
            } else if (this.shape == "dart") {
                // E
                this.x1 = this.x0 + (this.length * Math.cos(Geometry.degToRad(this.angle)));
                this.y1 = this.y0 + (this.length * Math.sin(Geometry.degToRad(this.angle)));
                // F
                this.x2 = this.x1 - (this.length * Math.sin(Geometry.degToRad(54 + this.rotation)));
                this.y2 = this.y1 + (this.length * Math.cos(Geometry.degToRad(54 + this.rotation)));
                // G
                this.x3 = this.x2 + (this.shortLen * Math.sin(Geometry.degToRad(18 + this.rotation)));
                this.y3 = this.y2 - (this.shortLen * Math.cos(Geometry.degToRad(18 + this.rotation)));
                // console.log('E', this.x1, this.y1);
                console.log('F', this.x2, this.y2);

                this.pointNames = ['H','E','F','G'];
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

    var VertexGroup;
    VertexGroup = function(options) {

        //----------------------------------------------------------------------
        // Private Properties
        //----------------------------------------------------------------------
        var _settings = {};
        var _defaults = {
            x: 0,
            y: 0
        };
        var _allGroups = [
            'EEEEE',
            'GBD',
            'AAAAA',
            'EEDBE',
            'CFAAH',
            'EDBDB',
            'HCCF'
        ];
        var _possibleGroups = [];

        var _matchStrings = [
            'EEEEE',
            'GBDGB',
            'AAAAA',
            'EEDBEEEDB',
            'CFAAHCFAA',
            'EDBDBEDBD',
            'HCCFHCC'
        ];

        var _rotations = [
            [126, 198, 270, 342, 54],
            [270, 306, 234],
            [270, 342, 54, 126, 198],
            [90, 162, 162, 18, 18],
            [90, 54, 54, 126, 126],
            [90, 90, 306, 234, 90],
            [234, 198, 342, 306]
        ];

        var vertices = [];
        this.tiles    = [];

        var _complete = false;

        /**
         * This will initialize the unset private variables and create the
         * manager object.
         *
         * @return void
         */
        this.init = function () {
            _settings = $.extend(true, {}, _defaults, options);
            // for debugging
            this.x = _settings.x;
            this.y = _settings.y;
        }

        this.isComplete = function () {
            return _complete;
        }

        /**
         * @param string vName alphabetic vertex identifier (e.g. 'E')
         * @param Tile tile the tile whose vertex is at this point
         * @return void
         */
        this.addVertex = function(vName, tile) {
            vertices.push(vName);
            this.tiles.push(tile);
        }

        this.checkComplete = function() {
            /*
             * check 360 degrees around the point and figure out what type of group it is, or at
             * least eliminate impossible groups.
             * draw a circle of a radius much shorter than the size of the polygon
             */
            var radius = this.tiles[0].length * 0.1;
            // console.log('radius');
            // console.log(radius);
            // console.log( _settings.x, _settings.y);
            var rotation = 360
            var pointX, pointY;
            var lastTile;
            var orderedTiles = [];
            var matchString = '';
            var gaps = false;
            while ( rotation > 0) {
                var rotationInRadians = Geometry.degToRad(rotation);
                pointX = _settings.x + (radius * Math.sin(rotationInRadians));
                pointY = _settings.y + (radius * Math.cos(rotationInRadians));
// console.log(pointX, pointY, rotation);

                var found = false;
                for( var i in this.tiles) {
                    if (Geometry.pointInsidePoly([pointX, pointY], this.tiles[i].points)) {
// console.log('point is in tile ' + i + ', ' + vertices[i]);
                        if (this.tiles[i] != lastTile) {
                            lastTile = this.tiles[i];
                            if (orderedTiles.indexOf(this.tiles[i]) < 0) {
                                matchString += vertices[i];
                                orderedTiles.push(this.tiles[i]);
                            }
                        }
                        found = true;
                    }
                }
                if (!found && lastTile != '.') {
                    lastTile = '.';
                    matchString += '.+';
                    gaps = true;
                }
                rotation -= 35;
            }
            console.log(matchString);
            console.log(orderedTiles);
            if (!gaps) {
                _complete = true;
            }

            // check which patterns match our possible pattern list
            var pattern = new RegExp(matchString);
            console.log('pattern', pattern);
            _possibleGroups = [];
            for (var i = 0; i < 7; i++) {
                if (_matchStrings[i].match(pattern)) {
                    _possibleGroups.push(i);
                }
            }
            console.log(_allGroups);
            console.log(_possibleGroups);

            // pick a random pattern option
            var useGroupIndex = _possibleGroups[Math.floor(Math.random()*_possibleGroups.length)];
            console.log('use ' + _allGroups[useGroupIndex]);
            
            // determine which tiles are missing from the vertex group, and the rotation of the group
            
        }

        this.init(options);
    }

    window.Penrose = Penrose;
    window.Tile = Tile;

}(jQuery));

    
    // var makingTiles = setInterval(addNewTile, 2000);
