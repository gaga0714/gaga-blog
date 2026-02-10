# 最小覆盖子串
## 问题
```js
给你一个字符串 s 、一个字符串 t 。返回 s 中涵盖 t 所有字符的最小子串。如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 "" 。

 

注意：

对于 t 中重复字符，我们寻找的子字符串中该字符数量必须不少于 t 中该字符数量。
如果 s 中存在这样的子串，我们保证它是唯一的答案。
 

示例 1：

输入：s = "ADOBECODEBANC", t = "ABC"
输出："BANC"
解释：最小覆盖子串 "BANC" 包含来自字符串 t 的 'A'、'B' 和 'C'。
示例 2：

输入：s = "a", t = "a"
输出："a"
解释：整个字符串 s 是最小覆盖子串。
示例 3:

输入: s = "a", t = "aa"
输出: ""
解释: t 中两个字符 'a' 均应包含在 s 的子串中，
因此没有符合条件的子字符串，返回空字符串。
```

## 答案
```js
var minWindow = function(s, t) {
    let map=new Map();
    let res='';
    for(let i=0;i<t.length;i++){
        if(map.has(t[i])){
            map.set(t[i],map.get(t[i])+1);
        }else{
            map.set(t[i],1);
        }
    }
    let typeSum=map.size;
    let left=0;
    let right=0;
    while(right<s.length){
        if(map.has(s[right])){
            map.set(s[right],map.get(s[right])-1);
        }
        if(map.get(s[right])==0){
            typeSum--;
        }
        while(typeSum==0){
            let newRes=s.substring(left,right+1);
            if(newRes.length<res.length||!res){
                res=newRes;
            }
            if(map.has(s[left])){
                if(map.get(s[left])==0){
                    typeSum++;
                }
                map.set(s[left],map.get(s[left])+1);
            }
            left++;
        }
        right++;
    }
    return res;
};
```
## 扩展
首先用哈希表存好目标字符串的字符及对应要出现的次数，

记录种类是哈希表的大小

右指针从零开始遍历，遇到就减一，

减到0就把种类减一，

种类为0就判断res和当前的符合标准的字符串哪个短，赋值短的

开始左指针往右收缩，只有两种情况（要不然是0->目标字符｜｜要不然是负数->非目标字符）

反正都要向左收缩，如果不符合会自己跳出循环，所以都加上1
