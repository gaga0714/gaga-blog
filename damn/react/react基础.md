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
3. 




```
import { CurrentNamespace } from '@/common/namespace';
import {
    AddmoreIcon,
    BookIcon,
    CadIcon,
    CodeIcon,
    FindIcon,
    InformIcon,
    InformationIcon,
    LaughIcon,
    ListIcon,
    MagnifyIcon,
    PictureIcon,
    RankIcon,
    RoleIcon,
    SandboxIcon,
    SetIcon,
    ShareIcon,
    TagIcon,
} from '@qunhe/muya-theme-light';
import { HudongLiulanIcon, MeitiJiankongIcon, ModelIcon, StoreyIcon, ZhutiIcon } from '@qunhe/muya-theme-up';
import React from 'react';

export interface IMenuItem {
    icon: React.ReactNode;
    title: string;
    path: string;
    children?: Array<IMenuItem>;
    admin?: boolean; //超管
}
export const MENUS_CONST = [
    { icon: <MagnifyIcon />, title: '效果走查', path: 'groups' },
    {
        icon: <TagIcon />,
        title: '出图配置',
        path: 'strategy',
        children: [
            { icon: <BookIcon />, title: '出图参数', path: 'property' },
            { icon: <PictureIcon />, title: '出图策略', path: 'strategy?type=2' },
        ],
    },
    {
        icon: <MeitiJiankongIcon />,
        title: 'KV管理',
        path: 'pics',
        children: [
            { icon: <ZhutiIcon />, title: 'KV管理', path: 'pics' },
            { icon: <HudongLiulanIcon />, title: '测试管理', path: 'testManager' },
            { icon: <HudongLiulanIcon />, title: '甘特图', path: 'ganttChart' },
        ],
    },
    {
        icon: <SetIcon />,
        title: '系统管理',
        path: 'permission',
        children: [
            { icon: <InformationIcon />, title: '权限树', path: 'permission' },
            { icon: <RoleIcon />, title: '权限配置', path: 'permissionSetting' },
            { icon: <CodeIcon />, title: '策略因素', path: 'factor' },
            { icon: <BookIcon />, title: '注册算法', path: 'algorithm', admin: true },
            { icon: <BookIcon />, title: 'MAAS看板', path: 'tetris', admin: true },
            { icon: <InformationIcon />, title: '标签管理', path: 'tag' },
            { icon: <InformationIcon />, title: 'workflow配置', path: 'workflowConfig' },
        ],
    },
    {
        icon: <SetIcon />,
        title: '其他',
        path: 'other',
        children: [
            { icon: <SandboxIcon />, title: '参数列表', path: 'params' },
            { icon: <ListIcon />, title: '模型训练', path: 'loraTask' },
            { icon: <ModelIcon />, title: '风格管理', path: 'styleType' },
            { icon: <TagIcon />, title: '标签管理', path: 'tags' },
        ],
    },
];

export const kjlAiMenus = [
    {
        icon: <TagIcon />,
        title: '推荐配置',
        path: 'recommend',
        children: [
            { icon: <AddmoreIcon />, title: '推荐参数', path: 'relate' },
            { icon: <CodeIcon />, title: '推荐策略', path: 'strategy?type=1' },
        ],
    },
    {
        icon: <InformIcon />,
        title: '应用管理',
        path: 'app',
        children: [
            { icon: <InformIcon />, title: '应用管理', path: 'app' },
            { icon: <ShareIcon />, title: '业务应用关系', path: 'appScene' },
            { icon: <CadIcon />, title: '自定义参数', path: 'customParam' },
        ],
    },
    {
        icon: <RankIcon />,
        title: '训练管理',
        path: 'lora',
        children: [
            { icon: <InformationIcon />, title: '训练走查', path: 'lora' },
            { icon: <LaughIcon />, title: '方向配置', path: 'loraType' },
            { icon: <FindIcon />, title: '测试词库', path: 'loraTypeTest' },
        ],
    },
];

export const DATA_MENU_CONST = [
    { icon: <ListIcon />, title: '数据集', path: 'data/collection' },
    { icon: <InformationIcon />, title: '数据流转', path: 'data/transformation' },
    { icon: <ModelIcon />, title: '数仓表', path: 'data/warehouse' },
    { icon: <BookIcon />, title: '数据标注', path: 'data/temptable' },
    { icon: <LaughIcon />, title: '标注类型', path: 'data/label/rules' },
    { icon: <CodeIcon />, title: 'IFC转换', path: 'data/design2ifc' },
    { icon: <CodeIcon />, title: '智能设计选品', path: 'data/mark-brandgood' },
    { icon: <TagIcon />, title: '标签可视化', path: 'data/mark-visualization' },
];

export const CAD_MENU_CONST = [
    { icon: <ListIcon />, title: '图纸集', path: 'namespace/model/drawingset' },
    { icon: <ModelIcon />, title: '图纸', path: 'namespace/model/drawing' },
    { icon: <LaughIcon />, title: '评分标准', path: 'namespace/model/regress/standard' },
    { icon: <InformationIcon />, title: '评分结果', path: 'namespace/model/regress/score' },
    { icon: <BookIcon />, title: '模型版本', path: 'namespace/model/cad/version' },
];

export const LAYOUT_TEST_MENU_CONST = [
    {
        icon: <BookIcon />,
        title: '测试集管理',
        path: 'namespace/model/layout/test/collection/list',
    },
    {
        icon: <ListIcon />,
        title: '方案管理',
        path: 'namespace/model/layout/test/design/list',
    },
    {
        icon: <InformIcon />,
        title: '约束集管理',
        path: 'namespace/model/layout/test/constraint/collection',
    },
    {
        icon: <CodeIcon />,
        title: '约束管理',
        path: 'namespace/model/layout/test/constraint/list',
    },
    {
        icon: <LaughIcon />,
        title: '测试记录',
        path: 'namespace/model/layout/test/record/list',
    },
    {
        icon: <StoreyIcon />,
        title: '结果对比',
        path: 'namespace/model/layout/test/result/compare',
    },
    {
        icon: <InformationIcon />,
        title: '模型版本',
        path: 'namespace/model/layout/test/model/version',
    },
];

export const AI_SEARCH_MENU_CONST = [
    {
        icon: <BookIcon />,
        title: '测试集管理',
        path: 'namespace/model/ai_search/test/collection/list',
    },
    {
        icon: <ListIcon />,
        title: 'AI搜模型评测',
        path: 'namespace/model/ai_search/test/record/list?type=2',
    },
    {
        icon: <LaughIcon />,
        title: '公库搜索评测',
        path: 'namespace/model/ai_search/test/record/list?type=4',
    },
    {
        icon: <StoreyIcon />,
        title: 'API管理',
        path: 'namespace/model/ai_search/model/version',
    },
    {
        icon: <ListIcon />,
        title: 'Badcase处理',
        path: 'namespace/model/ai_search/model/badcase/handle',
    },
    {
        icon: <ListIcon />,
        title: 'Badcase跟踪',
        path: 'namespace/model/ai_search/model/badcase/track',
    },
    {
        icon: <StoreyIcon />,
        title: 'Badcase记录',
        path: 'namespace/model/ai_search/model/badcase/record',
    },
];

export const ALL_SCREEN_MENU_CONST = [
    '/',
    '/paramPizza',
    '/paramPizza/detail',
    '/testReport',
    '/diff',
    '/diff/detail',
    '/market/edit',
    '/market/detail',
    '/data/collection/detail',
    '/data/floorplan/list',
    '/data/floorplan/scores',
    '/data/label/page',
    '/namespace/model/layout/test/record/detail',
    '/namespace/model/drawingset/detail',
    '/namespace/model/layout/test/collection/detail',
    '/namespace/model/ai_search/test/collection/detail',
    '/namespace/model/ai_search/test/record/detail',
];

function getModelEvaluationMenuItem(): IMenuItem {
    return {
        icon: <ModelIcon />,
        title: '模型测评',
        path: '',
        children: [],
    };
}

export const NAMESPACE_MENU_CONST = [
    {
        icon: <ModelIcon />,
        title: '模型训练',
        path: 'namespace/model/training',
        children: [
            {
                icon: <ListIcon />,
                title: '数据源',
                path: 'namespace/datasource',
            },
            {
                icon: <ModelIcon />,
                title: '标注任务',
                path: 'namespace/label/tasks',
            },
            {
                icon: <CodeIcon />,
                title: '标注类型',
                path: 'namespace/label/rules',
            },
            {
                icon: <ModelIcon />,
                title: '模型训练',
                path: 'namespace/model/training',
            },
        ],
    },
    {
        icon: <SetIcon />,
        title: 'Namespace设置',
        path: 'namespace/permission',
        children: [
            { icon: <InformationIcon />, title: '权限配置', path: 'namespace/permission/manager' },
            { icon: <RoleIcon />, title: '角色配置', path: 'namespace/role/manager' },
        ],
    },
];

const AGENT_MENU_CONST = [
    { icon: <InformationIcon />, title: '基础信息', path: 'agent_platform/agent/detail' },
    { icon: <ListIcon />, title: 'Function Call 列表', path: 'agent_platform/agent/detail/function_call' },
    { icon: <ListIcon />, title: 'Dify Agent 关联', path: 'agent_platform/agent/detail/dify_relation' },
];

const AGENT_APP_MENU_CONST = [
    { icon: <InformationIcon />, title: '基础信息', path: 'agent_platform/agent_app/detail' },
    {
        icon: <ListIcon />,
        title: '子智能体管理',
        path: 'agent_platform/agent_app/detail/sub_agent_list',
    },
    {
        icon: <ListIcon />,
        title: '上线管理',
        path: 'agent_platform/agent_app/detail/publish',
    },
    { icon: <ListIcon />, title: '用户权限', path: 'agent_platform/agent_app/detail/dify_relation' },
];

export async function getMenuList(pathname: string, sceneId?: string, namespaceId?: number) {
    const [
        isDataPlatform,
        isModelPlatform,
        isModelEvaluateList,
        isLayoutTest,
        isNamespace,
        isAgentManagement,
        isAgentAppManagement,
    ] = [
        pathname.startsWith('/data'),
        pathname.startsWith('/model'),
        pathname.startsWith('/evaluate'),
        pathname.startsWith('/model/layout/test'),
        pathname.startsWith('/namespace'),
        pathname.startsWith('/agent_platform/agent/detail'),
        pathname.startsWith('/agent_platform/agent_app/detail'),
    ];
    if (isNamespace && !CurrentNamespace.getInstance().hasNamespace() && namespaceId) {
        CurrentNamespace.getInstance().setNamespace(namespaceId);
    } else if (isModelPlatform && !CurrentNamespace.getInstance().hasNamespace()) {
        CurrentNamespace.getInstance().setNamespace(isLayoutTest ? '布局模型' : 'CAD 模型');
    }
    switch (true) {
        case isAgentManagement: {
            return AGENT_MENU_CONST;
        }
        case isAgentAppManagement: {
            return AGENT_APP_MENU_CONST;
        }
        case isNamespace: {
            const namespace = await CurrentNamespace.getInstance().getNamespace();
            switch (true) {
                case namespace?.namespaceType === 102:
                case namespace?.name === 'CAD 模型': {
                    const item = getModelEvaluationMenuItem();
                    item.children = CAD_MENU_CONST;
                    return [NAMESPACE_MENU_CONST[0], item, NAMESPACE_MENU_CONST[1]];
                }
                case namespace?.namespaceType === 103:
                case namespace?.name === '布局模型': {
                    const item = getModelEvaluationMenuItem();
                    item.children = LAYOUT_TEST_MENU_CONST;
                    return [NAMESPACE_MENU_CONST[0], item, NAMESPACE_MENU_CONST[1]];
                }
                case namespace?.namespaceType === 104:
                case namespace?.name === 'AI 搜模型': {
                    const item = getModelEvaluationMenuItem();
                    item.children = AI_SEARCH_MENU_CONST;
                    return [NAMESPACE_MENU_CONST[0], item, NAMESPACE_MENU_CONST[1]];
                }
                default: {
                    return NAMESPACE_MENU_CONST;
                }
            }
        }
        case ['/main', '/market'].includes(pathname): {
            return [
                {
                    icon: <TagIcon />,
                    title: '业务管理',
                    path: 'main',
                },
                {
                    icon: <StoreyIcon />,
                    title: '应用市场',
                    path: 'market',
                },
            ];
        }
        case isDataPlatform: {
            return DATA_MENU_CONST;
        }
        case sceneId === 'kjlAI': {
            return [...MENUS_CONST.slice(0, -1), ...kjlAiMenus, ...MENUS_CONST.slice(-1)];
        }
        case isModelEvaluateList: {
            return [];
        }
        default: {
            return MENUS_CONST;
        }
    }
}

```