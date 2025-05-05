# 有效的括号
## 问题
```
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
```
var isValid = function(s){
    if(s.length%2==1){
        return false;
    }
    const pairs = new Map([
        [')','('],
        ['}','{'],
        [']','[']
    ]);
    let res = [];
    for(const ch of s){
        if(pairs.has(ch)){
            if(!res.length||res[res.length-1]!=pairs.get(ch)){
                return false;
            }
            res.pop();
        }
        else{
            res.push(ch);
        }
    }
    return !res.length;
}

```
## 扩展

`map.has(k)` :map中是否存在键k

`map.get(k)` :拿到键为k的值

