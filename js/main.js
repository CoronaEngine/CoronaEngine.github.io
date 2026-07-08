// ================= 团队数据配置中心 =================
// avatar: 头像图片地址。如果留空 ("")，则显示默认的图标占位符
// link: 点击头像跳转的链接。如果留空，默认为 "#"

const founders = [
    {n: "范洪辉", r: "联合创始人", tags: ["教授", "博士", "硕士生导师"], b: "江苏理工学院教授、博士、硕士生导师，\"十四五\"计算机科学与技术省重点学科带头人，软件工程国家一流专业负责人，面向对象程序设计国家一流课程负责人。主要研究方向为图形图像处理、机器学习，主持国家重点研发计划子课题、国家自然科学基金、省科技计划项目等科研项目十余项，公开发表SCI/EI论文100余篇。", exp: "江苏理工学院教授、博士、硕士生导师，\"十四五\"计算机科学与技术省重点学科带头人，软件工程国家一流专业负责人，面向对象程序设计国家一流课程负责人。主要研究方向为图形图像处理、机器学习，主持国家重点研发计划子课题、国家自然科学基金、省科技计划项目等科研项目十余项，公开发表SCI/EI论文100余篇。", avatar: "images/Fan.jpg", link: "https://baike.baidu.com/item/%E8%8C%83%E6%B4%AA%E8%BE%89/63345374", detail: true},
    {n: "Zero", r: "联合创始人", tags: ["资深图形引擎工程师"], b: "资深图形引擎工程师，曾任职于D5渲染器、欢聚时代、网易、多益等头部企业。网易任职期间为《阴阳师》《哈利波特：魔法觉醒》等项目提供引擎技术支持，多益任职期间于《神武》项目组担任开发工作。专注于全局光照、嵌入式 DSL 及工具链优化等方向，发明专利/顶会论文10项，对前沿技术的工程化落地有一定的实践积累。", exp: "资深图形引擎工程师，曾任职于D5渲染器、欢聚时代、网易、多益等头部企业。网易任职期间为《阴阳师》《哈利波特：魔法觉醒》等项目提供引擎技术支持，多益任职期间于《神武》项目组担任开发工作。专注于全局光照、嵌入式 DSL 及工具链优化等方向，发明专利/顶会论文10项，对前沿技术的工程化落地有一定的实践积累。", avatar: "images/Zero.png", link: "https://github.com/FaithZL", detail: true},
    {n: "邹刘磊", r: "联合创始人", tags: ["某初创公司CTO", "校外硕士研究生导师"], b: "某初创公司CTO，硕士研究生导师（校外），曾于D5渲染器担任图形引擎工程师，曾于网易游戏、阿里巴巴担任游戏引擎工程师。曾担任第十届、第十一届\"数媒竞赛\"（A类竞赛）国赛决赛评委。指导学生获\"大创项目\"省级/国家级3项。研究兴趣集中在计算机图形学、计算成像、计算机视觉，对全局光照、渲染后处理、光场显示等课题较为熟悉，公开发明论文/学术专利20余项。", exp: "某初创公司CTO，硕士研究生导师（校外），曾于D5渲染器担任图形引擎工程师，曾于网易游戏、阿里巴巴担任游戏引擎工程师。曾担任第十届、第十一届\"数媒竞赛\"（A类竞赛）国赛决赛评委。指导学生获\"大创项目\"省级/国家级3项。研究兴趣集中在计算机图形学、计算成像、计算机视觉，对全局光照、渲染后处理、光场显示等课题较为熟悉，公开发明论文/学术专利20余项。", avatar: "images/GraphZ.jpg", link: "https://github.com/GraphZou", detail: true}
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
    {n: "范泽敏", r: "引擎开发（Agent）", b: "专注于AI智能体开发，探索大语言模型在游戏引擎中的应用，主导三维场景生成等功能。", avatar: "images/FZM.jpg", link: "https://github.com/fzm2017"},
    {n: "杨星启", r: "引擎开发（产品设计）", b: "专注于引擎前端页面的设计与开发，负责官网及编辑器界面的视觉呈现与交互体验，致力于将复杂的引擎功能以直观友好的方式呈现给用户。", avatar: "images/YXQ.jpg", link: "https://github.com/lanmoliu-ops"},
    {n: "赵嘉琪", r: "引擎开发（产品设计）", b: "专注于引擎前端页面的设计与开发，负责官网及编辑器界面的视觉呈现与交互体验，致力于将复杂的引擎功能以直观友好的方式呈现给用户。", avatar: "images/ZJQ.jpg", link: ""},
    {n: "王丹敏", r: "引擎开发（产品设计）", b: "专注于引擎前端页面的设计与开发，负责官网及编辑器界面的视觉呈现与交互体验，致力于将复杂的引擎功能以直观友好的方式呈现给用户。", avatar: "images/WDM.jpg", link: ""},
    {n: "黄俊霖", r: "引擎开发（编辑器与工具链）", b: "负责引擎前端开发及整体技术方案的落地，参与引擎官网与工具链前端的构建与维护。", avatar: "images/HJL.jpg", link: "https://github.com/ALazyDog-oh"},
    {n: "霍笑甜", r: "引擎开发（编辑器与工具链）", b: "负责引擎前端开发及整体技术方案的落地，参与引擎官网与工具链前端的构建与维护。", avatar: "images/HXT.jpg", link: "https://github.com/Paper206422"}
];

