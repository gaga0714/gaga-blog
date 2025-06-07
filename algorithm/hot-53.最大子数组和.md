# 最大子数组和
## 问题
```
给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

子数组 是数组中的一个连续部分。

示例 1：

输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
示例 2：

输入：nums = [1]
输出：1
示例 3：

输入：nums = [5,4,-1,7,8]
输出：23

提示：
1 <= nums.length <= 105
-104 <= nums[i] <= 104

进阶：如果你已经实现复杂度为 O(n) 的解法，尝试使用更为精妙的 分治法 求解。
```
## 答案
```js
var maxSubArray = function(nums) {
    let sum=0;
    let minsum=0;
    let res=-Infinity;
    for(let num of nums){
        sum+=num;
        res=Math.max(res,sum-minsum);
        minsum=Math.min(minsum,sum);
    }
    return res;
}
```
## 扩展

一个最大前缀和

一个最小前缀和

遍历数组来更新这两个变量

用当前前缀和减去最小前缀和，更新结果数组即可