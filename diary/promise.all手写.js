function PromiseAll(promises){
    return new Promise((resolve,reject)=>{
        let total=promises.length;
        let results=[];
        let completed=0;
        if(total===0){
            resolve(results);
            return;
        }

        promises.forEach((promise,index)=>{
            Promise.resolve(promise)
            .then((value)=>{
                results[index]=value;
                completed++;
                if(total===completed){
                    resolve(results);
                }
            })
            .catch((err)=>{
                reject(err);
            });
        });
    });
}