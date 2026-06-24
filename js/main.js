// ================= 团队数据配置中心 =================
// avatar: 头像图片地址。如果留空 ("")，则显示默认的图标占位符
// link: 点击头像跳转的链接。如果留空，默认为 "#"

const founders = [
    {n: "Zero", r: "联合创始人", tags: ["某大厂资深工程师", "硕士研究生导师(即将)"], b: "资深图形引擎工程师，曾任职于D5渲染器、欢聚时代、网易、多益等头部企业。网易任职期间为《阴阳师》《哈利波特：魔法觉醒》等项目提供引擎技术支持，多益任职期间于《神武》项目组担任开发工作。专注于全局光照、嵌入式 DSL 及工具链优化等方向，发明专利/顶会论文10项，对前沿技术的工程化落地有一定的实践积累。", avatar: "images/Zero.png", link: "https://github.com/FaithZL"},
    {n: "范洪辉", r: "联合创始人", tags: ["教授", "博士","硕士研究生导师"], b: "江苏理工学院教授、博士、硕士生导师，“十四五”计算机科学与技术省重点学科带头人，软件工程国家一流专业负责人，面向对象程序设计国家一流课程负责人。主要研究方向为图形图形处理、机器学习，主持国家重点研发计划子课题、国家自然科学基金、省科技计划项目等科研项目十余项，公开发表SCI/EI论文100余篇。", avatar: "images/Fan.jpg", link: "https://baike.baidu.com/item/%E8%8C%83%E6%B4%AA%E8%BE%89/63345374"},
    {n: "邹刘磊", r: "联合创始人", tags: ["某初创公司CTO", "硕士研究生导师(校外)"], b: "某初创公司CTO，曾于D5渲染器担任图形引擎工程师，曾于网易游戏、阿里巴巴担任游戏引擎工程师。曾担任第十届、第十一届\"数媒竞赛\"（A类竞赛）国赛决赛评委。指导学生获\"大创项目\"省级/国家级3项。研究兴趣集中在计算机图形学、计算成像、计算机视觉，对全局光照、渲染后处理、光场显示等课题较为熟悉，公开发明论文/学术专利20余项。", avatar: "images/GraphZ.jpg", link: "https://github.com/GraphZou"}
];

const coreMembers = [
    {n: "徐安琦", r: "核心成员(架构)", b: "引擎架构工程师、独立游戏开发者，曾就职于莉莉丝游戏与某央企。前期奠定引擎工具链与编辑器架构基础，现持续主导该部分架构演进，专注于系统解耦与工作流搭建。", avatar: "images/AQ.jpg", link: "https://github.com/anqi233"},
    {n: "李昊", r: "核心成员(架构)", b: "引擎架构工程师，专注于高性能引擎的底层系统设计，在多线程计算、内存管理、构建系统及跨平台编译领域积累深厚，为项目提供坚实的架构支撑。", avatar: "images/LH.jpg", link: "https://github.com/lh472266503"},
    {n: "吴学杰", r: "核心成员(架构)", b: "引擎架构工程师，前期深度参与引擎工具链与编辑器核心框架的搭建，现逐渐转向引擎Agent底层架构设计，致力于大模型与智能体技术在引擎中的深度融合。", avatar: "images/WXJ.jpg", link: "https://github.com/JOPLOPOL"},
    {n: "Royalvice", r: "核心成员(算法)", b: "北京邮电大学博士，专注于3D显示、神经渲染及3D AIGC等前沿交叉学科。致力于探索AI算法与传统图形学的结合，并推动学术成果在引擎中的工程化落地。", avatar: "images/Royalvice.png", link: "https://github.com/Royalvice"}
];

