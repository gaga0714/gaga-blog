# 有效的括号
## 问题
```js
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
每个右括号都有一个对应的相同类型的左括号。
 

示例 1：

输入：s = "()"

输出：true

示例 2：

输入：s = "()[]{}"

输出：true

示例 3：

输入：s = "(]"

输出：false

示例 4：

输入：s = "([])"

输出：true

```
## 答案
```js
var isValid = function(s) {
    let stack=[];
    for(let i of s){
        if(i=='('){
            stack.push(')');
        }else if(i=='{'){
            stack.push('}');
        }else if(i=='['){
            stack.push(']');
        }else if(stack.length==0||i!=stack.at(-1)){
            return false;
        }else{
            stack.pop();
        }
    }
    if(stack.length!=0){
        return false;
    }
    return true;
};

```
## 扩展

变异了😇

遇到左括号时，把右括号推入栈

遇到右括号时，如果栈空了false，如果栈顶和当前字符不一样false，其余的把栈顶弹出

遍历完后栈还不为空false