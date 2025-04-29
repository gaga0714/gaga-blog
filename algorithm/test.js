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



Array.prototype.groupBy = function(fn) {
    let map=new Map();
    for(let item of this){
        if(map.has(fn(item))){
            map.get(fn(item)).push(item);
        }
        else{
            map.set(fn(item),[item]);
        }
    }
    return map;
};

console.log([1,2,3].groupBy(String))