# 缺失的第一个正数
## 问题
```js
给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。

请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。
 

示例 1：

输入：nums = [1,2,0]
输出：3
解释：范围 [1,2] 中的数字都在数组中。
示例 2：

输入：nums = [3,4,-1,1]
输出：2
解释：1 在数组中，但 2 没有。
示例 3：

输入：nums = [7,8,9,11,12]
输出：1
解释：最小的正数 1 没有出现。
 

提示：

1 <= nums.length <= 105
-231 <= nums[i] <= 231 - 1
```
## 答案
```js
var firstMissingPositive = function(nums) {
    for(let item of nums){
        if(typeof nums[item-1]!="undefined"){
            nums[item-1]+="";
        }
    }
    for(let i=0;i<nums.length;i++){
        if(typeof(nums[i]) == "number"){
            return i+1;
        }
    }
    return nums.length+1;
};
```
```js
var firstMissingPositive = function(nums) {
    let res=0;
    for(let i of nums){
        if(i-1<nums.length){
            nums[i-1]+="";
        }
    }
    for(let i=0;i<nums.length;i++){
        if(typeof nums[i]==="number"){
            return i+1;
        }
    }
    return nums.length+1;
};
```
## 扩展
难难难

这个思路其实来源于「用下标去当哈希」的常见技巧——既然我们关心的正整数都在 1…n 范围内，就可以把它们和数组的下标 0…n–1 一一对应起来：

映射关系：值 x 对应到索引 x–1。

打标记：只要碰到一个合法的 x，就在位置 x–1 上做个“标记”，表示我们见过这个值。

扫描找答案：第一个没被标记的位置 i ，就说明 i+1 没出现过。