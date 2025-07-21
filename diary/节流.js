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
    let lasttime=0;
    return function(...args){
        let now = new Date.getTime();
        if(now-lasttime>=delay){
            fn.apply(this,args);
            lasttime=now;
        }
    }
}