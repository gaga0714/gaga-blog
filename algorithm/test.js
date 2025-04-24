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

const arr = ['a', 'b', 'c'];

const result = arr.map((element, index, array) => {
  console.log(`element: ${element}, index: ${index}, array: [${array}]`);
  return `${index}-${element}`;
});

console.log(result); // ["0-a", "1-b", "2-c"]
