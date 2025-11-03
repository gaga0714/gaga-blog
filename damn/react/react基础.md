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
多次渲染同一个组件
```jsx
import {useState} from 'react';
function MyButton(){
    const [cnt,setCnt]=usrState(0);
}
```



快速切换 Tab 时，useEffect 滞后于用户的操作，导致 that.sqlQuery (快速更新) 和 sqlQuery (慢速更新，依赖 useEffect) 之间的数据不一致，从而造成混乱。


```
import { LayoutContainer } from '@/pages/index/components/MaasLayout';
import { AddIcon, CloseIcon } from '@qunhe/muya-theme-light';
import { Button, Input, Space, Table, Tabs, toast } from '@qunhe/muya-ui';
import React, { useMemo, useState } from 'react';
import Dashboard from './dashboard';
import { TabBarContainer, TabBarContent, TabBarTitle, TabCloseButton } from './styled';

type SearchMode = 'dashbord' | 'condition';

interface TabState {
    id: number;
    name: string;
    mode: SearchMode;
    searchInput1?: string; // 搜索条件1
    searchInput2?: string; // 搜索条件2
    resultData?: any[]; // 搜索结果数据
    pageNo?: number; // 当前页码
    closeAble: boolean;
}

function getBlankTab(nextId: number): TabState {
    return {
        id: nextId,
        name: `搜索${nextId}`,
        mode: 'condition',
        searchInput1: '',
        searchInput2: '',
        resultData: [],
        pageNo: 1,
        closeAble: true,
    };
}

const DASHBOARD_TAB: TabState = {
    id: 0,
    name: '数据看板',
    mode: 'dashbord',
    closeAble: false,
};

export default function MarkVisualization() {
    const [tabs, setTabs] = useState<TabState[]>([DASHBOARD_TAB]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingName, setEditingName] = useState<string>('');
    const activeTab = useMemo(() => tabs[activeIndex], [activeIndex, tabs]);

    // 从当前tab获取搜索条件
    const searchInput1 = activeTab?.searchInput1 || '';
    const searchInput2 = activeTab?.searchInput2 || '';
    const resultData = activeTab?.resultData || [];
    const pageNo = activeTab?.pageNo || 1;

    const addTab = () => {
        const nextId = tabs.length ? Math.max(...tabs.map(t => t.id)) + 1 : 1;
        const newTab = getBlankTab(nextId);
        setTabs(prev => [...prev, newTab]);
        setActiveIndex(tabs.length);
    };

    const closeTab = (idx: number) => {
        if (tabs.length === 0 || !tabs[idx].closeAble) return;
        const newTabs = tabs.filter((_, i) => i !== idx);
        const nextActive =
            idx === activeIndex ? Math.min(idx, newTabs.length - 1) : idx < activeIndex ? activeIndex - 1 : activeIndex;
        setTabs(newTabs);
        setActiveIndex(nextActive);
    };

    const startRename = (idx: number) => {
        setEditingIndex(idx);
        setEditingName(tabs[idx].name);
    };

    const updateTab = (idx: number, patch: Partial<TabState>) => {
        setTabs(prev => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
    };

    const commitRename = () => {
        if (editingIndex === null) return;
        const name = editingName.trim() || tabs[editingIndex].name;
        updateTab(editingIndex, { name });
        setEditingIndex(null);
    };

    const updateActiveTab = (patch: Partial<TabState>) => {
        updateTab(activeIndex, patch);
    };

    const handleClear = () => {
        if (!activeTab) return;
        // 清空搜索输入框
        updateActiveTab({
            searchInput1: '',
            searchInput2: '',
            resultData: [],
            pageNo: 1,
        });
    };

    const handleSearch = () => {
        if (!activeTab) return;
        // 触发搜索，这里可以后续接入实际的搜索接口
        // 暂时使用模拟数据
        const mockData = Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            col1: `数据${i + 1}-1`,
            col2: `数据${i + 1}-2`,
            col3: `数据${i + 1}-3`,
            col4: `数据${i + 1}-4`,
            col5: `数据${i + 1}-5`,
            col6: `数据${i + 1}-6`,
            col7: `数据${i + 1}-7`,
            col8: `数据${i + 1}-8`,
        }));
        updateActiveTab({
            resultData: mockData,
            pageNo: 1,
        });
        toast.success('搜索完成');
    };

    return (
        <LayoutContainer>
            <TabBarContainer>
                <TabBarTitle>数据看板</TabBarTitle>
                <TabBarContent>
                    <Tabs type="capsule" index={activeIndex} onChange={(v: number) => setActiveIndex(v)}>
                        {tabs.map((t, idx) => (
                            <Tabs.Tab width={160} index={idx} key={t.id}>
                                {editingIndex === idx ? (
                                    <Input
                                        size="s"
                                        style={{ width: 92 }}
                                        value={editingName}
                                        autoFocus
                                        onInput={e => setEditingName((e.target as HTMLInputElement).value)}
                                        onBlur={commitRename}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') commitRename();
                                            if (e.key === 'Escape') setEditingIndex(null);
                                        }}
                                    />
                                ) : (
                                    <span onDoubleClick={() => startRename(idx)}>{t.name}</span>
                                )}
                                {t.closeAble && (
                                    <TabCloseButton
                                        onClick={e => {
                                            e.stopPropagation();
                                            closeTab(idx);
                                        }}
                                    >
                                        <CloseIcon style={{ width: 8 }} />
                                    </TabCloseButton>
                                )}
                            </Tabs.Tab>
                        ))}
                    </Tabs>
                    <Button size="s" onClick={addTab} style={{ marginLeft: 8 }}>
                        <AddIcon />
                    </Button>
                </TabBarContent>
            </TabBarContainer>
            {activeTab.mode === 'dashbord' ? (
                <Dashboard />
            ) : (
                <div style={{ padding: 16 }}>
                    <Space direction="vertical" spacing={16} style={{ width: '100%' }}>
                        <Space direction="horizontal" style={{ width: '100%' }} spacing={12}>
                            <Input
                                placeholder="请输入搜索条件1"
                                value={searchInput1}
                                onChange={e => updateActiveTab({ searchInput1: (e.target as HTMLInputElement).value })}
                            />
                            <Input
                                placeholder="请输入搜索条件2"
                                value={searchInput2}
                                onChange={e => updateActiveTab({ searchInput2: (e.target as HTMLInputElement).value })}
                            />
                            <Button onClick={handleClear}>清空</Button>
                            <Button type="primary" onClick={handleSearch}>
                                搜索
                            </Button>
                        </Space>
                        <div style={{ marginTop: 24 }}>
                            <div style={{ textAlign: 'center', marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
                                结果列表
                            </div>
                            <Table
                                dataSource={resultData}
                                columns={[
                                    { title: '1', key: 'col1', dataIndex: 'col1' },
                                    { title: '2', key: 'col2', dataIndex: 'col2' },
                                    { title: '3', key: 'col3', dataIndex: 'col3' },
                                    { title: '4', key: 'col4', dataIndex: 'col4' },
                                    { title: '5', key: 'col5', dataIndex: 'col5' },
                                    { title: '6', key: 'col6', dataIndex: 'col6' },
                                    { title: '7', key: 'col7', dataIndex: 'col7' },
                                    { title: '8', key: 'col8', dataIndex: 'col8' },
                                ]}
                                rowKey="id"
                                pagination={{
                                    totalRecords: resultData.length,
                                    current: pageNo,
                                    pageSize: 20,
                                    onClick: e => {
                                        const newPageNo = parseInt((e.target as HTMLAnchorElement).text);
                                        if (newPageNo && !isNaN(newPageNo)) {
                                            updateActiveTab({ pageNo: newPageNo });
                                        }
                                    },
                                }}
                            />
                        </div>
                    </Space>
                </div>
            )}
        </LayoutContainer>
    );
}

```