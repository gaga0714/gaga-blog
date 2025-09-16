先背相师傅的：

https://github.com/camera-2018/frontend-interview

# 深拷贝
```js
function deepClone(obj,hash=new WeakMap()){
    if(obj===null) return obj;
    if(obj instanceof Date) return new Date(obj);
    if(obj instanceof RegExp) return new RegExp(obj);
    if(typeof obj !=='object') return obj;
    if(hash.has(obj)) return hash.get(obj);
    let cloneObj=new obj.constructor();
    hash.set(obj,cloneObj);
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            cloneObj[key]=deepClone(obj[key],hash);
        }
    }
    return cloneObj;
}
```


# call
```js
function mycall(context,...args){
    context=context||windows;
    context.fn=this;
    let res=context.fn(...args);
    delete context.fn;
    return res;
}
```

# 防抖
```js
function debounce(fn,delay){
    let timer=null;
    return function(...args){
        if(timer){
            clearTimeout(timer);
        }
        timer=setTimeout(()=>{
            fn.apply(this,args);
        },delay);
    }
}
```

# 节流
```js
function throttle(fn,delay){
    let lasttime=0;
    return function(...args){
        let now=new Date.getTime();
        if(now-lasttime>=delay){
            fn.apply(this,args);
            lasttime=now;
        }
    }
}
```

# PromiseAll
```js
function my_promiseAll(promises){
    return new Promise((resolve,reject)=>{
        let settled=0;
        let total=promises.length;
        let res=[];
        if(total==0){
            resolve(res);
            return ;
        }
        promises.forEach((promise,index)=>{
            Promise.resolve(promise)
            .then((val)=>{
                res[index]=val;
                settled++;
                if(settled===total){
                    resolve(res);
                }
            })
            .catch((err)=>{
                reject(err);
            })
        })
    })
}
```

# instanceof
```js
function InstanceOf(obj,Constructor){
    if(typeof Constructor !=='function') throw new TypeError();
    if(obj===null||typeof obj!=='object') return false;
    let proto=Object.getPrototypeOf(obj);
    let prototype=Constructor.prototype;
    while(proto!==null){
        if(proto===prototype) return true;
        proto=Object.getPrototypeOf(proto);
    }
    return false;
}
```

# new
```js
function mynew(Function,...args){
    let obj={};
    obj.__proto__=Function.prototype;
    let res=Function.apply(obj,args);
    return result instanceof Object?res:obj;
}
```

# 扁平化树
```js
const tree=[
    {
        id:1,
        name:"A",
        children:[
            {id:2,name:"B",children:[{id:3,name:"C"}]},
            {id:4,name:"D"},
        ],
    }
];
function flatTree(node,parentId=null,level=0,res=[]){
    for(let item of tree){
        const {children,...args}=item;
        res.push({...args,level,parentId});
        if(children&&children.length){
            flatTree(children,item.id,level+1,res);
        }
    }
    return res;
}
```

