# 基本语法

react组件是返回标签的js函数

```tsx
function MyComp(){
    return (
        <button>我是按钮</button>
    )
}
```
react组件必须用开头大写来区分，html标签则一定是小写
```tsx
export default function MyApp(){
    return(
        <MyComp />//如果没有中间嵌套标签就用自闭合，在后面
    )
}
```

只能返回一个共享的父级，使用`<div></div>`或者`<></>`包裹

css: `<img className="avatar"/>`

js写在`{xxx}`

内联样式 `style={{}}`，就是`{}`里的一个普通 `{}` 对象

# 条件渲染
```jsx
let content;
if(isLogin){
    content=<AdminPanel/>;
}else{
    content=<Login/>;
}
return (
    {content}
)
```
# 渲染列表
```jsx
const listItems = products.map(()=>{
    <li key={product.id}>
        {product.title}
    </li>
});

return (
    <ul>{listItems}</ul>
)
```
# 响应事件

# 更新界面
多次渲染同一个组件，每个组件都会有自己的state，不会共用
```jsx
import {useState} from 'react';
function MyButton(){
    const [cnt,setCnt]=usrState(0);
}
```

hook比普通函数更严格，只能在组件顶层调用

在条件或循环中使用 useState，要提取一个新的组件并在组件内部使用它

# 组件间共享数据

# hooks
## useState
`const [state.setState]=useState(init);`
## useEffect
副作用函数+依赖项（数组）

1. 忽略数组
2. 空数组

