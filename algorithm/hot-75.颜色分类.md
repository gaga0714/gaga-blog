# 颜色分类
## 问题
```
给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums ，原地 对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。

我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。

必须在不使用库内置的 sort 函数的情况下解决这个问题。

示例 1：

输入：nums = [2,0,2,1,1,0]
输出：[0,0,1,1,2,2]
示例 2：

输入：nums = [2,0,1]
输出：[0,1,2]
 

提示：

n == nums.length
1 <= n <= 300
nums[i] 为 0、1 或 2
 
进阶：

你能想出一个仅使用常数空间的一趟扫描算法吗？
```
## 答案
```js
var sortColors=function(nums){
    let red=0;
    let white=0;
    let blue=0;
    for(let item of nums){
        if(item==0){
            red++;
        }
        else if(item==1){
            white++;
        }
    }
    nums.fill(0,0,red);
    nums.fill(1,red,red+white);
    nums.fill(2,red+white);
    return nums;
}

```
## 扩展
Array.fill(填充数值，开始，结束)

左闭右开