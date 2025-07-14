# 接雨水
## 问题
```js
给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。
示例 1：
输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6
解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 
示例 2：
输入：height = [4,2,0,3,2,5]
输出：9
```
## 答案
```js
var trap = function(height) {
    let frontmax=0;
    let backmax=0;
    let left=0;
    let right=height.length-1;
    let res=0;
    while(left<right){
        frontmax=Math.max(frontmax,height[left]);
        backmax=Math.max(backmax,height[right]);
        if(frontmax<backmax){
            res+=(frontmax-height[left]);
            left++;
        }
        else{
            res+=(backmax-height[right]);
            right--;
        }
    }
    return res;
};
```
## 扩展

要用两边最小的墙来算，移动小的那边的指针