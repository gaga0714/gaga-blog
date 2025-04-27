import{_ as s,c as n,o as p,ag as t}from"./chunks/framework.DPDPlp3K.js";const h=JSON.parse('{"title":"记忆函数","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/js-11.记忆函数.md","filePath":"algorithm/js-11.记忆函数.md"}'),l={name:"algorithm/js-11.记忆函数.md"};function e(o,a,i,c,u,d){return p(),n("div",null,a[0]||(a[0]=[t(`<h1 id="记忆函数" tabindex="-1">记忆函数 <a class="header-anchor" href="#记忆函数" aria-label="Permalink to &quot;记忆函数&quot;">​</a></h1><h2 id="问题" tabindex="-1">问题 <a class="header-anchor" href="#问题" aria-label="Permalink to &quot;问题&quot;">​</a></h2><p>请你编写一个函数 fn，它接收另一个函数作为输入，并返回该函数的 记忆化 后的结果。</p><p>记忆函数 是一个对于相同的输入永远不会被调用两次的函数。相反，它将返回一个缓存值。</p><p>你可以假设有 3 个可能的输入函数：sum 、fib 和 factorial 。</p><ul><li>sum 接收两个整型参数 a 和 b ，并返回 a + b 。假设如果参数 (b, a) 已经缓存了值，其中 a != b，它不能用于参数 (a, b)。例如，如果参数是 (3, 2) 和 (2, 3)，则应进行两个单独的调用。</li><li>fib 接收一个整型参数 n ，如果 n &lt;= 1 则返回 1，否则返回 fib (n - 1) + fib (n - 2)。</li><li>factorial 接收一个整型参数 n ，如果 n &lt;= 1 则返回 1 ，否则返回 factorial(n - 1) * n 。</li></ul><p>示例 1：</p><p>输入：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fnName = &quot;sum&quot;</span></span>
<span class="line"><span>actions = [&quot;call&quot;,&quot;call&quot;,&quot;getCallCount&quot;,&quot;call&quot;,&quot;getCallCount&quot;]</span></span>
<span class="line"><span>values = [[2,2],[2,2],[],[1,2],[]]</span></span></code></pre></div><p>输出：[4,4,1,3,2]</p><p>解释：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const sum = (a, b) =&gt; a + b;</span></span>
<span class="line"><span>const memoizedSum = memoize(sum);</span></span>
<span class="line"><span>memoizedSum (2, 2);// &quot;call&quot; - 返回 4。sum() 被调用，因为之前没有使用参数 (2, 2) 调用过。</span></span>
<span class="line"><span>memoizedSum (2, 2);// &quot;call&quot; - 返回 4。没有调用 sum()，因为前面有相同的输入。</span></span>
<span class="line"><span>// &quot;getCallCount&quot; - 总调用数： 1</span></span>
<span class="line"><span>memoizedSum(1, 2);// &quot;call&quot; - 返回 3。sum() 被调用，因为之前没有使用参数 (1, 2) 调用过。</span></span>
<span class="line"><span>// &quot;getCallCount&quot; - 总调用数： 2</span></span></code></pre></div><p>示例 2：</p><p>输入：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fnName = &quot;factorial&quot;</span></span>
<span class="line"><span>actions = [&quot;call&quot;,&quot;call&quot;,&quot;call&quot;,&quot;getCallCount&quot;,&quot;call&quot;,&quot;getCallCount&quot;]</span></span>
<span class="line"><span>values = [[2],[3],[2],[],[3],[]]</span></span></code></pre></div><p>输出：[2,6,2,2,6,2]</p><p>解释：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const factorial = (n) =&gt; (n &lt;= 1) ? 1 : (n * factorial(n - 1));</span></span>
<span class="line"><span>const memoFactorial = memoize(factorial);</span></span>
<span class="line"><span>memoFactorial(2); // &quot;call&quot; - 返回 2。</span></span>
<span class="line"><span>memoFactorial(3); // &quot;call&quot; - 返回 6。</span></span>
<span class="line"><span>memoFactorial(2); // &quot;call&quot; - 返回 2。 没有调用 factorial()，因为前面有相同的输入。</span></span>
<span class="line"><span>// &quot;getCallCount&quot; -  总调用数：2</span></span>
<span class="line"><span>memoFactorial(3); // &quot;call&quot; - 返回 6。 没有调用 factorial()，因为前面有相同的输入。</span></span>
<span class="line"><span>// &quot;getCallCount&quot; -  总调用数：2</span></span></code></pre></div><p>示例 3：</p><p>输入：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fnName = &quot;fib&quot;</span></span>
<span class="line"><span>actions = [&quot;call&quot;,&quot;getCallCount&quot;]</span></span>
<span class="line"><span>values = [[5],[]]</span></span></code></pre></div><p>输出：[8,1]</p><p>解释：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fib(5) = 8 // &quot;call&quot;</span></span>
<span class="line"><span>// &quot;getCallCount&quot; - 总调用数：1</span></span></code></pre></div><p>提示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>0 &lt;= a, b &lt;= 105</span></span>
<span class="line"><span>1 &lt;= n &lt;= 10</span></span>
<span class="line"><span>1 &lt;= actions.length &lt;= 105</span></span>
<span class="line"><span>actions.length === values.length</span></span>
<span class="line"><span>actions[i] 为 &quot;call&quot; 和 &quot;getCallCount&quot; 中的一个</span></span>
<span class="line"><span>fnName 为 &quot;sum&quot;, &quot;factorial&quot; 和 &quot;fib&quot; 中的一个</span></span></code></pre></div><h2 id="答案" tabindex="-1">答案 <a class="header-anchor" href="#答案" aria-label="Permalink to &quot;答案&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function memoize(fn) {</span></span>
<span class="line"><span>    const cache = {};</span></span>
<span class="line"><span>    return function(...args) {</span></span>
<span class="line"><span>        const key=JSON.stringify(args);</span></span>
<span class="line"><span>        if(key in cache){</span></span>
<span class="line"><span>            return cache[key];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else{</span></span>
<span class="line"><span>            cache[key]=fn(...args);</span></span>
<span class="line"><span>            return cache[key];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="扩展" tabindex="-1">扩展 <a class="header-anchor" href="#扩展" aria-label="Permalink to &quot;扩展&quot;">​</a></h2><p><strong>用哈希表结构，键存参数的字符串形式，值存函数计算该参数返回的值</strong></p><p>先转换参数去哈希表里找，</p><p>如果没有就调用函数计算存进哈希表；</p><p>如果有就直接返回；</p>`,33)]))}const q=s(l,[["render",e]]);export{h as __pageData,q as default};
