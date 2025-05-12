# 在排序数组中查找元素的第一个和最后一个位置
## 问题
```
给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。

如果数组中不存在目标值 target，返回 [-1, -1]。

你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。

 

示例 1：

输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]
示例 2：

输入：nums = [5,7,7,8,8,10], target = 6
输出：[-1,-1]
示例 3：

输入：nums = [], target = 0
输出：[-1,-1]
 

提示：

0 <= nums.length <= 105
-109 <= nums[i] <= 109
nums 是一个非递减数组
-109 <= target <= 109
```

## 答案
```
var searchRange = function(nums, target) {
    let left=0;
    let right=nums.length-1;
    let minset=-1;
    let maxset=-1;
    while(left<=right){
        let mid=left+Math.floor((right-left)/2);
        if(target<nums[mid]){
            right=mid-1;
        }
        else if(target>nums[mid]){
            left=mid+1;
        }
        else{
            let tmp=mid;
            minset=mid;
            maxset=mid;
            while(target==nums[mid-1]){
                minset=mid-1;
                mid--;
            }
            while(target==nums[tmp+1]){
                maxset=tmp+1;
                tmp++;
            }
            return [minset,maxset];
        }
    }
    return [-1,-1];
};
```

## 扩展