const scrollingMembers = [
    {n: "陈康洲", r: "引擎开发（底层）", b: "专注于引擎底层核心模块的研发，深度参与了RHI（图形API）的搭建与完善，现致力于EDSL相关技术的探索与落地。", avatar: "images/CKZ.jpg", link: "https://github.com/michaelchern"},
    {n: "小薯条Peter", r: "引擎开发（底层）", b: "极具极客精神的新生代开发者，深度参与引擎EDSL模块的研发，尤其是其中光栅化管线与底层逻辑的构建。", avatar: "images/Peter.jpg", link: "https://github.com/FriesPeter"},
    {n: "王奕飞", r: "引擎开发（物理）", b: "物理引擎方向开发者，致力于刚体动力学、碰撞检测等核心物理模块的算法实现与性能优化。", avatar: "images/WYF.jpg", link: "https://github.com/BestNeon"},
    {n: "徐志明", r: "引擎开发（渲染）", b: "图形学方向在读硕士，专注于前沿实时渲染算法的跟进与复现，致力于图形管线的技术探索与落地。", avatar: "images/XZM.jpg", link: "https://github.com/xxm123666"},
    {n: "顾晟尧", r: "引擎开发（图像与Agent）", b: "专注于图像处理技术与AI智能体开发，探索计算机视觉与大语言模型在引擎管线中的交叉应用。", avatar: "images/GSY.jpg", link: "https://github.com/whiteThrush"},
    {n: "Beortust", r: "引擎开发（Agent）", b: "开源社区研究员、RWKV生态开发者，专注于LLM底层原理及Agent智能体在游戏引擎中的深度融合。", avatar: "images/Beortust.jpg", link: "https://github.com/Beortext"},
    {n: "张权", r: "引擎开发（Agent）", b: "AI方向在读硕士，专注于引擎内Agent模块的研发，协助推进引擎AI架构的演进，致力于提升引擎工具链的智能化体验。", avatar: "images/ZQ.jpg", link: "https://github.com/fox-zq"},
    {n: "欧阳省文", r: "引擎开发（底层）", b: "专注场景流式加载与几何相关底层算法研发，深度参与大场景资源调度、空间几何与性能优化，致力于提升场景加载与渲染效率。", avatar: "images/OYSW.jpg", link: "https://github.com/6wcczgwszry6"},
    {n: "范泽敏", r: "引擎开发（Agent）", b: "专注于AI智能体开发，探索大语言模型在游戏引擎中的应用，主导三维场景生成等功能。", avatar: "images/FZM.jpg", link: "https://github.com/fzm2017"}
];

// ================= 其它数据 =================
const patentsData = [
    { title: "一种基于三角形邻接信息的沿三维模型表面移动算法", year: "2018" },
    { title: "一种基于离散碰撞检测的借助法线修正位置的移动方法", year: "2019" },
    { title: "一种三维空间内基于降维的实时路径生成方法", year: "2019" },
    { title: "一种带有动态模糊的降低采样数量的渲染加速方法", year: "2019" },
    { title: "基于球坐标图元映射的模型压缩与碰撞检测方法", year: "2020" },
    { title: "一种基于深度缓冲加速的光线追踪渲染方法", year: "2021" },
    { title: "一种基于光线路径复用的动态场景渲染加速方法", year: "2021" },
    { title: "一种基于非对称卷积核的卷积神经网络训练方法", year: "2024" },
    { title: "一种基于高斯先验指导的卷积神经网络结构优化的方法", year: "2024" },
    { title: "基于凸包优化的非均匀数据的聚类方法", year: "2024" },
    { title: "基于密度聚类算法的三维物体碰撞体优化方法", year: "2025" },
    { title: "一种利用光线追踪生成用于图像优化网络的训练数据的方法", year: "2025" }
];

// ================= 页面初始化与交互 =================
document.addEventListener('DOMContentLoaded', () => {
    renderTeam();
    renderPatents();
    initSlider();
    initClipboard();
    initSceneAccordion();
});

// ================= 渲染效果展示：纵向手风琴（鼠标选择展开） =================
function initSceneAccordion() {
    const acc = document.getElementById('sceneAccordion');
    if (!acc) return;
    const panels = acc.querySelectorAll('.scene-panel');
    const activate = (panel) => {
        panels.forEach(p => p.classList.toggle('active', p === panel));
    };
    panels.forEach(panel => {
        panel.addEventListener('mouseenter', () => activate(panel));
        panel.addEventListener('click', () => activate(panel));
        panel.addEventListener('focus', () => activate(panel));
    });
}

