import{_ as s,c as n,o as p,ag as e}from"./chunks/framework.DPDPlp3K.js";const h=JSON.parse('{"title":"柯里化","description":"","frontmatter":{},"headers":[],"relativePath":"damn/javascript/柯里化.md","filePath":"damn/javascript/柯里化.md"}'),t={name:"damn/javascript/柯里化.md"};function i(l,a,c,d,o,r){return p(),n("div",null,a[0]||(a[0]=[e(`<h1 id="柯里化" tabindex="-1">柯里化 <a class="header-anchor" href="#柯里化" aria-label="Permalink to &quot;柯里化&quot;">​</a></h1><p>解释:把一个多参数函数，转化为一系列每次只接收一个参数的函数的过程。</p><p>好处:可以实现参数复用,减少代码冗余</p><p>实现:可以用<a href="./call&amp;apply&amp;bind对比.html"><code>bind()</code></a></p><p>举例: 普通函数:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function add(a, b) {</span></span>
<span class="line"><span>  return a + b;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>add(1, 2); // 输出 3</span></span></code></pre></div><p>柯里化后:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function add(a) {</span></span>
<span class="line"><span>  return function(b) {</span></span>
<span class="line"><span>    return a + b;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>add(1)(2); // 输出 3</span></span></code></pre></div>`,8)]))}const u=s(t,[["render",i]]);export{h as __pageData,u as default};
