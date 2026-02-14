// Function.prototype.mycall(context,...args){
//     context=context||window;
//     context.fn=this;
//     let res=context.fn(...args);
//     delete context.fn;
//     return res;
// }