// ================= 深空星海 · 鼠标探照灯交互 =================
// 休眠星光 + 鼠标力场点亮 + 动态连线 + 雾气驱散 + 拖尾延迟
// 纯 Canvas 2D，无第三方依赖
(function () {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d', { alpha: true });
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- 可调参数 ----------
    var FORCE_RADIUS = 260;           // 鼠标力场半径 (px)
    var TRAIL_MAX = 10;               // 拖尾采样点数
    var TRAIL_EVERY = 2;              // 每隔 N 帧采样一次
    var STAR_COUNT = 280;             // 粒子总数
    var LERP_RATE = 0.06;             // 平滑过渡速率（~0.5s 到位）
    var MAX_LINK_DIST = 125;          // 连线最大距离
    var LINK_THRESHOLD = 0.30;        // 最低连线亮度
    var DORMANT_MIN = 0.08;           // 休眠最低透明度
    var DORMANT_MAX = 0.20;           // 休眠最高透明度
    var GOLD_RATIO = 0.06;            // 金色点缀比例

    // ---------- 状态 ----------
    var W = 0, H = 0, dpr = 1;
    var stars = [];
    var trail = [];                   // [{x, y}] 最新在前
    var mouse = { x: -500, y: -500, active: false };
    var rafId = null, running = false;
    var frameCount = 0;

    // ---------- 画布尺寸 ----------
    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        var rect = canvas.getBoundingClientRect();
        W = Math.max(1, rect.width);
        H = Math.max(1, rect.height);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // ---------- 初始化星场 ----------
    function initStars() {
        stars = [];
        for (var i = 0; i < STAR_COUNT; i++) {
            var isGold = Math.random() < GOLD_RATIO;
            stars.push({
                x: Math.random() * W,
                y: Math.random() * H,
                baseR: 0.25 + Math.random() * 1.1,     // 休眠时微小
                r: 0,
                opacity: DORMANT_MIN + Math.random() * (DORMANT_MAX - DORMANT_MIN),
                targetOpacity: 0,
                targetR: 0,
                vx: (Math.random() - 0.5) * 0.08,      // 极慢漂浮
                vy: (Math.random() - 0.5) * 0.08,
                phase: Math.random() * Math.PI * 2,
                twinkle: 0.3 + Math.random() * 0.8,
                color: isGold ? [255, 210, 138] : [140, 198, 255]
            });
        }
    }

    // ---------- 光照强度计算 (考虑拖尾) ----------
    function getIllumination(sx, sy) {
        var best = 0;
        for (var i = 0; i < trail.length; i++) {
            var weight = 1 - i / trail.length;                  // 新采样权重高
            var r = FORCE_RADIUS * (0.4 + 0.6 * weight);       // 旧采样半径衰减
            var dx = sx - trail[i].x;
            var dy = sy - trail[i].y;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d < r) {
                var raw = 1 - d / r;
                var eased = raw * raw * (3 - 2 * raw);          // smoothstep
                best = Math.max(best, eased * weight);
            }
        }
        return best; // 0 = 休眠, 1 = 最强光照
    }

    // ---------- 绘制 ----------
    function draw() {
        frameCount++;

        // -- 更新拖尾 --
        if (!reduceMotion) {
            if (mouse.active && frameCount % TRAIL_EVERY === 0) {
                trail.unshift({ x: mouse.x, y: mouse.y });
                if (trail.length > TRAIL_MAX) trail.length = TRAIL_MAX;
            }
            if (!mouse.active && trail.length > 0 && frameCount % 4 === 0) {
                trail.pop(); // 鼠标离开后自然衰减
            }
        }

        // -- 更新每颗星 --
        for (var si = 0; si < stars.length; si++) {
            var s = stars[si];
            if (!reduceMotion) {
                // 漂浮
                s.x += s.vx;
                s.y += s.vy;
                if (s.x < -15) s.x = W + 15; else if (s.x > W + 15) s.x = -15;
                if (s.y < -15) s.y = H + 15; else if (s.y > H + 15) s.y = -15;
                s.phase += s.twinkle * 0.02;
            }

            // 光照
            var illum = reduceMotion ? 0 : getIllumination(s.x, s.y);

            // 目标值 = 休眠微光 + 力场点亮
            var dormant = DORMANT_MIN +
                (Math.sin(s.phase) * 0.5 + 0.5) * (DORMANT_MAX - DORMANT_MIN);
            s.targetOpacity = dormant + illum * (1 - dormant);
            s.targetR = s.baseR * (1 + illum * 3.0);

            // 平滑插值
            if (!reduceMotion) {
                s.opacity += (s.targetOpacity - s.opacity) * LERP_RATE;
                s.r += (s.targetR - s.r) * LERP_RATE;
            } else {
                s.opacity = DORMANT_MIN;
                s.r = s.baseR;
            }
        }

        // -- 清屏 + 深色科技蓝渐变背景 --
        ctx.clearRect(0, 0, W, H);
        var bg = ctx.createRadialGradient(W * 0.50, H * 0.35, 0, W * 0.52, H * 0.40, Math.max(W, H) * 0.85);
        bg.addColorStop(0, '#0b1536');
        bg.addColorStop(0.42, '#060e26');
        bg.addColorStop(1, '#020614');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // -- 连线（仅亮星之间）--
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
                        var d = Math.sqrt(d2);
                        var lineAlpha = Math.min(a.opacity, b.opacity) * (1 - d / MAX_LINK_DIST) * 0.45;
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

        // -- 绘制星点 --
        ctx.globalCompositeOperation = 'lighter';
        for (si = 0; si < stars.length; si++) {
            var s2 = stars[si];
            var alpha = s2.opacity;
            if (alpha < 0.012) continue;
            var r = s2.r;
            var col = s2.color;

            // 光晕（亮星外圈）
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
            // 星核
            ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + alpha.toFixed(3) + ')';
            ctx.beginPath();
            ctx.arc(s2.x, s2.y, r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';

        // -- 动态雾气遮罩（鼠标驱散朦胧）--
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

    // ---------- 启停 ----------
    function start() {
        if (running || reduceMotion) return;
        running = true;
        rafId = requestAnimationFrame(draw);
    }
    function stop() {
        running = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }

    // ---------- 事件 ----------
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
    });

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop(); else if (!reduceMotion) start();
    });

    // IntersectionObserver：Canvas 不可见时暂停
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
            if (en.isIntersecting && !document.hidden) start();
            else stop();
        });
    }, { threshold: 0.05 });

    // ---------- 启动 ----------
    resize();
    initStars();
    io.observe(canvas);
    if (reduceMotion) draw(); // 仅绘一帧静态星空
})();
