import{_ as a,c as n,o as p,ag as e}from"./chunks/framework.DPDPlp3K.js";const g=JSON.parse('{"title":"login 样式笔记","description":"","frontmatter":{},"headers":[],"relativePath":"damn/css/login样式笔记.md","filePath":"damn/css/login样式笔记.md"}'),i={name:"damn/css/login样式笔记.md"};function l(t,s,c,o,d,r){return p(),n("div",null,s[0]||(s[0]=[e(`<h1 id="login-样式笔记" tabindex="-1">login 样式笔记 <a class="header-anchor" href="#login-样式笔记" aria-label="Permalink to &quot;login 样式笔记&quot;">​</a></h1><p>确保背景图片覆盖整个页面并保持其比例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>background-size: cover;</span></span></code></pre></div><p>flexbox 布局，居中对齐。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>display: flex;</span></span>
<span class="line"><span>justify-content: center;</span></span>
<span class="line"><span>align-items: center;</span></span></code></pre></div><p>使用 flexbox 布局，并将子元素垂直排列。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>display: flex;</span></span>
<span class="line"><span>flex-direction: column;</span></span></code></pre></div><p>元素本身的背景会被模糊掉，但该元素的内容（如文本、图片等）会保持清晰。这种效果可以用来让元素的前景内容更加突出，同时将背景进行模糊，使得用户更容易关注到前景内容。</p><p>参数 10px 表示模糊的程度，数字越大，模糊效果越强。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>backdrop-filter: blur(10px);</span></span></code></pre></div><p>占父容器宽度的 90%</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>.input-wrap {</span></span>
<span class="line"><span>    width: 90%;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>设置输入框背景透明</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>input {</span></span>
<span class="line"><span>    background-color: transparent;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>提示文字样式</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>input::placeholder：{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>button {</span></span>
<span class="line"><span>    font-size: 1.2rem;      /* 字体大小 */</span></span>
<span class="line"><span>    height: 60px;           /* 按钮高度 */</span></span>
<span class="line"><span>    width: 90%;             /* 宽度为容器90% */</span></span>
<span class="line"><span>    border-radius: 50px;    /* 圆角大，形成 pill 按钮 */</span></span>
<span class="line"><span>    font-weight: 600;       /* 字体加粗 */</span></span>
<span class="line"><span>    letter-spacing: 1px;    /* 字母间距增加 */</span></span>
<span class="line"><span>    margin-bottom: 25px;    /* 与下方间隔 25px */</span></span>
<span class="line"><span>    cursor: pointer;        /* 鼠标悬停变手型 */</span></span>
<span class="line"><span>    transition: 0.3s;       /* 添加平滑过渡动画 */</span></span>
<span class="line"><span>    animation: reloadA 2s ease-out forwards; /* 动画延迟后出现 */</span></span>
<span class="line"><span>    opacity: 0;</span></span>
<span class="line"><span>    animation-delay: 1s;</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@keyframes reloadA {</span></span>
<span class="line"><span>    from {</span></span>
<span class="line"><span>        transform: translateY(250px); /* 从页面下方250px开始移动 */</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    to {</span></span>
<span class="line"><span>        transform: translateY(0);     /* 回到原位 */</span></span>
<span class="line"><span>        opacity: 1;                   /* 变为完全可见 */</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,18)]))}const u=a(i,[["render",l]]);export{g as __pageData,u as default};
