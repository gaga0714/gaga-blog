import{_ as n,c as s,o as e,ag as p}from"./chunks/framework.DPDPlp3K.js";const u=JSON.parse('{"title":"伪元素和z-index","description":"","frontmatter":{},"headers":[],"relativePath":"damn/css/伪元素和z-index.md","filePath":"damn/css/伪元素和z-index.md"}'),t={name:"damn/css/伪元素和z-index.md"};function o(l,a,i,r,c,d){return e(),s("div",null,a[0]||(a[0]=[p(`<h1 id="伪元素和z-index" tabindex="-1">伪元素和z-index <a class="header-anchor" href="#伪元素和z-index" aria-label="Permalink to &quot;伪元素和z-index&quot;">​</a></h1><h2 id="伪元素" tabindex="-1">伪元素 <a class="header-anchor" href="#伪元素" aria-label="Permalink to &quot;伪元素&quot;">​</a></h2><h3 id="怎么解释伪元素是什么" tabindex="-1">怎么解释伪元素是什么？ <a class="header-anchor" href="#怎么解释伪元素是什么" aria-label="Permalink to &quot;怎么解释伪元素是什么？&quot;">​</a></h3><p>伪元素是虚拟dom元素，在html中看不到，但是页面渲染存在。</p><p>不是写的真实标签，通常用来<strong>附加内容</strong>或<strong>装饰元素</strong></p><h3 id="最常见的伪元素有两个" tabindex="-1">最常见的伪元素有两个： <a class="header-anchor" href="#最常见的伪元素有两个" aria-label="Permalink to &quot;最常见的伪元素有两个：&quot;">​</a></h3><blockquote><p>::before - 在元素内容前面插入东西</p></blockquote><blockquote><p>::after - 在元素内容后面插入东西</p></blockquote><h3 id="和伪类的区别" tabindex="-1">和伪类的区别 <a class="header-anchor" href="#和伪类的区别" aria-label="Permalink to &quot;和伪类的区别&quot;">​</a></h3><p>伪类是选中<strong>已有元素</strong>的状态或位置</p><blockquote><p>::hover - 鼠标悬浮</p></blockquote><blockquote><p>::selected - 鼠标选中</p></blockquote><h3 id="一般使用方法" tabindex="-1">一般使用方法 <a class="header-anchor" href="#一般使用方法" aria-label="Permalink to &quot;一般使用方法&quot;">​</a></h3><p><code>content:&quot;&quot;</code>一定要有，<strong>如果不写，元素不会出现在页面上</strong></p><p><code>position: absolute</code>一般用<strong>绝对定位</strong>来实现脱离文档流，让其可以自由定位，<strong>使用的时候其父元素一定要加属性</strong> <code>position:relative</code></p><h3 id="举个例子" tabindex="-1">举个例子 <a class="header-anchor" href="#举个例子" aria-label="Permalink to &quot;举个例子&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>body{</span></span>
<span class="line"><span>    //写在background-image里的图片无法在这下面加东西，不是单独一层而是body的属性</span></span>
<span class="line"><span>    //如果想在背景图下面加一层，可以把背景写成一个image</span></span>
<span class="line"><span>    background-image: url(&quot;https://www.pixelstalk.net/wp-content/uploads/images6/Purple-Aesthetic-Wallpaper.jpg&quot;);</span></span>
<span class="line"><span>    background-repeat: no-repeat;</span></span>
<span class="line"><span>    background-position: center;</span></span>
<span class="line"><span>    background-size: cover;</span></span>
<span class="line"><span>    height: 100vh;</span></span>
<span class="line"><span>    display: flex;</span></span>
<span class="line"><span>    justify-content: center;</span></span>
<span class="line"><span>    align-items: center;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>body::after{</span></span>
<span class="line"><span>    content: &quot;&quot;;</span></span>
<span class="line"><span>    position: absolute;</span></span>
<span class="line"><span>    top: 0;</span></span>
<span class="line"><span>    bottom: 0;</span></span>
<span class="line"><span>    right: 0;</span></span>
<span class="line"><span>    left: 0;</span></span>
<span class="line"><span>    background-color: rgba(0, 0, 0, 0.2);</span></span>
<span class="line"><span>    z-index: -1;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="z-index" tabindex="-1">z-index <a class="header-anchor" href="#z-index" aria-label="Permalink to &quot;z-index&quot;">​</a></h2><p>就是上面这个例子想到的，写在background-image里的图片无法在这下面加东西</p><p>不是单独一层而是body的属性</p><p>如果想在背景图下面加一层，可以把背景写成一个image</p><p>然后body的z-index没定义应该是默认auto，近似于是0</p><p>总体概括这个结构就是：</p><ul><li>背景图（最底）</li><li>遮罩（-1，中间）</li><li>body（最顶）</li></ul>`,24)]))}const b=n(t,[["render",o]]);export{u as __pageData,b as default};
