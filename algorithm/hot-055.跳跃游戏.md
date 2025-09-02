# 跳跃游戏
## 问题
```js
给你一个非负整数数组 nums ，你最初位于数组的 第一个下标 。数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个下标，如果可以，返回 true ；否则，返回 false 。

示例 1：

输入：nums = [2,3,1,1,4]
输出：true
解释：可以先跳 1 步，从下标 0 到达下标 1, 然后再从下标 1 跳 3 步到达最后一个下标。
示例 2：

输入：nums = [3,2,1,0,4]
输出：false
解释：无论怎样，总会到达下标为 3 的位置。但该下标的最大跳跃长度是 0 ， 所以永远不可能到达最后一个下标。
```
## 答案
```js
var canJump = function(nums) {
    let jumpmax=0;
    for(let i=0;i<nums.length;i++){
        let cur=i+nums[i];
        jumpmax=Math.max(cur,jumpmax);
        if(jumpmax>=nums.length-1) return true;
        if (nums[i] === 0 && cur >= jumpmax) {
            return false;
        }
    }
    return false;
};
```
## 扩展
```
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
  let n = nums.length;
  let maxJump = 0;
  for (let i = 0; i < n; ++i) {
    // 计算当前位置能调到的最远位置
    const currentJump = i + nums[i];

    // 保存目前为止能调到的最远位置
    if (currentJump >= maxJump) {
      maxJump = currentJump;
    }
    // 如果能覆盖到最后一个元素，则成功
    if (maxJump >= n - 1) {
      return true;
    }
    
    // 如果当前位置不能往前走，且之前的maxJump也未能超过本位置，则一定无法往后跳了
    if (nums[i] === 0 && currentJump >= maxJump) {
      return false;
    }
  }

  // for循环中没有返回true，所以默认返回false
  return false;
};

作者：王正鑫
链接：https://leetcode.cn/problems/jump-game/solutions/3597762/bi-guan-fang-ti-jie-geng-zao-fan-hui-fal-823f/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```