# 常见树操作合集
```js

const list = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
  { id: 6, name: '部门6', pid: 0 }
];

const tree = [
  {
    id: 1,
    name: '部门1',
    pid: 0,
    children: [
      {
        id: 2,
        name: '部门2',
        pid: 1,
        children: []
      },
      {
        id: 3,
        name: '部门3',
        pid: 1,
        children: [
          {
            id: 4,
            name: '部门4',
            pid: 3,
            children: [
              {
                id: 5,
                name: '部门5',
                pid: 4,
                children: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 6,
    name: '部门6',
    pid: 0,
    children: []
  }
];

const levelTree = [
  {
    level: 1,
    name: '部门1',
    id: 1
  },
  {
    level: 3,
    name: '部门2',
    id: 2
  },
  {
    level: 2,
    name: '部门3',
    id: 3
  },
  {
    level: 3,
    name: '部门4',
    id: 4
  },
  {
    level: 4,
    name: '部门5',
    id: 5
  }
];

const strarr = {
  'a-b-c-d': 1,
  'a-b-c-e': 2,
  'a-b-f': 3,
  'a-j': 4
};

// 列表转树(遍历列表,先创建当前节点-有可能已经创建过则直接赋值chidren,再处理父节点,如果父节点还没遍历到则创建,如果之前已经创建过则直接赋值,父节点的children中加入当前节点)
function getTree(list) {
  const tree = [];
  // 用hashmap存储id=>{node, children:[]}的映射
  const hashmap = {};
  for (const item of list) {
    const { id, pid } = item;
    // 处理当前节点
    // 如果没创建就创建,如果之前已经创建过则直接赋值
    if (!hashmap[id]) hashmap[id] = { ...item, children: [] };
    else hashmap[id] = { ...item, children: hashmap[id].children };
    // 处理父节点
    if (pid === 0) {
      // 根节点直接放入list
      tree.push(hashmap[id]);
    } else {
      // 非根节点,如果父节点还没遍历到则创建
      if (!hashmap[pid]) {
        hashmap[pid] = {
          children: []
        };
      }
      // 父节点的children中加入当前节点
      hashmap[pid].children.push(hashmap[id]);
    }
  }
  return tree;
}

// 树转列表(遍历树,将节点放入结果,如果有children则递归遍历children,将结果放入结果中)
function getList(data, result = []) {
  if (!data) return [];

  for (const node of data) {
    const { children, ...rest } = node;
    result.push(rest);

    if (children && children.length) getList(children, result);
  }

  return result;
}

// 计算树的深度(遍历树,找到叶子节点,更新最大深度)
function getDeep(tree) {
  let max = 0;

  const traverse = (node, level) => {
    if (!node) return;
    // 如果是叶子节点,更新最大深度
    if (node?.children.length === 0) max = Math.max(max, level);

    node?.children.forEach(child => {
      traverse(child, level + 1);
    });
  };

  tree?.forEach(node => {
    traverse(node, 1);
  });

  return max;
}

// 树形结构获取路径(遍历树,进入节点前加入节点路径,离开节点前节点路径,找到id,返回结果)
function getTreePath(tree, id) {
  const path = [];
  let res = '';

  const traverse = (node, path) => {
    if (!node) return;

    path.push(node.name);
    if (node.id === id) {
      res = path.join('->');
      return;
    }

    node?.children.forEach(child => {
      traverse(child, path);
      path.pop();
    });
  };

  tree?.forEach(node => {
    traverse(node, path);
  });

  return res;
}

// 对象字符串转对象(遍历字符串,根据-分割,遍历分割后的数组,最后一个直接赋值,否则判断是否存在,不存在则创建,指向下一层)
function strToObject(str) {
  if (!str) return {};

  let obj = {};

  for (let key in str) {
    let keys = key.split('-');

    let temp = obj;
    keys.forEach((item, index) => {
      // 如果是最后一个,直接赋值
      if (index === keys.length - 1) {
        temp[item] = str[key];
      } else {
        // 如果不是最后一个,则判断是否存在,不存在则创建
        temp[item] ??= {};
      }

      // 指向下一层
      temp = temp[item];
    });
  }
}

// 树筛选,(分解子问题)一个节点是否保留在过滤后的树结构中，取决于它自身以及后代节点中是否有符合条件的节点
function filterTree(tree, func) {
  if (!Array.isArray(tree) || tree.length === 0) {
    return [];
  }

  // 使用map复制一下节点，避免修改到原树
  return tree
    .map(node => ({ ...node }))
    .filter(node => {
      // 如果有子节点，遍历过滤子节点得到新的子节点
      if (node.children) node.children = filterTree(node.children, func);

      // 节点本身符合条件，或者它的子节点中有符合条件的节点，就保留
      if (func(node)) return true;
      if (node.children && node.children.length) return true;
    });
}
// 遍历转换将树节中没有 pid 的节点中添加 pid
function addPid(tree) {
  const traverse = (node, pid) => {
    if (!node) return;

    node.pid = pid;

    node?.children.forEach(child => {
      traverse(child, node.id);
    });
  };

  tree?.forEach(node => {
    traverse(node, 0);
  });

  return tree;
}

// 打印树层次结构缩进表示(第一层节点加*号,第二层节点加-号,第三层节点加+号)
function treePrint(tree) {
  let res = '';

  const dfs = (node, level) => {
    if (!node) return;

    if (level % 3 === 0) res += `${'  '.repeat(level)}* ${node.name}\n`;
    else if (level % 3 === 1) res += `${'  '.repeat(level)}- ${node.name}\n`;
    else res += `${'  '.repeat(level)}+ ${node.name}\n`;

    node.children?.forEach(child => {
      dfs(child, level + 1);
    });
  };

  tree.forEach(node => {
    dfs(node, 0);
  });

  return res;
}

const tree1 = getTree(list);
console.log(tree1);
console.log(getList(tree1));
console.log(getDeep(tree1));
console.log(getTreePath(tree1, 6));
console.log(strToObject(strarr));
console.log(filterTree(tree1, node => node.id === 3));
console.log(addPid(tree1));
console.log(treePrint(tree1));
```

# 两个队列模拟栈
```js
class StackWithQueues {
  constructor() {
    this.queue1 = []; // 主队列（始终存储数据）
    this.queue2 = []; // 辅助队列（用于操作时临时存储）
  }

  // 入栈操作：直接加入主队列
  push(x) {
    this.queue1.push(x);
  }

  // 出栈操作：将主队列元素转移到辅助队列，留最后一个弹出
  pop() {
    if (this.empty()) return undefined;
    while (this.queue1.length > 1) {
      this.queue2.push(this.queue1.shift());
    }
    const popped = this.queue1.shift();
    // 交换队列引用，保证下次操作时 queue1 仍是主队列
    [this.queue1, this.queue2] = [this.queue2, this.queue1];
    return popped;
  }

  // 查看栈顶元素：类似出栈，但将元素放回主队列
  top() {
    if (this.empty()) return undefined;
    while (this.queue1.length > 1) {
      this.queue2.push(this.queue1.shift());
    }
    const topElement = this.queue1[0];
    this.queue2.push(this.queue1.shift());
    [this.queue1, this.queue2] = [this.queue2, this.queue1];
    return topElement;
  }

  // 判断栈是否为空
  empty() {
    return this.queue1.length === 0;
  }
}
```

