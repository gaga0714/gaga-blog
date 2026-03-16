```js
function PromiseAll(promises){
    return new Promise((resolve,reject)=>{
        let settled=0;
        let total=promises.length;
        let res=[];
        if(total===0){
            resolve(res);
            return;
        }
        promises.forEach((promise,inedx)=>{
            Promise.resolve(promise)
            .then((value)=>{
                res[index]=value;
                settled++;
                if(settled===total){
                    resolve(res);
                }
            })
            .catch((err)=>{
                reject(err);
            })
        })
    })
}

```