// ================= 其它数据 =================
const patentsData = [
    { label: "资源调度与场景预览系统", tag: "2026 · 国家级", full: "基于大模型与流式加载的资源调度与场景预览系统", year: "2026", level: "国家级" },
    { label: "立体显示交互系统", tag: "2025 · 国家级", full: "基于牛顿力学仿真与光照传输模拟的实时交互式立体显示系统", year: "2025", level: "国家级" },
    { label: "三维美术资源生成系统", tag: "2024 · 省级", full: "基于PCG与AIGC的三维美术资源生成与预览系统", year: "2024", level: "省级" },
    { label: "分布式仿真辅助设计系统", tag: "2022 · 国家级", full: "基于Image-Based三维重建与Physically-Based渲染的分布式仿真模拟与辅助设计系统", year: "2022", level: "国家级" },
    { label: "MLT分布式渲染系统", tag: "2020 · 国家级", full: "基于Metropolis Light Transport的分布式渲染系统", year: "2020", level: "国家级" },
    { label: "物理仿真海洋探索系统", tag: "2019 · 国家级", full: "基于Real-Time Path Tracing与Reinforcement Learning的在物理仿真下的海洋探索系统", year: "2019", level: "国家级" },
    { label: "多语言实时交互仿真系统", tag: "2019 · 省级", full: "基于Photon Mapping与Deep Learning的多语言实时交互仿真系统的研究与开发", year: "2019", level: "省级" },
    { label: "编程语言教学系统", tag: "2018 · 国家级", full: "基于Real-Time Ray Tracing的编程语言教学系统", year: "2018", level: "国家级" }
];

// CCF-A 顶会论文（金色 · 最内层）
const ccfaPapers = [
    { label: "Real-Time Light Field Tracing", tag: "录用 · CCF-A会议", full: "Real-Time Light Field Tracing via Display-Architecture Alignment", year: "2026", venue: "顶会 SIGGRAPH", status: "已公开" },
    { label: "Light-Field Path Tracing", tag: "录用 · CCF-A会议", full: "Real-Time Light-Field Path Tracing for 3D Displays via Sparse Spatial-Angular-Temporal Reconstruction", year: "2026", venue: "顶会 SIGGRAPH", status: "已公开" },
    { label: "Topology-Aware Polymorphism", tag: "公开 · CCF-A会议", full: "Topology-Aware Polymorphism for Embedded Shading Languages", year: "2025", venue: "顶会 SIGGRAPH ASIA", status: "已公开" },
    { label: "游戏生成", tag: "投稿中 · CCF-A会议", full: "游戏生成", year: "2026", venue: "SIGGRAPH ASIA", status: "投稿中" },
    { label: "光场UI算法", tag: "投稿中 · CCF-A会议", full: "光场UI算法", year: "2026", venue: "SIGGRAPH ASIA", status: "投稿中" }
];