# 手写堆
```js
class Heap {
  constructor(compare = (a, b) => a < b) {
    this.compare = compare; // 比较函数，决定堆的类型（默认最小堆）
    this.heap = [];
  }

  // 插入元素
  insert(value) {
    this.heap.push(value);
    this._siftUp(this.heap.length - 1);
  }

  // 弹出堆顶元素
  extract() {
    if (this.heap.length === 0) return null;
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  // 查看堆顶元素
  peek() {
    return this.heap.length === 0 ? null : this.heap[0];
  }

  // 获取堆大小
  size() {
    return this.heap.length;
  }

  // 判断堆是否为空
  isEmpty() {
    return this.heap.length === 0;
  }

  // 上浮操作
  _siftUp(index) {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.compare(this.heap[current], this.heap[parent])) {
        [this.heap[current], this.heap[parent]] = [this.heap[parent], this.heap[current]];
        current = parent;
      } else {
        break;
      }
    }
  }

  // 下沉操作
  _siftDown(index) {
    let current = index;
    const length = this.heap.length;
    while (true) {
      const leftChild = 2 * current + 1;
      const rightChild = 2 * current + 2;
      let target = current;

      // 与左子节点比较
      if (leftChild < length && this.compare(this.heap[leftChild], this.heap[target])) {
        target = leftChild;
      }
      // 与右子节点比较
      if (rightChild < length && this.compare(this.heap[rightChild], this.heap[target])) {
        target = rightChild;
      }
      // 若需要交换，继续下沉
      if (target !== current) {
        [this.heap[current], this.heap[target]] = [this.heap[target], this.heap[current]];
        current = target;
      } else {
        break;
      }
    }
  }
}
```

# 手写属性访问函数
```js
/**
 * 安全访问嵌套对象属性，支持数组索引
 * @param {Object} obj - 目标对象
 * @param {string} path - 属性路径，例如 'a.b[0].c'
 * @param {any} [defaultValue=undefined] - 默认值
 * @returns {any} 属性值或默认值
 */
function getProperty(obj, path, defaultValue) {
  // 1. 路径解析：拆分成属性名和数组索引
  const segments = [];
  const regex = /([^\.\[\]]+)|\[(\d+)\]/g;
  let match;
  
  while ((match = regex.exec(path)) !== null) {
    if (match[1]) { // 捕获属性名
      segments.push(match[1]);
    } else if (match[2]) { // 捕获数组索引
      segments.push(parseInt(match[2], 10));
    }
  }

  // 2. 逐级访问属性
  let current = obj;
  for (const segment of segments) {
    if (current === null || current === undefined) break;
    current = current[segment];
  }

  // 3. 返回最终值或默认值
  return current !== undefined ? current : defaultValue;
}

// 示例测试
const obj = {
  user: {
    name: 'John',
    hobbies: [
      { title: 'Coding', tags: ['js', 'node'] },
      { title: 'Gaming' }
    ],
    'special.property': 'Secret' // 包含特殊字符的属性
  }
};

// 测试用例
console.log(getProperty(obj, 'user.name')); // 'John'
console.log(getProperty(obj, 'user.hobbies[0].tags[1]')); // 'node'
console.log(getProperty(obj, 'user.hobbies[1].title')); // 'Gaming'
console.log(getProperty(obj, 'user.hobbies[3]', 'Not Found')); // 'Not Found'
console.log(getProperty(obj, 'user["special.property"]')); // undefined（需特殊处理）
```

# 三栏布局移动优先设计
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .container {
        display: flex;
        flex-direction: column;
      }
      .sidebar {
        background-color: lightgray;
        padding: 10px;
      }
      .main-content {
        background-color: lightblue;
      }

      @media screen and (min-width: 768px) {
        .container {
          flex-direction: row;
        }
        .sidebar {
          flex-basis: 200px;
        }
        .main-content {
          flex-grow: 1;
          margin: 0 10px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="sidebar">Sidebar</div>
      <div class="main-content">Main Content</div>
      <div class="sidebar">Sidebar</div>
    </div>
  </body>
</html>
```

# 两栏布局
```js
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .container {
        display: flex;
      }
      .column {
        flex: 1;
        padding: 20px;
      }
      .column1 {
        background-color: #f1f1f1;
      }
      .column2 {
        background-color: #e1e1e1;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="column column1">Column 1</div>
      <div class="column column2">Column 2</div>
    </div>
  </body>
</html>
```

# 圣杯布局
```html
<style>
  .container {
    width: 100vw;
    display: flex;
  }
  .main {
    background: red;
    flex-grow: 1;
    order: 2;
  }
  .left {
    background: #000;
    width: 200px;
    order: 1;
  }
  .right {
    background: blue;
    width: 200px;
    order: 3;
  }
</style>
<div class="container">
  <div class="main"></div>
  <div class="left"></div>
  <div class="right"></div>
</div>
```