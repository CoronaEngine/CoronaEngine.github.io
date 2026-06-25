// ================= 赛博星空 · 引路星光芒 + 科技星图网络 + 星际电路基底 =================
// 中心日冕耀斑 + 曼哈顿折角连线 + PCB暗纹 + 流光数据束 + 深紫/金调色
// 纯 Canvas 2D
(function () {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d', { alpha: true });
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== 配置 =====
    var STAR_CX = 0.50, STAR_CY = 0.38; // 引路星中心（标题背后）
    var FLARE_RADIUS_RATIO = 0.55;       // 耀斑半径比例

    var LAYERS = [
        { count: 800,  rMin: 0.02, rMax: 0.12, oMin: 0.008, oMax: 0.05, drift: 0.003, plx: 65 },
        { count: 500,  rMin: 0.06, rMax: 0.30, oMin: 0.015, oMax: 0.12, drift: 0.006, plx: 48 },
        { count: 250,  rMin: 0.22, rMax: 1.20, oMin: 0.04, oMax: 0.26, drift: 0.014, plx: 28 },
        { count: 20,   rMin: 0.90, rMax: 2.50, oMin: 0.08, oMax: 0.38, drift: 0.022, plx: 6 }
    ];

    // 数据流粒子
    var DATA_FLOW_COUNT = 60;
    var CIRCUIT_ALPHA = 0.04; // 电路暗纹透明度

    // ===== 状态 =====
    var W = 0, H = 0, dpr = 1;
    var allStars = [];
    var dataFlows = [];
    var circuitCanvas = null, circuitCtx = null;
    var cursor = { x: 0.5, y: 0.45, active: false };
    var follow = { x: 0.5, y: 0.45 };
    var rafId = null, running = false;
    var time = 0;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        var rect = canvas.getBoundingClientRect();
        W = Math.max(1, rect.width); H = Math.max(1, rect.height);
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildCircuitPattern();
    }

    // ---------- 星际电路暗纹 ----------
    function buildCircuitPattern() {
        if (reduceMotion) return;
        circuitCanvas = document.createElement('canvas');
        circuitCanvas.width = Math.round(W);
        circuitCanvas.height = Math.round(H);
        circuitCtx = circuitCanvas.getContext('2d');

        var cxPx = STAR_CX * W, cyPx = STAR_CY * H;
        var spacing = 55;
        circuitCtx.strokeStyle = 'rgba(140,180,220,0.18)';
        circuitCtx.lineWidth = 0.6;

        // 网格线
        for (var x = spacing; x < W; x += spacing) {
            circuitCtx.beginPath();
            circuitCtx.moveTo(x, 0); circuitCtx.lineTo(x, H);
            circuitCtx.stroke();
        }
        for (var y = spacing; y < H; y += spacing) {
            circuitCtx.beginPath();
            circuitCtx.moveTo(0, y); circuitCtx.lineTo(W, y);
            circuitCtx.stroke();
        }

        // 45° 斜角走线（随机选取一些交叉点做折角）
        circuitCtx.strokeStyle = 'rgba(140,180,220,0.10)';
        circuitCtx.lineWidth = 0.4;
        var randSeed = 42;
        for (var x = spacing; x < W; x += spacing) {
            for (var y = spacing; y < H; y += spacing) {
                randSeed = (randSeed * 16807) % 2147483647;
                if (randSeed / 2147483647 < 0.25) {
                    var dir = Math.floor((randSeed / 2147483647) * 4);
                    var len = spacing * 0.7;
                    circuitCtx.beginPath();
                    circuitCtx.moveTo(x, y);
                    if (dir === 0) { circuitCtx.lineTo(x + len, y - len); }
                    else if (dir === 1) { circuitCtx.lineTo(x + len, y + len); }
                    else if (dir === 2) { circuitCtx.lineTo(x - len, y - len); }
                    else { circuitCtx.lineTo(x - len, y + len); }
                    circuitCtx.stroke();
                }
            }
        }

        // 节点焊盘 (小圆点)
        for (x = spacing; x < W; x += spacing) {
            for (y = spacing; y < H; y += spacing) {
                randSeed = (randSeed * 16807) % 2147483647;
                if (randSeed / 2147483647 < 0.30) {
                    circuitCtx.fillStyle = 'rgba(160,200,235,0.25)';
                    circuitCtx.beginPath();
                    circuitCtx.arc(x, y, 2.2, 0, Math.PI * 2);
                    circuitCtx.fill();
                }
            }
        }

        // 同心圆雷达波纹（引路星中心向外）
        for (var ring = 1; ring <= 5; ring++) {
            var rr = Math.min(W, H) * (0.15 + ring * 0.12);
            circuitCtx.strokeStyle = 'rgba(180,200,230,' + (0.12 - ring * 0.02).toFixed(2) + ')';
            circuitCtx.lineWidth = 0.5;
            circuitCtx.setLineDash([4, 16]);
            circuitCtx.beginPath();
            circuitCtx.arc(cxPx, cyPx, rr, 0, Math.PI * 2);
            circuitCtx.stroke();
            circuitCtx.setLineDash([]);
        }
    }

    // ---------- 星点分布（几何化 + 随机混合） ----------
    function starPos() {
        // 60% 沿网格附近（科技感），40% 随机
        if (Math.random() < 0.55) {
            var gridSpacing = 45 + Math.random() * 80;
            var gx = Math.round(Math.random() * W / gridSpacing) * gridSpacing;
            var gy = Math.round(Math.random() * H / gridSpacing) * gridSpacing;
            return { x: (gx + (Math.random() - 0.5) * gridSpacing * 0.6) / W, y: (gy + (Math.random() - 0.5) * gridSpacing * 0.6) / H };
        }
        return { x: Math.random(), y: Math.random() };
    }

    function initStars() {
        allStars = [];
        for (var li = 0; li < LAYERS.length; li++) {
            var L = LAYERS[li];
            for (var i = 0; i < L.count; i++) {
                var pos = starPos();
                var t = Math.random();
                var baseR = L.rMin + t * t * (L.rMax - L.rMin);
                var baseO = L.oMin + Math.random() * (L.oMax - L.oMin);
                // 距中心越近越亮
                var dx = pos.x - STAR_CX, dy = pos.y - STAR_CY;
                var dist = Math.sqrt(dx * dx + dy * dy);
                var proximityBoost = Math.max(0, 1 - dist / 0.45) * 0.15;
                var isNode = (li >= 2 && baseR > L.rMax * 0.55);
                allStars.push({
                    nx: pos.x, ny: pos.y, x: pos.x * W, y: pos.y * H,
                    baseR: baseR, r: 0, opacity: 0,
                    baseO: baseO + proximityBoost,
                    phase: Math.random() * Math.PI * 2,
                    breatheSpeed: 0.025 + Math.random() * 0.10,
                    breatheAmp: baseO * (0.20 + Math.random() * 0.55),
                    drift: (Math.random() - 0.5) * L.drift * 0.02,
                    layer: li, plx: L.plx,
                    isNode: isNode, // 节点星（参与连线）
                    ring: (isNode && li === 3) // 近层大节点环形光晕
                });
            }
        }

        // 数据流光粒子
        dataFlows = [];
        for (i = 0; i < DATA_FLOW_COUNT; i++) {
            dataFlows.push({
                angle: Math.random() * Math.PI * 2,
                radius: 0.05 + Math.random() * 0.85, // 当前距中心的距离 (0~1)
                speed: 0.0004 + Math.random() * 0.0012,
                alpha: 0.15 + Math.random() * 0.4,
                life: 0, maxLife: 0.6 + Math.random() * 0.4,
                outward: true
            });
        }
    }

    // ---------- 星芒绘制 ----------
    function draw4Point(x, y, r, alpha, cr, cg, cb) {
        var len = r * 5.0, w = r * 0.45;
        ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + alpha.toFixed(3) + ')';
        for (var a = 0; a < 4; a++) {
            var t = a * Math.PI * 0.5, ct = Math.cos(t), st = Math.sin(t);
            ctx.beginPath();
            ctx.moveTo(x - st * w, y + ct * w); ctx.lineTo(x + ct * len, y + st * len); ctx.lineTo(x + st * w, y - ct * w);
            ctx.closePath(); ctx.fill();
        }
        ctx.beginPath(); ctx.arc(x, y, r * 1.0, 0, Math.PI * 2); ctx.fill();
    }

    // ---------- 曼哈顿折角连线 (PCB 走线风格) ----------
    function drawManhattanLink(ax, ay, bx, by, alpha) {
        var midX = (ax + bx) * 0.5;
        ctx.strokeStyle = 'rgba(200,210,235,' + alpha.toFixed(3) + ')';
        ctx.lineWidth = 0.4 + alpha * 0.6;
        ctx.beginPath();
        // 从 A → 水平中点 → 垂直 → B (曼哈顿路由)
        ctx.moveTo(ax, ay);
        ctx.lineTo(midX, ay);
        ctx.lineTo(midX, by);
        ctx.lineTo(bx, by);
        ctx.stroke();
    }

    // ---------- 主循环 ----------
    function draw() {
        time += reduceMotion ? 0 : 0.016;
        var t = time;
        var cxPx = STAR_CX * W, cyPx = STAR_CY * H;
        var flareR = Math.min(W, H) * FLARE_RADIUS_RATIO;

        if (!reduceMotion) {
            var tx = cursor.active ? cursor.x : 0.5 + Math.cos(t * 0.06) * 0.06;
            var ty = cursor.active ? cursor.y : 0.45 + Math.sin(t * 0.08) * 0.04;
            follow.x += (tx - follow.x) * 0.025;
            follow.y += (ty - follow.y) * 0.025;
        }
        var panX = follow.x - 0.5, panY = follow.y - 0.45;

        // -- 深空基底（深紫+藏青） --
        ctx.clearRect(0, 0, W, H);
        var bg = ctx.createRadialGradient(cxPx, cyPx, 0, cxPx, cyPx, Math.max(W, H) * 0.95);
        bg.addColorStop(0, '#100b2e');
        bg.addColorStop(0.15, '#0c0826');
        bg.addColorStop(0.38, '#06041c');
        bg.addColorStop(0.65, '#020212');
        bg.addColorStop(1, '#000008');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        // -- 星际电路暗纹 --
        if (circuitCanvas && !reduceMotion) {
            ctx.save();
            ctx.globalAlpha = CIRCUIT_ALPHA + Math.sin(t * 0.3) * 0.012;
            ctx.drawImage(circuitCanvas, 0, 0);
            ctx.restore();
        } else if (circuitCanvas) {
            ctx.save();
            ctx.globalAlpha = CIRCUIT_ALPHA;
            ctx.drawImage(circuitCanvas, 0, 0);
            ctx.restore();
        }

        // -- 引路星中心耀斑 --
        // 外层大范围柔光
        ctx.globalCompositeOperation = 'lighter';
        var outerFlare = ctx.createRadialGradient(cxPx, cyPx, flareR * 0.08, cxPx, cyPx, flareR * 1.1);
        outerFlare.addColorStop(0, 'rgba(255,210,120,0.25)');
        outerFlare.addColorStop(0.25, 'rgba(220,170,80,0.12)');
        outerFlare.addColorStop(0.55, 'rgba(160,100,50,0.03)');
        outerFlare.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = outerFlare;
        ctx.fillRect(cxPx - flareR, cyPx - flareR, flareR * 2, flareR * 2);

        // 中层金色辉光
        var midFlare = ctx.createRadialGradient(cxPx, cyPx, 0, cxPx, cyPx, flareR * 0.42);
        midFlare.addColorStop(0, 'rgba(255,235,200,0.32)');
        midFlare.addColorStop(0.30, 'rgba(240,200,110,0.14)');
        midFlare.addColorStop(0.65, 'rgba(180,130,50,0.03)');
        midFlare.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = midFlare;
        ctx.fillRect(cxPx - flareR * 0.45, cyPx - flareR * 0.45, flareR * 0.9, flareR * 0.9);

        // 核心炽热白点
        var coreFlare = ctx.createRadialGradient(cxPx, cyPx, 0, cxPx, cyPx, flareR * 0.10);
        coreFlare.addColorStop(0, 'rgba(255,255,250,0.70)');
        coreFlare.addColorStop(0.40, 'rgba(255,230,180,0.25)');
        coreFlare.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = coreFlare;
        ctx.fillRect(cxPx - flareR * 0.12, cyPx - flareR * 0.12, flareR * 0.24, flareR * 0.24);
        ctx.globalCompositeOperation = 'source-over';

        // -- 更新星点 --
        for (var si = 0; si < allStars.length; si++) {
            var s = allStars[si];
            if (!reduceMotion) {
                s.nx += s.drift; s.ny += s.drift * 0.7;
                if (s.nx < -0.06) s.nx = 1.06; else if (s.nx > 1.06) s.nx = -0.06;
                if (s.ny < -0.06) s.ny = 1.06; else if (s.ny > 1.06) s.ny = -0.06;
                s.phase += s.breatheSpeed * 0.012;
            }
            s.x = s.nx * W; s.y = s.ny * H;
            var breathe = Math.sin(s.phase);
            s.opacity = s.baseO + breathe * s.breatheAmp;
            s.r = s.baseR * (1 + breathe * 0.13);
        }

        // -- 科技星图网络（曼哈顿连线） --
        var nodes = [];
        for (si = 0; si < allStars.length; si++) {
            if (allStars[si].isNode && allStars[si].opacity > 0.06) nodes.push(allStars[si]);
        }
        if (nodes.length > 1) {
            ctx.globalCompositeOperation = 'lighter';
            var maxLinkDist = Math.min(W, H) * 0.25;
            for (var i = 0; i < nodes.length; i++) {
                var na = nodes[i];
                var pax = na.x + panX * na.plx;
                var pay = na.y + panY * na.plx * 0.7;
                for (var j = i + 1; j < nodes.length; j++) {
                    var nb = nodes[j];
                    var dx = (na.nx - nb.nx) * W, dy = (na.ny - nb.ny) * H;
                    var d = Math.sqrt(dx * dx + dy * dy);
                    if (d < maxLinkDist) {
                        var linkAlpha = Math.min(na.opacity, nb.opacity) * (1 - d / maxLinkDist) * 0.35;
                        if (linkAlpha > 0.008) {
                            var pbx = nb.x + panX * nb.plx;
                            var pby = nb.y + panY * nb.plx * 0.7;
                            drawManhattanLink(pax, pay, pbx, pby, linkAlpha);
                        }
                    }
                }
            }
            ctx.globalCompositeOperation = 'source-over';
        }

        // -- 绘制星点 --
        for (si = 0; si < allStars.length; si++) {
            var s = allStars[si];
            var ppx = s.x + panX * s.plx;
            var ppy = s.y + panY * s.plx * 0.7;
            if (ppx < -40 || ppx > W + 40 || ppy < -40 || ppy > H + 40) continue;

            var alpha = Math.max(0, Math.min(1, s.opacity));
            if (alpha < 0.002) continue;

            // 距中心距离 → 色温
            var dxc = s.nx - STAR_CX, dyc = s.ny - STAR_CY;
            var dCenter = Math.sqrt(dxc * dxc + dyc * dyc);
            var warmRatio = Math.max(0, 1 - dCenter / 0.50);
            var cr = Math.round(130 + warmRatio * 110);
            var cg = Math.round(170 + warmRatio * 55);
            var cb = Math.round(235 - warmRatio * 100);

            ctx.globalCompositeOperation = 'lighter';

            if (s.ring && alpha > 0.06) {
                // 环形光晕亮星
                ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (alpha * 0.022).toFixed(3) + ')';
                ctx.beginPath(); ctx.arc(ppx, ppy, s.r * 9, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (alpha * 0.07).toFixed(3) + ')';
                ctx.beginPath(); ctx.arc(ppx, ppy, s.r * 3.5, 0, Math.PI * 2); ctx.fill();
                // 光环
                ctx.strokeStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (alpha * 0.35).toFixed(3) + ')';
                ctx.lineWidth = s.r * 0.30;
                ctx.beginPath(); ctx.arc(ppx, ppy, s.r * 6.5, 0, Math.PI * 2); ctx.stroke();
                // 白核
                ctx.fillStyle = 'rgba(255,255,255,' + Math.min(1, alpha * 1.2).toFixed(3) + ')';
                ctx.beginPath(); ctx.arc(ppx, ppy, s.r * 0.50, 0, Math.PI * 2); ctx.fill();
            }
            else if (s.isNode && alpha > 0.04) {
                // 节点星（四芒）
                if (alpha > 0.06) {
                    ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (alpha * 0.04).toFixed(3) + ')';
                    ctx.beginPath(); ctx.arc(ppx, ppy, s.r * 4, 0, Math.PI * 2); ctx.fill();
                }
                draw4Point(ppx, ppy, s.r, alpha, cr, cg, cb);
            }
            else {
                // 普通星点
                if (s.baseR > 0.6 && alpha > 0.08) {
                    ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (alpha * 0.03).toFixed(3) + ')';
                    ctx.beginPath(); ctx.arc(ppx, ppy, s.r * 3.5, 0, Math.PI * 2); ctx.fill();
                }
                if (s.baseR > 0.8 && alpha > 0.10) {
                    ctx.fillStyle = 'rgba(255,255,255,' + (alpha * 0.40).toFixed(3) + ')';
                    ctx.beginPath(); ctx.arc(ppx, ppy, s.r * 0.28, 0, Math.PI * 2); ctx.fill();
                }
                ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + alpha.toFixed(3) + ')';
                ctx.beginPath(); ctx.arc(ppx, ppy, s.r, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';
        }

        // -- 数据流光束 --
        if (!reduceMotion) {
            ctx.globalCompositeOperation = 'lighter';
            for (var di = 0; di < dataFlows.length; di++) {
                var df = dataFlows[di];
                df.life += 0.005;
                if (df.life > df.maxLife) { df.life = 0; df.angle = Math.random() * Math.PI * 2; df.radius = 0.05; df.outward = true; }
                if (df.outward) { df.radius += df.speed; if (df.radius > 0.85) df.outward = false; }
                else { df.radius -= df.speed * 0.5; if (df.radius < 0.05) df.outward = true; }

                var dfx = cxPx + Math.cos(df.angle) * df.radius * Math.min(W, H) * 0.7;
                var dfy = cyPx + Math.sin(df.angle) * df.radius * Math.min(W, H) * 0.5;
                var lifeRatio = df.life / df.maxLife;
                var dfAlpha = df.alpha * (1 - Math.abs(lifeRatio - 0.5) * 2); // 中段最亮

                // 光轨拖尾
                var trailLen = 35;
                var trailX = cxPx + Math.cos(df.angle) * (df.radius - 0.02) * Math.min(W, H) * 0.7;
                var trailY = cyPx + Math.sin(df.angle) * (df.radius - 0.02) * Math.min(W, H) * 0.5;

                var flowGrad = ctx.createRadialGradient(dfx, dfy, 0, dfx, dfy, trailLen);
                flowGrad.addColorStop(0, 'rgba(255,210,120,' + dfAlpha.toFixed(3) + ')');
                flowGrad.addColorStop(0.35, 'rgba(220,170,80,' + (dfAlpha * 0.5).toFixed(3) + ')');
                flowGrad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = flowGrad;
                ctx.fillRect(dfx - trailLen, dfy - trailLen, trailLen * 2, trailLen * 2);
            }
            ctx.globalCompositeOperation = 'source-over';
        }

        // -- 引路星光芒射线 --
        if (!reduceMotion) {
            ctx.globalCompositeOperation = 'lighter';
            var rayCount = 8;
            for (var ri = 0; ri < rayCount; ri++) {
                var rayAngle = (ri / rayCount) * Math.PI * 2 + t * 0.04;
                var rayLen = flareR * (0.55 + Math.sin(t * 0.7 + ri) * 0.30);
                var rayGrad = ctx.createLinearGradient(
                    cxPx + Math.cos(rayAngle) * flareR * 0.08,
                    cyPx + Math.sin(rayAngle) * flareR * 0.08,
                    cxPx + Math.cos(rayAngle) * rayLen,
                    cyPx + Math.sin(rayAngle) * rayLen
                );
                rayGrad.addColorStop(0, 'rgba(255,225,160,0.12)');
                rayGrad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.strokeStyle = rayGrad;
                ctx.lineWidth = 1.5 + Math.sin(t * 0.5 + ri) * 0.5;
                ctx.beginPath();
                ctx.moveTo(cxPx + Math.cos(rayAngle) * flareR * 0.06, cyPx + Math.sin(rayAngle) * flareR * 0.06);
                ctx.lineTo(cxPx + Math.cos(rayAngle) * rayLen, cyPx + Math.sin(rayAngle) * rayLen);
                ctx.stroke();
            }
            ctx.globalCompositeOperation = 'source-over';
        }

        // 暗角
        var vignette = ctx.createRadialGradient(cxPx, cyPx, Math.min(W, H) * 0.30, cxPx, cyPx, Math.max(W, H) * 0.88);
        vignette.addColorStop(0, 'rgba(2,2,10,0)'); vignette.addColorStop(1, 'rgba(2,2,10,0.40)');
        ctx.fillStyle = vignette; ctx.fillRect(0, 0, W, H);

        if (running) rafId = requestAnimationFrame(draw);
    }

    function start() { if (running || reduceMotion) return; running = true; rafId = requestAnimationFrame(draw); }
    function stop()  { running = false; if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

    window.addEventListener('mousemove', function (e) { cursor.x = e.clientX / W; cursor.y = e.clientY / H; cursor.active = true; }, { passive: true });
    window.addEventListener('mouseleave', function () { cursor.active = false; });
    window.addEventListener('touchmove', function (e) { if (e.touches.length) { cursor.x = e.touches[0].clientX / W; cursor.y = e.touches[0].clientY / H; cursor.active = true; } }, { passive: true });
    window.addEventListener('touchend', function () { cursor.active = false; });
    window.addEventListener('resize', function () { resize(); initStars(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (!reduceMotion) start(); });
    var io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting && !document.hidden) start(); else stop(); }); }, { threshold: 0.05 });

    resize(); initStars(); io.observe(canvas);
    if (reduceMotion) draw();
})();
