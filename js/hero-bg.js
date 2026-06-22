// ================= 首页背景：科幻数字海洋（透视波形网格 + 粒子星座 + 流光视差） =================
// 纯 Canvas，无第三方依赖。只在首页可见且标签页激活时运行。
(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0, H = 0, dpr = 1;
    let particles = [];
    let gridPts = [];
    let linkDist = 120, linkDist2 = 120 * 120;
    let rafId = null, running = false, time = 0;

    // 网格密度
    const COLS = 26, ROWS = 16;

    // 鼠标（归一化 0~1），平滑跟随；空闲时镜头自动巡游
    const mouse = { x: 0.5, y: 0.45, tx: 0.5, ty: 0.45, idle: 999 };

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        W = Math.max(1, rect.width);
        H = Math.max(1, rect.height);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        linkDist = Math.min(W, H) * 0.14;
        linkDist2 = linkDist * linkDist;
        initParticles();
    }

    function initParticles() {
        const count = Math.min(90, Math.round((W * H) / 13000));
        particles = [];
        for (let i = 0; i < count; i++) {
            const roll = Math.random();
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H * 0.7,        // 主要分布在上方"星空"区
                r: Math.random() * 1.5 + 0.5,
                depth: Math.random() * 0.8 + 0.2,  // 景深：影响视差强度
                drift: Math.random() * 0.25 + 0.05,
                vx: (Math.random() - 0.5) * 0.12,
                twPhase: Math.random() * Math.PI * 2,
                twSpeed: Math.random() * 1.6 + 0.6,
                gold: roll < 0.18,
                mag: roll >= 0.18 && roll < 0.30
            });
        }
        gridPts = new Array(COLS * ROWS);
    }

    // 数字海洋：透视波形线框网格
    function drawGrid(t, panX, panY) {
        const horizon = H * 0.46;
        for (let r = 0; r < ROWS; r++) {
            const p = r / (ROWS - 1);
            const persp = p * p;                       // 近大远小压缩
            const yBase = horizon + (H - horizon + 60) * persp;
            const spread = 0.45 + persp * 1.45;
            for (let c = 0; c < COLS; c++) {
                const cx = c / (COLS - 1) - 0.5;
                const wave = Math.sin(cx * 7 + t * 1.1 + r * 0.35)
                    + 0.5 * Math.sin(cx * 3.3 - t * 0.7 + r * 0.2);
                const amp = 32 * persp;
                const x = W / 2 + cx * W * spread + panX * 75 * persp;
                const y = yBase - wave * amp - panY * 28 * persp;
                gridPts[r * COLS + c] = { x: x, y: y, p: persp };
            }
        }

        ctx.globalCompositeOperation = 'lighter';
        // 横向波纹线（按景深增亮加粗，制造辉光纵深）
        for (let r = 0; r < ROWS; r++) {
            const persp = gridPts[r * COLS].p;
            ctx.beginPath();
            for (let c = 0; c < COLS; c++) {
                const pt = gridPts[r * COLS + c];
                if (c === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
            }
            ctx.strokeStyle = 'rgba(90,205,255,' + (0.04 + persp * 0.34) + ')';
            ctx.lineWidth = 0.6 + persp * 1.3;
            ctx.stroke();
        }
        // 纵向经线
        for (let c = 0; c < COLS; c++) {
            ctx.beginPath();
            for (let r = 0; r < ROWS; r++) {
                const pt = gridPts[r * COLS + c];
                if (r === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
            }
            ctx.strokeStyle = 'rgba(70,160,255,0.09)';
            ctx.lineWidth = 0.7;
            ctx.stroke();
        }
        // 近处波峰高光节点
        for (let r = Math.floor(ROWS * 0.55); r < ROWS; r++) {
            for (let c = 0; c < COLS; c += 2) {
                const pt = gridPts[r * COLS + c];
                ctx.fillStyle = 'rgba(140,230,255,' + (pt.p * 0.5) + ')';
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 0.6 + pt.p * 1.4, 0, 6.283);
                ctx.fill();
            }
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    // 粒子星座 + 连线 + 鼠标视差
    function drawParticles(t, gx, gy, panX, panY) {
        const reach = Math.min(W, H) * 0.4;
        ctx.globalCompositeOperation = 'lighter';

        // 连线
        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];
            const ax = a.x + panX * a.depth * 55;
            const ay = a.y + panY * a.depth * 32;
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const bx = b.x + panX * b.depth * 55;
                const by = b.y + panY * b.depth * 32;
                const dx = ax - bx, dy = ay - by;
                const d2 = dx * dx + dy * dy;
                if (d2 < linkDist2) {
                    const al = (1 - Math.sqrt(d2) / linkDist) * 0.16;
                    ctx.strokeStyle = 'rgba(120,200,255,' + al + ')';
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(ax, ay);
                    ctx.lineTo(bx, by);
                    ctx.stroke();
                }
            }
        }

        // 节点
        for (const p of particles) {
            if (!reduceMotion) {
                p.y -= p.drift;
                p.x += p.vx;
                p.twPhase += p.twSpeed * 0.05;
            }
            if (p.y < -6) { p.y = H * 0.7; p.x = Math.random() * W; }
            if (p.x < -6) p.x = W + 6; else if (p.x > W + 6) p.x = -6;

            const px = p.x + panX * p.depth * 55;
            const py = p.y + panY * p.depth * 32;
            let alpha = 0.4 + Math.sin(p.twPhase) * 0.3;
            const near = Math.max(0, 1 - Math.hypot(px - gx, py - gy) / reach);
            alpha = Math.min(1, alpha + near * 0.5);
            const rr = p.r * (1 + near * 1.6);
            const col = p.gold ? '255,210,120' : (p.mag ? '210,150,255' : '150,210,255');

            ctx.fillStyle = 'rgba(' + col + ',' + alpha + ')';
            ctx.beginPath();
            ctx.arc(px, py, rr, 0, 6.283);
            ctx.fill();
            ctx.fillStyle = 'rgba(' + col + ',' + (alpha * 0.12) + ')';
            ctx.beginPath();
            ctx.arc(px, py, rr * 3.5, 0, 6.283);
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    function frame() {
        time += reduceMotion ? 0 : 0.016;
        const t = time;

        mouse.idle += 1;
        if (mouse.idle > 90) {                     // 空闲：镜头缓慢巡游
            mouse.tx = 0.5 + Math.cos(t * 0.18) * 0.3;
            mouse.ty = 0.45 + Math.sin(t * 0.22) * 0.15;
        }
        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;

        const gx = mouse.x * W, gy = mouse.y * H;
        const panX = mouse.x - 0.5, panY = mouse.y - 0.5;

        ctx.clearRect(0, 0, W, H);

        // 1) 深空海底渐变
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, 'rgba(4,10,32,0)');
        bg.addColorStop(0.55, 'rgba(3,12,38,0.25)');
        bg.addColorStop(1, 'rgba(2,14,44,0.6)');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // 2) 跟随鼠标的星云流光（冷 + 暖双束）
        ctx.globalCompositeOperation = 'lighter';
        const R = Math.min(W, H) * 0.6;
        const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, R);
        glow.addColorStop(0, 'rgba(70,180,255,0.20)');
        glow.addColorStop(0.4, 'rgba(56,130,246,0.10)');
        glow.addColorStop(1, 'rgba(56,130,246,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);

        const g2x = gx + Math.cos(t * 0.5) * 70, g2y = gy + Math.sin(t * 0.5) * 45;
        const glow2 = ctx.createRadialGradient(g2x, g2y, 0, g2x, g2y, R * 0.55);
        glow2.addColorStop(0, 'rgba(180,120,255,0.10)');
        glow2.addColorStop(1, 'rgba(180,120,255,0)');
        ctx.fillStyle = glow2;
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'source-over';

        // 3) 数字海洋网格
        drawGrid(t, panX, panY);

        // 4) 粒子星座
        drawParticles(t, gx, gy, panX, panY);

        // 5) 暗角，聚焦中心、压暗边缘
        const vg = ctx.createRadialGradient(W / 2, H * 0.48, Math.min(W, H) * 0.25, W / 2, H * 0.5, Math.max(W, H) * 0.8);
        vg.addColorStop(0, 'rgba(2,4,12,0)');
        vg.addColorStop(1, 'rgba(1,3,10,0.6)');
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, W, H);

        if (running) rafId = requestAnimationFrame(frame);
    }

    function start() {
        if (running || reduceMotion) return;
        running = true;
        rafId = requestAnimationFrame(frame);
    }
    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
    }

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.tx = (e.clientX - rect.left) / rect.width;
        mouse.ty = (e.clientY - rect.top) / rect.height;
        mouse.idle = 0;
    }, { passive: true });

    window.addEventListener('resize', resize);

    // 仅在首页可见时运行（滑到其它屏 / 切后台自动暂停）
    const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting && !document.hidden) start();
            else stop();
        });
    }, { threshold: 0.05 });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop();
    });

    resize();
    io.observe(canvas);
    if (reduceMotion) frame();   // 偏好减少动效：只画静态一帧
})();
