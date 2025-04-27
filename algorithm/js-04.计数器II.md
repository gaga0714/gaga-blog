# 计数器 II

## 题目

请你写一个函数 createCounter。这个函数接收一个初始的整数值 init。并返回一个包含三个函数的对象。

这三个函数是：

increment() 将当前值加 1 并返回。

decrement() 将当前值减 1 并返回。

reset() 将当前值设置为 init 并返回。

示例 1：

输入：init = 5, calls = ["increment","reset","decrement"]

输出：[6,5,4]

解释：

const counter = createCounter(5);

counter.increment(); // 6

counter.reset(); // 5

counter.decrement(); // 4

示例 2：

输入：init = 0, calls = ["increment","increment","decrement","reset","reset"]

输出：[1,2,1,0,0]

解释：

const counter = createCounter(0);

counter.increment(); // 1

counter.increment(); // 2

counter.decrement(); // 1

counter.reset(); // 0

counter.reset(); // 0

提示：

-1000 <= init <= 1000

0 <= calls.length <= 1000

calls[i] 是 “increment”、“decrement” 和 “reset” 中的一个

## 答案

```
var createCounter = function(init){
    let tmp=init;
    return {
        increment: function(){
            return ++tmp;
        },
        decrement: function(){
            return --tmp;
        },
        reset: function(){
            tmp=init;
            return tmp;
        }
    }
}
```

## 扩展

**闭包（closure）**：函数“记住了”定义它时所处的作用域中的变量，即使函数在外部执行也能访问它。

只初始化一次，保存在闭包里，fn() 每次调用都在访问那同一个 count 变量。
