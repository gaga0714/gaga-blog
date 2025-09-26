function debounced(fn,delay){
    let timer=null;
    return function(...args){
        if(timer){
            clearTimeout(timer);
        }
        timer=setTimeout(()=>{
            fn.apply(this,args);
        },delay);
    }
}


function formatMoney(num) {
    num+='';
    // let f=0;
    // for(let i of num){
    //     if(i=='.'){
    //         f=1;
    //     }
    // }
    // if(f==0){
    //     num+='.';
    // }
    
        let p1=num.split('.');
        p1[1]=p1[1].slice(0,2);
        
        // console.log(p1[0],p1[1]);
        
        let n=0;
        let str='';
        for(let i=p1[0].length-1;i>=0;i--){
            n++;
            str=p1[0][i]+str;
            if(n%3==0&&n!=p1[0].length){
                str=','+str;
            }
        }
        let newstr='';
        if(p1[1].length==0){
            newstr=str+'.'+'00';
        }else{
            newstr=str+'.'+p1[1];
        }
        return newstr;
    }
    

console.log(formatMoney(102)); // '102.00'
console.log(formatMoney(12.9876)); // '12.99'
console.log(formatMoney(1298762)); // '1,298,762'

