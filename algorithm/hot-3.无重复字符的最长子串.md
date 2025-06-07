# 无重复字符的最长子串
## 问题
```
给定一个字符串 s ，请你找出其中不含有重复字符的 最长 子串 的长度。

示例 1:

输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
示例 2:

输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
示例 3:

输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
 
提示：

0 <= s.length <= 5 * 104
s 由英文字母、数字、符号和空格组成
```
## 答案
```js
var lengthOfLongestSubstring = function(s){
    let map=new Map();
    let left=0;
    let res=0;
    for(let right=0;right<s.length;right++){
        if(map.has(s[right])&&map.get(s[right])>=left){
            left=map.get(s[right])+1;
        }
        map.set(s[right],right);
        res=Math.max(res,right-left+1);
    }
    return res;
}
```
## 扩展

哈希表的结构是：

- 键：字符
- 值：该字符下标

滑动窗口，右指针遍历存入哈希表，如果发现已经存过并且在窗口里出现过当前字符，将左指针移到该字符下一位

！要记得实时更新 即使是在窗口外的 字符最大下标索引