# 三数之和
## 问题
```js
给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请你返回所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。

示例 1：

输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
解释：
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。
不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。
注意，输出的顺序和三元组的顺序并不重要。
示例 2：

输入：nums = [0,1,1]
输出：[]
解释：唯一可能的三元组和不为 0 。
示例 3：

输入：nums = [0,0,0]
输出：[[0,0,0]]
解释：唯一可能的三元组和为 0 。

```
## 答案
```js
var threeSum = function(nums) {
    let res=[];
    nums=nums.sort((a,b)=>a-b);//升序
    for(let i=0;i<nums.length;i++){
        if(nums[i]>0) break;//因为升序排列，left和right都比nums[i]大，和要小于0则nums[i]必须<=0
        if(i>0&&nums[i]==nums[i-1]) continue;//如果和前一个一样就不用算了，最后结果是set
        let left=i+1;
        let right=nums.length-1;
        while(left<right){
            let sum=nums[i]+nums[right]+nums[left];
            if(sum==0){
                res.push([nums[i],nums[left],nums[right]]);
                while(nums[left]==nums[left+1]) left++;
                while(nums[right]==nums[right-1]) right--;
                left++;
                right--;
            }
            else if(sum<0){
                left++;
            }
            else{
                right--;
            }
        }
    }
    return res;
};
```

## 扩展