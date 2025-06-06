# 字母异位词分组
## 问题
```
给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。

字母异位词 是由重新排列源单词的所有字母得到的一个新单词。

示例 1:

输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
输出: [["bat"],["nat","tan"],["ate","eat","tea"]]
示例 2:

输入: strs = [""]
输出: [[""]]
示例 3:

输入: strs = ["a"]
输出: [["a"]]
 

提示：

1 <= strs.length <= 104
0 <= strs[i].length <= 100
strs[i] 仅包含小写字母
```
## 答案
```js
var groupAnagrams = function(strs) {
    let map = new Map();
    for(let str of strs){
        let tmp=[...str].sort().join("");
        if(!map.has(tmp)){
            map.set(tmp,[str]);
        }
        else{
            map.get(tmp).push(str);
        }
    }
    return [...map.values()];
};
```
## 扩展

`let tmp=[...str].sort().join("");` :字符串转数组排序后再转字符串

[`map.values()`]([https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/values)返回值的迭代器，`map.values().next()`是第一个的迭代器，`map.values().next().value()`是值

`...`转成数组