// ================= 团队数据配置中心 =================
// avatar: 头像图片地址。如果留空 ("")，则显示默认的图标占位符
// link: 点击头像跳转的链接。如果留空，默认为 "#"

const founders = [
    {n: "范洪辉", r: "联合创始人", tags: ["教授", "博士","硕士研究生导师"], b: "江苏理工学院教授、博士、硕士生导师。十四五计算机科学与技术省重点学科带头人，软件工程国家一流专业负责人。专注于图形图像处理与机器学习，发表 SCI/EI 论文 100 余篇。", exp: "现任江苏理工学院 <b>教授、博士及硕士生导师</b>。<br><br>担任 <b>\"十四五\" 计算机科学与技术省重点学科带头人</b>。<br><br>主导 <b>软件工程</b> 国家一流专业建设。<br><br>负责 <b>《面向对象程序设计》</b> 国家一流课程建设。", tech: "专注于 <b>图形图像处理</b> 与 <b>机器学习</b> 等底层与前沿领域。<br><br>在学术理论与计算机图形学交叉领域具有深厚的研究积累。", ach: "累计主持 <b>国家级科研项目 10 余项</b>。<br><br>发表 <b>SCI / EI 论文 100 余篇</b>。", avatar: "images/Fan.jpg", link: "https://baike.baidu.com/item/%E8%8C%83%E6%B4%AA%E8%BE%89/63345374", detail: true},
    {n: "Zero", r: "联合创始人", tags: ["前网易/D5资深工程师"], b: "资深图形引擎工程师。专注全局光照与嵌入式DSL优化，曾为《阴阳师》等国内S级顶流商业项目提供核心引擎技术支持，具备深厚的前沿技术工程化落地经验。", exp: "曾任职于 <b>D5渲染器、欢聚时代、网易、多益</b> 等头部企业。<br><br>网易期间为 <b>《阴阳师》《哈利波特：魔法觉醒》</b> 等项目提供引擎技术支持。<br><br>多益期间于 <b>《神武》</b> 项目组担任核心开发。", tech: "专注于 <b>全局光照 (GI)</b>、<b>嵌入式 DSL</b> 及 <b>工具链优化</b> 等底层方向。<br><br>对前沿技术的工业级、工程化落地具有丰富的实践积累。", ach: "累计发表/产出 <b>发明专利与顶级会议论文 10 项</b>。", avatar: "images/Zero.png", link: "https://github.com/FaithZL", detail: true},
    {n: "邹刘磊", r: "联合创始人", tags: ["某初创公司CTO", "校外硕士研究生导师"], b: "某初创公司CTO。曾于D5渲染器、网易游戏、阿里巴巴担任图形与游戏引擎工程师。深耕计算机图形学、计算成像与计算机视觉，公开专利/论文 20 余项，曾任A类竞赛国赛决赛评委。", exp: "现任 <b>某初创公司 CTO</b>。<br><br>曾先后就职于 <b>D5渲染器、网易游戏</b> 及 <b>阿里巴巴</b>，担任图形与游戏引擎工程师。", tech: "深耕于 <b>计算机图形学、计算成像</b> 与 <b>计算机视觉</b> 等前沿领域。<br><br>对 <b>全局光照、渲染后处理、光场显示</b> 等硬核课题具有丰富的实战与研究经验。", ach: "累计公开发表 <b>发明论文与学术专利 20 余项</b>。<br><br>曾任第十届/第十一届 <b>\"数媒竞赛\"（A类）国赛决赛评委</b>，指导学生斩获省级/国家级 <b>\"大创项目\" 3 项</b>。", avatar: "images/GraphZ.jpg", link: "https://github.com/GraphZou", detail: true}
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
    var container = document.getElementById('creditsContainer') || document.getElementById('teamBento');
    if (!container) return;

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function(ch) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[ch];
        });
    }

    function memberButton(person, className, roleText) {
        return '<button class="team-force-member ' + className + '" type="button" data-member-name="' + escapeHtml(person.n) + '">' +
            '<span class="team-force-role">' + escapeHtml(roleText || person.r || '') + '</span>' +
            '<span class="team-force-name">' + escapeHtml(person.n) + '</span>' +
            '</button>';
    }

    var founderHtml = founders.map(function(person) {
        return memberButton(person, 'lead', person.tags ? person.tags.join(' / ') : person.r);
    }).join('');

    var coreHtml = coreMembers.map(function(person) {
        return memberButton(person, 'core-member', person.r);
    }).join('');

    var supportHtml = scrollingMembers.map(function(person) {
        return memberButton(person, 'support', person.r);
    }).join('');

    container.innerHTML =
        '<div class="team-force-row founders">' + founderHtml + '</div>' +
        '<div class="team-force-row core">' + coreHtml + '</div>' +
        '<div class="team-force-row development">' + supportHtml + '</div>';

    container.querySelectorAll('[data-member-name]').forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            showMemberModalByName(button.getAttribute('data-member-name'));
        });
    });
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
    var allHtml = patentsData.map(function(p) {
        return '<div class="patent-item" title="' + p.title + '"><span class="patent-year">' + p.year + '</span><span class="patent-title">' + p.title + '</span></div>';
    }).join('');
    var top8 = patentsData.slice(0, 8).map(function(p) {
        return '<div class="patent-item" title="' + p.title + '"><span class="patent-year">' + p.year + '</span><span class="patent-title">' + p.title + '</span></div>';
    }).join('');
    var c1 = document.getElementById('patentsContainer');
    if (c1) c1.innerHTML = top8;
    var c2 = document.getElementById('patentsFullContainer');
    if (c2) c2.innerHTML = allHtml;
}

// ================= 滑动控制逻辑 =================
let currentIndex = 0;
const totalSlides = document.querySelectorAll('.slide').length;

function initSlider() {
    updateNav();
}

// slide index → nav item index 映射（导航栏有5个条目，但只有3页slide）
const slideNavMap = [0, 1, 2, 4];

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
