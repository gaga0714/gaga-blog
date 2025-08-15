function DeepClone(obj,hash=new WeakMap()){
    if(obj===null) return obj;
    if(obj instanceof Date) return new Date(obj);
    if(obj instanceof RegExp) return new RegExp(obj);
    if(typeof obj!=="object") return obj;
    if(hash.has(obj)) return hash.get(obj);
    let cloneObj=new obj.constructor();
    hash.set(obj,cloneObj);
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            cloneObj[key]=DeepClone(obj[key],hash);
        }
    }
    return cloneObj;
}




function DeepClone(obj,hash=new WeakMap()){
    if(obj===null) return obj;
    if(obj instanceof RegExp) return new RegExp(obj);
    if(obj instanceof Date) return new Date(obj);
    if(typeof obj !="object") return obj;
    let cloneObj=new obj.constructor();
    if(hash.has(obj)) return hash.get(obj);
    hash.set(obj,cloneObj);
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            cloneObj[key]=DeepClone(obj[key],hash);
        }
    }
    return cloneObj;
}