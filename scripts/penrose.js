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
            var tile1, tile2, tile3, tile4, tile5;
            tile1 = new Tile({
                x0: 253,
                y0: 207,
                shape: 'dart',
                rotation: 135,
                initialVertex: 'E',
            });
            tile2 = new Tile({
                x0: 253,
                y0: 207,
                shape: 'kite',
                rotation: 135,
                initialVertex: 'D',
            });
            tile3 = new Tile({
                x0: 253,
                y0: 207,
                shape: 'kite',
                rotation: 351,
                initialVertex: 'B',
            });
            tile4 = new Tile({
                x0: 253,
                y0: 207,
                shape: 'kite',
                rotation: 279,
                initialVertex: 'D',
            });
            tile5 = new Tile({
                x0: 253,
                y0: 207,
                shape: 'kite',
                rotation: 135,
                initialVertex: 'B',
            });
            tile1.draw(_canvas);
            tile2.draw(_canvas);
            tile3.draw(_canvas);
            tile4.draw(_canvas);
            tile5.draw(_canvas);
            
            
/*
            var firstTile = new Tile({
                x0: 400,
                y0: _settings.startY,
                shape: 'dart',
                rotation: 0,
                initialVertex: 'E',
            });
            firstTile.draw(_canvas);

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
                shape: 'kite',
                rotation: 0,
                initialVertex: 'D'
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
*/
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
            if (!options.initialVertex) {
                if (_settings.shape == 'kite') {
                    _settings.initialVertex = 'A';
                } else {
                    _settings.initialVertex = 'H';
                }
            }
console.log('Tile settings');
console.log(_settings);
            // A / H
            this.x0       = _settings.x0;
            this.y0       = _settings.y0;

            this.shape    = _settings.shape;
            this.rotation = _settings.rotation;
            this.length   = _settings.length;
            this.shortLen = (this.length / Geometry.phi);

            this.points     = [];
            this.pointNames = [];
            
            var nextPointMap = {
                'kite' : {
                    'A': {
                        'next': 'B',
                        'translation': [
                            (this.length * Math.cos(Geometry.degToRad(this.rotation + 216))),
                            (this.length * Math.sin(Geometry.degToRad(this.rotation + 216)))
                        ]
                    },
                    'B': {
                        'next': 'C',
                        'translation': [
                            (this.length * Math.cos(Geometry.degToRad(this.rotation - 36))),
                            (this.length * Math.sin(Geometry.degToRad(this.rotation - 36)))
                        ]
                    },
                    'C': {
                        'next': 'D',
                        'translation': [
                            (this.shortLen * Math.sin(Geometry.degToRad(18 - this.rotation))),
                            (this.shortLen * Math.cos(Geometry.degToRad(18 - this.rotation)))
                        ]
                    },
                    'D' : {
                        'next': 'A',
                        'translation': [
                            (this.shortLen * Math.sin(Geometry.degToRad(this.rotation + 18))) * -1,
                            (this.shortLen * Math.cos(Geometry.degToRad(this.rotation + 18)))
                        ]
                    }
                },
                'dart' : {
                    'H': {
                        'next': 'E',
                        'translation': [
                            (this.shortLen * Math.sin(Geometry.degToRad(this.rotation - 18))),
                            (this.shortLen * Math.cos(Geometry.degToRad(this.rotation - 18))) * -1
                        ]
                    },
                    'E': {
                        'next': 'F',
                        'translation': [
                            (this.length * Math.cos(Geometry.degToRad(this.rotation + 36))),
                            (this.length * Math.sin(Geometry.degToRad(this.rotation + 36)))
                        ]
                    },
                    'F': {
                        'next': 'G',
                        'translation': [
                            (this.length * Math.sin(Geometry.degToRad(this.rotation + 54))) * -1,
                            (this.length * Math.cos(Geometry.degToRad(this.rotation + 54)))
                        ]
                    },
                    'G': {
                        'next': 'H',
                        'translation': [
                            (this.shortLen * Math.sin(Geometry.degToRad(this.rotation + 18))),
                            (this.shortLen * Math.cos(Geometry.degToRad(this.rotation + 18))) * -1
                        ]
                    }
                }
            };

            var x = _settings.x0;
            var y = _settings.y0;
            var currentVertexName = _settings.initialVertex;
            var currentVertex = nextPointMap[_settings.shape][currentVertexName];

            for (var i = 0; i < 4; i++) {
                this.pointNames.push(currentVertexName);
                this.points.push([x, y]);
                currentVertexName = currentVertex.next;
                currentVertex = nextPointMap[_settings.shape][currentVertex.next];
                x = x + currentVertex.translation[0];
                y = y + currentVertex.translation[1];
            }
        };
        
        this.draw = function(canvas) {
            // Template for drawing darts & kites.  Specify the x,y coords of the endpoint
            //  and the rotation; optionally the length of a side and fill & stroke color.

            canvas.moveTo(this.points[0][0], this.points[0][1]);
            canvas.beginPath();

            canvas.lineTo(this.points[1][0], this.points[1][1]);
            canvas.lineTo(this.points[2][0], this.points[2][1]);
            canvas.lineTo(this.points[3][0], this.points[3][1]);
            canvas.lineTo(this.points[0][0], this.points[0][1]);

            canvas.closePath();
            canvas.fillStyle = _settings.colors.fill;
            canvas.fill();
            canvas.strokeStyle = _settings.colors.stroke;
            canvas.stroke();

            canvas.fillStyle = "#0026ff";
            canvas.fillRect(this.points[0][0]-2,this.points[0][1]-2,4,4);
            canvas.fillStyle = "#b200ff";
            canvas.fillRect(this.points[1][0]-2,this.points[1][1]-2,4,4);
            canvas.fillStyle = "#ff006e";
            canvas.fillRect(this.points[2][0]-2,this.points[2][1]-2,4,4);
            canvas.fillStyle = "#ff6a00";
            canvas.fillRect(this.points[3][0]-2,this.points[3][1]-2,4,4);
            
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
            var arc1, arc2;
            if (this.shape == "kite") {
                arc1 = this.pointNames.indexOf('A');
                arc2 = this.pointNames.indexOf('C');

                canvas.beginPath();
                canvas.strokeStyle = _settings.colors.arc1;
                canvas.arc(this.points[arc1][0], this.points[arc1][1], z * Geometry.phi, Geometry.degToRad(this.rotation - 36), Geometry.degToRad(this.rotation + 36));
                canvas.stroke();
                
                canvas.beginPath();
                canvas.strokeStyle = _settings.colors.arc2;
                canvas.arc(this.points[arc2][0], this.points[arc2][1], z, Geometry.degToRad(this.rotation + 108), Geometry.degToRad(this.rotation - 108));
                canvas.stroke();
                
            } else if (this.shape == "dart") {
                arc1 = this.pointNames.indexOf('E');
                arc2 = this.pointNames.indexOf('G');

                canvas.beginPath();
                canvas.strokeStyle = _settings.colors.arc1;
                canvas.arc(this.points[arc1][0], this.points[arc1][1], z, Geometry.degToRad(this.rotation + 144), Geometry.degToRad(this.rotation - 144));
                canvas.stroke();

                canvas.beginPath();
                canvas.strokeStyle = _settings.colors.arc2;
                canvas.arc(this.points[arc2][0], this.points[arc2][1], z / Geometry.phi, Geometry.degToRad(this.rotation - 108), Geometry.degToRad(this.rotation + 108));
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