function renderTeam() {
    // 1. 渲染联合创始人
    const foundersContainer = document.getElementById('foundersContainer');
    if (foundersContainer) {
        foundersContainer.innerHTML = founders.map(f => `
            <div class="member-card founder-card">
                <div class="profile-header">
                    <a href="${f.link || '#'}" target="${f.link && f.link !== '#' ? '_blank' : '_self'}" class="avatar-link">
                        ${f.avatar ? `<img src="${f.avatar}" class="avatar" alt="${f.n}">` : `<div class="avatar-placeholder"><i class="fas fa-user-tie"></i></div>`}
                    </a>
                    <div class="name-info">
                        <div class="name-title-row">
                            <h3>${f.n}</h3><span class="role-text">${f.r}</span>
                        </div>
                        <div class="tag-container">
                            ${f.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <p class="bio">${f.b}</p>
            </div>
        `).join('');
    }

    // 2. 渲染核心成员
    const coreMembersContainer = document.getElementById('coreMembersContainer');
    if (coreMembersContainer) {
        coreMembersContainer.innerHTML = coreMembers.map(m => `
            <div class="core-member-card">
                <div class="profile-header">
                    <a href="${m.link || '#'}" target="${m.link && m.link !== '#' ? '_blank' : '_self'}" class="avatar-link">
                        ${m.avatar ? `<img src="${m.avatar}" class="avatar" alt="${m.n}">` : `<div class="avatar-placeholder"><i class="fas fa-user-astronaut"></i></div>`}
                    </a>
                    <div class="name-info">
                        <div class="name-title-row"><h3>${m.n}</h3><span class="role-text">${m.r}</span></div>
                    </div>
                </div>
                <p class="bio" style="margin:0;">${m.b}</p>
            </div>
        `).join('');
    }

    // 3. 渲染跑马灯成员
    const marqueeTrack = document.getElementById('marqueeTrack');
    if (marqueeTrack) {
        const baseCards = scrollingMembers.map(m => `
            <div class="scrolling-card">
                <div class="profile-header">
                    <a href="${m.link || '#'}" target="${m.link && m.link !== '#' ? '_blank' : '_self'}" class="avatar-link" style="text-decoration:none;">
                        ${m.avatar ? `<img src="${m.avatar}" class="avatar" alt="${m.n}">` : `<div class="avatar-placeholder"><i class="fas fa-ghost"></i></div>`}
                    </a>
                    <div class="name-info"><div class="name-title-row"><h3>${m.n}</h3></div><span class="role-text">${m.r}</span></div>
                </div>
                <p class="bio" style="margin:0;">${m.b}</p>
            </div>
        `).join('');
        marqueeTrack.innerHTML = baseCards + baseCards;
    }
}

// ================= 页脚联系方式：单击复制到剪贴板 =================
function initClipboard() {
    document.querySelectorAll('.contact-item[data-copy]').forEach(el => {
        const original = el.getAttribute('data-tip');
        let timer = null;

        const showCopied = () => {
            el.setAttribute('data-tip', '已复制 ✓');
            el.classList.add('copied');
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                el.setAttribute('data-tip', original);
                el.classList.remove('copied');
            }, 1400);
        };

        const doCopy = () => {
            const text = el.getAttribute('data-copy');
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(showCopied).catch(() => fallbackCopy(text, showCopied));
            } else {
                fallbackCopy(text, showCopied);
            }
        };

        el.addEventListener('click', doCopy);
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doCopy(); }
        });
    });
}

function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); if (cb) cb(); } catch (e) {}
    document.body.removeChild(ta);
}

function renderPatents() {
    const patentsContainer = document.getElementById('patentsContainer');
    if (patentsContainer) {
        patentsContainer.innerHTML = patentsData.map(p => `
            <div class="patent-item" title="${p.title}">
                <span class="patent-year">${p.year}</span>
                <span class="patent-title">${p.title}</span>
            </div>
        `).join('');
    }
}

// ================= 滑动控制逻辑 =================
let currentIndex = 0;
const totalSlides = document.querySelectorAll('.slide').length;

function initSlider() {
    updateNav();
}

// slide index → nav item index 映射（导航栏有5个条目，但只有3页slide）
const slideNavMap = [0, 1, 4];

function updateNav() {
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length) {
        navItems.forEach(function(item, i) {
            item.classList.toggle('active', i === slideNavMap[currentIndex]);
        });
    }
}

function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    const track = document.getElementById('sliderTrack');
    currentIndex = index;
    if (track) track.style.transform = `translateX(-${currentIndex * 100}vw)`;
    updateNav();
}

window.goToSlide = goToSlide; // 暴露给 HTML 中的 onclick