// 学术论文（紫色 · 第二层）
const academicPapers = [
    { label: "SK-GAN", tag: "中科院四区 · 投稿中", full: "SK-GAN: Selective Kernel Channel Based Generative Adversarial Network for Image Restoration on Industrial Parts", year: "2026", venue: "中科院四区", status: "投稿中" },
    { label: "跨学科学业表现建模", tag: "中科院四区 · 投稿中", full: "Hybrid Three-Level Modeling of Cross-Disciplinary Academic Performance in Higher Education", year: "2026", venue: "中科院四区", status: "投稿中" },
    { label: "Diagnostic-Driven MLT", tag: "中科院四区 · 投稿中", full: "Diagnostic-Driven Metropolis Light Transport with Adaptive Parameter Control", year: "2026", venue: "中科院四区", status: "投稿中" },
    { label: "Visibility-Driven MLT", tag: "2025 · 中科院四区", full: "Removing Initialization Phase of Visibility-Driven Metropolis Light Transport", year: "2025", venue: "中科院四区", status: "已公开" },
    { label: "Hot Reloading Runtime", tag: "2025 · EI会议", full: "Hot Reloading for Runtime Code Modifiability via File Monitoring and Dependency Analysis", year: "2025", venue: "EI会议", status: "已公开" },
    { label: "Shadow Maps Enhancement", tag: "2024 · EI会议", full: "Enhancing Shadow Maps via Screen-Space Visibility", year: "2024", venue: "EI会议", status: "已公开" },
    { label: "Parameter-Free MLT", tag: "2022 · EI会议", full: "Parameter-Free Single-Pass Parallel Metropolis Light Transport with Sensor Path Visibility", year: "2022", venue: "EI会议", status: "已公开" },
    { label: "多智能体场景创作机制", tag: "中文核心 · 投稿中", full: "基于状态节点介入与上下文意图保持的多智能体三维场景迭代创作机制", year: "2026", venue: "中文核心", status: "投稿中" },
];

// 学生项目（绿色 · 最外层）
const studentProjects = [
    { title: "一种基于三角形邻接信息的沿三维模型表面移动算法", tag: "2018 · 专利", label: "三角形邻接信息移动算法" },
    { title: "一种基于离散碰撞检测的借助法线修正位置的移动方法", tag: "2019 · 专利", label: "法线修正碰撞移动方法" },
    { title: "一种三维空间内基于降维的实时路径生成方法", tag: "2019 · 专利", label: "降维实时路径生成方法" },
    { title: "一种带有动态模糊的降低采样数量的渲染加速方法", tag: "2019 · 专利", label: "动态模糊降采样加速方法" },
    { title: "基于球坐标图元映射的模型压缩与碰撞检测方法", tag: "2020 · 专利", label: "球坐标图元模型压缩方法" },
    { title: "一种基于深度缓冲加速的光线追踪渲染方法", tag: "2021 · 专利", label: "深度缓冲加速光追渲染" },
    { title: "一种基于光线路径复用的动态场景渲染加速方法", tag: "2021 · 专利", label: "光线路径复用渲染加速" },
    { title: "一种基于非对称卷积核的卷积神经网络训练方法", tag: "2024 · 专利", label: "非对称卷积核训练方法" },
    { title: "一种基于高斯先验指导的卷积神经网络结构优化的方法", tag: "2024 · 专利", label: "高斯先验卷积网络优化方法" },
    { title: "基于凸包优化的非均匀数据的聚类方法", tag: "2024 · 专利", label: "凸包优化聚类方法" },
    { title: "基于密度聚类算法的三维物体碰撞体优化方法", tag: "2025 · 专利", label: "密度聚类碰撞体优化方法" },
    { title: "一种利用光线追踪生成用于图像优化网络的训练数据的方法", tag: "2025 · 专利", label: "光追训练数据生成方法" },
    { title: "一种基于屏幕空间阴影的阴影贴图优化方法", tag: "2025 · 专利", label: "屏幕空间阴影优化方法" },
    { title: "一种基于物理仿真与智能体协同的三维场景生成与编辑方法", tag: "2026 · 专利", label: "智能体协同场景生成方法" },
    { title: "一种基于显示与架构对齐的光场路径追踪调度方法", tag: "2026 · 专利", label: "光场路径追踪调度方法" },
    { title: "一种基于稀疏时空角重建的实时光场渲染方法", tag: "2026 · 专利", label: "稀疏时空角光场渲染方法" },
    { title: "一种基于显示原生光线映射的子像素级光线生成方法", tag: "2026 · 专利", label: "子像素光线生成方法" }
];

