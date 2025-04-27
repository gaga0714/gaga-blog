import{_ as e,c as s,o as n,ag as p}from"./chunks/framework.DPDPlp3K.js";const _=JSON.parse('{"title":"reduce","description":"","frontmatter":{},"headers":[],"relativePath":"damn/javascript/reduce.md","filePath":"damn/javascript/reduce.md"}'),t={name:"damn/javascript/reduce.md"};function r(c,a,l,i,o,d){return n(),s("div",null,a[0]||(a[0]=[p(`<h1 id="reduce" tabindex="-1"><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce" target="_blank" rel="noreferrer">reduce</a> <a class="header-anchor" href="#reduce" aria-label="Permalink to &quot;[reduce](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)&quot;">​</a></h1><p>每一次运行 reducer 会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值。</p><p>第一次执行回调函数时，不存在“上一次的计算结果”。如果需要回调函数从数组索引为 0 的元素开始执行，则需要传递初始值。否则，数组索引为 0 的元素将被用作初始值，迭代器将从第二个元素开始执行（即从索引为 1 而不是 0 的位置开始）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const array1 = [1, 2, 3, 4];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 0 + 1 + 2 + 3 + 4</span></span>
<span class="line"><span>const initialValue = 0;</span></span>
<span class="line"><span>const sumWithInitial = array1.reduce(</span></span>
<span class="line"><span>  (accumulator, currentValue) =&gt; accumulator + currentValue,</span></span>
<span class="line"><span>  initialValue,</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>console.log(sumWithInitial);</span></span>
<span class="line"><span>// Expected output: 10</span></span></code></pre></div>`,4)]))}const h=e(t,[["render",r]]);export{_ as __pageData,h as default};
