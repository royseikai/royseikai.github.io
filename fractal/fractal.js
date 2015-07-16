"use strict";

var canvas;
var gl;

var points = [];

var numTimesToSubdivide = 1;

var bufferId;
var angle = 0;
function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 8*Math.pow(5, 6), gl.STATIC_DRAW );



    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

        document.getElementById("input").onchange = function(e) {
        numTimesToSubdivide = e.target.value||e.srcElement.value;
		
        render();
    };
document.getElementById("inputangle").onchange = function(e) {
        angle = e.target.value||e.srcElement.value;
		
        render();
    };

    render();
};

function addAngle(ai,input)
{
	var x=input[0];
	var y=input[1];
	var dis = Math.sqrt(x*x+y*y)*Math.PI*(ai/180);
	//var dis=1*Math.PI;
	
	var a=x*Math.cos(dis)-y*Math.sin(dis);
	var b=x*Math.sin(dis)+y*Math.cos(dis);
	//alert (dis);
	//alert (i);
	return vec2(  a, b )
	
		
	
	
	
}
function triangle( a, b, c )
{
	
	
	

    points.push( addAngle(angle,a), addAngle(angle,b), addAngle(angle,b), addAngle(angle,c), addAngle(angle,c),addAngle(angle,a) );
	
	
	
	
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, bc, ac, count );
        divideTriangle( b, ab, bc, count );
		divideTriangle( bc, ac, ab, count );
    }
}

window.onload = init;

function render()
{
    var vertices = [
        vec2( -0.5, -0.5 ),
        vec2(  0,  0.5 ),
        vec2(  0.5, -0.5 )
    ];
    points = [];
    divideTriangle( vertices[0], vertices[1], vertices[2],
                    numTimesToSubdivide);

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, points.length );
    //points = [];
    //requestAnimFrame(render);
}
