// ================= Shadertoy 风格首屏背景 =================
// WebGL 1.0 Shadertoy runtime，无第三方依赖；失败时保持黑屏便于诊断。
(function () {
    'use strict';

    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var REDUCED_MOTION_TIME = 8.0;
    var REDUCED_MOTION_SPEED = 0.75;
    var DESKTOP_TARGET_FPS = 60;
    var MOBILE_TARGET_FPS = 30;
    var REDUCED_MOTION_TARGET_FPS = 30;
    var POINTER_TRAIL_COUNT = 6;

    // Shadertoy Image pass source for https://www.shadertoy.com/view/tXKfz1.
    var IMAGE_PASS_SOURCE = `
// just unrolled the loop, i guess we only need 3 layers
// to get some nice clouds :D
#define N(a) abs(dot(sin(iTime+.1*p.z+.3*p / a), vec3(a+a)))
#define NUM_LAYERS 7.
#define TAU 6.28318
#define PI 3.141592
#define Velocity .025 //modified value to increse or decrease speed, negative value travel backwards
#define StarGlow 0.025
#define StarSize 02.
#define CanvasView 20.


float Star(vec2 uv, float flare){
    float d = length(uv);
    float m = sin(StarGlow*1.2)/d;
    float rays = max(0., .5-abs(uv.x*uv.y*1000.));
    m += (rays*flare)*2.;
    m *= smoothstep(1., .1, d);
    return m;
}

float Hash21(vec2 p){
    p = fract(p*vec2(123.34, 456.21));
    p += dot(p, p+45.32);
    return fract(p.x*p.y);
}


vec3 StarLayer(vec2 uv){
    vec3 col = vec3(0);
    vec2 gv = fract(uv);
    vec2 id = floor(uv);
    for(int y=-1;y<=1;y++){
        for(int x=-1; x<=1; x++){
            vec2 offs = vec2(x,y);
            float n = Hash21(id+offs);
            float size = fract(n);
            float star = Star(gv-offs-vec2(n, fract(n*34.))+.5, smoothstep(.1,.9,size)*.46);
            vec3 color = sin(vec3(.2,.3,.9)*fract(n*2345.2)*TAU)*.25+.75;
            color = color*vec3(.9,.59,.9+size);
            star *= sin(iTime*.6+n*TAU)*.5+.5;
            col += star*size*color;
        }
    }
    return col;
}


void mainImage(out vec4 o, vec2 u) {
    o = vec4(0);
    float i = 0., s = 0.;
    vec3 p = vec3(0), r = iResolution;

   vec4 o2=vec4(0);
    vec2 F =u;

    vec2 uv = (u-.5*iResolution.xy)/iResolution.y;
	vec2 M = vec2(0);

    float t = iTime*.0;
    vec3 col = vec3(0);
    for(float i=0.; i<1.; i+=1./NUM_LAYERS){
        float depth = fract(i+t);
        float scale = mix(CanvasView, .5, depth);
        float fade = depth*smoothstep(1.,.9,depth);
        col += StarLayer(uv*scale+i*453.2-iTime*.05+M)*fade;}



    u = (u+u-r.xy)/r.y;


    o *= i;
    for(int rayStep=0; rayStep<72; rayStep++) {
        i += 1.;
        p += vec3(u * s, s);
        s = 6.+(p.y);
        s -= N(.08);
        s -= N(.2);
        s -= N(.6);
        s = .1 + abs(s)*.2;
        o +=  vec4(4,2,1,0)/s;
    }

       // Если нужно обрезать края кадра (как было в оригинале .8)
    o *= smoothstep(0.8, 0.75, abs(u.y));

    vec2 R = iResolution.xy;
    o2-=o2;
    float t2 = -iTime*.005;
    float d = 0.;
    for(float i = 0. ; i > -1.; i -= .075 )
    {   d = fract( i -3.*t2 );
        vec4 c = vec4( ( F - R *.5 ) / R.y *d ,i,0 ) * 28.;
        for (int j=0 ; j <18; j++ )
            c.xzyw = abs( c / max(dot(c,c), 1e-4)
                    -vec4( 7.-.2*sin(t2) , 6.3 , .7 , 1.-cos(t2/.8))/7.);
       o2 -= c * c.yzww  * d--*d  / vec4(3,5,1,1);
    }
  o+=o2;

    o = tanh(o / 2e3 / length(u));

    // Создаем плавную маску для звезд:
    // Начинают появляться при u.y = -0.4, полностью видны при u.y = 0.1
    float starMask = smoothstep(-0.4, 0.1, u.y);

    // Мягко добавляем звезды к результату
    o.rgb += col * starMask*o2.xyz*12.;



}
`;

    var debugMatch = /(?:[?&])heroDebug(?:=([^&]*))?/.exec(window.location.search);
    var heroDebug = debugMatch ? decodeURIComponent(debugMatch[1] || '1') : '';
    var debugState = heroDebug ? (canvas.__heroBgDebug = {
        mode: heroDebug,
        frame: 0,
        inView: false,
        size: [0, 0],
        centerPixel: null,
        samplePixels: null,
        glError: 0,
        webglVersion: 'webgl1',
        status: 'initializing'
    }) : null;

    function publishDebugState() {
        if (debugState) canvas.setAttribute('data-hero-bg-debug', JSON.stringify(debugState));
    }
    publishDebugState();

    var DEBUG_SOLID_SOURCE = `
void mainImage(out vec4 o, vec2 u) {
    vec2 uv = u / iResolution.xy;
    o = vec4(uv.x, uv.y, 1.0 - uv.x, 1.0);
}
`;

    var SHADERTOY_PASSES = [
        {
            name: 'Image',
            kind: 'image',
            source: heroDebug === 'solid' ? DEBUG_SOLID_SOURCE : IMAGE_PASS_SOURCE,
            channels: []
        }
    ];

    var VERTEX_SOURCE = `
attribute vec2 aPosition;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

    function fragmentSource(body) {
        return `
precision highp float;
precision highp int;

uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform int iFrame;
uniform vec4 iMouse;
uniform vec4 iPointer;
uniform vec4 iPointerTrail[6];
uniform vec4 iDate;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
uniform vec3 iChannelResolution[4];

float shadertoyTanh(float x) {
    x = clamp(x, -10.0, 10.0);
    float e = exp(2.0 * x);
    return (e - 1.0) / (e + 1.0);
}

vec2 shadertoyTanh(vec2 x) {
    x = clamp(x, vec2(-10.0), vec2(10.0));
    vec2 e = exp(2.0 * x);
    return (e - vec2(1.0)) / (e + vec2(1.0));
}

vec3 shadertoyTanh(vec3 x) {
    x = clamp(x, vec3(-10.0), vec3(10.0));
    vec3 e = exp(2.0 * x);
    return (e - vec3(1.0)) / (e + vec3(1.0));
}

vec4 shadertoyTanh(vec4 x) {
    x = clamp(x, vec4(-10.0), vec4(10.0));
    vec4 e = exp(2.0 * x);
    return (e - vec4(1.0)) / (e + vec4(1.0));
}

` + sanitizeShaderBody(body) + `

float readableLightScale(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float centerColumn = 1.0 - smoothstep(0.16, 0.39, abs(uv.x - 0.5));
    float titleBand = smoothstep(0.28, 0.39, uv.y) * (1.0 - smoothstep(0.62, 0.74, uv.y));
    return mix(1.0, 0.52, centerColumn * titleBand);
}

vec4 pointerMasksForPoint(vec2 fragCoord, vec2 pointer, float strength, float trailAmount) {
    if (strength <= 0.001) return vec4(0.0);

    float unit = iResolution.y;
    float readable = readableLightScale(fragCoord);
    float coreRadius = mix(0.115, 0.080, trailAmount) * unit;
    float haloRadius = mix(0.270, 0.210, trailAmount) * unit;
    float ambientRadius = mix(0.420, 0.300, trailAmount) * unit;

    float dist = length(fragCoord - pointer);
    float coreGlow = smoothstep(coreRadius, 0.0, dist) * 0.38;
    float haloGlow = smoothstep(haloRadius, 0.0, dist) * 0.31;
    float ambientGlow = smoothstep(ambientRadius, 0.0, dist) * 0.085;
    float trailScale = mix(1.0, 0.38, trailAmount);
    float glow = min(0.74, coreGlow + haloGlow + ambientGlow) * strength * readable * trailScale;
    float clarity = smoothstep(mix(0.23, 0.16, trailAmount) * unit, 0.0, dist) * strength * readable * mix(0.64, 0.23, trailAmount);
    float starIgnite = (smoothstep(0.230 * unit, 0.0, dist) * 0.48
        + smoothstep(0.112 * unit, 0.0, dist) * 0.24) * strength * readable * mix(1.0, 0.30, trailAmount);
    float cloudIgnite = (smoothstep(0.295 * unit, 0.0, dist) * 0.27
        + smoothstep(0.165 * unit, 0.0, dist) * 0.12) * strength * readable * mix(0.72, 0.22, trailAmount);

    return vec4(glow, clarity, starIgnite, cloudIgnite);
}

vec4 pointerMasks(vec2 fragCoord) {
    vec4 masks = pointerMasksForPoint(fragCoord, iPointer.xy, iPointer.z, 0.0);

    for (int i = 0; i < 6; i++) {
        vec4 trail = iPointerTrail[i];
        float ageFade = smoothstep(1.0, 0.0, clamp(trail.w, 0.0, 1.0));
        masks += pointerMasksForPoint(fragCoord, trail.xy, trail.z * ageFade, 1.0);
    }

    return min(masks, vec4(0.78, 0.50, 0.64, 0.40));
}

vec3 coolGrade(vec3 raw) {
    float luma = dot(raw, vec3(0.299, 0.587, 0.114));
    float cloud = smoothstep(0.026, 0.19, luma);
    vec3 shadow = vec3(0.006, 0.010, 0.048);
    vec3 deepBlue = vec3(0.030, 0.070, 0.230);
    vec3 blue = vec3(0.120, 0.280, 0.760);
    vec3 pearl = vec3(0.880, 0.940, 1.000);

    vec3 grade = mix(shadow, deepBlue, smoothstep(0.012, 0.16, luma));
    grade = mix(grade, blue, smoothstep(0.14, 0.52, luma) * 0.58);
    grade = mix(grade, pearl, cloud * 0.82);
    grade += vec3(0.018, 0.034, 0.082) * smoothstep(0.05, 0.42, raw.b);
    return clamp(grade, 0.0, 1.0);
}

vec3 starfieldGrade(vec3 raw) {
    float luma = dot(raw, vec3(0.299, 0.587, 0.114));
    vec3 shadow = vec3(0.014, 0.018, 0.060);
    vec3 violet = vec3(0.100, 0.070, 0.300);
    vec3 blue = vec3(0.150, 0.300, 0.780);
    vec3 pearl = vec3(0.700, 0.820, 1.000);

    vec3 grade = mix(shadow, violet, smoothstep(0.02, 0.42, luma));
    grade = mix(grade, blue, smoothstep(0.24, 0.82, luma));
    grade += vec3(0.055, 0.020, 0.170) * smoothstep(0.08, 0.62, raw.r);
    grade += vec3(0.015, 0.095, 0.220) * smoothstep(0.05, 0.46, raw.g);
    grade += pearl * luma * luma * 0.34;
    return clamp(grade, 0.0, 1.0);
}

void main() {
    vec4 color = vec4(0.0);
    mainImage(color, gl_FragCoord.xy);
    vec4 masks = pointerMasks(gl_FragCoord.xy);
    float glow = masks.x;
    float clarity = masks.y;
    float starIgnite = masks.z;
    float cloudIgnite = masks.w;
    vec3 raw = clamp(color.rgb, 0.0, 1.0);
    float luma = dot(raw, vec3(0.299, 0.587, 0.114));
    float cloud = smoothstep(0.024, 0.18, luma);
    vec2 uvN = gl_FragCoord.xy / iResolution.xy;
    float cloudEdgeNoise = sin(uvN.x * 17.0 + iTime * 0.10) * 0.035
        + sin((uvN.x + uvN.y) * 31.0 - iTime * 0.07) * 0.022;
    float bottomDissolve = smoothstep(-0.03, 0.26, uvN.y + cloudEdgeNoise);
    float cloudFloor = (1.0 - smoothstep(0.00, 0.34, uvN.y + cloudEdgeNoise * 0.55)) * 0.46;
    float cloudBand = (1.0 - smoothstep(0.46 * iResolution.y, 0.73 * iResolution.y, gl_FragCoord.y)) * max(bottomDissolve, cloudFloor);
    float cloudMask = max(cloud * cloudBand, cloudFloor * 0.22);
    float skyRegion = smoothstep(0.28 * iResolution.y, 0.58 * iResolution.y, gl_FragCoord.y);
    vec3 cloudRaw = coolGrade(raw);
    vec3 coolRaw = mix(cloudRaw, starfieldGrade(raw), skyRegion * (1.0 - cloudMask * 0.85));
    vec3 frostTone = vec3(0.006, 0.012, 0.052);
    vec3 pearlCloud = vec3(0.850, 0.920, 1.000);
    vec3 frosted = mix(frostTone, coolRaw * 0.34, 0.54);
    frosted = mix(frosted, pearlCloud * (0.20 + luma * 1.18), cloudMask * 0.52);
    frosted *= mix(0.58, 0.94, cloudMask);
    float starMask = skyRegion * (1.0 - cloudMask * 0.82);
    frosted = mix(frosted, starfieldGrade(raw) * 0.78 + vec3(0.004, 0.016, 0.070), starMask * 0.62);
    float skyLens = glow * starMask * (1.0 - cloudMask * 0.76);
    float lensRim = skyLens * (1.0 - clarity) * smoothstep(0.08, 0.58, glow);

    vec3 focused = coolRaw * (1.08 + glow * 0.32) + vec3(0.018, 0.030, 0.088);
    focused = mix(focused, pearlCloud * (0.48 + luma * 1.42), cloudMask * 0.46);
    focused += vec3(0.110, 0.170, 0.380) * glow;

    vec3 lit = mix(frosted, focused, clarity);
    float starLift = starMask * smoothstep(0.010, 0.20, luma);
    lit += starfieldGrade(raw) * starLift * 0.30 + vec3(0.004, 0.014, 0.052) * starMask * 0.25;
    float existingStar = starMask * (1.0 - cloudMask * 0.82) * smoothstep(0.016, 0.17, luma);
    float twinkle = 0.84 + 0.16 * sin(iTime * 3.7 + sin(dot(gl_FragCoord.xy, vec2(0.013, 0.029))) * 6.28318);
    vec3 igniteTone = mix(vec3(0.18, 0.30, 0.86), vec3(0.62, 0.74, 1.00), twinkle);
    lit += igniteTone * existingStar * starIgnite * (0.34 + twinkle * 0.18);
    lit += vec3(0.035, 0.070, 0.200) * starIgnite * starMask * 0.34;
    lit += vec3(0.038, 0.060, 0.190) * skyLens * 0.74;
    lit += vec3(0.050, 0.024, 0.135) * lensRim;
    float coolIgniteZone = starIgnite * starMask * (1.0 - cloudMask * 0.65);
    vec3 cooledIgnition = vec3(lit.r * 0.82, lit.g * 0.92, max(lit.b, lit.g * 1.10));
    lit = mix(lit, cooledIgnition, coolIgniteZone * 0.18);
    float cloudEdge = smoothstep(0.045, 0.34, cloudMask) * (1.0 - smoothstep(0.62, 0.98, cloudMask));
    float cloudSilver = cloudIgnite * cloudEdge * (0.80 + 0.20 * sin(uvN.x * 23.0 + uvN.y * 15.0 - iTime * 0.32));
    lit = mix(lit, pearlCloud * (0.43 + luma * 1.06), cloudIgnite * cloudMask * 0.19);
    lit += vec3(0.085, 0.120, 0.165) * cloudSilver;
    float lowMist = 1.0 - smoothstep(-0.04, 0.42, uvN.y + cloudEdgeNoise * 0.42);
    lowMist *= 0.50 + 0.24 * sin(uvN.x * 19.0 - iTime * 0.05);
    lit += vec3(0.165, 0.185, 0.235) * max(lowMist, 0.0);
    lit += vec3(0.030, 0.046, 0.132) * glow * (1.0 - clarity);
    lit = lit / (vec3(1.0) + max(lit - vec3(0.82), vec3(0.0)) * 0.72);
    gl_FragColor = vec4(lit, 1.0);
}
`;
    }

    function sanitizeShaderBody(source) {
        return source
            .replace(/^\s*#version\s+.*$/gm, '')
            .replace(/^\s*precision\s+(lowp|mediump|highp)\s+(float|int)\s*;\s*$/gm, '')
            .replace(/^\s*out\s+vec4\s+\w+\s*;\s*$/gm, '')
            .replace(/\btexture\s*\(/g, 'texture2D(')
            .replace(/\btanh\s*\(/g, 'shadertoyTanh(');
    }

    function isSmallViewport(cssWidth, cssHeight) {
        var viewport = window.visualViewport;
        var visualW = viewport && viewport.width ? viewport.width : (window.innerWidth || cssWidth);
        var visualH = viewport && viewport.height ? viewport.height : (window.innerHeight || cssHeight);
        var screenW = window.screen && window.screen.width ? window.screen.width : visualW;
        var screenH = window.screen && window.screen.height ? window.screen.height : visualH;
        return Math.min(visualW, visualH, screenW, screenH) < 720;
    }

    function renderScaleFor(cssWidth, cssHeight) {
        var smallScreen = isSmallViewport(cssWidth, cssHeight);
        var cap = smallScreen ? 0.75 : 1.25;
        var scale = Math.min(window.devicePixelRatio || 1, cap);
        var pixelBudget = smallScreen ? 900000 : 1200000;
        var pixels = Math.max(1, cssWidth * scale) * Math.max(1, cssHeight * scale);

        if (pixels > pixelBudget) {
            scale *= Math.sqrt(pixelBudget / pixels);
        }
        return Math.max(0.45, scale);
    }

    function targetFrameInterval(cssWidth, cssHeight) {
        var fps = reduceMotionQuery.matches
            ? REDUCED_MOTION_TARGET_FPS
            : (isSmallViewport(cssWidth, cssHeight) ? MOBILE_TARGET_FPS : DESKTOP_TARGET_FPS);
        return 1000 / fps;
    }

    function getWebGL(canvasEl) {
        var attributes = {
            alpha: true,
            antialias: false,
            depth: false,
            stencil: false,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            powerPreference: 'high-performance'
        };
        return canvasEl.getContext('webgl', attributes) ||
            canvasEl.getContext('experimental-webgl', attributes);
    }

    function compileShader(gl, type, source, label) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            var info = gl.getShaderInfoLog(shader) || 'unknown shader compile error';
            gl.deleteShader(shader);
            throw new Error(label + ': ' + info);
        }
        return shader;
    }

    function createProgram(gl, pass) {
        var vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SOURCE, pass.name + ' vertex');
        var fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource(pass.source), pass.name + ' fragment');
        var program = gl.createProgram();
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            var info = gl.getProgramInfoLog(program) || 'unknown program link error';
            gl.deleteProgram(program);
            throw new Error(pass.name + ': ' + info);
        }
        return program;
    }

    function collectLocations(gl, program) {
        return {
            aPosition: gl.getAttribLocation(program, 'aPosition'),
            iResolution: gl.getUniformLocation(program, 'iResolution'),
            iTime: gl.getUniformLocation(program, 'iTime'),
            iTimeDelta: gl.getUniformLocation(program, 'iTimeDelta'),
            iFrame: gl.getUniformLocation(program, 'iFrame'),
            iMouse: gl.getUniformLocation(program, 'iMouse'),
            iPointer: gl.getUniformLocation(program, 'iPointer'),
            iPointerTrail: gl.getUniformLocation(program, 'iPointerTrail[0]'),
            iDate: gl.getUniformLocation(program, 'iDate'),
            iChannelResolution: gl.getUniformLocation(program, 'iChannelResolution'),
            channels: [
                gl.getUniformLocation(program, 'iChannel0'),
                gl.getUniformLocation(program, 'iChannel1'),
                gl.getUniformLocation(program, 'iChannel2'),
                gl.getUniformLocation(program, 'iChannel3')
            ]
        };
    }

    function verifyShaders() {
        var probe = document.createElement('canvas');
        probe.width = 4;
        probe.height = 4;
        var gl = getWebGL(probe);
        if (!gl) return { ok: false, reason: 'WebGL 1.0 is not available' };
        try {
            for (var i = 0; i < SHADERTOY_PASSES.length; i++) {
                var program = createProgram(gl, SHADERTOY_PASSES[i]);
                gl.deleteProgram(program);
            }
            var lose = gl.getExtension('WEBGL_lose_context');
            if (lose) lose.loseContext();
            return { ok: true };
        } catch (err) {
            var loseCtx = gl.getExtension('WEBGL_lose_context');
            if (loseCtx) loseCtx.loseContext();
            return { ok: false, reason: err.message };
        }
    }

    function createTexture(gl, width, height, pixels) {
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels || null);
        return tex;
    }

    function createNoiseTexture(gl) {
        var size = 256;
        var data = new Uint8Array(size * size * 4);
        for (var i = 0; i < size * size; i++) {
            var v = Math.floor(Math.random() * 256);
            data[i * 4 + 0] = v;
            data[i * 4 + 1] = Math.floor(Math.random() * 256);
            data[i * 4 + 2] = Math.floor(Math.random() * 256);
            data[i * 4 + 3] = 255;
        }
        return createTexture(gl, size, size, data);
    }

    function createTarget(gl, width, height) {
        var texture = createTexture(gl, width, height, null);
        var fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
            throw new Error('Framebuffer is incomplete');
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return { texture: texture, fbo: fbo, width: width, height: height };
    }

    function createPingPong(gl, width, height) {
        return {
            read: createTarget(gl, width, height),
            write: createTarget(gl, width, height)
        };
    }

    function destroyTarget(gl, target) {
        if (!target) return;
        if (target.texture) gl.deleteTexture(target.texture);
        if (target.fbo) gl.deleteFramebuffer(target.fbo);
    }

    function makeRuntime(gl) {
        var compiled = SHADERTOY_PASSES.map(function (pass) {
            var program = createProgram(gl, pass);
            return {
                def: pass,
                program: program,
                locations: collectLocations(gl, program),
                target: null
            };
        });

        var fullscreenBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
             3, -1,
            -1,  3
        ]), gl.STATIC_DRAW);

        var blankTexture = createTexture(gl, 1, 1, new Uint8Array([0, 0, 0, 255]));
        var noiseTexture = createNoiseTexture(gl);
        var W = 1;
        var H = 1;
        var dpr = 1;
        var frame = 0;
        var startMs = performance.now();
        var lastMs = startMs;
        var lastDrawMs = 0;
        var rafId = null;
        var running = false;
        var inView = false;
        var mouse = [0, 0, 0, 0];
        var channelResValues = new Float32Array(12);
        var pointerTrailValues = new Float32Array(POINTER_TRAIL_COUNT * 4);
        var pointer = {
            x: 0,
            y: 0,
            strength: 0,
            targetX: 0,
            targetY: 0,
            targetStrength: 0,
            hasInput: false
        };
        var pointerTrail = [];
        for (var trailInit = 0; trailInit < POINTER_TRAIL_COUNT; trailInit++) {
            pointerTrail.push({ x: 0, y: 0, strength: 0, age: 1 });
        }
        var pointerTrailCursor = 0;
        var lastTrailX = 0;
        var lastTrailY = 0;
        var lastTrailMs = 0;
        if (debugState) {
            debugState.status = 'runtime-ready';
            publishDebugState();
        }

        function resizeTargets(width, height) {
            compiled.forEach(function (pass) {
                if (pass.def.kind !== 'buffer') return;
                if (pass.target) {
                    destroyTarget(gl, pass.target.read);
                    destroyTarget(gl, pass.target.write);
                }
                pass.target = createPingPong(gl, width, height);
            });
        }

        function resize() {
            var rect = canvas.getBoundingClientRect();
            var nextW = Math.max(1, rect.width);
            var nextH = Math.max(1, rect.height);
            var nextDpr = renderScaleFor(nextW, nextH);
            var pixelW = Math.max(1, Math.round(nextW * nextDpr));
            var pixelH = Math.max(1, Math.round(nextH * nextDpr));

            if (canvas.width !== pixelW || canvas.height !== pixelH) {
                canvas.width = pixelW;
                canvas.height = pixelH;
                W = pixelW;
                H = pixelH;
                dpr = nextDpr;
                resizeTargets(W, H);
                if (debugState) {
                    debugState.size = [W, H];
                    publishDebugState();
                }
            }
        }

        function channelTexture(channel) {
            if (!channel) return blankTexture;
            if (channel === 'noise') return noiseTexture;
            if (typeof channel === 'string') {
                for (var i = 0; i < compiled.length; i++) {
                    if (compiled[i].def.name === channel && compiled[i].target) {
                        return compiled[i].target.read.texture;
                    }
                }
            }
            return blankTexture;
        }

        function channelResolution(channel) {
            if (!channel) return [1, 1, 1];
            if (channel === 'noise') return [256, 256, 1];
            if (typeof channel === 'string') {
                for (var i = 0; i < compiled.length; i++) {
                    if (compiled[i].def.name === channel && compiled[i].target) {
                        return [compiled[i].target.read.width, compiled[i].target.read.height, 1];
                    }
                }
            }
            return [1, 1, 1];
        }

        function setCommonUniforms(pass, now, delta) {
            var loc = pass.locations;
            var channels = pass.def.channels || [];

            if (loc.iResolution) gl.uniform3f(loc.iResolution, W, H, 1);
            if (loc.iTime) gl.uniform1f(loc.iTime, now);
            if (loc.iTimeDelta) gl.uniform1f(loc.iTimeDelta, delta);
            if (loc.iFrame) gl.uniform1i(loc.iFrame, frame);
            if (loc.iMouse) gl.uniform4f(loc.iMouse, mouse[0], mouse[1], mouse[2], mouse[3]);
            if (loc.iPointer) gl.uniform4f(loc.iPointer, pointer.x, pointer.y, pointer.strength, 0);
            if (loc.iPointerTrail) {
                for (var trailIndex = 0; trailIndex < POINTER_TRAIL_COUNT; trailIndex++) {
                    var trail = pointerTrail[trailIndex];
                    var baseIndex = trailIndex * 4;
                    pointerTrailValues[baseIndex] = trail.x;
                    pointerTrailValues[baseIndex + 1] = trail.y;
                    pointerTrailValues[baseIndex + 2] = trail.strength;
                    pointerTrailValues[baseIndex + 3] = trail.age;
                }
                gl.uniform4fv(loc.iPointerTrail, pointerTrailValues);
            }
            if (loc.iDate) {
                var date = new Date();
                var seconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds() + date.getMilliseconds() / 1000;
                gl.uniform4f(loc.iDate, date.getFullYear(), date.getMonth() + 1, date.getDate(), seconds);
            }

            if (loc.iChannelResolution || loc.channels[0] || loc.channels[1] || loc.channels[2] || loc.channels[3]) {
                for (var i = 0; i < 4; i++) {
                    var ch = channels[i] || null;
                    if (loc.channels[i]) {
                        gl.activeTexture(gl.TEXTURE0 + i);
                        gl.bindTexture(gl.TEXTURE_2D, channelTexture(ch));
                        gl.uniform1i(loc.channels[i], i);
                    }
                    if (loc.iChannelResolution) {
                        var res = channelResolution(ch);
                        var base = i * 3;
                        channelResValues[base] = res[0];
                        channelResValues[base + 1] = res[1];
                        channelResValues[base + 2] = res[2];
                    }
                }
                if (loc.iChannelResolution) gl.uniform3fv(loc.iChannelResolution, channelResValues);
            }
        }

        function render(timestamp, singleFrame) {
            if (!singleFrame) {
                var minFrameMs = targetFrameInterval(canvas.clientWidth || W, canvas.clientHeight || H) * 0.9;
                if (lastDrawMs && timestamp - lastDrawMs < minFrameMs) {
                    if (running) rafId = requestAnimationFrame(render);
                    return;
                }
                lastDrawMs = timestamp;
            }

            resize();

            var reduceMotion = reduceMotionQuery.matches;
            var rawElapsed = (timestamp - startMs) / 1000;
            var rawDelta = Math.min(0.05, Math.max(0, (timestamp - lastMs) / 1000));
            var elapsed = reduceMotion ? REDUCED_MOTION_TIME + rawElapsed * REDUCED_MOTION_SPEED : rawElapsed;
            var delta = reduceMotion ? rawDelta * REDUCED_MOTION_SPEED : rawDelta;
            lastMs = timestamp;
            updatePointer(rawDelta);

            try {
                for (var i = 0; i < compiled.length; i++) {
                    var pass = compiled[i];
                    var isBuffer = pass.def.kind === 'buffer';
                    gl.useProgram(pass.program);
                    gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenBuffer);
                    if (pass.locations.aPosition >= 0) {
                        gl.enableVertexAttribArray(pass.locations.aPosition);
                        gl.vertexAttribPointer(pass.locations.aPosition, 2, gl.FLOAT, false, 0, 0);
                    }

                    if (isBuffer) {
                        gl.bindFramebuffer(gl.FRAMEBUFFER, pass.target.write.fbo);
                    } else {
                        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                    }
                    gl.viewport(0, 0, W, H);
                    setCommonUniforms(pass, elapsed, delta);
                    gl.drawArrays(gl.TRIANGLES, 0, 3);

                    if (isBuffer) {
                        var swap = pass.target.read;
                        pass.target.read = pass.target.write;
                        pass.target.write = swap;
                    }
                }
                frame++;
                if (debugState) {
                    var pixel = new Uint8Array(4);
                    var samples = [];
                    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                    gl.readPixels(Math.floor(W * 0.5), Math.floor(H * 0.5), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
                    [[0.25, 0.25], [0.5, 0.25], [0.75, 0.25], [0.25, 0.5], [0.5, 0.5], [0.75, 0.5], [0.25, 0.75], [0.5, 0.75], [0.75, 0.75]].forEach(function (p) {
                        var sp = new Uint8Array(4);
                        gl.readPixels(Math.floor(W * p[0]), Math.floor(H * p[1]), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, sp);
                        samples.push([p[0], p[1], sp[0], sp[1], sp[2], sp[3]]);
                    });
                    debugState.frame = frame;
                    debugState.centerPixel = [pixel[0], pixel[1], pixel[2], pixel[3]];
                    debugState.samplePixels = samples;
                    debugState.glError = gl.getError();
                    debugState.status = 'rendered';
                    publishDebugState();
                }
            } catch (err) {
                stop();
                if (debugState) {
                    debugState.status = 'runtime-error';
                    debugState.error = err && err.message ? err.message : String(err);
                    publishDebugState();
                }
                console.error('[hero-bg] WebGL runtime failed:', err);
                startCanvasFallback();
                return;
            }

            if (running && !singleFrame) {
                rafId = requestAnimationFrame(render);
            }
        }

        function start() {
            if (running || document.hidden || !inView) return;
            running = true;
            lastMs = performance.now();
            lastDrawMs = 0;
            rafId = requestAnimationFrame(render);
        }

        function stop() {
            running = false;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        function renderStatic() {
            stop();
            render(performance.now(), true);
        }

        function canvasPoint(clientX, clientY) {
            var rect = canvas.getBoundingClientRect();
            var x = (clientX - rect.left) * dpr;
            var y = (rect.bottom - clientY) * dpr;
            return [
                Math.max(0, Math.min(W, x)),
                Math.max(0, Math.min(H, y))
            ];
        }

        function pointInsideCanvas(clientX, clientY) {
            var rect = canvas.getBoundingClientRect();
            return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
        }

        function setPointerTarget(clientX, clientY) {
            if (!pointInsideCanvas(clientX, clientY)) {
                pointer.targetStrength = 0;
                return;
            }

            var p = canvasPoint(clientX, clientY);
            if (pointer.hasInput) {
                pushPointerTrail(pointer.x, pointer.y, false);
            }
            pointer.targetX = p[0];
            pointer.targetY = p[1];
            pointer.targetStrength = 1;
            pointer.x = p[0];
            pointer.y = p[1];
            pointer.strength = 1;
            pointer.hasInput = true;
            lastDrawMs = 0;
        }

        function pushPointerTrail(x, y, force) {
            var now = performance.now();
            var dx = x - lastTrailX;
            var dy = y - lastTrailY;
            var minDistance = Math.max(18, 26 * dpr);
            if (!force && now - lastTrailMs < 38 && dx * dx + dy * dy < minDistance * minDistance) {
                return;
            }

            var trail = pointerTrail[pointerTrailCursor];
            trail.x = x;
            trail.y = y;
            trail.strength = 0.28;
            trail.age = 0;
            pointerTrailCursor = (pointerTrailCursor + 1) % POINTER_TRAIL_COUNT;
            lastTrailX = x;
            lastTrailY = y;
            lastTrailMs = now;
        }

        function fadePointerTarget() {
            if (pointer.hasInput) {
                pushPointerTrail(pointer.x, pointer.y, true);
            }
            pointer.targetStrength = 0;
            lastDrawMs = 0;
        }

        function updatePointer(delta) {
            var dt = Math.min(0.08, Math.max(0.001, delta || 0.016));
            var strengthRate = pointer.targetStrength > pointer.strength ? 24 : 1.55;
            var strengthEase = 1 - Math.exp(-dt * strengthRate);

            pointer.strength += (pointer.targetStrength - pointer.strength) * strengthEase;

            if (pointer.strength < 0.001 && pointer.targetStrength <= 0) {
                pointer.strength = 0;
            }

            for (var i = 0; i < POINTER_TRAIL_COUNT; i++) {
                var trail = pointerTrail[i];
                if (trail.strength <= 0.001) {
                    trail.strength = 0;
                    trail.age = 1;
                    continue;
                }
                trail.age = Math.min(1, trail.age + dt * 0.95);
                trail.strength += (0 - trail.strength) * (1 - Math.exp(-dt * 2.35));
            }
        }

        function updateMouse(clientX, clientY, pressed) {
            var p = canvasPoint(clientX, clientY);
            mouse[0] = p[0];
            mouse[1] = p[1];
            if (pressed) {
                mouse[2] = p[0];
                mouse[3] = p[1];
            }
            setPointerTarget(clientX, clientY);
        }

        window.addEventListener('mousemove', function (e) {
            updateMouse(e.clientX, e.clientY, false);
        }, { passive: true });

        window.addEventListener('mousedown', function (e) {
            updateMouse(e.clientX, e.clientY, true);
        }, { passive: true });

        window.addEventListener('touchstart', function (e) {
            if (e.touches.length) updateMouse(e.touches[0].clientX, e.touches[0].clientY, true);
        }, { passive: true });

        window.addEventListener('touchmove', function (e) {
            if (e.touches.length) updateMouse(e.touches[0].clientX, e.touches[0].clientY, false);
        }, { passive: true });

        canvas.addEventListener('mouseleave', fadePointerTarget, { passive: true });

        window.addEventListener('mouseout', function (e) {
            if (!e.relatedTarget) fadePointerTarget();
        }, { passive: true });

        window.addEventListener('touchend', fadePointerTarget, { passive: true });
        window.addEventListener('touchcancel', fadePointerTarget, { passive: true });

        window.addEventListener('resize', function () {
            resize();
            if (!running) renderStatic();
        });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stop();
            else start();
        });

        if (reduceMotionQuery.addEventListener) {
            reduceMotionQuery.addEventListener('change', function () {
                start();
            });
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                inView = entry.isIntersecting;
                if (debugState) {
                    debugState.inView = inView;
                    publishDebugState();
                }
                if (inView) {
                    start();
                } else {
                    stop();
                }
            });
        }, { threshold: 0.05 });

        resize();
        observer.observe(canvas);
        renderStatic();
    }

    function startWebGL() {
        var verified = verifyShaders();
        if (!verified.ok) {
            console.warn('[hero-bg] WebGL shader verification failed; leaving black canvas:', verified.reason);
            startCanvasFallback();
            return;
        }

        var gl = getWebGL(canvas);
        if (!gl) {
            startCanvasFallback();
            return;
        }

        try {
            makeRuntime(gl);
        } catch (err) {
            console.warn('[hero-bg] WebGL init failed; leaving black canvas:', err);
            replaceCanvasForFallback();
            startCanvasFallback();
        }
    }

    function replaceCanvasForFallback() {
        var replacement = canvas.cloneNode(false);
        if (canvas.parentNode) {
            canvas.parentNode.replaceChild(replacement, canvas);
            canvas = replacement;
        }
    }

    function startCanvasFallback() {
        canvas.style.opacity = '1';
        canvas.style.background = '#000';
        canvas.setAttribute('data-hero-bg-error', 'webgl-failed');
        return;

        var ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) {
            replaceCanvasForFallback();
            ctx = canvas.getContext('2d', { alpha: true });
        }
        if (!ctx) return;

        var reduceMotion = reduceMotionQuery.matches;
        var FORCE_RADIUS = 260;
        var TRAIL_MAX = 10;
        var TRAIL_EVERY = 2;
        var STAR_COUNT = 280;
        var LERP_RATE = 0.06;
        var MAX_LINK_DIST = 125;
        var LINK_THRESHOLD = 0.30;
        var DORMANT_MIN = 0.08;
        var DORMANT_MAX = 0.20;
        var GOLD_RATIO = 0.06;

        var W = 0;
        var H = 0;
        var dpr = 1;
        var stars = [];
        var trail = [];
        var mouse = { x: -500, y: -500, active: false };
        var rafId = null;
        var running = false;
        var frameCount = 0;
        var inView = false;

        function resize() {
            var rect = canvas.getBoundingClientRect();
            W = Math.max(1, rect.width);
            H = Math.max(1, rect.height);
            dpr = renderScaleFor(W, H);
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function initStars() {
            stars = [];
            for (var i = 0; i < STAR_COUNT; i++) {
                var isGold = Math.random() < GOLD_RATIO;
                stars.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    baseR: 0.25 + Math.random() * 1.1,
                    r: 0,
                    opacity: DORMANT_MIN + Math.random() * (DORMANT_MAX - DORMANT_MIN),
                    targetOpacity: 0,
                    targetR: 0,
                    vx: (Math.random() - 0.5) * 0.08,
                    vy: (Math.random() - 0.5) * 0.08,
                    phase: Math.random() * Math.PI * 2,
                    twinkle: 0.3 + Math.random() * 0.8,
                    color: isGold ? [255, 210, 138] : [140, 198, 255]
                });
            }
        }

        function getIllumination(sx, sy) {
            var best = 0;
            for (var i = 0; i < trail.length; i++) {
                var weight = 1 - i / trail.length;
                var r = FORCE_RADIUS * (0.4 + 0.6 * weight);
                var dx = sx - trail[i].x;
                var dy = sy - trail[i].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < r) {
                    var raw = 1 - dist / r;
                    var eased = raw * raw * (3 - 2 * raw);
                    best = Math.max(best, eased * weight);
                }
            }
            return best;
        }

        function draw() {
            frameCount++;

            if (!reduceMotion) {
                if (mouse.active && frameCount % TRAIL_EVERY === 0) {
                    trail.unshift({ x: mouse.x, y: mouse.y });
                    if (trail.length > TRAIL_MAX) trail.length = TRAIL_MAX;
                }
                if (!mouse.active && trail.length > 0 && frameCount % 4 === 0) {
                    trail.pop();
                }
            }

            for (var si = 0; si < stars.length; si++) {
                var s = stars[si];
                if (!reduceMotion) {
                    s.x += s.vx;
                    s.y += s.vy;
                    if (s.x < -15) s.x = W + 15; else if (s.x > W + 15) s.x = -15;
                    if (s.y < -15) s.y = H + 15; else if (s.y > H + 15) s.y = -15;
                    s.phase += s.twinkle * 0.02;
                }

                var illum = reduceMotion ? 0 : getIllumination(s.x, s.y);
                var dormant = DORMANT_MIN +
                    (Math.sin(s.phase) * 0.5 + 0.5) * (DORMANT_MAX - DORMANT_MIN);
                s.targetOpacity = dormant + illum * (1 - dormant);
                s.targetR = s.baseR * (1 + illum * 3.0);

                if (!reduceMotion) {
                    s.opacity += (s.targetOpacity - s.opacity) * LERP_RATE;
                    s.r += (s.targetR - s.r) * LERP_RATE;
                } else {
                    s.opacity = DORMANT_MIN;
                    s.r = s.baseR;
                }
            }

            ctx.clearRect(0, 0, W, H);
            var bg = ctx.createRadialGradient(W * 0.50, H * 0.35, 0, W * 0.52, H * 0.40, Math.max(W, H) * 0.85);
            bg.addColorStop(0, '#0b1536');
            bg.addColorStop(0.42, '#060e26');
            bg.addColorStop(1, '#020614');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, W, H);

            var linkers = [];
            for (si = 0; si < stars.length; si++) {
                if (stars[si].opacity > LINK_THRESHOLD) linkers.push(stars[si]);
            }
            if (linkers.length > 1) {
                ctx.globalCompositeOperation = 'lighter';
                for (var i = 0; i < linkers.length; i++) {
                    var a = linkers[i];
                    for (var j = i + 1; j < linkers.length; j++) {
                        var b = linkers[j];
                        var dx = a.x - b.x;
                        var dy = a.y - b.y;
                        var d2 = dx * dx + dy * dy;
                        if (d2 < MAX_LINK_DIST * MAX_LINK_DIST) {
                            var dist = Math.sqrt(d2);
                            var lineAlpha = Math.min(a.opacity, b.opacity) * (1 - dist / MAX_LINK_DIST) * 0.45;
                            if (lineAlpha > 0.006) {
                                ctx.strokeStyle = 'rgba(155,215,255,' + lineAlpha.toFixed(3) + ')';
                                ctx.lineWidth = 0.5 + lineAlpha * 1.0;
                                ctx.beginPath();
                                ctx.moveTo(a.x, a.y);
                                ctx.lineTo(b.x, b.y);
                                ctx.stroke();
                            }
                        }
                    }
                }
                ctx.globalCompositeOperation = 'source-over';
            }

            ctx.globalCompositeOperation = 'lighter';
            for (si = 0; si < stars.length; si++) {
                var s2 = stars[si];
                var alpha = s2.opacity;
                if (alpha < 0.012) continue;
                var r = s2.r;
                var col = s2.color;

                if (alpha > 0.25) {
                    var glowA = alpha * 0.09;
                    ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + glowA.toFixed(3) + ')';
                    ctx.beginPath();
                    ctx.arc(s2.x, s2.y, r * 5.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                if (alpha > 0.16) {
                    var midA = alpha * 0.20;
                    ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + midA.toFixed(3) + ')';
                    ctx.beginPath();
                    ctx.arc(s2.x, s2.y, r * 2.2, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + alpha.toFixed(3) + ')';
                ctx.beginPath();
                ctx.arc(s2.x, s2.y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';

            if (!reduceMotion && trail.length > 0) {
                var cx = trail[0].x;
                var cy = trail[0].y;
                var fog = ctx.createRadialGradient(cx, cy, FORCE_RADIUS * 0.10, cx, cy, Math.max(W, H) * 0.88);
                fog.addColorStop(0, 'rgba(2,6,20,0.03)');
                fog.addColorStop(0.20, 'rgba(2,6,20,0.14)');
                fog.addColorStop(0.50, 'rgba(2,6,20,0.40)');
                fog.addColorStop(1, 'rgba(2,6,20,0.56)');
                ctx.fillStyle = fog;
            } else {
                ctx.fillStyle = 'rgba(2,6,20,0.50)';
            }
            ctx.fillRect(0, 0, W, H);

            if (running) rafId = requestAnimationFrame(draw);
        }

        function start() {
            if (running || reduceMotion || document.hidden || !inView) return;
            running = true;
            rafId = requestAnimationFrame(draw);
        }

        function stop() {
            running = false;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        window.addEventListener('mousemove', function (e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        }, { passive: true });

        window.addEventListener('mouseleave', function () {
            mouse.active = false;
        });

        window.addEventListener('touchmove', function (e) {
            if (e.touches.length) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
                mouse.active = true;
            }
        }, { passive: true });

        window.addEventListener('touchend', function () {
            mouse.active = false;
        });

        window.addEventListener('resize', function () {
            resize();
            initStars();
            if (reduceMotion) draw();
        });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stop();
            else if (!reduceMotion) start();
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                inView = entry.isIntersecting;
                if (inView && !document.hidden) start();
                else stop();
            });
        }, { threshold: 0.05 });

        resize();
        initStars();
        observer.observe(canvas);
        if (reduceMotion) draw();
    }

    startWebGL();
})();
