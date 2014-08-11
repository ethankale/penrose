 // Thanks to many cool sources on the web:
    // http://en.wikipedia.org/wiki/Penrose_tiling
    // http://math.uchicago.edu/~mann/penrose.pdf
    // http://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    // http://stackoverflow.com/questions/3115982/how-to-check-javascript-array-equals
    
    
    ///////
    // Global variables
    ///////
    var debug = false;
    
    var PHI = 0.5 + Math.sqrt(5 / 4);
    var canvas = document.getElementById("tiles").getContext("2d");
    
    var len    = 75
    var startX = 200
    var startY = 200
    
    //////
    // Global functions
    /////
    
    // Sine and cosine functions in javascript accept radians rather than degrees.
    function degToRad(degrees) {
        return degrees * (Math.PI / 180)
    }
    
    //////
    // Classes
    //////
    
    // We need to make a tile class, which can be either a dart or a kite
    // tileProperties = [shape, start x, start y, degrees rotation, length of side]
    
    //function Tile(shape, x, y, deg, len) {
    function Tile(tileProperties) {
        // Either "dart" or "kite"
        this.shape = tileProperties[0];
        
        // Starting point - the "point" of the kite, or the bottom point of a dart facing right
        this.x0 = tileProperties[1];
        this.y0 = tileProperties[2];
        
        // deg = angle of rotation in degrees 
        this.deg = tileProperties[3];
        
        // len = length of the longest side
        this.len = tileProperties[4];
        
        // So we're not relying on a global variable of PHI
        var PHI = 0.5 + Math.sqrt(5 / 4);
        
        var shortLen = (len / PHI);
        
        //Calculate the coordinates for each point
        this.x1 = 0; 
        this.y1 = 0; 
        this.x2 = 0;
        this.y2 = 0;
        this.x3 = 0;
        this.y3 = 0; 
        
        var angle     = this.deg + 36;
        var antiAngle = this.deg - 36;
        
        if (this.shape == "kite") {
            
            this.x1 = this.x0 + (this.len * Math.cos(degToRad(antiAngle)));
            this.y1 = this.y0 + (this.len * Math.sin(degToRad(antiAngle)));
            this.x2 = this.x0 + (this.len * Math.cos(degToRad(this.deg)));
            this.y2 = this.y0 + (this.len * Math.sin(degToRad(this.deg)));
            this.x3 = this.x0 + (this.len * Math.cos(degToRad(angle)));
            this.y3 = this.y0 + (this.len * Math.sin(degToRad(angle)));
            
            this.points = [[x0, y0], [x1, y1], [x2, y2], [x3, y3]];
            
            
            // Potential neighbors that fit the tile setting rules.
            this.neighbors = [
                ["dart", this.x0, this.y0, this.deg, this.len],
                ["dart", this.x1 - (this.len * Math.cos(degToRad(this.deg + 36))), this.y1 - (this.len * Math.sin(degToRad(this.deg + 36))), this.deg, this.len],
                ["dart", this.x2, this.y2, angle, this.len],
                ["dart", this.x0 + (this.len * Math.cos(degToRad(antiAngle - 36))), this.y0 + (this.len * Math.sin(degToRad(antiAngle - 36))), antiAngle, this.len],
                ["kite", this.x0, this.y0, this.deg + 72, this.len],
                ["kite", this.x0, this.y0, this.deg - 72, this.len],
                ["kite", this.x2 - (this.len * Math.cos(degToRad(this.deg - 144))), this.y2 - (this.len * Math.sin(degToRad(this.deg - 144))), this.deg - 144, this.len],
                ["kite", this.x2 - (this.len * Math.cos(degToRad(this.deg + 144))), this.y2 - (this.len * Math.sin(degToRad(this.deg + 144))), this.deg + 144, this.len]
            ]
            
            
        } else if (this.shape == "dart") {

            this.x1 = this.x0 + (this.len * Math.cos(degToRad(angle)));
            this.y1 = this.y0 + (this.len * Math.sin(degToRad(angle)));
            this.x2 = this.x1 - (this.len * Math.sin(degToRad(54 + this.deg)));
            this.y2 = this.y1 + (this.len * Math.cos(degToRad(54 + this.deg)));
            this.x3 = this.x2 + (shortLen * Math.sin(degToRad(18 + this.deg)));
            this.y3 = this.y2 - (shortLen * Math.cos(degToRad(18 + this.deg)));
            
            // Potential neighbors that fit the tile setting rules.
            this.neighbors = [
                ["kite", this.x0, this.y0, this.deg, this.len],
                ["kite", this.x2, this.y2, this.deg, this.len],
                ["kite", this.x3 + (this.len * Math.cos(degToRad(this.deg - 180))), this.y3 + (this.len * Math.sin(degToRad(this.deg + 180))), this.deg - 36, this.len],
                ["kite", this.x3 + (this.len * Math.cos(degToRad(this.deg - 180))), this.y3 + (this.len * Math.sin(degToRad(this.deg + 180))), this.deg + 36, this.len],
                ["dart", this.x2, this.y2, this.deg - 72, this.len],
                ["dart", this.x1 + (this.len * Math.cos(degToRad(this.deg - 72))), this.y1 + (this.len * Math.sin(degToRad(this.deg - 72))), this.deg + 72, this.len]
            ]
        }
        
    }
    
    
    //////
    // Display functions
    //////
    
    function drawShape(tile, fillCol, strokeCol) {
        // Template for drawing darts & kites.  Specify the x,y coords of the endpoint
        //  and the rotation; optionally the length of a side and fill & stroke color.
        
        x     = tile.x0;
        y     = tile.y0;
        deg   = tile.deg;
        len   = tile.len;
        shape = tile.shape;
        
        shortLen = (len / PHI)
        
        // Default values
        fillCol = typeof fillCol !== 'undefined' ? fillCol : '#f00';
        strokeCol = typeof strokeCol !== 'undefined' ? strokeCol : 'blue';
        
        canvas.moveTo(tile.x0, tile.y0);
        canvas.beginPath();
        
        canvas.lineTo(tile.x1, tile.y1);
        canvas.lineTo(tile.x2, tile.y2);
        canvas.lineTo(tile.x3, tile.y3);
        canvas.lineTo(tile.x0, tile.y0);
        
        canvas.closePath();
        canvas.fillStyle = fillCol;
        canvas.fill();
        canvas.strokeStyle = strokeCol;
        canvas.stroke();
        
        // Draw the curvy lines
        
        // Calculating lengths is confusing.  Here's a cheat sheet:
        //
        // len = z(1 + PHI)
        // 
        // Solving for x will make calculating lengths a lot easier (especially for the radius of the arcs)
        // The variable z is the radius of the 144 degree arc for the kite, and the 216 degree arc for the dart
        // Basically, sub for the radii of length 1 in the diagrams here: http://math.uchicago.edu/~mann/penrose.pdf
        // Therefore:
        z = 1 / ((1 + PHI) / len)
        
        if (shape == "kite") {
            canvas.beginPath();
            canvas.strokeStyle = "yellow";
            canvas.arc(tile.x0, tile.y0, z * PHI, degToRad(deg - 36), degToRad(deg + 36));
            canvas.stroke();
            
            canvas.beginPath();
            canvas.strokeStyle = "purple";
            canvas.arc(tile.x2, tile.y2, z, degToRad(deg + 108), degToRad(deg - 108));
            canvas.stroke();
            
        }
        
        if (shape == "dart") {
            canvas.beginPath();
            canvas.strokeStyle = "purple";
            canvas.arc(tile.x3, tile.y3, z / PHI, degToRad(deg - 108), degToRad(deg + 108));
            canvas.stroke();
            
            canvas.beginPath();
            canvas.strokeStyle = "yellow";
            canvas.arc(tile.x1, tile.y1, z, degToRad(deg + 144), degToRad(deg - 144));
            canvas.stroke();
            
        }
    }
    
    //////
    // Draw the tileset
    //////
    
    theHeight = startY - (2 * (len * Math.sin(degToRad(36))));
    
    // First tile, to get things started
    var t1 = new Tile(["dart", startX, startY, 154,  len]);
    
    drawShape(t1, fillCol = "lightgray");
    if (debug) {
        var colors = ["cyan", "purple", "blue", "wheat", "orange", "yellow", "pink", "teal"];
        for (var i in t1.neighbors) {
            
            drawShape(new Tile(t1.neighbors[i]), colors[i]);
        }
        clearInterval(makingTiles);
    }
    
    // Start randomly adding (non-colliding) tiles, up to 20, to the canvas
    var drawnTiles = [t1];
    
    var numberOfTiles = 0;
    

    
    function addNewTile() {
        var currentTile  = drawnTiles[Math.floor(Math.random() * drawnTiles.length)];
        var neighbor     = Math.floor(Math.random() * currentTile.neighbors.length);
        var possibleTile = new Tile(currentTile.neighbors[neighbor]);
        
        if (debug) {
            console.log("currentTile, neighbor, possibleTile"); 
            console.log(currentTile, neighbor, possibleTile); 
        }
        
        var overlap = false;
        
        for (var j in drawnTiles) {
            if (tileOverlap(drawnTiles[j], possibleTile)) {
                overlap = true;
                
                if (debug) {
                    console.log("Overlap detected!");
                    console.log("drawnTiles[j], possibleTile, j");
                    console.log(drawnTiles[j], possibleTile, j);
                    drawShape(possibleTile, "red");
                    clearInterval(makingTiles);
                }
                
            };
        };
        
        if (overlap == false) {
            drawnTiles.push(possibleTile);
            drawShape(possibleTile, fillCol = "lightgray");
            
            numberOfTiles = numberOfTiles + 1;
        };
    };
    
    var makingTiles = setInterval(addNewTile, 2000);

    
    // Some samples of how to create/draw tiles from an existing tile
    //var n1 = t1.neighbors[4];
    //var t2 = new Tile(n1);
    //drawShape(t2, fillCol = "lightgray");
    //drawShape("kite", x = startX, y = startY, deg = angles[2], len = len, fillCol = "lightgray");