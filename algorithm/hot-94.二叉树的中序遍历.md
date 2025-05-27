# 二叉树的中序遍历
## 问题
给定一个二叉树的根节点 root ，返回它的中序遍历 。

## 答案
递归：
```js
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
```js
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

```js
var inorderTraversal = function(root, res = []) {
  if (root == null) {
    return res;
  }
  inorderTraversal(root.left, res);
  res.push(root.val);
  inorderTraversal(root.right, res);
  return res;
};
```

## 扩展

#### 前序遍历
```js
var preorderTraversal = function(root) {
    let res = [];
    let preorder = (root)=>{
        if(!root){
            return;
        }
        res.push(root.val);
        preorder(root.left);
        preorder(root.right);
    }
    preorder(root);
    return res;
};
```

#### 后序遍历
```js
var postorderTraversal = function(root) {
    let res = [];
    let postorder = (root)=>{
        if(!root){
            return;
        }
        postorder(root.left);
        postorder(root.right);
        res.push(root.val);
    }
    postorder(root);
    return res;
};
```