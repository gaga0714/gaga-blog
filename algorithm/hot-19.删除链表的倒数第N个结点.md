# 删除链表的倒数第N个结点
## 问题
```js
给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

 

示例 1：


输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
示例 2：

输入：head = [1], n = 1
输出：[]
示例 3：

输入：head = [1,2], n = 1
输出：[1]
 

提示：

链表中结点的数目为 sz
1 <= sz <= 30
0 <= Node.val <= 100
1 <= n <= sz
 

进阶：你能尝试使用一趟扫描实现吗？
```
## 答案
```js
var removeNthFromEnd = function(head, n) {
    let p=new ListNode(0,head);
    let left=p;
    let right=p;
    while(n--){
        right=right.next;
    }
    while(right.next){
        left=left.next;
        right=right.next;
    }
    left.next=left.next.next;
    return p.next;
};
```
## 扩展
首先，确认一下while循环的条件

```js
let n=5;
while(n--){
    console.log(n);
}
//4 3 2 1 0
```
为什么有0？因为n--，先返回n，然后再减1，一共是走了五遍循环

```js
let n=5;
while(--n){
    console.log(n);
}
//4 3 2 1
```
加在前，先加再返回，一共走4遍循环
