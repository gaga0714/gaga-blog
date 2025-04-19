import{_ as s,c as n,o as e,ag as p}from"./chunks/framework.DPDPlp3K.js";const l="/assets/vercel%E9%85%8D%E7%BD%AE.DOaFK2KB.png",_=JSON.parse('{"title":"gaga-blog部署到服务器","description":"","frontmatter":{},"headers":[],"relativePath":"others/diary/个人博客部署服务器.md","filePath":"others/diary/个人博客部署服务器.md"}'),t={name:"others/diary/个人博客部署服务器.md"};function i(r,a,c,o,h,g){return e(),n("div",null,a[0]||(a[0]=[p(`<h1 id="gaga-blog部署到服务器" tabindex="-1">gaga-blog部署到服务器 <a class="header-anchor" href="#gaga-blog部署到服务器" aria-label="Permalink to &quot;gaga-blog部署到服务器&quot;">​</a></h1><h2 id="github-page管理静态内容" tabindex="-1">github page管理静态内容 <a class="header-anchor" href="#github-page管理静态内容" aria-label="Permalink to &quot;github page管理静态内容&quot;">​</a></h2><p>没配成啊没配成</p><h2 id="vercel" tabindex="-1">vercel <a class="header-anchor" href="#vercel" aria-label="Permalink to &quot;vercel&quot;">​</a></h2><p>嗯嗯对，转战vercel了</p><h3 id="优势" tabindex="-1">优势 <a class="header-anchor" href="#优势" aria-label="Permalink to &quot;优势&quot;">​</a></h3><ul><li>个人版永久免费，每个月 100G 带宽（别人访问你的项目所耗费的流量），个人项目部署完全够用，需要注意的是团队模式收费，所以要协作你只能付费。</li><li>内置 CI CD，你可以理解成一个黑盒，项目丢进去，只需要将项目导入 vercel ，一句命令自动部署。</li><li>因为内置构建流程，支持代码推送、PR 自动触发构建，不同分支唯一地址，方便测试。</li><li>支持本地、测试、生产三种环境部署，仅仅是命令区别，上手成本极低。 丰富的集成能力，项目部署自动监控，端到端自动化测试等等，当然这些并并属于 vercel 自身的能力，但它可以为你提供集成入口，让这些成为你自动部署中自动进行的一步，比如构建生产后自动完成性能指标输出，自动化测试，以及后续项目监控等等。</li></ul><h3 id="部署" tabindex="-1">部署 <a class="header-anchor" href="#部署" aria-label="Permalink to &quot;部署&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>注册和登录：</span></span>
<span class="line"><span>访问 Vercel 官网，注册一个账号或使用已有账号登录。</span></span>
<span class="line"><span>创建新项目：</span></span>
<span class="line"><span>登录后，点击 Vercel 仪表盘中的 “New Project” 按钮。</span></span>
<span class="line"><span>选择网站项目的代码仓库（例如 GitHub、GitLab 或 Bitbucket）。如果还没有将代码托管在这些平台上，先将代码上传到其中一个代码托管服务。</span></span>
<span class="line"><span>导入 Git 仓库：</span></span>
<span class="line"><span>在 “Import Git Repository” 页面，选择要部署的代码仓库。</span></span>
<span class="line"><span>Vercel 会自动检测并配置项目设置。可以根据需要进行修改。</span></span>
<span class="line"><span>配置项目：</span></span>
<span class="line"><span>项目名称：确认或更改项目名称。</span></span>
<span class="line"><span>框架预设：Vercel 会根据项目自动检测框架（例如 Next.js）。如果没有正确检测，可以手动选择适合的框架。</span></span>
<span class="line"><span>构建设置：如果需要，可以修改构建命令和输出目录。通常，Vercel 会自动为大多数常见框架配置这些选项。</span></span>
<span class="line"><span>部署项目：</span></span>
<span class="line"><span>点击 “Deploy” 按钮，Vercel 将开始构建和部署项目。</span></span>
<span class="line"><span>部署过程完成后，会看到一个唯一的域名，网站将托管在该域名下。</span></span>
<span class="line"><span>自定义域名（可选）：</span></span>
<span class="line"><span>如果你想使用自定义域名，可以在项目设置中配置。</span></span>
<span class="line"><span>前往 “Domains” 标签页，添加你的自定义域名，并按照指示将域名的 DNS 记录指向 Vercel 提供的地址。</span></span>
<span class="line"><span>管理和监控：</span></span>
<span class="line"><span>在 Vercel 仪表盘中，可以查看部署历史、性能分析、日志等，方便管理和监控项目。</span></span>
<span class="line"><span>持续集成：</span></span>
<span class="line"><span>Vercel 会自动为你设置持续集成（CI）。每次你将代码推送到指定的 Git 分支时，Vercel 会自动重新构建和部署你的网站。</span></span></code></pre></div><p><a href="https://gaga-space.vercel.app" target="_blank" rel="noreferrer">https://gaga-space.vercel.app</a></p><p>又烂了如何呢</p><p>ok啊ok啊成功了</p><p>之前打开页面404</p><p>原因是：</p><p>project-settings里面</p><p><img src="`+l+'" alt="alt text"></p><p>哦莫，因为vercel用的是github仓库上的dist文件夹，所以在.gitignore文件中不能添加dist</p>',17)]))}const b=s(t,[["render",i]]);export{_ as __pageData,b as default};
