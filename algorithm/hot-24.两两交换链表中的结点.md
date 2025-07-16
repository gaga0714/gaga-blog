# 两两交换链表中的结点
## 问题
```js
给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。

 

示例 1：


输入：head = [1,2,3,4]
输出：[2,1,4,3]
示例 2：

输入：head = []
输出：[]
示例 3：

输入：head = [1]
输出：[1]
 

提示：

链表中节点的数目在范围 [0, 100] 内
0 <= Node.val <= 100
```
## 答案
```js
var swapPairs = function(head) {
    let node0=new ListNode(0,head);
    let pre=node0;
    let node1=node0.next;
    while(node1&&node1.next){
        let node2=node1.next;
        let node3=node1.next.next;
        pre.next=node2;
        node2.next=node1;
        node1.next=node3;
        pre=node1;
        node1=node3;
    }
    return node0.next;

};
```
## 扩展
总的来说是建四个结点
