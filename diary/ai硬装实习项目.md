---
title: ai硬装
created: '2026-02-25T16:30:50+08:00'
updated: '2026-05-25T14:28:51+08:00'
---

<PasswordProtect>

# 一、简介

针对简历上酷家乐ai硬装部分的准备，包括内容对应的八股和可能提问。

# 二、内容概括

八股：

- 组件封装
- 点选擦除涂抹使用canvas的实现细节以及各种touch操作api
- 防抖节流

遇到的难点：
逻辑上如何避免模式切换的状态污染？

# 三、详细内容

## 2.1 **封装墙漆改色选区组件，支持多模式（点选/涂抹/擦除），撤销重做选区更新在筛选候选集合基础上采用增量合并与扣除，输出标准化接口与MDX文档，供多个模块复用**

### 2.1.1 封装组件

**MaaSPartialRepaint组件名字**

**对应点：组件设计、可复用性、抽象能力**

1.  提问：为什么要封装成组件？

回答：因为组件封装它很大的一个优点就是提高可复用性，而我封装的选区组件里面像点选涂抹擦除这些本身都是通用的交互能力，而不是某个页面特有的业务逻辑，所以封装之后减少了代码大部分重复的现象，可读性也有很大提高。同时封装成组件的话也便于进行测试，可以单独验证交互和输出，也容易定位问题所在。

**八股对应：将交互和业务解耦，避免重复实现；统一接口，方便不同模块接入**

2.  提问：怎么判断该不该抽成组件？

回答：能力是否会被多个地方复用。逻辑很复杂会导致页面代码特别乱。输入输出能否被抽象成稳定接口

3.  提问：封装组件具体的输入输出怎么设计的？

回答：MaaSPartialRepaint 是一个组件、一套输入输出，通过一个 pipeline 枚举区分五种业务：家具试搭、墙漆试色、地板选材、家具替换、背景替换。父组件传 pipeline 告诉组件当前是哪种场景，组件内部根据 pipeline 分支：比如初始是「保留模式」还是「选区模式」、用哪类 OneFormer 语义、confirm 时走哪套产出逻辑；输入上，像 url、width/height 是共用的，墙漆/地板会多传 texture 做铺贴，家具试搭会多传 bgImage、keepBackground 等；输出上，所有场景都用同一套 onModeChange、onMaskChange、confirm() 等，只是不同 pipeline 下 confirm() 返回的字段会有差异（例如墙漆/地板多 tileUrl、家具试搭多 bgUrl）。这样父组件始终是「传 pipeline + 通用/可选 props → 监听同一批回调 → 在确认时拿同一类结果」，五种功能共用一套组件接口，只是内部逻辑按 pipeline 分流。

4.  提问：有哪些可配置项？

回答：

- pipeline选择当前业务（有五个：墙漆、地板、家具替换、背景替换、家具试搭）
- outputSize产出图/mask的尺寸
- 默认选区方式点选涂抹擦除、是否显示笔触和粗细、是否允许双指缩放之类的配置
- 以及ui布局和一些功能开关，像操作区隐藏、模式切换这样
- 还有多语言

5.  提问：当前的封装有什么缺点？

回答：可配置项缺少一些分组和约束。props 很多，哪些组合合法、哪些 pipeline 必须配 texture、哪些会忽略某些 props，没有在类型或文档里显式约束，容易误用。后续可以用联合类型、 discriminated union 或配置 schema 把「pipeline + 对应必选/可选」写清楚。

### 2.1.2 多模式实现细节

1.  提问：点选、涂抹、擦除在事件层面有什么区别？

回答：

#### **点选**：

模式为 click 时才处理，用点击坐标调 getMaskByPosition(...)（内部用 SAM/OneFormer 等）拿到该点对应的 mask，再合并进 that.mask。

```js
that.wrapper?.addEventListener('click', async (e) => {
            if (that.selectMode !== 'click' || that.curTexture) return;
            // ...
            const realPosition = { x: Math.round(...), y: Math.round(...) };
            const res = await getMaskByPosition({ pageX: e.pageX, pageY: e.pageY, id, url, rect, size, log });
```

ps:

含义：用户点一下，由模型算出“这个点属于哪个物体/区域”，把整块区域的 mask 合并进当前选区。

流程：

1. 用户点击画布 → 触发 wrapper 的 click 事件。
2. 只在 that.selectMode === 'click' 时处理，否则直接 return。
3. 用点击坐标换算成画布上的像素位置 realPosition，再算在 mask 数组里的下标 positionIdx = y \* width + x。
4. 若有预计算的 hover 结果（that.hoverMask）且该点有值，就直接用这份 mask；否则调 getMaskByPosition({ pageX, pageY, id, url, rect, size })，内部用 SAM/OneFormer 等得到“包含这个点的那个物体”的 mask。
5. 合并到 that.mask：
   - 若该点已经是选中（that.mask[positionIdx] === 1）：新 mask 和当前 mask 做“减”，相当于取消选中这一块。
   - 若该点未选中：新 mask 和当前 mask 做“加”，相当于把这一块选上。
6. 调用 refreshMask() 把 that.mask 画回 canvas，并 push 撤销栈、触发 onMaskChange 等。
   **一句话**：点选 = 一次点击 → 用坐标问模型“这是哪一块” → 把这一块的 mask 加进或移出当前选区。

#### **涂抹 (smear) / 擦除 (erase)**：

共用同一套“拖拽”事件（addMoveListener），区别只在绘制时的 compositeOperation 和语义（加选 / 减选）。
ps:

1. 事件
   都走 addMoveListener：按下 → 移动 → 抬手（touchstart/touchmove/touchend 或 mousedown/mousemove/mouseup）。
2. 按下（startCallback）
   先判断不是点选、不是缩放、没有纹理才继续。记录起点、getBoundingClientRect，把起点转成画布坐标 push 进 drawLinePoints，设置线宽。
   唯一区别：按当前是涂抹还是擦除设置ctx.globalCompositeOperation = 'source-over'（涂抹）或 'destination-out'（擦除）。
   之后不再分支。
3. 移动（positionChange）
   每次把当前点转成画布坐标 push 进 drawLinePoints，用 moveTo(上一帧点) + lineTo(当前点) + stroke() 画一段线。
   涂抹和擦除用的是同一段代码，画出来的“形状”一样，只是混合模式不同，所以画布上效果不同（一个盖上去、一个挖掉）。
4. 抬手（endCallback）
   若按下后没动（isClick 为 true），就画一个圆：arc + fill()，否则前面已经用 stroke() 画完轨迹。
   然后用 getImageData 把整张 canvas 读出来得到 newMask（RGBA）。
   再统一用一行写回 mask：
   that.mask[i/4] = newMask[i] ? 1 : 0
   （看每个像素 R 通道是否非 0：非 0 置 1，为 0 置 0）。
   最后做撤销栈、isEmpty、firstSmear/firstErase、打点等。
5. 为什么同一套逻辑能同时实现涂抹和擦除
   涂抹时设的是 source-over，笔刷画上去的地方会变成 MASK_COLOR（不透明），读回时这些位置 newMask[i] 非 0 → 被写成 1 → 选区变大。
   擦除时设的是 destination-out，笔刷画到的地方被挖成透明，读回时这些位置 newMask[i] 为 0 → 被写成 0 → 选区变小。
   所以：事件、画路径、读 canvas、写 that.mask 的代码完全共用；唯一差别就是一开始设的 globalCompositeOperation，导致画布上笔画处最终是“有颜色”还是“透明”，你的代码再根据这个统一转成 1 和 0。

**简单一点的概括：**
流程就三步：按下时根据当前模式设一次 ctx.globalCompositeOperation，涂抹用 source-over，擦除用 destination-out；移动过程中用 moveTo、lineTo、stroke() 按轨迹画线，点击不移动就画一个圆再 fill()；抬手后用 getImageData 把整张画布读出来，按像素做 that.mask[i] = 有颜色 ? 1 : 0 写回选区。
区别只在混合模式：source-over 是笔刷盖上去，读回来有颜色就置 1，相当于加选；destination-out 是笔刷把原来挖掉，读回来是透明就置 0，相当于减选。所以代码只在一处按模式分支，后面画路径和读回写 mask 都共用。」

另外的细节解释：
谁决定每个像素最后是「有颜色」还是「透明」？→ 浏览器（Canvas 的 composite 计算）。
谁把结果转成 1 和 0 并赋给 that.mask？→ 你这行代码：that.mask[i / 4] = newMask[i] ? 1 : 0。

2.  提问：鼠标拖动涂抹时怎么处理连续轨迹？怎么避免漏选？

回答：
用“上一帧点 + 当前帧点”连成线段，而不是单点画圆。
即便 move 事件丢帧或间隔大，两点之间仍是一条连续线段，所以轨迹是连续的，不容易出现中间断空。没有再做 Bresenham 等额外插值，线段 + 线宽已经起到主要防漏选作用。

```js
    positionChange(x, y) {
        if (that.selectMode === 'click' || that.isScale || that.curTexture) return;
        if (that.rect && that.drawLinePoints.length > 0 && that.ctx) {
            that.end = { x, y };
            that.isClick = false;
            const movePosition = that.drawLinePoints[that.drawLinePoints.length - 1];
            const linePosition = {
                x: (x - that.rect.left) / that.scale,
                y: (y - that.rect.top) / that.scale,
            };
            that.drawLinePoints.push(linePosition);
            that.ctx.beginPath();
            that.ctx.moveTo(movePosition.x, movePosition.y);
            that.ctx.lineTo(linePosition.x, linePosition.y);
            that.ctx.stroke();
```

**细节处理（笔触大小+漏选避免处理）：**

1.  lineWidth 是 canvas 像素，画布有缩放 scale，所以同一 lineWidth 放大后会显得更粗。我们把 lineWidth 设成 (strokeWidth2)/scale，这样 lineWidth 在屏幕上显示的尺寸正好是 strokeWidth2，和缩放无关，就保证了缩放后笔刷视觉一致。
2.  「线段」 = 用线把相邻事件点连起来，避免「只画点」造成的轨迹断档；
    「线宽」 = 线有粗细，把轨迹变成一条连续带子，进一步减少空隙。

3.  提问：模式切换时如何避免状态污染（比如涂抹中切换到擦除）？

回答：

- 原来的代码处理里面没有考虑这个问题，有bug
- bug问题表现：先涂抹拖到一半的时候切成擦除
- 解决：加一个字段来判断是否在进行拖拽，如果正在拖拽就直接return，不允许切换模式。在startcallback里面设置是否正在拖拽的状态

4.  如何处理误触、抖动、快速移动等边界情况？
    这里可以加一个防抖节流的八股点
    不加了

### 2.1.3 撤销重做

选区更新在筛选候选集合基础上采用增量合并与扣除
这个代码在哪？有什么优点？为什么要这样做

其实是缓存之后存起来，选的时候去那个缓存里面拿

</PasswordProtect>
