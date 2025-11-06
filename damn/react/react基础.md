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
import { useSearch } from '@/common/search/searchContext';
import { useNewSearchRequest } from '@/common/search/useSearch';
import { getCommonField } from '@/common/table';
import { NumberBoolean } from '@/common/types';
import { Stage, getCurrentEnv, getGPUNodesFromPrompt, getKVArrayFromEnum } from '@/common/utils';
import { useQuery } from '@/hooks/useQuery';
import { IAlgorithm } from '@/pages/index/api/maasWorkflow/algorithm';
import { applyPropertyBpm } from '@/pages/index/api/maasWorkflow/diff';
import { LogType } from '@/pages/index/api/maasWorkflow/paramLog';
import {
    IProperty,
    PropertyParamType,
    PropertyStatus,
    PropertyTaskType,
    getAssociatedStrategy,
    requestAllPropertiesConfig,
    requestCopy,
    requestDeleteCache,
    requestProperties,
    requestSaveOrUpdate,
} from '@/pages/index/api/maasWorkflow/property';
import CopyText from '@/pages/index/components/CopyText';
import { LayoutContainer, useAlgorithm, useScene } from '@/pages/index/components/MaasLayout';
import { RootState } from '@/pages/index/store';
import { workflowSelector } from '@/pages/index/store/features/workflowSlice';
import {
    Button,
    ITableColumn,
    InlineButton,
    Input,
    Link,
    OutlineTag,
    Popconfirm,
    PopoverCard,
    Select,
    Space,
    Table,
    Tabs,
    Tooltip,
    toast,
} from '@qunhe/muya-ui';
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { SceneSelect } from '../../Permission/setting';
import { ColorTag, diffColor } from '../Diff/util';
import { VersionDrawer } from '../version/version';
import { PropertyEdit } from './edit';
import { PropertyParamEdit } from './paramEdit';
import { StrategyDrawer } from './strategy';
import { TestRecordDrawer } from './testRecord';

/**
 * 解析 workflow 入参
 * 从 params JSON 字符串中提取包含 MaaSInput 的节点信息
 */
interface WorkflowInput {
    key: string;
    value: string | number | boolean;
    required: boolean;
}

function parseWorkflowInputs(params?: string): WorkflowInput[] {
    if (!params) {
        return [];
    }
    try {
        const paramsArray = JSON.parse(params);
        if (!Array.isArray(paramsArray) || paramsArray.length === 0) {
            return [];
        }
        const param = paramsArray[0];
        if (!param.workflow) {
            return [];
        }
        const inputs: WorkflowInput[] = [];
        try {
            const workflow = typeof param.workflow === 'string' ? JSON.parse(param.workflow) : param.workflow;
            if (workflow.nodes && Array.isArray(workflow.nodes)) {
                workflow.nodes.forEach((node: any) => {
                    if (node.type && node.type.includes('MaaSInput')) {
                        const widgetsValues = node.widgets_values || [];
                        if (widgetsValues.length > 0) {
                            inputs.push({
                                key: String(widgetsValues[0] || ''),
                                value: widgetsValues[1] !== undefined ? widgetsValues[1] : '',
                                required: widgetsValues[2] !== undefined ? Boolean(widgetsValues[2]) : false,
                            });
                        }
                    }
                });
            }
        } catch (error) {
            console.error('解析 workflow 失败:', error);
        }
        return inputs;
    } catch (error) {
        console.error('解析 params 失败:', error);
        return [];
    }
}

export interface ISelectOption {
    id: string | number;
    name: string;
    children?: Array<ISelectOption>;
}
interface IPropertyContext {
    factor: Array<ISelectOption>;
    factorMap: Record<string, any>;
    stage: Stage;
}
const PropertyCommonContext = createContext<IPropertyContext>({} as IPropertyContext);
export const useCommonData = () => useContext(PropertyCommonContext);

