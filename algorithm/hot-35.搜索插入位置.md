# 搜索插入位置
## 问题
```
给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
请必须使用时间复杂度为 O(log n) 的算法。
示例 1:
输入: nums = [1,3,5,6], target = 5
输出: 2
示例 2:
输入: nums = [1,3,5,6], target = 2
输出: 1
示例 3:
输入: nums = [1,3,5,6], target = 7
输出: 4
```

## 答案
```
var searchInsert = function(nums, target) {
    const n=nums.length;
    let left = 0;
    let right=n-1;
    while(left<=right){
        let mid=left +((right-left)>>1);
        if(target<=nums[mid]){
            right=mid-1;
        }else{
            left=mid+1;
        }
    }
    return left;
};
```

## 扩展

不需要ans变量，最后直接返回left就可以了，根据if的判断条件，left左边的值一直保持小于target，right右边的值一直保持大于等于target，而且left最终一定等于right+1，这么一来，循环结束后，在left和right之间画一条竖线，恰好可以把数组分为两部分：left左边的部分和right右边的部分，而且left左边的部分全部小于target，并以right结尾；right右边的部分全部大于等于target，并以left为首。所以最终答案一定在left的位置。