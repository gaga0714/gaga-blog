function debounced(fn,delay){
    let timer;
    return function(...args){
        clearTimeout(timer);
        timer=setTimeout(()=>{
            fn.apply(this,args);
        },delay)
    }
}

function debounced(fn,delay,immediate=false){
    let timer=null;
    return function(...args){
        const context=this;
        clearTimeout(timer);
        if(immediate&&!timer){
            fn.apply(context,args);
        }
        timer=setTimeout(()=>{
            timer=null;
            if(!immediate){
                fn.apply(context,args);
            }
        },delay)
    }
}