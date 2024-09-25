function getRandomPoint() {
    return [Math.random(), Math.random()] // (can start anywhere in the area)
}

function getRandomCentralPoint() {
    return [0.5 + (Math.random()-0.5)/5.0, 0.5 + (Math.random()-0.5)/5.0]    // Let's make it point toward the center
}

var Tantalum = function() {
    this.canvas         = document.getElementById("render-canvas");
    this.controls       = document.getElementById("controls");
    
    this.boundRenderLoop = this.renderLoop.bind(this);
    
    this.savedImages = 0;
    
    try {
        this.setupGL();
    } catch (e) {
        /* GL errors at this stage are to be expected to some degree,
           so display a nice error message and call it quits */
        this.fail(e.message + ". This demo won't run in your browser.");
        return;
    }
    try {
        this.setupUI();
    } catch (e) {
        /* Errors here are a bit more serious and shouldn't normally happen.
           Let's just dump what we have and hope the user can make sense of it */
        this.fail("Ooops! Something unexpected happened. The error message is listed below:<br/>" +
             "<pre>" + e.message + "</pre>");
        return;
    }
    
    /* Ok, all seems well. Time to show the controls */
    this.controls.style.visibility = "visible";
    
    window.requestAnimationFrame(this.boundRenderLoop);
}

Tantalum.prototype.setupGL = function() {
    try {
        var gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
    } catch (e) {}
    if (!gl)
        throw new Error("Could not initialise WebGL");
    
    var floatExt    = gl.getExtension("OES_texture_float");
    var floatLinExt = gl.getExtension("OES_texture_float_linear");
    var multiBufExt = gl.getExtension("WEBGL_draw_buffers");
    
    if (!floatExt || !floatLinExt)
        throw new Error("Your platform does not support float textures");
    if (!multiBufExt)
        throw new Error("Your platform does not support the draw buffers extension");
        
    tgl.init(gl, multiBufExt);
    
    this.gl = gl;
}

Tantalum.prototype.setupUI = function() {
    function map(a, b) { return [a*0.5/1.78 + 0.5, -b*0.5 + 0.5]; }

    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    this.canvas.width = vw;
    this.canvas.height = vh;

    var config = {
        "resolutions": [[vw, vh]],
        "scenes": [
            {'shader': 'scene1', 'name': 'Lenses',               'posA': [0.5,  0.5],      'posB': [0.5, 0.5],        'spread': tcore.Renderer.SPREAD_POINT},
            {'shader': 'scene6', 'name': 'Spheres',              'posA': map(-1.59, 0.65), 'posB': map(0.65, -0.75),  'spread': tcore.Renderer.SPREAD_BEAM},
            {'shader': 'scene7', 'name': 'Playground',           'posA': [0.3, 0.52],      'posB': [0.3, 0.52],       'spread': tcore.Renderer.SPREAD_POINT},
            {'shader': 'scene4', 'name': 'Prism',                'posA': [0.1,  0.65],     'posB': [0.4, 0.4],        'spread': tcore.Renderer.SPREAD_LASER},
            {'shader': 'scene5', 'name': 'Cardioid',             'posA': [0.2,  0.5],      'posB': [0.2, 0.5],        'spread': tcore.Renderer.SPREAD_POINT},
            {'shader': 'scene3', 'name': 'Cornell Box',          'posA': [0.5,  0.101],    'posB': [0.5, 0.2],        'spread': tcore.Renderer.SPREAD_AREA},
            {'shader': 'scene2', 'name': 'Rough Mirror Spheres', 'posA': [0.25, 0.125],    'posB': [0.5, 0.66],       'spread': tcore.Renderer.SPREAD_LASER},
            {'shader': 'scene8', 'name': 'Random Spheres',       'posA': [0.00, 0.00],     'posB': [0.00, 0.00],      'spread': tcore.Renderer.SPREAD_LASER}
        ]
    };
    
    var sceneShaders = [], sceneNames = [];
    for (var i = 0; i < config.scenes.length; ++i) {
        sceneShaders.push(config.scenes[i].shader);
        sceneNames.push(config.scenes[i].name);
    }
    
    this.renderer = new tcore.Renderer(this.gl, vw, vh, sceneShaders);
    
    /* Let's try and make member variables in JS a little less verbose... */
    var renderer = this.renderer;
    var canvas = this.canvas;
    
    this.progressBar = new tui.ProgressBar("render-progress");
        
    var mouseListener = new tui.MouseListener(canvas, renderer.setEmitterPos.bind(renderer));
    
    renderer.setNormalizedEmitterPos(getRandomPoint(), getRandomCentralPoint());
    renderer.setSpreadType(3);          // This can be from [0 to 4] ["Point", "Cone", "Beam", "Laser", "Area"]
    renderer.setMaxPathLength(24);
        
    let exponent1 = 6;  // A good range is [4 to 7]
    var sampleCount = Math.floor(Math.pow(10, (exponent1*100)*0.01));
    renderer.setMaxSampleCount(sampleCount);
        
    renderer.changeScene(7);            // Can be [0 to 7]
}

Tantalum.prototype.fail = function(message) {
    var sorryP = document.createElement("p"); 
    sorryP.appendChild(document.createTextNode("Sorry! :("));
    sorryP.style.fontSize = "50px";

    var failureP = document.createElement("p");
    failureP.className = "warning-box";
    failureP.innerHTML = message;
    
    var errorImg = document.createElement("img"); 
    errorImg.title = errorImg.alt = "The Element of Failure";
    errorImg.src = "derp.gif";
    
    var failureDiv = document.createElement("div"); 
    failureDiv.className = "center";
    failureDiv.appendChild(sorryP);
    failureDiv.appendChild(errorImg);
    failureDiv.appendChild(failureP);
    
    document.getElementById("content").appendChild(failureDiv);
    this.canvas.style.display = 'none';
}

Tantalum.prototype.renderLoop = function(timestamp) {
    window.requestAnimationFrame(this.boundRenderLoop);
    
    if (!this.renderer.finished()) {
        this.renderer.render(timestamp);
    } else {
    //  this.renderer.setSpreadType(Math.floor(Math.random() * 5));
        this.renderer.setNormalizedEmitterPos(getRandomPoint(), getRandomCentralPoint());
    }
    
    this.progressBar.setProgress(this.renderer.progress());
}
