// var test = function(...args){
//     console.log(args);
// };
// let asfs=123;
// test(asfs,"aaa");
// let n=2;
// var createCounter = function(n){
//     return counter = function(){
//         console.log(n++);
//     }
// }
// var createCounter = function(init){
//     let tmp=init;
//     return {
//         increment: function(){
//             return ++tmp;
//         },
//         decrement: function(){
//             return --tmp;
//         },
//         reset: function(){
//             tmp=init;
//             return tmp;
//         }
//     }
// }
// const a = createCounter(4);
// a.increment()
// a.decrement()
// a.reset()

// let arr=[1,2,3];
// let fn = function plusone(n){
//     return n+1;
// }
// var map = function(arr,fn){
//     for(let i=0;i<arr.length;i++){
//         arr[i]=fn(arr[i]);
//     }
//     return arr;
// };
// console.log(map(arr,fn));

// const arr = ['a', 'b', 'c'];

// const result = arr.map((element, index, array) => {
//   console.log(`element: ${element}, index: ${index}, array: [${array}]`);
//   return `${index}-${element}`;
// });

// console.log(result); // ["0-a", "1-b", "2-c"]

// functions =
// [x => x + 1, x => x * x, x => 2 * x];

// let x=4;

// var compose = function(functions) {
// 	return function(x) {
//         if(functions.length==0){
//             return x;
//         }
//         else{
//             let res=x;
//             for(let i=0;i<functions.length;i++){
//                 res=functions[i](res);
//             }
//             return res;
//         }
//     }
// };

// const fn = compose(functions);
// console.log(fn(x));



// var once = function(fn) {
//   let cnt=1;
//   return function(...args){
//       if(cnt){
//         cnt--;
//         return fn(...args);
//       }else{
//           return undefined;
//       } 
//   }
// };
// let fn = (a,b,c) => (a + b + c)
// let onceFn = once(fn)
// console.log(onceFn(1,2,3));


// let arr=[1,9,6,3,2]
// let size=3;
// var chunk = function(arr, size) {
//   if(arr.length==0){
//       return arr;
//   }
//   else{
//       let i=0;
//       let new_arr=[];
//       for(i=0;i<arr.length;i+=size){
//           let n=Math.min(i+size,arr.length);
//           let item=[];
//           for(j=i;j<n;j++){
//               item.push(arr[j]);
//           }
//           new_arr.push(item);
//       }
//       return new_arr;
//   }
// };


// console.log(chunk(arr,size));



// Array.prototype.groupBy = function(fn) {
//     let map=new Map();
//     for(let item of this){
//         if(map.has(fn(item))){
//             map.get(fn(item)).push(item);
//         }
//         else{
//             map.set(fn(item),[item]);
//         }
//     }
//     return map;
// };

// console.log([1,2,3].groupBy(String))

// let arr1 = [
//     {"id": 1, "b": {"b": 94},"v": [4, 3], "y": 48}
// ]
// let arr2 = [
//     {"id": 1, "c": [3,4]}
// ]
// var join = function(arr1, arr2) {
//     const map = new Map();
//     for (const obj of arr1) map.set(obj.id, obj);
//     for (const obj of arr2) {
//         if (!map.has(obj.id)) map.set(obj.id, obj);
//         else {
//             const prevObj = map.get(obj.id);
//             for (const key of Object.keys(obj)) prevObj[key] = obj[key];
//         }
//     }
//     const res = new Array();
//     for (let key of map.keys()) res.push(map.get(key));
//     return res.sort((a,b)=>a.id-b.id); 
// };

// console.log(join(arr1,arr2));

// let obj1={
//     sex:'girl',
// };
// let obj={
//     name:'huang',
//     age:13,
// };
// obj.sex=obj1.sex;
// console.log(obj);

// let s="abca";
// var lengthOfLongestSubstring = function(s) {
//     let map=new Map();
//     let left=0;
//     let res=0;
//     for(let right=0;right<s.length;right++){
//         if(map.has(s[right])&&map.get(s[right])>=left){
//             left=map.get(s[right])+1;
//         }
//         map.set(s[right],right);
//         res=Math.max(res,right-left+1);
//     }
//     return res;
// };
// lengthOfLongestSubstring(s);

// let arr = [3, 5, 2, 2, 5, 5];
// let x=new Set(arr)
// let unique = [...new Set(arr)];
// console.log(x);
// console.log(...new Set(arr));
// let str = "352255";
// let unique = [...new Set(str)].join("");
// console.log(new Set(str));
// const arr = Array(3).fill({}); // [{}, {}, {}]


// arr[0].hi = "hi"; // [{ hi: "hi" }, { hi: "hi" }, { hi: "hi" }]
// console.log(arr);

// let str="I think Ruth's dog is cuter than your dog!";
// console.log(str.length);

// var findAnagrams = function(s,p){
//     let arr=new Array(26).fill(0);
//     let left=0;
//     let res=[];
//     for(let item of p){
//         arr[item.codePointAt(0)-"a".codePointAt(0)]++;
//     }
//     for(let i=0;i<s.length;i++){
//         arr[s[i].codePointAt(0)-"a".codePointAt(0)]--;
//         while(arr[s[i].codePointAt(0)-"a".codePointAt(0)]<0){
//             arr[s[left].codePointAt(0)-"a".codePointAt(0)]++;
//             left++;
//         }
//         if(p.length==i-left+1){
//             res.push(left);
//         }
//     }
//     return res;
// }

// findAnagrams("aaaaaaab","ab")

// var maxSlidingWindow = function(nums, k) {
//     let q = [];
//     let res = [];
//     for(let i=0;i<nums.length;i++){
//         while(q.length>0&&nums[i]>=nums[q.at(-1)]) q.pop();
//         q.push(i);
//         if(i-q[0]>=k) q.shift();
//         if(i>=k-1){
//             res.push(nums[q[0]]);
//         }
//     }
//     return res;
// };

// maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3)

// let matrix=[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]];
// for(let item of matrix){
//     console.log(item);
    
// }

// var canMakeEqual = function(nums, k) {
//     let flag=0;
//     let k2=k;
//     let nums2=nums;
//     for(let i=0;i<nums.length;i++){
//         if(nums[i]==-1){
//             if(k==0||i==nums.length-1){
//                 flag=-1;
//                 break;
//                 // return false;
//             }
//             nums[i+1]*=(-1);
//             k--;
//         }
//     }
//     if(flag==-1){
//         flag=0;
//         for(let i=0;i<nums2.length;i++){
        
//             if(nums2[i]==1){
//                 if(k2==0||i==nums2.length-1){
//                     flag=-1;
//                     break;
//                     // return false;
//                 }
//                 nums2[i+1]*=(-1);
//                 k2--;
//             }
//         }
//     }

//     if(flag==-1){
//         return false;
//     }
//     return true;
// };

// canMakeEqual([1,-1,1],2);

// let numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];
// let mapResult = numbers.map((item, index, array) => item * 2);
// console.log(mapResult) // [2, 4, 6, 8, 10, 8, 6, 4, 2]
// console.log(numbers);

// let num=0;
// outermost:
// for(let i=0;i<10;i++){
//     for(let j=0;j<10;j++){
//         if(i===5&&j===5){
//             continue outermost;
//         }
//         num++;
//     }
// }
// console.log(num); // 55
let n=5;
while(--n){
    console.log(n);
}