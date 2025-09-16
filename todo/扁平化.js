const tree=[
    {
        id:1,
        name:"A",
        children:[
            {id:2,name:"B",children:[{id:3,name:"C"}]},
            {id:4,name:"D"},
        ],
    }
];

function treeflat(nodes,parentId=null,level=0,result=[]){
    nodes.forEach((node)=>{
        const {children,...args}=node;
        result.push( {...args, level, parentId});
        if(children&&children.length){
            treeflat(children,node.id,level+1,result);
        }
    })
    return result;
}
