# k个一组翻转链表
## 问题
```js
给你链表的头节点 head ，每 k 个节点一组进行翻转，请你返回修改后的链表。

k 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序。

你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。

 

示例 1：


输入：head = [1,2,3,4,5], k = 2
输出：[2,1,4,3,5]
示例 2：



输入：head = [1,2,3,4,5], k = 3
输出：[3,2,1,4,5]
 

提示：
链表中的节点数目为 n
1 <= k <= n <= 5000
0 <= Node.val <= 1000
```
## 答案
```js
var reverseKGroup = function(head, k) {
    let pre=null;
    let cur=head;
    let p=head;
    for(let i=0;i<k;i++){
        if(p==null) return head;
        p=p.next;
    }
    for(let i=0;i<k;i++){
        let next=cur.next;
        cur.next=pre;
        pre=cur;
        cur=next;
    }
    head.next=reverseKGroup(cur,k);
    return pre;
};
```
## 扩展
难难难

递归

