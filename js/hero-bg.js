// ================= 首页背景：赛博数字海洋（透视网格 + 星座 + HUD + 线框母题） =================
// 纯 Canvas，无第三方依赖。只在首页可见且标签页激活时运行。
(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0, H = 0, dpr = 1;
    let particles = [];
    let shapes = [];
    let gridPts = [];
    let linkDist = 120, linkDist2 = 120 * 120;
    let rafId = null, running = false, time = 0;

    const COLS = 28, ROWS = 18;
    const mouse = { x: 0.5, y: 0.45, tx: 0.5, ty: 0.45, idle: 999 };

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        W = Math.max(1, rect.width);
        H = Math.max(1, rect.height);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        linkDist = Math.min(W, H) * 0.15;
        linkDist2 = linkDist * linkDist;
        initParticles();
        initShapes();
    }

    function initParticles() {
        const count = Math.min(120, Math.round((W * H) / 10000));
        particles = [];
        for (let i = 0; i < count; i++) {
            const roll = Math.random();
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H * 0.75,
                r: Math.random() * 1.6 + 0.5,
                depth: Math.random() * 0.8 + 0.2,
                drift: Math.random() * 0.25 + 0.05,
                vx: (Math.random() - 0.5) * 0.12,
                twPhase: Math.random() * Math.PI * 2,
                twSpeed: Math.random() * 1.6 + 0.6,
                gold: roll < 0.2,
                mag: roll >= 0.2 && roll < 0.34
            });
        }
        gridPts = new Array(COLS * ROWS);
    }

    // 漂浮线框母题（六边形 / 三角形）
    function initShapes() {
        shapes = [];
        const sc = Math.max(5, Math.round(W / 320));
        for (let i = 0; i < sc; i++) {
            shapes.push({
                x: Math.random() * W,
                y: Math.random() * H * 0.7,
                size: Math.random() * 24 + 12,
                sides: Math.random() < 0.5 ? 6 : 3,
                rot: Math.random() * 6.283,
                rotSpeed: (Math.random() - 0.5) * 0.012,
                vy: -(Math.random() * 0.22 + 0.05),
                depth: Math.random() * 0.7 + 0.3,
                alpha: Math.random() * 0.14 + 0.06
            });
        }
    }

    // 数字海洋：透视波形线框网格
    function drawGrid(t, panX, panY) {
        const horizon = H * 0.42;
        for (let r = 0; r < ROWS; r++) {
            const p = r / (ROWS - 1);
            const persp = p * p;
            const yBase = horizon + (H - horizon + 80) * persp;
            const spread = 0.42 + persp * 1.55;
            for (let c = 0; c < COLS; c++) {
                const cx = c / (COLS - 1) - 0.5;
                const wave = Math.sin(cx * 7 + t * 1.1 + r * 0.35)
                    + 0.5 * Math.sin(cx * 3.3 - t * 0.7 + r * 0.2);
                const amp = 36 * persp;
                const x = W / 2 + cx * W * spread + panX * 80 * persp;
                const y = yBase - wave * amp - panY * 30 * persp;
                gridPts[r * COLS + c] = { x: x, y: y, p: persp };
            }
        }

        ctx.globalCompositeOperation = 'lighter';
        for (let r = 0; r < ROWS; r++) {
            const persp = gridPts[r * COLS].p;
            ctx.beginPath();
            for (let c = 0; c < COLS; c++) {
                const pt = gridPts[r * COLS + c];
                if (c === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
            }
            ctx.strokeStyle = 'rgba(95,210,255,' + (0.06 + persp * 0.42) + ')';
            ctx.lineWidth = 0.6 + persp * 1.5;
            ctx.stroke();
        }
        for (let c = 0; c < COLS; c++) {
            ctx.beginPath();
            for (let r = 0; r < ROWS; r++) {
                const pt = gridPts[r * COLS + c];
                if (r === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
            }
            ctx.strokeStyle = 'rgba(75,165,255,0.12)';
            ctx.lineWidth = 0.7;
            ctx.stroke();
        }
        for (let r = Math.floor(ROWS * 0.5); r < ROWS; r++) {
            for (let c = 0; c < COLS; c += 2) {
                const pt = gridPts[r * COLS + c];
                ctx.fillStyle = 'rgba(150,235,255,' + (pt.p * 0.6) + ')';
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 0.6 + pt.p * 1.6, 0, 6.283);
                ctx.fill();
            }
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    function drawShapes(t, panX, panY) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineWidth = 1;
        for (const s of shapes) {
            if (!reduceMotion) { s.rot += s.rotSpeed; s.y += s.vy; }
            if (s.y < -s.size) { s.y = H * 0.7 + s.size; s.x = Math.random() * W; }
            const x = s.x + panX * s.depth * 65;
            const y = s.y + panY * s.depth * 38;
            ctx.strokeStyle = 'rgba(95,185,255,' + s.alpha + ')';
            ctx.beginPath();
            for (let i = 0; i <= s.sides; i++) {
                const a = s.rot + i / s.sides * 6.283;
                const px = x + Math.cos(a) * s.size;
                const py = y + Math.sin(a) * s.size;
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.fillStyle = 'rgba(150,225,255,' + (s.alpha * 0.9) + ')';
            ctx.beginPath();
            ctx.arc(x, y, 1.3, 0, 6.283);
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    function drawParticles(t, gx, gy, panX, panY) {
        const reach = Math.min(W, H) * 0.42;
        ctx.globalCompositeOperation = 'lighter';
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
                    const al = (1 - Math.sqrt(d2) / linkDist) * 0.2;
                    ctx.strokeStyle = 'rgba(130,205,255,' + al + ')';
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(ax, ay);
                    ctx.lineTo(bx, by);
                    ctx.stroke();
                }
            }
        }
        for (const p of particles) {
            if (!reduceMotion) { p.y -= p.drift; p.x += p.vx; p.twPhase += p.twSpeed * 0.05; }
            if (p.y < -6) { p.y = H * 0.75; p.x = Math.random() * W; }
            if (p.x < -6) p.x = W + 6; else if (p.x > W + 6) p.x = -6;
            const px = p.x + panX * p.depth * 55;
            const py = p.y + panY * p.depth * 32;
            let alpha = 0.45 + Math.sin(p.twPhase) * 0.3;
            const near = Math.max(0, 1 - Math.hypot(px - gx, py - gy) / reach);
            alpha = Math.min(1, alpha + near * 0.5);
            const rr = p.r * (1 + near * 1.6);
            const col = p.gold ? '255,210,120' : (p.mag ? '210,150,255' : '160,215,255');
            ctx.fillStyle = 'rgba(' + col + ',' + alpha + ')';
            ctx.beginPath();
            ctx.arc(px, py, rr, 0, 6.283);
            ctx.fill();
            ctx.fillStyle = 'rgba(' + col + ',' + (alpha * 0.13) + ')';
            ctx.beginPath();
            ctx.arc(px, py, rr * 3.5, 0, 6.283);
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    // 鼠标 HUD 准星：双向旋转虚线环 + 十字刻度
    function drawReticle(t, gx, gy) {
        ctx.save();
        ctx.translate(gx, gy);
        ctx.globalCompositeOperation = 'lighter';
        const r1 = 44;
        ctx.strokeStyle = 'rgba(120,220,255,0.22)';
        ctx.lineWidth = 1;
        ctx.rotate(t * 0.4);
        ctx.setLineDash([10, 9]);
        ctx.beginPath(); ctx.arc(0, 0, r1, 0, 6.283); ctx.stroke();
        ctx.setLineDash([]);
        ctx.rotate(-t * 0.65);
        ctx.setLineDash([4, 13]);
        ctx.beginPath(); ctx.arc(0, 0, r1 + 13, 0, 6.283); ctx.stroke();
        ctx.setLineDash([]);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);   // 复位变换再画刻度
        ctx.translate(gx, gy);
        ctx.strokeStyle = 'rgba(150,230,255,0.4)';
        for (const a of [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]) {
            const ix = Math.cos(a), iy = Math.sin(a);
            ctx.beginPath();
            ctx.moveTo(ix * (r1 - 7), iy * (r1 - 7));
            ctx.lineTo(ix * (r1 + 7), iy * (r1 + 7));
            ctx.stroke();
        }
        ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
    }

    function frame() {
        time += reduceMotion ? 0 : 0.016;
        const t = time;

        mouse.idle += 1;
        if (mouse.idle > 90) {
            mouse.tx = 0.5 + Math.cos(t * 0.18) * 0.3;
            mouse.ty = 0.45 + Math.sin(t * 0.22) * 0.15;
        }
        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;

        const gx = mouse.x * W, gy = mouse.y * H;
        const panX = mouse.x - 0.5, panY = mouse.y - 0.5;
        const horizonY = H * 0.42;

        ctx.clearRect(0, 0, W, H);

        // 1) 深空海底底色（整体提亮）
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, 'rgba(8,20,52,0.15)');
        bg.addColorStop(0.5, 'rgba(10,26,64,0.30)');
        bg.addColorStop(1, 'rgba(8,30,74,0.55)');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        ctx.globalCompositeOperation = 'lighter';

        // 2) 地平线"数据日"辉光，填充中部空旷
        const sunX = W * 0.5 + panX * 70;
        const sun = ctx.createRadialGradient(sunX, horizonY, 0, sunX, horizonY, W * 0.55);
        sun.addColorStop(0, 'rgba(80,205,255,0.22)');
        sun.addColorStop(0.45, 'rgba(60,140,255,0.07)');
        sun.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sun;
        ctx.fillRect(0, 0, W, H);

        // 3) 跟随鼠标的双束星云流光
        const R = Math.min(W, H) * 0.6;
        const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, R);
        glow.addColorStop(0, 'rgba(80,185,255,0.22)');
        glow.addColorStop(0.4, 'rgba(56,130,246,0.10)');
        glow.addColorStop(1, 'rgba(56,130,246,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);
        const g2x = gx + Math.cos(t * 0.5) * 70, g2y = gy + Math.sin(t * 0.5) * 45;
        const glow2 = ctx.createRadialGradient(g2x, g2y, 0, g2x, g2y, R * 0.55);
        glow2.addColorStop(0, 'rgba(185,125,255,0.12)');
        glow2.addColorStop(1, 'rgba(185,125,255,0)');
        ctx.fillStyle = glow2;
        ctx.fillRect(0, 0, W, H);

        // 4) 扫描线扫掠（自上而下循环）
        if (!reduceMotion) {
            const sweepY = ((t * 55) % (H + 240)) - 120;
            const sw = ctx.createLinearGradient(0, sweepY - 50, 0, sweepY + 50);
            sw.addColorStop(0, 'rgba(90,210,255,0)');
            sw.addColorStop(0.5, 'rgba(130,225,255,0.07)');
            sw.addColorStop(1, 'rgba(90,210,255,0)');
            ctx.fillStyle = sw;
            ctx.fillRect(0, sweepY - 50, W, 100);
        }
        ctx.globalCompositeOperation = 'source-over';

        // 5) 主体元素
        drawGrid(t, panX, panY);
        drawShapes(t, panX, panY);
        drawParticles(t, gx, gy, panX, panY);
        drawReticle(t, gx, gy);

        // 6) 暗角（减弱，仅轻压边缘）
        const vg = ctx.createRadialGradient(W / 2, H * 0.46, Math.min(W, H) * 0.35, W / 2, H * 0.5, Math.max(W, H) * 0.85);
        vg.addColorStop(0, 'rgba(2,4,12,0)');
        vg.addColorStop(1, 'rgba(1,3,10,0.42)');
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
    if (reduceMotion) frame();
})();
