# 相等还是不相等

## 题目

请你编写一个名为 expect 的函数，用于帮助开发人员测试他们的代码。它应该接受任何值 val 并返回一个包含以下两个函数的对象。

toBe(val) 接受另一个值并在两个值相等（ === ）时返回 true 。如果它们不相等，则应抛出错误 "Not Equal" 。

notToBe(val) 接受另一个值并在两个值不相等（ !== ）时返回 true 。如果它们相等，则应抛出错误 "Equal" 。

示例 1：

输入：`func = () => expect(5).toBe(5)`

输出：`{"value": true}`

解释：`5 === 5` 因此该表达式返回 `true`。

示例 2：

输入：`func = () => expect(5).toBe(null)`

输出：`{"error": "Not Equal"}`

解释：`5 !== null` 因此抛出错误 `"Not Equal"`.

示例 3：

输入：`func = () => expect(5).notToBe(null)`

输出：`{"value": true}`

解释：`5 !== null` 因此该表达式返回 `true`.

## 答案

```
var expect = function(val){
    return {
        toBe:function(v2){
            if(val===v2) return true;
            else throw new Error("Not Equal");
        },
        notToBe:function(v2){
            if(val!==v2) return true;
            else throw new Error("Equal");
        }
    }
}
```

## 扩展

对象里函数的写法:
`a:function(){},`或者`a:()=>{},`

`new`不加不会报错,但是最好加上

附上对象的写法格式:

```
const person = {
  name: ["Bob", "Smith"],
  age: 32,
  bio: function () {
    console.log(`${this.name[0]} ${this.name[1]} 现在 ${this.age} 岁了。`);
  },
  introduceSelf: function () {
    console.log(`你好！我是 ${this.name[0]}。`);
  },
};
```