// ================= 页面初始化与交互 =================
document.addEventListener('DOMContentLoaded', () => {
    renderFeatureBlocks();
    renderTeam();
    renderPatents();
    renderPapers();
    initSlider();
    initClipboard();
    initSceneAccordion();
    initOrbitSystem();
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

// ================= 核心业务与渲染展示（按前端左右分栏组织） =================
// 每栏第一项为重点大块，其余为小方块；新增/调整功能只需在对应栏内增删条目
const bentoLayout = {
    // 左栏 · 创作者：零基础创作沙盒 + 4 个小块
    creatorGrid: [
        { title: "零基础创作沙盒，让灵感即刻落地", tag: "Creation Sandbox", icon: "fas fa-wand-magic-sparkles", tone: "sandbox", detail: "专为学生与初学者打造，让创意不再被技术壁垒阻挡。告别传统繁杂的引擎面板，无论你是是否有美术与技术基础，只需带上灵感，就能在这里轻松拼搭出心中的游戏世界。" },
        { title: "可视化编程", tag: "Visual Scripting", icon: "fas fa-puzzle-piece", tone: "sandbox", detail: "用直观的逻辑模块代替生涩代码，所见即所得。" },
        { title: "协同编辑", tag: "AI Scene Assistant", icon: "fas fa-robot", tone: "sandbox", detail: "多人实时协作的场景编辑能力，像在线文档一样顺畅高效。" },
        { title: "所见即所得", tag: "Beginner Ecosystem", icon: "fas fa-seedling", tone: "sandbox", detail: "搭建与游玩无缝切换，无需等待，随时随地测试你的每一个灵感。" },
        { title: "AI 助手", tag: "Real-Time Collaboration", image: "render/3.png", icon: "fas fa-users-gear", tone: "sandbox", detail: "智能化辅助构建、美术资产一键生成，大幅降低场景搭建的时间成本。" }
    ],
    // 右栏 · 开发者：突破边界 + 8 个小块
    devGrid: [
        { title: "突破边界，专为硬核而生", tag: "Research Native", icon: "fas fa-circle-nodes", tone: "research", detail: "为挑战游戏开发、影视制作等数字内容创作中的特殊需求而设计。提供极具深度的底层控制力，助力前沿学术探索与工业级图形技术突破。" },
        { title: "多线程", tag: "Native Multithreading", icon: "fas fa-bolt", tone: "research", detail: "原生多线程架构，任务调度与并行计算深度融合，充分释放多核算力，保障大规模场景的高效运行。" },
        { title: "物理", tag: "Physics", icon: "fas fa-atom", tone: "research", detail: "刚体动力学与碰撞检测系统，为交互与仿真提供真实可信的物理表现。" },
        { title: "动画", tag: "Animation", icon: "fas fa-person-running", tone: "research", detail: "骨骼动画与状态混合系统，让角色与物体的运动自然流畅。" },
        { title: "全局光照", tag: "Global Illumination", image: "render/1.png", icon: "fas fa-sun", tone: "research", detail: "硬件光追与光栅化双管线并行：硬件光线追踪实现物理级间接光照，光栅化路径以 RSM + SSR 提供高性能近似，在画质与帧率之间灵活取舍。" },
        { title: "立体显示", tag: "Light Field · 裸眼3D", image: "render/2.png", icon: "fas fa-cube", tone: "research", detail: "面向光场显示设备的实时渲染管线，无需佩戴任何设备即可呈现真实立体的裸眼 3D 画面，针对空间-角度-时间维度做稀疏重建优化。" },
        { title: "C++/JS/Py三层架构", tag: "Layered Architecture", icon: "fas fa-layer-group", tone: "research", detail: "C++ 高性能内核、JavaScript 逻辑层、Python 脚本层三层协同，兼顾运行效率与开发灵活性。" },
        { title: "自研EDSL语言", tag: "Embedded DSL", icon: "fas fa-microchip", tone: "research", detail: "自研嵌入式领域特定语言（EDSL），统一 CPU-GPU 异构编程，以简洁语法释放极致算力。" },
        { title: "流式加载", tag: "Streaming Loading", icon: "fas fa-download", tone: "research", detail: "大场景资源按需流式调度，实现超大世界的无缝加载与渲染，显著降低内存占用。" },
    ]
};

function renderFeatureBlocks() {
    Object.keys(bentoLayout).forEach(function(gridId) {
        var grid = document.getElementById(gridId);
        if (grid) renderBizItems(grid, bentoLayout[gridId]);
    });
}

function renderBizItems(container, items) {
    container.innerHTML = '';

    function buildBlock(item, isFeatured) {
        var block = document.createElement('div');
        block.className = 'bento-block' + (isFeatured ? ' bento-featured expanded' : '');
        if (item.image) {
            block.classList.add('has-image');
            block.style.setProperty('--feature-image', 'url("' + item.image + '")');
        }

        var iconWrap = document.createElement('div');
        iconWrap.className = 'bento-block-icon';
        var iconEl = document.createElement('i');
        iconEl.className = item.icon || 'fas fa-circle';
        iconWrap.appendChild(iconEl);
        block.appendChild(iconWrap);

        var title = document.createElement('h3');
        title.className = 'bento-block-title';
        title.textContent = item.title;
        block.appendChild(title);

        if (item.tag) {
            var tag = document.createElement('span');
            tag.className = 'bento-block-tag';
            tag.textContent = item.tag;
            block.appendChild(tag);
        }

        var detail = document.createElement('div');
        detail.className = 'bento-block-detail';
        if (item.detail) {
            var body = document.createElement('p');
            body.className = 'bento-detail-body';
            body.textContent = item.detail;
            detail.appendChild(body);
        }
        if (Array.isArray(item.items) && item.items.length) {
            var ul = document.createElement('ul');
            ul.className = 'bento-detail-list';
            item.items.forEach(function(li) {
                var liEl = document.createElement('li');
                var liIcon = document.createElement('i');
                liIcon.className = li.icon || 'fas fa-check';
                var liText = document.createElement('span');
                liText.textContent = li.text || String(li);
                liEl.appendChild(liIcon);
                liEl.appendChild(liText);
                ul.appendChild(liEl);
            });
            detail.appendChild(ul);
        }
        block.appendChild(detail);

        // 鼠标悬停展开/移出收起：块内显示具体内容
        block.addEventListener('mouseenter', function() {
            container.querySelectorAll('.bento-block.expanded').forEach(function(b) {
                if (b !== block) b.classList.remove('expanded');
            });
            block.classList.add('expanded');
        });

        return block;
    }

    // 第一个块为重点块
    container.appendChild(buildBlock(items[0], true));
    // 其余为小方块
    items.slice(1).forEach(function(item) {
        container.appendChild(buildBlock(item, false));
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

    // 每个名字包一层 wrap，内含按钮 + 悬浮卡片
    function creditBtn(person, isFounder) {
        var tagsHtml = '';
        if (Array.isArray(person.tags) && person.tags.length) {
            tagsHtml = '<div class="team-hover-tags">' +
                person.tags.map(function(t) { return '<span class="team-hover-tag">' + escapeHtml(t) + '</span>'; }).join('') +
                '</div>';
        }
        return '<span class="credit-name-wrap' + (isFounder ? ' founder-wrap' : '') + '" data-member-name="' + escapeHtml(person.n) + '">' +
            '<button class="credit-name-btn" type="button">' + escapeHtml(person.n) + '</button>' +
            '<div class="team-hover-card" role="tooltip">' +
                '<div class="team-hover-left">' +
                    '<img class="team-hover-avatar" src="' + escapeHtml(person.avatar || '') + '" alt="' + escapeHtml(person.n) + '">' +
                    '<h4>' + escapeHtml(person.n) + '</h4>' +
                    '<span class="team-hover-role">' + escapeHtml(person.r || '') + '</span>' +
                    tagsHtml +
                '</div>' +
                '<div class="team-hover-right">' +
                    '<p class="team-hover-bio">' + escapeHtml(person.b || person.exp || '') + '</p>' +
                '</div>' +
            '</div>' +
            '</span>';
    }

    var label1 = '<div class="credit-section-label"><span>创始人</span></div>';
    var row1 = '<div class="credit-names-row">' +
        founders.map(function(p) { return creditBtn(p, true); }).join('') +
        '</div>';

    var label2 = '<div class="credit-section-label"><span>核心团队</span></div>';

    var allMembers = [].concat(coreMembers, scrollingMembers);
    var chunkSize = Math.ceil(allMembers.length / 3);
    var rows2 = '';
    for (var i = 0; i < 3; i++) {
        var chunk = allMembers.slice(i * chunkSize, (i + 1) * chunkSize);
        if (chunk.length > 0) {
            rows2 += '<div class="credit-names-row">' +
                chunk.map(function(p) { return creditBtn(p); }).join('') +
                '</div>';
        }
    }

    var label3 = '<div class="credit-section-label"><span>加入我们</span></div>';
    var row3 = '<div class="credit-join-row">' +
        '<a href="https://www.jsut.edu.cn" target="_blank" rel="noopener noreferrer"><img src="logo/jsut_logo.svg" class="footer-logo" alt="江苏理工学院"></a>' +
        '<span class="contact-item" tabindex="0" role="button" data-copy="fanhonghui@jsut.edu.cn" data-tip="fanhonghui@jsut.edu.cn" aria-label="复制邮箱"><i class="fas fa-envelope"></i></span>' +
        '<span class="contact-item" tabindex="0" role="button" data-copy="939557353" data-tip="QQ群：939557353" aria-label="复制QQ群号"><i class="fab fa-qq"></i></span>' +
        '</div>';

    container.innerHTML = label1 + row1 + label2 + rows2 + label3 + row3;

    // 悬停联动：模糊周边、显示当前卡片
    container.classList.add('team-hover-ready');
    container.querySelectorAll('.credit-name-wrap').forEach(function(wrap) {
        wrap.addEventListener('mouseenter', function() {
            container.classList.add('has-hover');
            wrap.classList.add('hovered');
        });
        wrap.addEventListener('mouseleave', function() {
            container.classList.remove('has-hover');
            wrap.classList.remove('hovered');
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

function renderPapers() {
    function tagClass(item) {
        return item.status === '投稿中'
            ? 'style="background:rgba(148,163,184,0.08);color:#94a3b8;border-color:rgba(148,163,184,0.28);"'
            : 'style="background:rgba(220,180,60,0.08);color:#e8c860;border-color:rgba(220,180,60,0.35);"';
    }
    function cardHtml(item, goldStyle) {
        var tStyle = goldStyle
            ? 'style="background:rgba(220,180,60,0.08);color:#e8c860;border-color:rgba(220,180,60,0.35);"'
            : 'style="background:rgba(180,150,240,0.08);color:#c8b8f8;border-color:rgba(180,150,240,0.30);"';
        return '<div class="pub-card-new" title="' + item.full + '">' +
            '<div><span class="pub-tag" ' + tStyle + '>' + item.year + '</span> ' +
            '<span class="pub-tag" ' + tStyle + '>' + item.venue + '</span> ' +
            '<span class="pub-tag" ' + tagClass(item) + '>' + item.status + '</span></div>' +
            '<div class="pub-title-new" style="margin-top:8px;">' + item.full + '</div></div>';
    }
    var html = ccfaPapers.map(function(p) { return cardHtml(p, true); }).join('') +
        academicPapers.map(function(p) { return cardHtml(p, false); }).join('');
    var container = document.getElementById('papersFullContainer');
    if (container) container.innerHTML = html;
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

// ================= 行星轨道 – 学术成果 =================
function initOrbitSystem() {
    const universe = document.getElementById('orbitUniverse');
    if (!universe) return;

    // 第一层（金色）：CCF-A 顶会论文
    const ring1 = ccfaPapers.map(function(p) { return { label: p.label, tag: p.tag, full: p.full }; });

    // 第二层（紫色）：学术论文
    const ring2 = academicPapers.map(function(p) { return { label: p.label, tag: p.tag, full: p.full }; });

    // 第三层（蓝色）：发明专利
    const ring3 = patentsData.map(function(p) { return { label: p.label, tag: p.tag, full: p.full }; });

    // 第四层（绿色）：学生项目
    const ring4 = studentProjects.map(function(p) { return { label: p.label, tag: p.tag, full: p.title }; });

    // 四层轨道：由里到外，卫星尺寸逐步变小，速度逐步加快
    const orbits = [
        { items: ring1, radius: 340, tiltDeg: 66, speed: 0.0022, type: 'ccfa', sizeClass: 'sat-xl', angle: 0 },
        { items: ring2, radius: 500, tiltDeg: 64, speed: 0.0026, type: 'academic', sizeClass: '', angle: Math.PI / 4 },
        { items: ring3, radius: 680, tiltDeg: 62, speed: 0.0034, type: 'patent', sizeClass: 'sat-sm', angle: Math.PI / 6 },
        { items: ring4, radius: 800, tiltDeg: 58, speed: 0.0038, type: 'student', sizeClass: 'sat-xs', angle: Math.PI / 3 }
    ];

    // 设置视觉轨道环尺寸，并绑定 hover 暂停
    const tracks = [document.getElementById('orbitTrack1'), document.getElementById('orbitTrack2'), document.getElementById('orbitTrack3'), document.getElementById('orbitTrack4')];
    orbits.forEach(function(o, i) {
        var t = tracks[i];
        if (!t) return;
        var tiltRad = o.tiltDeg * Math.PI / 180;
        var w = o.radius * 2;
        var h = o.radius * 2 * Math.cos(tiltRad);
        t.style.width = w + 'px';
        t.style.height = h + 'px';
        t.style.marginLeft = (-o.radius) + 'px';
        t.style.marginTop = (-h / 2) + 'px';
        t.style.pointerEvents = 'auto';
        t.addEventListener('mouseenter', function() { o.trackHovered = true; });
        t.addEventListener('mouseleave', function() { o.trackHovered = false; });
    });

    // 创建卫星 DOM
    orbits.forEach(function(orbit) {
        orbit.tiltRad = orbit.tiltDeg * Math.PI / 180;
        orbit.nodeHovered = false;
        orbit.trackHovered = false;
        orbit.nodes = orbit.items.map(function(item) {
            var node = document.createElement('div');
            var sizeClass = orbit.sizeClass ? ' ' + orbit.sizeClass : '';
            node.className = 'sat-node sat-' + orbit.type + sizeClass;
            node.style.pointerEvents = 'auto';

            var lbl = document.createElement('div');
            lbl.className = 'sat-label';

            var name = document.createElement('span');
            name.className = 'sat-name';
            name.textContent = item.label;
            name.dataset.full = item.full || item.label;

            var tag = document.createElement('span');
            tag.className = 'sat-tag';
            tag.textContent = item.tag;

            lbl.appendChild(name);
            lbl.appendChild(tag);

            var dot = document.createElement('div');
            dot.className = 'sat-dot';

            var fullEl = document.createElement('div');
            fullEl.className = 'sat-hover-full';
            fullEl.textContent = item.full || item.label;

            node.appendChild(lbl);
            node.appendChild(dot);
            node.appendChild(fullEl);
            universe.appendChild(node);

            node.addEventListener('mouseenter', function() {
                orbit.nodeHovered = true;
                node.classList.add('hovered');
                name.textContent = name.dataset.full;
                universe.classList.add('has-hover');
            });
            node.addEventListener('mouseleave', function() {
                orbit.nodeHovered = false;
                node.classList.remove('hovered');
                name.textContent = item.label;
                universe.classList.remove('has-hover');
            });

            return { el: node, labelEl: lbl };
        });
    });

    // 响应式缩放
    function scaleUniverse() {
        var page = document.getElementById('page-3');
        if (!page) return;
        var availW = page.clientWidth * 0.92;
        var availH = (page.clientHeight - 90) * 0.90;
        var fitScale = Math.min(1, availW / 1900, availH / 1580);
        var scale = fitScale * 2;
        universe.style.transform = 'scale(' + scale + ')';
        // 用负 margin 抵消 fitScale（永远 <=1）对应的布局空间，防止 scrollHeight > clientHeight；
        // 视觉放大部分（scale 中额外的 *2）超出的布局盒由 .orbit-page-scroll 的 overflow:hidden 裁切
        var compensation = Math.round(1580 * (1 - fitScale) / 2);
        universe.style.marginTop = (-compensation) + 'px';
        universe.style.marginBottom = (-compensation) + 'px';
    }
    scaleUniverse();
    window.addEventListener('resize', scaleUniverse);

    // 动画循环
    function tick() {
        orbits.forEach(function(orbit) {
            if (!orbit.trackHovered && !orbit.nodeHovered) orbit.angle += orbit.speed;
            var n = orbit.items.length;
            var tiltRad = orbit.tiltRad;

            orbit.nodes.forEach(function(node, i) {
                var a = orbit.angle + (2 * Math.PI / n) * i;
                var x = Math.cos(a) * orbit.radius;
                var y = Math.sin(a) * orbit.radius * Math.cos(tiltRad);
                var z = Math.sin(a) * Math.sin(tiltRad); // -1 .. 1

                var scale = 0.52 + 0.48 * ((z + 1) / 2);
                node.el.style.transform =
                    'translate(calc(-50% + ' + x.toFixed(2) + 'px), calc(-50% + ' + y.toFixed(2) + 'px)) scale(' + scale.toFixed(3) + ')';
                node.el.style.zIndex = Math.round((z + 1) * 90);

                // 转到前方才显示标签
                var inFront = z > 0.28;
                node.labelEl.style.opacity = inFront ? '1' : '0';
                node.labelEl.style.transform = inFront ? 'translateY(0) scale(1)' : 'translateY(5px) scale(0.88)';
            });
        });
        requestAnimationFrame(tick);
    }
    tick();
}
