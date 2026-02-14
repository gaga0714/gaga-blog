function PromiseAll(promises){
    return new Promise((resolve,reject)=>{
        let total=promises.length;
        let competed=0;
        let tmp=[];
        if(total==0){
            resolve(tmp);
            return;
        }
        promises.forEach((promise,index)=>{
            Promise.resolve(promise)
            .then((val)=>{
                tmp[index]=val;
                competed++;
                if(total===competed){
                    resolve(tmp);
                }
            })
            .catch((err)=>{
                reject(err);
            })
        })
    })

}