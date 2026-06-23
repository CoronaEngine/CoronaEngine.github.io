// ================= 首页背景：深空星海（多层视差星点 + 星云 + 流星 + 星座连线） =================
// 纯 Canvas，无第三方依赖。只在首页可见且标签页激活时运行。
(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0, H = 0, dpr = 1;
    let stars = [];
    let nebulae = [];
    let shapes = [];
    let meteors = [];
    let linkDist = 120, linkDist2 = 120 * 120;
    let rafId = null, running = false, time = 0;

    const mouse = { x: 0.5, y: 0.45, tx: 0.5, ty: 0.45, idle: 999 };

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        W = Math.max(1, rect.width);
        H = Math.max(1, rect.height);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        linkDist = Math.min(W, H) * 0.16;
        linkDist2 = linkDist * linkDist;
        initStars();
        initNebulae();
        initShapes();
    }

    // 多层星点：depth 越大越近 → 更大、更亮、视差更强
    function initStars() {
        const count = Math.min(320, Math.round((W * H) / 5200));
        stars = [];
        for (let i = 0; i < count; i++) {
            const roll = Math.random();
            const depth = Math.random();
            stars.push({
                x: Math.random() * W,
                y: Math.random() * H,
                depth: depth,
                r: 0.4 + depth * 1.7,
                drift: 0.02 + depth * 0.18,            // 缓慢平移
                vx: (Math.random() - 0.5) * 0.05,
                twPhase: Math.random() * Math.PI * 2,
                twSpeed: Math.random() * 1.8 + 0.5,
                gold: roll < 0.12,
                mag: roll >= 0.12 && roll < 0.22,
                link: false
            });
        }
        // 仅选取数量受控的"连线星"（景深最靠前的若干颗），避免连线过多
        const linkTarget = Math.min(85, Math.round(stars.length * 0.28));
        const byDepth = stars.slice().sort((a, b) => b.depth - a.depth);
        for (let i = 0; i < byDepth.length; i++) byDepth[i].link = i < linkTarget;
    }

    // 星云：大而柔的彩色光团，缓慢漂移
    function initNebulae() {
        const palette = [
            '70,130,255',   // 蓝
            '150,90,255',   // 紫
            '40,200,255',   // 青
            '255,120,180'   // 品红（点缀）
        ];
        nebulae = [];
        const n = Math.max(3, Math.round(W / 480));
        for (let i = 0; i < n; i++) {
            nebulae.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.min(W, H) * (0.3 + Math.random() * 0.35),
                col: palette[i % palette.length],
                alpha: 0.05 + Math.random() * 0.05,
                vx: (Math.random() - 0.5) * 0.06,
                vy: (Math.random() - 0.5) * 0.04,
                depth: 0.15 + Math.random() * 0.3
            });
        }
    }

    // 少量旋转线框母题（科技点缀）
    function initShapes() {
        shapes = [];
        const sc = Math.max(3, Math.round(W / 480));
        for (let i = 0; i < sc; i++) {
            shapes.push({
                x: Math.random() * W,
                y: Math.random() * H,
                size: Math.random() * 20 + 10,
                sides: Math.random() < 0.5 ? 6 : 3,
                rot: Math.random() * 6.283,
                rotSpeed: (Math.random() - 0.5) * 0.01,
                vy: -(Math.random() * 0.15 + 0.03),
                depth: Math.random() * 0.6 + 0.3,
                alpha: Math.random() * 0.1 + 0.05
            });
        }
    }

    function spawnMeteor() {
        const fromLeft = Math.random() < 0.5;
        const a = 0.4 + Math.random() * 0.35;          // 俯冲角
        const sp = 8 + Math.random() * 7;
        meteors.push({
            x: fromLeft ? Math.random() * W * 0.45 : W * 0.55 + Math.random() * W * 0.45,
            y: Math.random() * H * 0.45,
            vx: Math.cos(a) * sp * (fromLeft ? 1 : -1),
            vy: Math.sin(a) * sp,
            sp: sp,
            len: 90 + Math.random() * 110,
            life: 0,
            max: 60 + Math.random() * 40,
            gold: Math.random() < 0.3
        });
    }

    function drawNebulae(panX, panY) {
        ctx.globalCompositeOperation = 'lighter';
        for (const nb of nebulae) {
            if (!reduceMotion) {
                nb.x += nb.vx; nb.y += nb.vy;
                if (nb.x < -nb.r) nb.x = W + nb.r; else if (nb.x > W + nb.r) nb.x = -nb.r;
                if (nb.y < -nb.r) nb.y = H + nb.r; else if (nb.y > H + nb.r) nb.y = -nb.r;
            }
            const x = nb.x + panX * nb.depth * 40;
            const y = nb.y + panY * nb.depth * 28;
            const g = ctx.createRadialGradient(x, y, 0, x, y, nb.r);
            g.addColorStop(0, 'rgba(' + nb.col + ',' + nb.alpha + ')');
            g.addColorStop(0.5, 'rgba(' + nb.col + ',' + (nb.alpha * 0.4) + ')');
            g.addColorStop(1, 'rgba(' + nb.col + ',0)');
            ctx.fillStyle = g;
            ctx.fillRect(x - nb.r, y - nb.r, nb.r * 2, nb.r * 2);
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    function drawShapes(panX, panY) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineWidth = 1;
        for (const s of shapes) {
            if (!reduceMotion) { s.rot += s.rotSpeed; s.y += s.vy; }
            if (s.y < -s.size) { s.y = H + s.size; s.x = Math.random() * W; }
            const x = s.x + panX * s.depth * 60;
            const y = s.y + panY * s.depth * 36;
            ctx.strokeStyle = 'rgba(110,190,255,' + s.alpha + ')';
            ctx.beginPath();
            for (let i = 0; i <= s.sides; i++) {
                const a = s.rot + i / s.sides * 6.283;
                const px = x + Math.cos(a) * s.size;
                const py = y + Math.sin(a) * s.size;
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    function drawStars(gx, gy, panX, panY) {
        const reach = Math.min(W, H) * 0.4;
        ctx.globalCompositeOperation = 'lighter';

        // 星座连线（仅近处亮星之间）
        const linkers = [];
        for (const p of stars) {
            if (!reduceMotion) { p.y -= p.drift; p.x += p.vx; p.twPhase += p.twSpeed * 0.05; }
            if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
            if (p.x < -4) p.x = W + 4; else if (p.x > W + 4) p.x = -4;
            p._x = p.x + panX * p.depth * 60;
            p._y = p.y + panY * p.depth * 38;
            if (p.link) linkers.push(p);
        }
        for (let i = 0; i < linkers.length; i++) {
            const a = linkers[i];
            for (let j = i + 1; j < linkers.length; j++) {
                const b = linkers[j];
                const dx = a._x - b._x, dy = a._y - b._y;
                const d2 = dx * dx + dy * dy;
                if (d2 < linkDist2) {
                    const prox = 1 - Math.sqrt(d2) / linkDist;
                    // 连线中点靠近鼠标 → 增亮，形成"光标牵引星网"的效果
                    const mx = (a._x + b._x) * 0.5, my = (a._y + b._y) * 0.5;
                    const near = Math.max(0, 1 - Math.hypot(mx - gx, my - gy) / reach);
                    const al = prox * (0.22 + near * 0.4);
                    ctx.strokeStyle = 'rgba(150,205,255,' + al + ')';
                    ctx.lineWidth = 0.5 + near * 0.8;
                    ctx.beginPath();
                    ctx.moveTo(a._x, a._y);
                    ctx.lineTo(b._x, b._y);
                    ctx.stroke();
                }
            }
        }

        // 星点
        for (const p of stars) {
            let alpha = 0.4 + Math.sin(p.twPhase) * 0.35;
            const near = Math.max(0, 1 - Math.hypot(p._x - gx, p._y - gy) / reach);
            alpha = Math.min(1, alpha + near * 0.4);
            const rr = p.r * (1 + near * 1.2);
            const col = p.gold ? '255,215,140' : (p.mag ? '230,160,255' : '190,220,255');
            ctx.fillStyle = 'rgba(' + col + ',' + alpha + ')';
            ctx.beginPath();
            ctx.arc(p._x, p._y, rr, 0, 6.283);
            ctx.fill();
            if (rr > 1.3) {                              // 亮星带十字星芒
                ctx.fillStyle = 'rgba(' + col + ',' + (alpha * 0.12) + ')';
                ctx.beginPath();
                ctx.arc(p._x, p._y, rr * 4, 0, 6.283);
                ctx.fill();
                ctx.strokeStyle = 'rgba(' + col + ',' + (alpha * 0.5) + ')';
                ctx.lineWidth = 0.6;
                const sp = rr * 3.5;
                ctx.beginPath();
                ctx.moveTo(p._x - sp, p._y); ctx.lineTo(p._x + sp, p._y);
                ctx.moveTo(p._x, p._y - sp); ctx.lineTo(p._x, p._y + sp);
                ctx.stroke();
            }
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    function drawMeteors() {
        if (!reduceMotion && meteors.length < 3 && Math.random() < 0.018) spawnMeteor();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = meteors.length - 1; i >= 0; i--) {
            const m = meteors[i];
            if (!reduceMotion) { m.x += m.vx; m.y += m.vy; m.life++; }
            const tx = m.x - (m.vx / m.sp) * m.len;
            const ty = m.y - (m.vy / m.sp) * m.len;
            const fade = Math.min(1, m.life / 8) * Math.max(0, 1 - m.life / m.max);
            const col = m.gold ? '255,220,150' : '170,225,255';
            const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
            g.addColorStop(0, 'rgba(' + col + ',' + (0.9 * fade) + ')');
            g.addColorStop(1, 'rgba(' + col + ',0)');
            ctx.strokeStyle = g;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(tx, ty);
            ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,' + (0.9 * fade) + ')';
            ctx.beginPath();
            ctx.arc(m.x, m.y, 1.6, 0, 6.283);
            ctx.fill();
            if (m.life > m.max || m.x < -m.len || m.x > W + m.len || m.y > H + m.len) meteors.splice(i, 1);
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    // 鼠标 HUD 准星（轻量）
    function drawReticle(t, gx, gy) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.translate(gx, gy);
        ctx.rotate(t * 0.35);
        ctx.strokeStyle = 'rgba(120,210,255,0.18)';
        ctx.lineWidth = 1;
        ctx.setLineDash([9, 10]);
        ctx.beginPath(); ctx.arc(0, 0, 42, 0, 6.283); ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
    }

    function frame() {
        time += reduceMotion ? 0 : 0.016;
        const t = time;

        mouse.idle += 1;
        if (mouse.idle > 90) {
            mouse.tx = 0.5 + Math.cos(t * 0.16) * 0.32;
            mouse.ty = 0.45 + Math.sin(t * 0.2) * 0.18;
        }
        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;

        const gx = mouse.x * W, gy = mouse.y * H;
        const panX = mouse.x - 0.5, panY = mouse.y - 0.5;

        ctx.clearRect(0, 0, W, H);

        // 深空底色
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, 'rgba(6,12,36,0.35)');
        bg.addColorStop(0.5, 'rgba(8,10,32,0.20)');
        bg.addColorStop(1, 'rgba(12,8,34,0.40)');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // 星云
        drawNebulae(panX, panY);

        // 跟随鼠标的星云流光
        ctx.globalCompositeOperation = 'lighter';
        const R = Math.min(W, H) * 0.55;
        const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, R);
        glow.addColorStop(0, 'rgba(90,180,255,0.16)');
        glow.addColorStop(0.45, 'rgba(80,120,255,0.06)');
        glow.addColorStop(1, 'rgba(80,120,255,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'source-over';

        // 主体
        drawShapes(panX, panY);
        drawStars(gx, gy, panX, panY);
        drawMeteors();
        drawReticle(t, gx, gy);

        // 轻暗角
        const vg = ctx.createRadialGradient(W / 2, H * 0.48, Math.min(W, H) * 0.4, W / 2, H * 0.5, Math.max(W, H) * 0.85);
        vg.addColorStop(0, 'rgba(2,4,12,0)');
        vg.addColorStop(1, 'rgba(1,2,8,0.45)');
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
