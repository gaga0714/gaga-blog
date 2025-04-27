import{_ as n,c as s,o as e,ag as p}from"./chunks/framework.DPDPlp3K.js";const h=JSON.parse('{"title":"相等还是不相等","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/js-03.相等还是不相等.md","filePath":"algorithm/js-03.相等还是不相等.md"}'),o={name:"algorithm/js-03.相等还是不相等.md"};function t(l,a,c,i,u,r){return e(),s("div",null,a[0]||(a[0]=[p(`<h1 id="相等还是不相等" tabindex="-1">相等还是不相等 <a class="header-anchor" href="#相等还是不相等" aria-label="Permalink to &quot;相等还是不相等&quot;">​</a></h1><h2 id="题目" tabindex="-1">题目 <a class="header-anchor" href="#题目" aria-label="Permalink to &quot;题目&quot;">​</a></h2><p>请你编写一个名为 expect 的函数，用于帮助开发人员测试他们的代码。它应该接受任何值 val 并返回一个包含以下两个函数的对象。</p><p>toBe(val) 接受另一个值并在两个值相等（ === ）时返回 true 。如果它们不相等，则应抛出错误 &quot;Not Equal&quot; 。</p><p>notToBe(val) 接受另一个值并在两个值不相等（ !== ）时返回 true 。如果它们相等，则应抛出错误 &quot;Equal&quot; 。</p><p>示例 1：</p><p>输入：<code>func = () =&gt; expect(5).toBe(5)</code></p><p>输出：<code>{&quot;value&quot;: true}</code></p><p>解释：<code>5 === 5</code> 因此该表达式返回 <code>true</code>。</p><p>示例 2：</p><p>输入：<code>func = () =&gt; expect(5).toBe(null)</code></p><p>输出：<code>{&quot;error&quot;: &quot;Not Equal&quot;}</code></p><p>解释：<code>5 !== null</code> 因此抛出错误 <code>&quot;Not Equal&quot;</code>.</p><p>示例 3：</p><p>输入：<code>func = () =&gt; expect(5).notToBe(null)</code></p><p>输出：<code>{&quot;value&quot;: true}</code></p><p>解释：<code>5 !== null</code> 因此该表达式返回 <code>true</code>.</p><h2 id="答案" tabindex="-1">答案 <a class="header-anchor" href="#答案" aria-label="Permalink to &quot;答案&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var expect = function(val){</span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>        toBe:function(v2){</span></span>
<span class="line"><span>            if(val===v2) return true;</span></span>
<span class="line"><span>            else throw new Error(&quot;Not Equal&quot;);</span></span>
<span class="line"><span>        },</span></span>
<span class="line"><span>        notToBe:function(v2){</span></span>
<span class="line"><span>            if(val!==v2) return true;</span></span>
<span class="line"><span>            else throw new Error(&quot;Equal&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="扩展" tabindex="-1">扩展 <a class="header-anchor" href="#扩展" aria-label="Permalink to &quot;扩展&quot;">​</a></h2><p>对象里函数的写法: <code>a:function(){},</code>或者<code>a:()=&gt;{},</code></p><p><code>new</code>不加不会报错,但是最好加上</p><p>附上对象的写法格式:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const person = {</span></span>
<span class="line"><span>  name: [&quot;Bob&quot;, &quot;Smith&quot;],</span></span>
<span class="line"><span>  age: 32,</span></span>
<span class="line"><span>  bio: function () {</span></span>
<span class="line"><span>    console.log(\`\${this.name[0]} \${this.name[1]} 现在 \${this.age} 岁了。\`);</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  introduceSelf: function () {</span></span>
<span class="line"><span>    console.log(\`你好！我是 \${this.name[0]}。\`);</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>};</span></span></code></pre></div>`,24)]))}const q=n(o,[["render",t]]);export{h as __pageData,q as default};
