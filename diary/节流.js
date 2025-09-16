function throttle(fn,delay){
    let lasttime=0;
    return function(...args){
        let now=new Date.getTime();
        if(now-lasttime>=delay){
            fn.apply(this,args);
            lasttime=now;
        }
    }
}

function throttle(fn,delay){
    let last=0;
    return function(...args){
        let now=new Date.getTime();
        if(now-last>=delay){
            fn.call(this,...args);
            last=now
        }
    }
}



function throttle(fn,delay){
    let time=0;
    return function(...args){
        let now=new Date.getTime();
        if(now-time>=delay){
            fn.apply(this,args);
        }
        time=now;
    }
}