const Index: React.FC = () => {
    const [factor, setFactor] = useState<Array<ISelectOption>>([]);
    const [stage, setStage] = useState<Stage>(getCurrentEnv());

    useEffect(() => {
        requestAllPropertiesConfig().then(res => {
            const _data = res.map(item => ({
                id: item.attributeKey,
                name: item.attributeName,
                children: (item.values || []).map(value => ({
                    id: `${value.id}.${item.attributeKey}`,
                    name: value.name,
                })),
            }));
            setFactor(_data);
        });
    }, []);
    const factorMap = useMemo(() => {
        return factor.reduce(
            (prev, currnet) => ({
                ...prev,
                [currnet.id]: {
                    name: currnet.name,
                    ...currnet.children?.reduce(
                        (_prev, _current) => ({
                            ..._prev,
                            [`${_current.id}`.split('.')[0]]: _current.name,
                        }),
                        {},
                    ),
                },
            }),
            {},
        ) as Record<string, any>;
    }, [factor]);
    const propertyCommonContextValue = useMemo(() => ({ factor, factorMap, stage }), [factor, factorMap, stage]);
    return (
        <LayoutContainer>
            <PropertyCommonContext.Provider value={propertyCommonContextValue}>
                <Content stage={stage} setStage={setStage} />
            </PropertyCommonContext.Provider>
        </LayoutContainer>
    );
};

const Content = ({ stage, setStage }: { stage: Stage; setStage: (stage: Stage) => void }) => {
    const query = useQuery();
    const queryId = query.get('id');
    const { scene } = useScene();
    const [prodData, setProdData] = useState<Array<IProperty>>([]);
    const [ctx, Search, request, requesting] = useNewSearchRequest({
        request: requestProperties,
        defaultFilters: {
            pageSize: 10,
            pageNo: 1,
            scene: scene?.id || null,
            id: queryId || null,
            stage,
        },
    });
    const { algorithms: algorithmKeys } = useAlgorithm();
    const getProdData = () => {
        const sceneQuery = scene?.id || null;
        stage !== Stage.prod &&
            requestProperties({ stage: Stage.prod, pageSize: 1000, scene: sceneQuery || undefined }).then(res => {
                setProdData(res.list);
            });
    };
    useEffect(() => {
        getProdData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stage]);
    const colorMark = useMemo(() => {
        if (ctx.data?.length) {
            return getDiffColor(ctx.data, prodData);
        }
        return {};
    }, [ctx.data, prodData]);
    return (
        <Search>
            <StageTabs
                stage={stage}
                onChange={(e: Stage) => {
                    setStage(e);
                    ctx.setFilters({ stage: e });
                }}
                tabBarExtraContent={<ColorTag />}
            />
            <TableFilter algorithmKeys={algorithmKeys} />
            <TableContent
                onSuccess={(flushProd: boolean) => {
                    request();
                    flushProd && getProdData();
                }}
                requesting={requesting}
                algorithmKeys={algorithmKeys}
                colorMark={colorMark}
            />
        </Search>
    );
};

