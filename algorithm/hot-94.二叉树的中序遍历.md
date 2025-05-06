# 二叉树的中序遍历
## 问题
给定一个二叉树的根节点 root ，返回它的中序遍历 。

## 答案
递归：
```
var inorderTraversal = function(root) {
    let res = [];
    let inorder=(root)=>{
        if(!root){
            return;
        }
        inorder(root.left);
        res.push(root.val);
        inorder(root.right);
    }
    inorder(root);
    return res;
};
```
栈：
```
var inorderTraversal = function(root){
    let ans=[];//结果
    let q=[];//栈
    while(root){
        q.push(root);
        root=root.left;
    }
    while(q.length){
        let node=q.pop();
        ans.push(node.val);
        let newNode=node.right;
        while(newNode){
            q.push(newNode);
            newNode=newNode.left;
        }
    }
    return ans;
}
```

## 扩展

