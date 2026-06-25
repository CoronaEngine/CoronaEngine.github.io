// ================= 赛博星空北极涡 · 引路星 + 光粒子探索者 + 星图网络 =================
// 多层涡旋 + 金/青双色引路星 + 数据星图 + 抽象光粒子人形 + 星际电路
// 纯 Canvas 2D
(function () {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d', { alpha: true });
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== 配置 =====
    var GCX = 0.50, GCY = 0.38;       // 涡旋/引路星中心
    var FLARE_R = 0.50;                // 耀斑半径比
    var REVEAL_R = 360;
    var ACTIVATE = 0.28, DECAY = 0.987;

    // 星层
    var LAYERS = [
        { count: 1400, rMin: 0.015, rMax: 0.10, oMin: 0.003, oMax: 0.035, drift: 0.002, plx: 68, reveal: true,  vortex: 0.88 },
        { count: 700,  rMin: 0.05, rMax: 0.25, oMin: 0.010, oMax: 0.08, drift: 0.005, plx: 52, reveal: true,  vortex: 0.80 },
        { count: 280,  rMin: 0.20, rMax: 1.20, oMin: 0.04, oMax: 0.28, drift: 0.014, plx: 30, reveal: false, vortex: 0.70 },
        { count: 22,   rMin: 0.90, rMax: 2.60, oMin: 0.08, oMax: 0.40, drift: 0.022, plx: 7,  reveal: false, vortex: 0.55 }
    ];

    // ===== 状态 =====
    var W = 0, H = 0, dpr = 1;
    var allStars = [];
    var circuitCanvas = null, circuitCtx = null;
    var explorerPoints = []; // 探索者粒子 [{bx,by,ox,oy}] 骨架坐标+偏移
    var cursor = { x: 0.5, y: 0.45, active: false };
    var followAura = { x: -999, y: -999 }, follow = { x: 0.5, y: 0.45 };
    var rafId = null, running = false;
    var time = 0;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        var rect = canvas.getBoundingClientRect();
        W = Math.max(1, rect.width); H = Math.max(1, rect.height);
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildCircuit();
        buildExplorer();
    }

    // ===== 星际电路暗纹 =====
    function buildCircuit() {
        if (reduceMotion) return;
        circuitCanvas = document.createElement('canvas');
        circuitCanvas.width = Math.round(W); circuitCanvas.height = Math.round(H);
        circuitCtx = circuitCanvas.getContext('2d');
        var sp = 60, cxPx = GCX * W, cyPx = GCY * H;
        // 网格
        circuitCtx.strokeStyle = 'rgba(130,170,215,0.16)'; circuitCtx.lineWidth = 0.5;
        for (var x = sp; x < W; x += sp) { circuitCtx.beginPath(); circuitCtx.moveTo(x, 0); circuitCtx.lineTo(x, H); circuitCtx.stroke(); }
        for (var y = sp; y < H; y += sp) { circuitCtx.beginPath(); circuitCtx.moveTo(0, y); circuitCtx.lineTo(W, y); circuitCtx.stroke(); }
        // 45° 走线 + 焊盘
        var seed = 42;
        circuitCtx.strokeStyle = 'rgba(130,170,215,0.08)'; circuitCtx.lineWidth = 0.35;
        for (x = sp; x < W; x += sp) {
            for (y = sp; y < H; y += sp) {
                seed = (seed * 16807) % 2147483647;
                if (seed / 2147483647 < 0.22) {
                    var len = sp * 0.65, dir = Math.floor((seed / 2147483647) * 4);
                    circuitCtx.beginPath(); circuitCtx.moveTo(x, y);
                    if (dir === 0) circuitCtx.lineTo(x + len, y - len);
                    else if (dir === 1) circuitCtx.lineTo(x + len, y + len);
                    else if (dir === 2) circuitCtx.lineTo(x - len, y - len);
                    else circuitCtx.lineTo(x - len, y + len);
                    circuitCtx.stroke();
                }
                seed = (seed * 16807) % 2147483647;
                if (seed / 2147483647 < 0.25) {
                    circuitCtx.fillStyle = 'rgba(150,190,225,0.22)';
                    circuitCtx.beginPath(); circuitCtx.arc(x, y, 2, 0, Math.PI * 2); circuitCtx.fill();
                }
            }
        }
        // 雷达环
        for (var ri = 1; ri <= 5; ri++) {
            var rr = Math.min(W, H) * (0.14 + ri * 0.11);
            circuitCtx.strokeStyle = 'rgba(170,195,225,' + (0.11 - ri * 0.018).toFixed(2) + ')';
            circuitCtx.lineWidth = 0.45; circuitCtx.setLineDash([3, 14]);
            circuitCtx.beginPath(); circuitCtx.arc(cxPx, cyPx, rr, 0, Math.PI * 2); circuitCtx.stroke();
            circuitCtx.setLineDash([]);
        }
    }

    // ===== 光粒子探索者骨架 =====
    function buildExplorer() {
        explorerPoints = [];
        var bx = W * 0.22, by = H * 0.82; // 基准位置（下方偏左）
        var scale = Math.min(W, H) * 0.12;

        // 骨架关键点（归一化，相对于 bx, by）
        var skeleton = [
            // 头部 (圆)
            { sx: 0, sy: -1.40, r: 0.22, n: 30 },
            // 颈部
            { sx: 0, sy: -1.12, r: 0.06, n: 5 },
            // 躯干 (V形)
            { sx: 0, sy: -0.55, r: 0.02, n: 4 },
            { sx: 0.08, sy: -0.60, r: 0.02, n: 3 },
            { sx: -0.08, sy: -0.60, r: 0.02, n: 3 },
            // 右臂 (指向引路星方向 - 右上方)
            { sx: 0.12, sy: -0.70, r: 0.03, n: 4 },
            { sx: 0.30, sy: -0.85, r: 0.04, n: 5 },
            { sx: 0.50, sy: -0.90, r: 0.05, n: 6 },
            { sx: 0.62, sy: -0.82, r: 0.04, n: 4 },
            // 左臂 (自然下垂微抬)
            { sx: -0.12, sy: -0.70, r: 0.03, n: 4 },
            { sx: -0.28, sy: -0.55, r: 0.04, n: 5 },
            { sx: -0.36, sy: -0.30, r: 0.04, n: 4 },
            // 躯干中线
            { sx: 0, sy: -0.20, r: 0.02, n: 3 },
            { sx: 0, sy: 0.10, r: 0.02, n: 3 },
            // 右腿
            { sx: 0.06, sy: 0.35, r: 0.03, n: 4 },
            { sx: 0.08, sy: 0.60, r: 0.04, n: 5 },
            { sx: 0.06, sy: 0.82, r: 0.03, n: 4 },
            // 左腿
            { sx: -0.06, sy: 0.35, r: 0.03, n: 4 },
            { sx: -0.08, sy: 0.60, r: 0.04, n: 5 },
            { sx: -0.06, sy: 0.82, r: 0.03, n: 4 }
        ];

        for (var si = 0; si < skeleton.length; si++) {
            var sk = skeleton[si];
            for (var i = 0; i < sk.n; i++) {
                var angle = Math.random() * Math.PI * 2;
                var dist = Math.random() * sk.r * scale;
                explorerPoints.push({
                    bx: bx + sk.sx * scale,
                    by: by + sk.sy * scale,
                    ox: Math.cos(angle) * dist,
                    oy: Math.sin(angle) * dist,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.03 + Math.random() * 0.06
                });
            }
        }

        // 星港平台线
        explorerPoints.push(
            { bx: bx - 0.25 * scale, by: by + 0.95 * scale, ox: 0, oy: 0, phase: 0, speed: 0, plat: true, platW: 0.50 * scale },
            { bx: bx - 0.15 * scale, by: by + 1.02 * scale, ox: 0, oy: 0, phase: 0, speed: 0, plat: true, platW: 0.30 * scale },
            { bx: bx - 0.10 * scale, by: by + 1.08 * scale, ox: 0, oy: 0, phase: 0, speed: 0, plat: true, platW: 0.20 * scale }
        );
    }

    // ===== 涡旋分布 =====
    function vortexPos() {
        if (Math.random() < 0.82) {
            var angle = Math.random() * Math.PI * 2;
            // 对数螺旋 + 环形轨道混合
            var dist = Math.pow(Math.random(), 1.5);
            var spiralAngle = angle + dist * 5.5;
            var theta = spiralAngle;
            var r = dist * 0.52;
            return { x: GCX + Math.cos(theta) * r, y: GCY + Math.sin(theta) * r * 0.76 };
        }
        return { x: Math.random(), y: Math.random() };
    }

    function initStars() {
        allStars = [];
        for (var li = 0; li < LAYERS.length; li++) {
            var L = LAYERS[li];
            for (var i = 0; i < L.count; i++) {
                var pos = Math.random() < L.vortex ? vortexPos() : { x: Math.random(), y: Math.random() };
                var t = Math.random();
                var baseR = L.rMin + t * t * (L.rMax - L.rMin);
                var baseO = L.oMin + Math.random() * (L.oMax - L.oMin);
                var dx = pos.x - GCX, dy = pos.y - GCY;
                var proxBoost = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 0.45) * 0.15;
                var isNode = (li >= 2 && baseR > L.rMax * 0.55);
                allStars.push({
                    nx: pos.x, ny: pos.y, x: pos.x * W, y: pos.y * H,
                    baseR: baseR, r: 0, opacity: 0, baseO: baseO + proxBoost,
                    phase: Math.random() * Math.PI * 2,
                    breatheSpeed: 0.025 + Math.random() * 0.10,
                    breatheAmp: baseO * (0.20 + Math.random() * 0.55),
                    drift: (Math.random() - 0.5) * L.drift * 0.015,
                    layer: li, plx: L.plx, reveal: L.reveal,
                    isNode: isNode, ring: (isNode && li === 3),
                    litLevel: 0
                });
            }
        }
    }

    function auraInfluence(px, py) {
        if (!cursor.active || followAura.x < -100) return 0;
        var dx = px - followAura.x, dy = py - followAura.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d >= REVEAL_R) return 0;
        var raw = 1 - d / REVEAL_R;
        return raw * raw * (3 - 2 * raw);
    }

    function drawManhattanLink(ax, ay, bx, by, alpha, t, phase) {
        var pulse = 0.55 + 0.45 * Math.sin(t * 2.2 + phase);
        var la = alpha * pulse; if (la < 0.004) return;
        var midX = (ax + bx) * 0.5;
        ctx.strokeStyle = 'rgba(210,200,160,' + la.toFixed(3) + ')';
        ctx.lineWidth = 0.35 + la * 0.6;
        ctx.beginPath();
        ctx.moveTo(ax, ay); ctx.lineTo(midX, ay); ctx.lineTo(midX, by); ctx.lineTo(bx, by);
        ctx.stroke();
        // 数据包
        var pkt = (t * 0.6 + phase) % 1.0;
        var total = Math.abs(midX - ax) + Math.abs(by - ay);
        var traveled = pkt * total;
        var seg1 = Math.abs(midX - ax);
        var pktX, pktY;
        if (traveled < seg1) { pktX = ax + (midX > ax ? traveled : -traveled); pktY = ay; }
        else { pktX = midX; pktY = ay + (by > ay ? traveled - seg1 : -(traveled - seg1)); }
        ctx.fillStyle = 'rgba(130,215,235,' + (la * 1.6).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(pktX, pktY, 1.6 + la * 1.4, 0, Math.PI * 2); ctx.fill();
    }

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

    // ===== 主循环 =====
    function draw() {
        time += reduceMotion ? 0 : 0.016;
        var t = time;
        var cxPx = GCX * W, cyPx = GCY * H;
        var flareR = Math.min(W, H) * FLARE_R;

        if (!reduceMotion) {
            var tx = cursor.active ? cursor.x : 0.5 + Math.cos(t * 0.06) * 0.06;
            var ty = cursor.active ? cursor.y : 0.45 + Math.sin(t * 0.08) * 0.04;
            if (cursor.active) { followAura.x += (cursor.x * W - followAura.x) * 0.18; followAura.y += (cursor.y * H - followAura.y) * 0.18; }
            follow.x += (tx - follow.x) * 0.025; follow.y += (ty - follow.y) * 0.025;
        }
        var panX = follow.x - 0.5, panY = follow.y - 0.45;

        // -- 深空基底 --
        ctx.clearRect(0, 0, W, H);
        var bg = ctx.createRadialGradient(cxPx, cyPx, 0, cxPx, cyPx, Math.max(W, H) * 0.95);
        bg.addColorStop(0, '#100b2e'); bg.addColorStop(0.15, '#0c0828'); bg.addColorStop(0.38, '#06041c'); bg.addColorStop(0.65, '#020212'); bg.addColorStop(1, '#000008');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        // -- 电路暗纹 --
        if (circuitCanvas) {
            ctx.save();
            ctx.globalAlpha = reduceMotion ? 0.025 : 0.03 + Math.sin(t * 0.3) * 0.008;
            ctx.drawImage(circuitCanvas, 0, 0);
            if (!reduceMotion && cursor.active) {
                ctx.globalCompositeOperation = 'source-over';
                ctx.beginPath(); ctx.arc(cursor.x * W, cursor.y * H, 260, 0, Math.PI * 2); ctx.clip();
                ctx.globalAlpha = 0.12;
                ctx.drawImage(circuitCanvas, 0, 0);
            }
            ctx.restore();
        }

        // ==== 引路星耀斑（金+青双色） ====
        ctx.globalCompositeOperation = 'lighter';
        // 金橙外层
        var of = ctx.createRadialGradient(cxPx, cyPx, flareR * 0.06, cxPx, cyPx, flareR * 1.1);
        of.addColorStop(0, 'rgba(255,210,120,0.28)'); of.addColorStop(0.22, 'rgba(220,170,80,0.13)'); of.addColorStop(0.55, 'rgba(160,100,50,0.03)'); of.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = of; ctx.fillRect(cxPx - flareR, cyPx - flareR, flareR * 2, flareR * 2);
        // 青色冷光层
        var cf = ctx.createRadialGradient(cxPx - flareR * 0.10, cyPx - flareR * 0.06, flareR * 0.04, cxPx, cyPx, flareR * 0.70);
        cf.addColorStop(0, 'rgba(80,215,235,0.20)'); cf.addColorStop(0.35, 'rgba(50,180,210,0.08)'); cf.addColorStop(0.70, 'rgba(20,120,170,0.02)'); cf.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cf; ctx.fillRect(cxPx - flareR, cyPx - flareR, flareR * 2, flareR * 2);
        // 暖金中层
        var mf = ctx.createRadialGradient(cxPx, cyPx, 0, cxPx, cyPx, flareR * 0.38);
        mf.addColorStop(0, 'rgba(255,235,200,0.35)'); mf.addColorStop(0.28, 'rgba(240,200,110,0.15)'); mf.addColorStop(0.62, 'rgba(180,130,50,0.04)'); mf.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = mf; ctx.fillRect(cxPx - flareR * 0.42, cyPx - flareR * 0.42, flareR * 0.84, flareR * 0.84);
        // 炽热白核
        var crf = ctx.createRadialGradient(cxPx, cyPx, 0, cxPx, cyPx, flareR * 0.09);
        crf.addColorStop(0, 'rgba(255,255,250,0.75)'); crf.addColorStop(0.35, 'rgba(255,230,180,0.28)'); crf.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = crf; ctx.fillRect(cxPx - flareR * 0.11, cyPx - flareR * 0.11, flareR * 0.22, flareR * 0.22);
        ctx.globalCompositeOperation = 'source-over';

        // -- 光芒射线 --
        ctx.globalCompositeOperation = 'lighter';
        for (var ri = 0; ri < 10; ri++) {
            var ra = (ri / 10) * Math.PI * 2 + t * 0.04;
            var rl = flareR * (0.50 + Math.sin(t * 0.6 + ri) * 0.35);
            var col = ri < 6 ? 'rgba(255,220,140,' : 'rgba(100,210,230,';
            var rg = ctx.createLinearGradient(cxPx + Math.cos(ra) * flareR * 0.05, cyPx + Math.sin(ra) * flareR * 0.05, cxPx + Math.cos(ra) * rl, cyPx + Math.sin(ra) * rl);
            rg.addColorStop(0, col + '0.10)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.strokeStyle = rg; ctx.lineWidth = 1.2 + Math.sin(t * 0.5 + ri) * 0.4;
            ctx.beginPath();
            ctx.moveTo(cxPx + Math.cos(ra) * flareR * 0.04, cyPx + Math.sin(ra) * flareR * 0.04);
            ctx.lineTo(cxPx + Math.cos(ra) * rl, cyPx + Math.sin(ra) * rl);
            ctx.stroke();
        }
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

        // -- 数据星图网络（中心→节点连线） --
        var nodes = [];
        for (si = 0; si < allStars.length; si++) {
            if (allStars[si].isNode && allStars[si].opacity > 0.05) nodes.push(allStars[si]);
        }
        if (nodes.length > 1) {
            ctx.globalCompositeOperation = 'lighter';
            for (var i = 0; i < nodes.length; i++) {
                var na = nodes[i];
                var pax = na.x + panX * na.plx, pay = na.y + panY * na.plx * 0.7;
                var dcn = Math.sqrt((na.nx - GCX) * (na.nx - GCX) + (na.ny - GCY) * (na.ny - GCY));
                if (dcn < 0.55) {
                    // 从中心连接到节点
                    var la = na.opacity * (1 - dcn / 0.55) * 0.28;
                    if (la > 0.006) {
                        drawManhattanLink(cxPx, cyPx, pax, pay, la, t, (na.nx + na.ny) * 12);
                    }
                }
                // 节点间连接
                for (var j = i + 1; j < nodes.length; j++) {
                    var nb = nodes[j];
                    var dx = (na.nx - nb.nx) * W, dy = (na.ny - nb.ny) * H;
                    var d2 = Math.sqrt(dx * dx + dy * dy);
                    if (d2 < Math.min(W, H) * 0.22) {
                        var la2 = Math.min(na.opacity, nb.opacity) * (1 - d2 / (Math.min(W, H) * 0.22)) * 0.30;
                        if (la2 > 0.006) {
                            var pbx = nb.x + panX * nb.plx, pby = nb.y + panY * nb.plx * 0.7;
                            drawManhattanLink(pax, pay, pbx, pby, la2, t, (na.nx + na.ny + nb.nx + nb.ny) * 8);
                        }
                    }
                }
            }
            ctx.globalCompositeOperation = 'source-over';
        }

        // -- 绘制星点 --
        for (si = 0; si < allStars.length; si++) {
            var s = allStars[si];
            var ppx = s.x + panX * s.plx, ppy = s.y + panY * s.plx * 0.7;
            if (ppx < -40 || ppx > W + 40 || ppy < -40 || ppy > H + 40) continue;

            // 启示层
            if (s.reveal) {
                var rawInf = reduceMotion ? 0 : auraInfluence(ppx, ppy);
                if (!reduceMotion && cursor.active) { s.litLevel += (rawInf - s.litLevel) * ACTIVATE; }
                else { s.litLevel *= DECAY; if (s.litLevel < 0.0005) s.litLevel = 0; }
                var revO = s.opacity + s.litLevel * (1.0 - s.opacity);
                var w = s.litLevel;
                var rr = Math.round(110 + w * 130), rg = Math.round(160 + w * 60), rb = Math.round(230 - w * 120);
                var ra = Math.max(0, Math.min(1, revO));
                if (ra < 0.001) continue;
                if (s.litLevel > 0.2) {
                    ctx.fillStyle = 'rgba(' + rr + ',' + rg + ',' + rb + ',' + (ra * 0.05 * s.litLevel).toFixed(3) + ')';
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.beginPath(); ctx.arc(ppx, ppy, s.r * 5, 0, Math.PI * 2); ctx.fill();
                }
                ctx.fillStyle = 'rgba(' + rr + ',' + rg + ',' + rb + ',' + ra.toFixed(3) + ')';
                ctx.beginPath(); ctx.arc(ppx, ppy, s.r * (1 + w * 0.7), 0, Math.PI * 2); ctx.fill();
                continue;
            }

            var alpha = Math.max(0, Math.min(1, s.opacity));
            if (alpha < 0.002) continue;
            var dxc = s.nx - GCX, dyc = s.ny - GCY;
            var dCenter = Math.sqrt(dxc * dxc + dyc * dyc);
            var warm = Math.max(0, 1 - dCenter / 0.50);
            var cr = Math.round(130 + warm * 110), cg = Math.round(170 + warm * 55), cb = Math.round(235 - warm * 100);
            ctx.globalCompositeOperation = 'lighter';

            if (s.ring && alpha > 0.06) {
                ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (alpha * 0.022).toFixed(3) + ')';
                ctx.beginPath(); ctx.arc(ppx, ppy, s.r * 9, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (alpha * 0.07).toFixed(3) + ')';
                ctx.beginPath(); ctx.arc(ppx, ppy, s.r * 3.5, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (alpha * 0.35).toFixed(3) + ')';
                ctx.lineWidth = s.r * 0.30;
                ctx.beginPath(); ctx.arc(ppx, ppy, s.r * 6.5, 0, Math.PI * 2); ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,' + Math.min(1, alpha * 1.2).toFixed(3) + ')';
                ctx.beginPath(); ctx.arc(ppx, ppy, s.r * 0.50, 0, Math.PI * 2); ctx.fill();
            } else if (s.isNode && alpha > 0.04) {
                if (alpha > 0.06) {
                    ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (alpha * 0.04).toFixed(3) + ')';
                    ctx.beginPath(); ctx.arc(ppx, ppy, s.r * 4, 0, Math.PI * 2); ctx.fill();
                }
                draw4Point(ppx, ppy, s.r, alpha, cr, cg, cb);
            } else {
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

        // ==== 光粒子探索者 ====
        if (!reduceMotion) {
            ctx.globalCompositeOperation = 'lighter';
            for (var ei = 0; ei < explorerPoints.length; ei++) {
                var ep = explorerPoints[ei];
                if (ep.plat) {
                    // 星港平台线
                    var platAlpha = 0.18 + Math.sin(t * 0.5 + ei) * 0.05;
                    ctx.strokeStyle = 'rgba(200,180,140,' + platAlpha.toFixed(3) + ')';
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(ep.bx, ep.by); ctx.lineTo(ep.bx + ep.platW, ep.by);
                    ctx.stroke();
                    // 端点节点
                    ctx.fillStyle = 'rgba(220,200,160,' + (platAlpha * 1.5).toFixed(3) + ')';
                    ctx.beginPath(); ctx.arc(ep.bx, ep.by, 2.5, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(ep.bx + ep.platW, ep.by, 2.5, 0, Math.PI * 2); ctx.fill();
                } else {
                    ep.phase += ep.speed * 0.02;
                    var breathe = Math.sin(ep.phase);
                    var epAlpha = 0.25 + breathe * 0.15;
                    var px = ep.bx + ep.ox, py = ep.by + ep.oy;
                    // 光晕
                    ctx.fillStyle = 'rgba(160,210,240,' + (epAlpha * 0.25).toFixed(3) + ')';
                    ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
                    // 核心
                    ctx.fillStyle = 'rgba(210,235,255,' + epAlpha.toFixed(3) + ')';
                    ctx.beginPath(); ctx.arc(px, py, 1.2, 0, Math.PI * 2); ctx.fill();
                }
            }
            ctx.globalCompositeOperation = 'source-over';
        }

        // -- 灵感唤醒暖光 --
        if (!reduceMotion && cursor.active && followAura.x > -100) {
            ctx.globalCompositeOperation = 'color-dodge';
            var wg = ctx.createRadialGradient(followAura.x, followAura.y, 0, followAura.x, followAura.y, REVEAL_R);
            wg.addColorStop(0, 'rgba(200,160,80,0.10)'); wg.addColorStop(0.30, 'rgba(160,120,50,0.04)'); wg.addColorStop(0.65, 'rgba(100,60,20,0.01)'); wg.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = wg;
            ctx.fillRect(followAura.x - REVEAL_R, followAura.y - REVEAL_R, REVEAL_R * 2, REVEAL_R * 2);
            ctx.globalCompositeOperation = 'source-over';
        }

        // 暗角
        var vignette = ctx.createRadialGradient(cxPx, cyPx, Math.min(W, H) * 0.28, cxPx, cyPx, Math.max(W, H) * 0.88);
        vignette.addColorStop(0, 'rgba(2,2,10,0)'); vignette.addColorStop(1, 'rgba(2,2,10,0.38)');
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