const TableFilter = ({ algorithmKeys }: { algorithmKeys: Array<IAlgorithm> }) => {
    const { scene, admin } = useScene();
    const { filters, setFilters } =
        useSearch<
            Partial<Pick<IProperty, 'taskType' | 'paramType' | 'needValidate' | 'status' | 'scene'> & { id: string }>
        >();
    const { stage } = useCommonData();
    const query = useQuery();
    const queryId = query.get('id');
    const [value, setValue] = useState<string>(filters.id || '');
    useEffect(() => {
        if (queryId) {
            setValue(queryId);
        }
    }, [queryId]);
    const paramTypes = useMemo(() => getKVArrayFromEnum(PropertyParamType).kv, []);
    const taskTypes = useMemo(() => getKVArrayFromEnum(PropertyTaskType).kv, []);
    const status = useMemo(() => getKVArrayFromEnum(PropertyStatus).kv, []);

    return (
        <Space style={{ justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Space block style={{ alignItems: 'center', marginBottom: 12, flex: 1 }}>
                {stage !== Stage.prod && (
                    <PropertyEdit
                        algorithmKeys={algorithmKeys}
                        data={{
                            scene: scene?.id,
                            factor: '{"model":0,"isLineArt":0,"isEmptyRoom":0,"isPublicLora":0,"isFloorPlan":0}',
                            needValidate: NumberBoolean.TRUE,
                            needCoverQuickly: NumberBoolean.FALSE,
                            promptNeedValidate: NumberBoolean.TRUE,
                        }}
                    >
                        {({ show }) => (
                            <Button type="primary" onClick={show}>
                                新建参数
                            </Button>
                        )}
                    </PropertyEdit>
                )}
                <Input
                    prefixNode={'id'}
                    value={value}
                    placeholder="id"
                    onChange={e => setValue(e.target.value)}
                    onBlur={() => {
                        setFilters({ id: value });
                    }}
                    onKeyDown={e => {
                        if ((e as any).code === 'Enter') {
                            setFilters({ id: value });
                        }
                    }}
                />
                <Select
                    allowClear
                    value={filters.paramType}
                    prefixNode="参数类型"
                    onChange={(v: PropertyParamType) => {
                        setFilters({ paramType: v });
                    }}
                >
                    {paramTypes.map(item => {
                        return <Select.Option key={item.value} label={item.label} value={item.value} />;
                    })}
                </Select>
                <Select
                    allowClear
                    value={filters.taskType}
                    prefixNode="出图任务类型"
                    onChange={(v: PropertyTaskType) => {
                        setFilters({ taskType: v });
                    }}
                >
                    {taskTypes.map(item => {
                        return <Select.Option key={item.value} label={item.label} value={item.value} />;
                    })}
                </Select>
                <Select
                    allowClear
                    value={filters.status}
                    prefixNode="状态"
                    onChange={(v: PropertyStatus) => {
                        setFilters({ status: v });
                    }}
                >
                    {status.map(item => {
                        return <Select.Option key={item.value} label={item.label} value={item.value} />;
                    })}
                </Select>
                <Select
                    allowClear
                    value={filters.needValidate}
                    prefixNode="是否进行违规检测"
                    onChange={(v: NumberBoolean) => {
                        setFilters({ needValidate: v });
                    }}
                >
                    <Select.Option key={NumberBoolean.FALSE} label={'进行违规检测'} value={NumberBoolean.FALSE} />
                    <Select.Option key={NumberBoolean.TRUE} label={'无须违规检测'} value={NumberBoolean.TRUE} />
                </Select>
                {admin && !scene?.id && (
                    <SceneSelect
                        value={filters.scene}
                        onChange={val => setFilters({ scene: val || undefined })}
                        key={filters.scene}
                    />
                )}
            </Space>
        </Space>
    );
};

const TableContent = ({
    algorithmKeys,
    onSuccess,
    requesting,
    colorMark = {},
}: {
    algorithmKeys: Array<IAlgorithm>;
    onSuccess: (flushProd?: boolean) => void;
    requesting?: boolean;
    colorMark?: any;
}) => {
    // const query = useQuery();
    // const paramId = query.get('paramId');
    const { data, filters, total, setFilters } = useSearch();
    const [_data, setData] = useState<Array<IProperty>>([]);
    const [selectData, setSelectData] = useState<IProperty>();
    // const { gpuNodeList } = useSelector<RootState, RootState['workflow']>(workflowSelector);
    const { stage } = useCommonData();
    const { workFlowKey } = useAlgorithm();
    const copyData = useCallback(
        (id: number) => {
            requestCopy({ id }).then(() => {
                toast.success('复制成功');
                onSuccess();
            });
        },
        [onSuccess],
    );
    const deleteData = useCallback(
        (data: IProperty) => {
            requestSaveOrUpdate({ ...data, status: PropertyStatus.已删除 }).then(() => {
                toast.success('删除成功');
                onSuccess();
            });
        },
        [onSuccess],
    );
    const column = useMemo<ITableColumn<IProperty>[]>(
        () => [
            {
                title: 'id',
                key: 'id',
                width: 50,
                render: v => <CopyText text={`${v.id}`} style={{ background: colorMark?.[v.id] }} />,
            },
            {
                title: '名称',
                key: 'name',
                width: 80,
                render: v => (
                    <Tooltip title={v.scene} placement="top">
                        <span>{v.name}</span>
                    </Tooltip>
                ),
            },
            {
                title: '参数类型',
                key: 'paramType',
                width: 80,
                render: v => {
                    let current = algorithmKeys?.find(e => e.type === v.paramType);
                    if (v.paramType === 5) {
                        current = { type: 5, name: 'workflow-gpu', id: 100 } as any;
                    }
                    const type = ['normal', 'primary', 'warning', 'success', 'success'][(current?.type || 1) - 1];
                    const workflowInputs = parseWorkflowInputs(v.params);
                    const tagContent = (
                        <OutlineTag type={type as any} shape="circle">
                            {current?.name || 'workflow-gpu'}
                        </OutlineTag>
                    );
                    if (workflowInputs.length > 0) {
                        return (
                            <Tooltip
                                title={
                                    <div style={{ maxWidth: 400, maxHeight: 300, overflow: 'auto' }}>
                                        <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Workflow 入参：</div>
                                        {workflowInputs.map((input, index) => (
                                            <div key={index} style={{ marginBottom: 8, padding: '4px 0' }}>
                                                <div>
                                                    <span style={{ fontWeight: 'bold' }}>Key: </span>
                                                    <span>{input.key || '-'}</span>
                                                </div>
                                                <div>
                                                    <span style={{ fontWeight: 'bold' }}>Value: </span>
                                                    <span style={{ wordBreak: 'break-all' }}>{input.value || '-'}</span>
                                                </div>
                                                <div>
                                                    <span style={{ fontWeight: 'bold' }}>Required: </span>
                                                    <span>{input.required ? '是' : '否'}</span>
                                                </div>
                                                {index < workflowInputs.length - 1 && (
                                                    <div style={{ borderTop: '1px solid #eee', marginTop: 8 }} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                }
                                placement="top"
                            >
                                {tagContent}
                            </Tooltip>
                        );
                    }

                    return tagContent;
                },
            },
            {
                title: 'CPU/GPU',
                key: 'cpu_gpu_key',
                width: 50,
                render: v => {
                    return <CPU_GPU_SHOW params={v.params} />;
                },
            },
            {
                title: '参数',
                key: 'params',
                width: 60,
                render: v => {
                    const current = algorithmKeys?.find(e => e.type === v.paramType);
                    let key = current?.key;
                    if (v.paramType === 5) {
                        key = workFlowKey;
                    }
                    return (
                        <PropertyParamEdit
                            data={v}
                            onChange={() => onSuccess()}
                            algorithmKeys={algorithmKeys}
                            algorithmKey={key}
                            disableEdit={stage === Stage.prod}
                        >
                            {({ show }) => (
                                <>
                                    <InlineButton type="primary" onClick={show}>
                                        {stage === Stage.prod ? '查看参数' : '编辑参数'}
                                    </InlineButton>
                                </>
                            )}
                        </PropertyParamEdit>
                    );
                },
            },
            {
                title: 'output',
                key: 'paramOutput',
                width: 50,
                render: v => (
                    <PopoverCard
                        title="paramOutput"
                        content={<OutputParamContent text={v.paramOutput} />}
                        triggerAction="hover"
                        placement="bottom"
                    >
                        <InlineButton type="primary">查看</InlineButton>
                    </PopoverCard>
                ),
            },
            {
                title: '违规检测',
                key: 'needValidate',
                width: 70,
                render: v => (
                    <div>
                        <p>
                            <span>生成图: </span>
                            {v.needValidate === NumberBoolean.FALSE ? (
                                <span style={{ color: 'green' }}>是</span>
                            ) : (
                                <span style={{ color: 'red' }}>否</span>
                            )}
                        </p>
                        <p>
                            <span>违规后转存: </span>
                            {v.needCoverQuickly === NumberBoolean.TRUE ? (
                                <span style={{ color: 'green' }}>是</span>
                            ) : (
                                <span style={{ color: 'red' }}>否</span>
                            )}
                        </p>
                        <p>
                            <span>输入 Prompt: </span>
                            {v.promptNeedValidate === NumberBoolean.FALSE ? (
                                <span style={{ color: 'green' }}>是</span>
                            ) : (
                                <span style={{ color: 'red' }}>否</span>
                            )}
                        </p>
                    </div>
                ),
            },
            ...getCommonField(),
            {
                title: '操作',
                key: 'action',
                width: 140,
                render: v => (
                    <Space spacing={12} style={{ flexWrap: 'wrap' }}>
                        {[4, 5].includes(v.paramType) && (
                            <TestRecordDrawer id={v.id} scene={v.scene}>
                                {({ open }) => (
                                    <InlineButton type="primary" onClick={open}>
                                        测试
                                    </InlineButton>
                                )}
                            </TestRecordDrawer>
                        )}
                        <InlineButton
                            type="warning"
                            onClick={() => {
                                window.open(`./#/groups?propertiesIdList=${v.id}`);
                            }}
                        >
                            走查
                        </InlineButton>
                        <InlineButton
                            type="success"
                            onClick={() => {
                                window.open(`https://tesseract.qunhequnhe.com/page/51306?propertiesId=${v.id}`);
                            }}
                        >
                            看板
                        </InlineButton>
                        <InlineButton
                            type="primary"
                            onClick={() => {
                                setSelectData(v);
                            }}
                        >
                            历史
                        </InlineButton>
                        <StrategyDrawer id={v.id} scene={v.scene} stage={stage}>
                            {({ open }) => (
                                <InlineButton type="primary" onClick={open}>
                                    策略
                                </InlineButton>
                            )}
                        </StrategyDrawer>
                        <InlineButton
                            type="danger"
                            title="删除实时缓存"
                            onClick={() => {
                                const stage_str = stage === Stage.prod || stage === Stage.beta ? stage : 'dev';
                                requestDeleteCache([{ type: 'propertyId', id: v.id, stage: stage_str }])
                                    .then(() => {
                                        toast.success('删除成功');
                                    })
                                    .catch(e => {
                                        toast.error('删除失败' + e.message);
                                    });
                            }}
                        >
                            清缓存
                        </InlineButton>
                        {stage !== Stage.prod && (
                            <>
                                <PropertyEdit data={v} onSuccess={onSuccess} algorithmKeys={algorithmKeys}>
                                    {({ show }) => (
                                        <InlineButton type="primary" onClick={show}>
                                            编辑
                                        </InlineButton>
                                    )}
                                </PropertyEdit>
                                <Popconfirm
                                    title="确认复制吗？"
                                    confirmText="确认"
                                    cancelText="取消"
                                    type="info"
                                    triggerAction="click"
                                    onConfirm={() => {
                                        copyData(v.id);
                                    }}
                                    placement="bottom-end"
                                >
                                    <InlineButton type="primary">复制</InlineButton>
                                </Popconfirm>
                                <BpmContent
                                    id={v.id}
                                    scene={v.scene}
                                    colorMark={colorMark}
                                    onSuccess={() => onSuccess(true)}
                                />
                                <Popconfirm
                                    title="确认删除吗？"
                                    confirmText="确认"
                                    cancelText="取消"
                                    type="error"
                                    triggerAction="click"
                                    onConfirm={() => {
                                        getAssociatedStrategy(v.id, stage).then(res => {
                                            if (res.strategyList.length) {
                                                toast.error(
                                                    `该参数已关联 id 为 ${res.strategyList.map(
                                                        e => e.id,
                                                    )}的策略，无法删除`,
                                                );
                                            } else {
                                                deleteData(v);
                                            }
                                        });
                                    }}
                                    placement="bottom-end"
                                >
                                    <InlineButton type="danger">删除</InlineButton>
                                </Popconfirm>
                            </>
                        )}
                    </Space>
                ),
            },
        ],
        [colorMark, algorithmKeys, stage, workFlowKey, onSuccess, copyData, deleteData],
    );

    useEffect(() => {
        setData(data?.filter(e => e.status !== 2).sort((a: any, b: any) => b.lastmodified - a.lastmodified) || []);
    }, [data]);

    return (
        <div>
            <Table<IProperty>
                style={{ marginTop: 16, height: '70vh' }}
                columns={column}
                dataSource={_data}
                rowKey="id"
                loading={requesting}
                pagination={{
                    current: filters.pageNo,
                    pageSize: filters.pageSize,
                    totalRecords: total,
                    showPageSizeChanger: true,
                }}
                onChange={({ pagination }) => {
                    setFilters({
                        pageNo: pagination?.current || 1,
                        pageSize: pagination?.pageSize,
                    });
                }}
            />
            {selectData && (
                <VersionDrawer
                    stage={stage}
                    id={selectData.id}
                    customNode={
                        <Link
                            onClick={() => {
                                window.open(
                                    `./#/diff??whoami=${selectData.scene}&dataId=${selectData.id}&dataType=12&versionDiff=true&stage=${stage}`,
                                );
                            }}
                        >
                            版本差异详情
                        </Link>
                    }
                    onClose={() => setSelectData(undefined)}
                    paramType={LogType.property}
                    show={true}
                    onReset={(data: IProperty) => {
                        return requestSaveOrUpdate(data)
                            .then(() => {
                                toast.success(`恢复成功,最新数据为该版本数据`);
                                onSuccess && onSuccess();
                                return Promise.resolve();
                            })
                            .catch(e => {
                                toast.error(`恢复失败`);
                                return Promise.reject(e);
                            });
                    }}
                />
            )}
        </div>
    );
};

export const OutputParamContent = ({ text, color }: { text?: string; color?: string }) => {
    const jsonData = useMemo(() => {
        try {
            return JSON.parse(text || '');
        } catch (error) {
            console.error(`output error:${error}`);
            return {};
        }
    }, [text]);
    if (!text) {
        return null;
    }
    return (
        <div style={{ color }}>
            <Space direction="vertical">
                {jsonData.map((item: any, index: number) => (
                    <div key={index}>{JSON.stringify(item, null, 2)}</div>
                ))}
            </Space>
        </div>
    );
};

const getDiffColor = (dev: Array<IProperty>, prods: Array<IProperty>) => {
    const prodMap = prods.reduce(
        (prev, current) => ({
            ...prev,
            [current.id]: current,
        }),
        {} as Record<number, IProperty>,
    );
    const result = dev.reduce((prev, current) => {
        const prodItem = prodMap?.[current.id];
        if (!prodItem) {
            return {
                ...prev,
                [current.id]: diffColor.Add,
            };
        }
        if (prodItem.lastmodified !== current.lastmodified) {
            return {
                ...prev,
                [current.id]: diffColor.Update,
            };
        }
        return prev;
    }, {});
    return result;
};

const BpmContent = ({
    id,
    scene,
    colorMark,
    onSuccess: onSuccess,
}: {
    id: number;
    scene: string;
    colorMark?: any;
    onSuccess: () => void;
}) => {
    const [loading, setLoading] = useState<boolean>();
    const startBpm = useCallback(() => {
        // requestTestRecordList({ pageSize: 1, propertiesId: id }).then(res => {
        //     if (
        //         !res.list.length ||
        //         dayjs().diff(dayjs(res.list[0].lastmodified), 'hour') > 24 ||
        //         res.list[0].status !== 1
        //     ) {
        //         toast.error('参数流转之前必须要有一个24小时内运行成功的测试报告');
        //         return;
        //     }

        if (colorMark?.[id] === diffColor.Add) {
            setLoading(true);
            applyPropertyBpm(+id)
                .then(() => {
                    toast.success('流转成功');
                    onSuccess();
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            window.open(`./#/diff?whoami=${scene}&dataId=${id}&dataType=12&preView=true`);
        }
        // });
    }, [colorMark, id, onSuccess, scene]);
    return (
        <>
            {colorMark?.[id] && (
                <InlineButton onClick={startBpm} type="danger" loading={loading}>
                    去流转
                </InlineButton>
            )}
        </>
    );
};

function getKeyByValue(object: any, value: string | number) {
    return Object.keys(object).find(key => object[key] === value);
}
export const StageTabs = ({
    stage,
    onChange,
    tabBarExtraContent,
}: {
    stage: Stage;
    onChange: (stage: Stage) => void;
    tabBarExtraContent?: ReactNode;
}) => {
    const currentEnv = useMemo(() => getCurrentEnv(), []);
    const stages = useMemo(() => {
        return [currentEnv, Stage.prod];
    }, [currentEnv]);
    if (currentEnv === Stage.prod) {
        return null;
    }
    return (
        <Tabs className="tabs" index={stage} onChange={onChange} size="l" tabBarExtraContent={tabBarExtraContent}>
            {stages.map(stage => (
                <Tabs.TabPanel tab={getKeyByValue(Stage, stage)} index={stage} key={stage}></Tabs.TabPanel>
            ))}
        </Tabs>
    );
};

export const CPU_GPU_SHOW = ({ params }: { params?: string }) => {
    const { gpuNodeList } = useSelector<RootState, RootState['workflow']>(workflowSelector);
    if (params) {
        const paramsJson = JSON.parse(params) as any[];
        if (!paramsJson || paramsJson.length === 0) {
            return <div />;
        }
        const useGPUNodes = paramsJson.flatMap(w => {
            if (w.workflow && w.prompt) {
                const filered = getGPUNodesFromPrompt(gpuNodeList, w.prompt);
                return filered.length > 0 ? [w] : [];
            }
            return [];
        });

        return (
            <>
                {useGPUNodes.length > 0 && (
                    <OutlineTag type={'primary'} shape="circle">
                        {`GPUx${useGPUNodes.length}`}
                    </OutlineTag>
                )}
                {paramsJson.length > useGPUNodes.length && (
                    <OutlineTag type={'normal'} shape="circle">
                        {`CPUx${paramsJson.length - useGPUNodes.length}`}
                    </OutlineTag>
                )}
            </>
        );
    }
    return <div />;
};

export default Index;

```