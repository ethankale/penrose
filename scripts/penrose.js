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
        this.drawnTiles = [];

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
            window.penrose_vertices = [];
            window.vertexGroupQueue = [];
        };

        this.startTiling = function() {var tile1, tile2, tile3, tile4, tile5;
            /*[270, 234, 306]
            var tile1, tile2, tile3, tile4, tile5;
            tile1 = new Tile({
                x0: 253,
                y0: 207,
                shape: 'dart',
                rotation: 134,
                initialVertex: 'H',
            });
            tile2 = new Tile({
                x0: 253,
                y0: 207,
                shape: 'kite',
                rotation: 98,
                initialVertex: 'C',
            });
            tile3 = new Tile({
                x0: 253,
                y0: 207,
                shape: 'kite',
                rotation: 242,
                initialVertex: 'C',
            });
            tile4 = new Tile({
                x0: 253,
                y0: 207,
                shape: 'dart',
                rotation: 206,
                initialVertex: 'F',
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
            // tile5.draw(_canvas);
            /*/
            var firstTile = new Tile({
                x0: _settings.startX,
                y0: _settings.startY,
                shape: 'dart',
                rotation: 54,
                initialVertex: 'F',
            });
            firstTile.draw(_canvas);
            
            this.drawnTiles.push(firstTile);
            var index;
            var vg;
            indexVertices(firstTile);
            var secondTile = new Tile({
                x0: _settings.startX,
                y0: _settings.startY,
                shape: 'kite',
                rotation: 90,
                initialVertex: 'C'
            });
            this.drawnTiles.push(secondTile);
            secondTile.draw(_canvas);
            indexVertices(secondTile);

            _makingTiles = setInterval(this.addTile, 2000); //*/
        }

        this.addTile = function() {

            var vg;
            var fillColor;
            for (var i in window.vertexGroupQueue) {
                var nextIndex = window.vertexGroupQueue[i];
                var currentVg = window.penrose_vertices[nextIndex];
                if (!currentVg.isComplete()) {
                    // console.log(vg);
                    // window.vg = vg;
                    var tiles = currentVg.checkComplete();
                    var shapeName = '';
                    // fillColor = '#' + (20 * j).toString(16) + (15 * i).toString(16) + (30 * i).toString(16);
                    // fillColor = '#'+'0123456789abcdef'.split('').map(function(v,i,a){
                        // return i>5 ? null : a[Math.floor(Math.random()*16)] }).join('');
                    var r,g,b;
                    r = [Math.floor(Math.random()*255)];
                    g = [Math.floor(Math.random()*255)];
                    b = [Math.floor(Math.random()*255)];
                    fillColor = "rgba(" + r + ", " + g + ", " + b + ", 0.3)"
                    for (var j in tiles) {
                        if (['A','B','C','D'].indexOf(tiles[j].vertex) != -1) {
                            shapeName = 'kite';
                        } else {
                            shapeName = 'dart';
                        }

                        var newTile = new Tile({
                            x0: currentVg.x,
                            y0: currentVg.y,
                            shape: shapeName,
                            rotation: tiles[j].rotation,
                            initialVertex: tiles[j].vertex,
                            colors : { fill: fillColor }
                        });
                        newTile.draw(_canvas);
            // window.penrose.drawnTiles.push(newTile);
                        indexVertices(newTile);
// console.log('vertices');
// console.log(window.penrose_vertices);
                    }
                    if (tiles.length > 0) {
                        break;
                    }
                }
            }
        }

        var indexVertices = function(tile) {
            for (var i in tile.points) {
                index = tile.points[i][0].toFixed(3) + '_' + tile.points[i][1].toFixed(3);
                if (!window.penrose_vertices[index]) {
                    vg = new VertexGroup({x: tile.points[i][0], y: tile.points[i][1], canvas: _canvas});
                    window.penrose_vertices[index] = vg;
                }
                // console.log('adding vertex ' + tile.pointNames[i] + ' to ' + index);
                window.penrose_vertices[index].addVertex(tile.pointNames[i], tile);

            }
            window.vertexGroupQueue = [];
            for (var i in window.penrose_vertices) {
                window.vertexGroupQueue.push(i);
            };
            console.log(window.vertexGroupQueue);

            window.vertexGroupQueue.sort(function(a, b){
                // move complete vertex groups to the end
                var aIsComplete, bIsComplete, aHasG, bHasG;
                aIsComplete = window.penrose_vertices[a].isComplete();
                bIsComplete = window.penrose_vertices[b].isComplete();
                aHasG       = window.penrose_vertices[a].vertices.indexOf('G') != -1;
                bHasG       = window.penrose_vertices[b].vertices.indexOf('G') != -1;
                if (aIsComplete && !bIsComplete) {
                    console.log('a is complete (' + a + ')');
                    return 1;
                } else if (bIsComplete && !aIsComplete) {
                    console.log('b is complete (' + b + ')');
                    return -1;
                }
                // G is a special case, it can only be in one group, so it should be handled first
                if (!aHasG && bHasG) {
                    console.log('b has G (' + b + ')');
                    return 1;
                } else if (!bHasG && aHasG) {
                    console.log('a has G (' + a + ')');
                    return -1;
                }
                
                return 0;
            });
            console.log(window.vertexGroupQueue);
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

            // Draw the arcs
            
            // Calculating lengths is confusing.  Here's a cheat sheet:
            //
            // len = z(1 + PHI)
            // 
            // Solving for x will make calculating lengths a lot easier (especially for the radius of the arcs)
            // The variable z is the radius of the 144 degree arc for the kite, and the 216 degree arc for the dart
            // Basically, sub for the radii of length 1 in the diagrams here: http://math.uchicago.edu/~mann/penrose.pdf
            
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
            y: 0,
            canvas: '',
        };
        
        /**
        * There are seven possible groupings of tiles around a vertex (vertex groups).
        * 
        * In the Tile object we label the vertices around a 'kite' A-D, and the
        *  vertices around a 'dart' E-H.  This way each of the seven possible vertex
        *  groups can be uniquely identified as the sequence of vertices encountered
        *  in a clockwise rotation around the vertex (starting at any point; 
        *  hence _matchStrings).
        */
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

        /*
        * Each of the tiles in the seven vertex groups is encountered at a specific
        *  rotation around the vertex. 
        *
        * _rotations captures the degree by which the tile is rotated.
        *
        * _centers allows us to detect whether the tile has yet been added to the group.
        */
        
        var _rotations = [
            [126, 198, 270, 342, 54],
            [270, 306, 234],
            [270, 342, 54, 126, 198],
            [90, 162, 162, 18, 18],
            [90, 54, 54, 126, 126],
            [90, 90, 306, 234, 90],
            [234, 198, 342, 306]
        ];

        
        var _centers = [
            [144, 72, 0, 288, 216],
            [180, 36, 324],
            [180, 108, 36, 324, 252],
            [180, 108, 36, 324, 252],
            [180, 90, 36, 324, 270],
            [180, 108, 36, 324, 252],
            [162, 72, 288, 198]
        ];

        this.vertices = [];
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
            this.vertices.push(vName);
            this.tiles.push(tile);
        }

        this.checkComplete = function() {
// console.log('vertex group being populated:',this);
// console.log(this.vertices);
// console.log(this.tiles);
            /*
             * check 360 degrees around the point and figure out what type of group it is, or at
             * least eliminate impossible groups.
             * draw a circle of a radius much shorter than the size of the polygon
             */
            var radius = this.tiles[0].length * 0.3;
// console.log('radius');
// console.log(radius);
// console.log( _settings.x, _settings.y);
            var traceRotation = 360
            var pointX, pointY;
            var lastTile;
            var orderedTiles = [];
            var matchString = '';
            var gaps = false;
            var firstTileIndex = false;
            while ( traceRotation > 0) {
                var rotationInRadians = Geometry.degToRad(traceRotation);
                pointX = _settings.x + (radius * Math.sin(rotationInRadians));
                pointY = _settings.y + (radius * Math.cos(rotationInRadians));

                var found = false;
                for( var i in this.tiles) {
                    if (Geometry.pointInsidePoly([pointX, pointY], this.tiles[i].points)) {
                        if (this.tiles[i] != lastTile) {
                            lastTile = this.tiles[i];
                            if (orderedTiles.indexOf(this.tiles[i]) < 0) {
                                matchString += this.vertices[i];
                                orderedTiles.push(this.tiles[i]);
                            }
                        }
                        if (firstTileIndex === false) {
                            firstTileIndex = i;
                        }
                        found = true;
// console.log('found in ' + i);
                    }
                }
                if (!found && lastTile != '.') {
                    lastTile = '.';
                    matchString += '.+';
                    gaps = true;
                }
                traceRotation -= 35;
            }
            if (matchString.substr(0,2) == '.+') {
                matchString = matchString.substr(2);
            }
            if (matchString.substr(-2) == '.+') {
                matchString = matchString.substr(0, matchString.length - 2);
            }

            if (!gaps) {
                _complete = true;
            }

            // check which patterns match our possible pattern list
            var pattern = new RegExp(matchString);
// console.log('pattern', pattern);
            _possibleGroups = [];
            for (var i = 0; i < 7; i++) {
                if (_matchStrings[i].match(pattern)) {
                    _possibleGroups.push(i);
                }
            }
            if (_possibleGroups.length == 0) {
                console.log(_allGroups);
                console.log(_possibleGroups);
                console.log(pattern);
            }
            // pick a random pattern option
            var selectedGroup = _possibleGroups[Math.floor(Math.random()*_possibleGroups.length)];
            
            // determine which tiles are missing from the vertex group, and the rotation of the group

// console.log('position, rotation');
// console.dir(this.tiles);
            var position =  _matchStrings[selectedGroup].search(matchString);
// console.log(position);
// console.log(this.tiles[firstTileIndex].rotation + ' - ' + _rotations[selectedGroup][position]);
            var rotation = this.tiles[firstTileIndex].rotation - _rotations[selectedGroup][position];
// console.log(rotation);

            var needsToBeDrawn = [];
            for (var i = 0; i < _allGroups[selectedGroup].length; i++) {
            
                centerRotation = _centers[selectedGroup][i] - rotation;
                rotationInRadians = Geometry.degToRad(centerRotation);
                pointX = _settings.x + (radius * Math.sin(rotationInRadians));
                pointY = _settings.y + (radius * Math.cos(rotationInRadians));
                // draw, for debugging
                var colors = ["#FF0000", "#FF6A00", "#FFD800", "#00FF21", "#4800FF"];
                _settings.canvas.fillStyle = colors[i];
                _settings.canvas.fillRect(pointX-2,pointY-2,4,4);
                var vertexLetter = _allGroups[selectedGroup][i];
                var found = false;
// console.log(vertexLetter, pointX, pointY);
                // before adding tile to the list to be drawn, make sure it's not already there
                for (var j in this.vertices) {
                    if (this.vertices[j] == vertexLetter) {
// console.log(this.vertices[j]);
// console.log(this.tiles[j]);
                        if (Geometry.pointInsidePoly([pointX, pointY], this.tiles[j].points, true)) {
                            found = true;
                            console.log('FOUND IT');
                            break;
                        }
                    }
                }
                if (!found) {
                    needsToBeDrawn.push({
                        'vertex': vertexLetter,
                        'rotation' : (_rotations[selectedGroup][i] + rotation) % 360
                    });
                }
            }
            _complete = true;
            console.log(needsToBeDrawn);
            return needsToBeDrawn;
        }

        this.init(options);
    }

    window.Penrose = Penrose;
    window.Tile = Tile;

}(jQuery));

    
    // var makingTiles = setInterval(addNewTile, 2000);
