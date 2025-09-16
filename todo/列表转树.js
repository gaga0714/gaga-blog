const list = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
  { id: 6, name: '部门6', pid: 0 }
];

function getTree(list){
    let tree=[];
    let hashMap={};//id=>{node,children}
    for(let item of list){
        const {id,pid}=item;
        if(!hashMap[id]) hashMap[id]={...item,children:[]};
        else hashMap[id]={...item,children:hashMap[id].children};
        if(pid==0){
            tree.push(hashMap[id]);
        }else{
            if(!hashMap[pid]){
                hashMap[pid]={children:[]}
            }
            hashMap[pid].children.push(hashMap[id]);
        }
    }
    return tree;
}