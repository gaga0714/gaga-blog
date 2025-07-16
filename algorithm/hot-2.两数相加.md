# 两数相加
## 问题
```js
给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

 

示例 1：


输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.
示例 2：

输入：l1 = [0], l2 = [0]
输出：[0]
示例 3：

输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
输出：[8,9,9,9,0,0,0,1]
 

提示：

每个链表中的节点数在范围 [1, 100] 内
0 <= Node.val <= 9
题目数据保证列表表示的数字不含前导零
```
## 答案
```js
var addTwoNumbers = function(l1, l2) {
    let head=new ListNode();
    let cur=head;
    let cnt=0;
    while(l1||l2||cnt){
        if(l1){
            cnt+=l1.val;
            l1=l1.next;
        }
        if(l2){
            cnt+=l2.val;
            l2=l2.next;
        }
        cur.next=new ListNode(cnt%10);
        cnt=Math.floor(cnt/10);
        cur=cur.next;
    }
    return head.next;
};
```
## 扩展
`cur.next=new ListNode(cnt%10);`

要新建节点，而不是直接赋值，一开始是null