```
import imageUrlRule from '@/common/image-url-rule';
import { addSeaweedFsHost } from '@/common/utils';
import { BasicLeftIcon, BasicRightIcon } from '@qunhe/muya-theme-up';
import { Img, InlineButton, Space, Typography } from '@qunhe/muya-ui';
import React, { FC } from 'react';
import { CompareArrow, CompareImage, PreviewWindow } from './styled';

const LayoutTestResultPreview: FC<{
    isCompare: boolean;
    resultJson: {
        url: string;
        ifcResult?: Record<
            string,
            {
                homeIfcUrl: string;
                predictIfcUrl: string;
            }
        >;
    };
    compareJson?: {
        url: string;
        ifcResult?: Record<
            string,
            {
                homeIfcUrl: string;
                predictIfcUrl: string;
            }
        >;
    };
    previewMode?: 'img' | 'ifc' | 'ifc-predict';
    onPreviewModeChange?: (mode: 'img' | 'ifc' | 'ifc-predict') => void;
    onClose?: () => void;
    onNext?: (step: 1 | -1) => void;
}> = ({ isCompare, resultJson, compareJson, previewMode, onPreviewModeChange, onClose, onNext }) => {
    return (
        <PreviewWindow
            onMouseMove={e => {
                // 只在图片对比模式下启用鼠标移动调整
                if (!isCompare || previewMode !== 'img') return;
                const img = document.getElementById('compare-img');
                const arrow = document.getElementById('move-arrow');
                if (!img || !arrow) return;
                const { pageX, pageY } = e;
                const { innerWidth } = window;
                const realPageX = Math.min(pageX, innerWidth * 0.6);
                img.style.width = `${innerWidth * 0.6 - realPageX}px`;
                arrow.style.left = `${realPageX - 32}px`;
                arrow.style.top = `${pageY - 32}px`;
            }}
        >
            {/* 图片模式 */}
            {previewMode === 'img' && (
                <>
                    <Img
                        src={imageUrlRule.wrapWebp(addSeaweedFsHost(resultJson.url))}
                        width={'60vw'}
                        height={'60vw'}
                        style={{ backgroundSize: 'contain' }}
                        suffix="off"
                        webp
                    />
                    {isCompare && compareJson?.url && (
                        <>
                            <CompareImage id="compare-img">
                                <Img
                                    src={imageUrlRule.wrapWebp(addSeaweedFsHost(compareJson.url))}
                                    width={'60vw'}
                                    height={'60vw'}
                                    style={{ backgroundSize: 'contain' }}
                                    suffix="off"
                                    webp
                                />
                            </CompareImage>
                            <CompareArrow id="move-arrow">
                                <BasicLeftIcon />
                                <BasicRightIcon />
                            </CompareArrow>
                            <Typography.Title
                                level={1}
                                style={{ position: 'fixed', left: 8, top: '50vh', transform: 'translateY(-50%)' }}
                            >
                                A
                            </Typography.Title>
                            <Typography.Title
                                level={1}
                                style={{
                                    position: 'fixed',
                                    right: 'calc(40vw + 8px)',
                                    top: '50vh',
                                    transform: 'translateY(-50%)',
                                }}
                            >
                                B
                            </Typography.Title>
                        </>
                    )}
                </>
            )}

            {/* IFC模式 - 非对比模式：只显示一个ifc（兼容从测试记录列表等其他入口进入的情况） */}
            {(previewMode === 'ifc' || previewMode === 'ifc-predict') && !isCompare && (
                <div style={{ width: '60vw', height: 'calc(100vh - 32px)', paddingTop: 32, background: 'white' }}>
                    {Object.values(resultJson.ifcResult || {})[0]?.[
                        previewMode === 'ifc' ? 'homeIfcUrl' : 'predictIfcUrl'
                    ] ? (
                        <iframe
                            src={addSeaweedFsHost(
                                Object.values(resultJson.ifcResult || {})[0]?.[
                                    previewMode === 'ifc' ? 'homeIfcUrl' : 'predictIfcUrl'
                                ] || '',
                            )}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            sandbox="allow-scripts allow-same-origin"
                            referrerPolicy="unsafe-url"
                            style={{ backgroundSize: 'contain', width: '100%', height: '100%' }}
                            title="3D Preview"
                        />
                    ) : (
                        '暂无数据'
                    )}
                </div>
            )}

            {/* IFC模式 - 对比模式：左右分屏显示两个ifc，宽度和图片模式一致（60vw） */}
            {(previewMode === 'ifc' || previewMode === 'ifc-predict') && isCompare && (
                <>
                    {/* 左侧：resultJson的ifc（A组），60vw宽 */}
                    <div
                        style={{
                            width: '60vw',
                            height: '60vw',
                            background: 'white',
                        }}
                    >
                        {Object.values(resultJson.ifcResult || {})[0]?.[
                            previewMode === 'ifc' ? 'homeIfcUrl' : 'predictIfcUrl'
                        ] ? (
                            <iframe
                                src={addSeaweedFsHost(
                                    Object.values(resultJson.ifcResult || {})[0]?.[
                                        previewMode === 'ifc' ? 'homeIfcUrl' : 'predictIfcUrl'
                                    ] || '',
                                )}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                sandbox="allow-scripts allow-same-origin"
                                referrerPolicy="unsafe-url"
                                style={{ backgroundSize: 'contain', width: '100%', height: '100%' }}
                                title="3D Preview A"
                            />
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                }}
                            >
                                暂无数据
                            </div>
                        )}
                    </div>
                    {/* 右侧：compareJson的ifc（B组），60vw宽，使用CompareImage样式 */}
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            overflow: 'hidden',
                            height: '60vw',
                            width: '60vw',
                            background: 'white',
                            borderLeft: '1px solid #d9d9d9',
                        }}
                    >
                        {compareJson &&
                        Object.values(compareJson.ifcResult || {})[0]?.[
                            previewMode === 'ifc' ? 'homeIfcUrl' : 'predictIfcUrl'
                        ] ? (
                            <iframe
                                src={addSeaweedFsHost(
                                    Object.values(compareJson.ifcResult || {})[0]?.[
                                        previewMode === 'ifc' ? 'homeIfcUrl' : 'predictIfcUrl'
                                    ] || '',
                                )}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                sandbox="allow-scripts allow-same-origin"
                                referrerPolicy="unsafe-url"
                                style={{ backgroundSize: 'contain', width: '100%', height: '100%' }}
                                title="3D Preview B"
                            />
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                }}
                            >
                                暂无数据
                            </div>
                        )}
                    </div>
                    {/* 标签 */}
                    <Typography.Title
                        level={1}
                        style={{ position: 'fixed', left: 8, top: '50vh', transform: 'translateY(-50%)', zIndex: 101 }}
                    >
                        A
                    </Typography.Title>
                    <Typography.Title
                        level={1}
                        style={{
                            position: 'fixed',
                            right: 'calc(40vw + 8px)',
                            top: '50vh',
                            transform: 'translateY(-50%)',
                            zIndex: 101,
                        }}
                    >
                        B
                    </Typography.Title>
                </>
            )}

            <Space style={{ position: 'fixed', right: 'calc(40vw + 8px)', top: 8, zIndex: 101 }}>
                {/* 三个选项按钮 - 现在在对比模式下也显示 */}
                <>
                    <InlineButton
                        type={previewMode === 'img' ? 'danger' : 'primary'}
                        onClick={() => {
                            onPreviewModeChange?.('img');
                        }}
                    >
                        图片
                    </InlineButton>
                    <InlineButton
                        type={previewMode === 'ifc-predict' ? 'danger' : 'primary'}
                        onClick={() => {
                            onPreviewModeChange?.('ifc-predict');
                        }}
                    >
                        自动布局
                    </InlineButton>
                    <InlineButton
                        type={previewMode === 'ifc' ? 'danger' : 'primary'}
                        onClick={() => {
                            onPreviewModeChange?.('ifc');
                        }}
                    >
                        布局+后处理
                    </InlineButton>
                </>
                <InlineButton type="primary" size="xl" onClick={() => onNext?.(-1)}>
                    上一项
                </InlineButton>
                <InlineButton type="primary" size="xl" onClick={() => onNext?.(1)}>
                    下一项
                </InlineButton>
                <InlineButton type="primary" size="xl" onClick={() => onClose?.()}>
                    关闭
                </InlineButton>
            </Space>
        </PreviewWindow>
    );
};

export default LayoutTestResultPreview;

```