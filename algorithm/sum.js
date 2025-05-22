// var twoSum = function(nums,target){
//     let map=new Map();
//     for(let i=0;i<nums.length;i++){
//         if(map.has(target-nums[i])){
//             return [i,map.get(target-nums[i])];
//         }
//         map.set(nums[i],i);
//     }
// }

// var groupAnagrams=function(strs){
//     let map=new Map();
//     for(let str of strs){
//         let tmp=[...str].sort().join("");
//         if(map.has(tmp)){
//             map.get(tmp).push(str);
//         }
//         else{
//             map.set(tmp,[str]);
//         }
//     }
//     return [...map.values()];
// }

// var longestConsecutive = function(nums){
//     let set=new Set(nums);
//     let res=0;
//     for(let item of set){
//         if(!set.has(item-1)){
//             let min=item;
//             let cnt=1;
//             while(set.has(min+1)){
//                 cnt++;
//                 min++;
//             }
//             res=Math.max(res,cnt);
//         }
//     }
//     return res;
// }

// var moveZeroes = function(nums){
//     let left=0;
//     for(let i=0;i<nums.length;i++){
//         if(nums[i]!=0){
//             [nums[left],nums[i]]=[nums[i],nums[left]];
//             left++;
//         }
//     }
//     return nums;
// }

// var maxArea = function(height){
//     let left=0;
//     let right=height.length-1;
//     let res=0;
//     while(left<right){
//         if(height[left]<height[right]){
//             res=Math.max(res,height[left]*(right-left));
//             left++;
//         }else{
//             res=Math.max(res,height[right]*(right-left));
//             right--;
//         }
//     }
//     return res;
// }

// var threeSum = function(nums){
//     nums.sort((a,b)=>a-b);
//     let res=[];
//     for(let i=0;i<nums.length;i++){
//         let left=i+1;
//         let right=nums.length-1;
//         if(nums[i]>0) break;
//         if((nums[i]==nums[i-1])&&i>0) continue;
//         while(left<right){
//             let sum=nums[i]+nums[left]+nums[right];
//             if(sum==0){
//                 res.push([nums[i],nums[left],nums[right]]);
//                 while(nums[left]==nums[left+1]) left++;
//                 while(nums[right]==nums[right-1]) right--;
//                 left++;
//                 right--;
//             }
//             else if(sum<0){
//                 left++;
//             }
//             else{
//                 right--;
//             }
//         }
//     }
//     return res;
// }

// var trap = function(height){
//     let left=0;
//     let right=height.length-1;
//     let pre=0;
//     let suf=0;
//     let res=0;
//     while(left<right){
//         pre=Math.max(pre,height[left]);
//         suf=Math.max(suf,height[right]);
//         if(height[left]<height[right]){
//             res+=(pre-height[left]);
//             left++;
//         }
//         else{
//             res+=(suf-height[right]);
//             right--;
//         }
//     }
//     return res;
// }

