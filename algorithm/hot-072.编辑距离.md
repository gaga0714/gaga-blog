# 编辑距离
## 问题
给你两个单词 word1 和 word2， 请返回将 word1 转换成 word2 所使用的最少操作数  。

你可以对一个单词进行如下三种操作：

- 插入一个字符
- 删除一个字符
- 替换一个字符
## 答案
```js
var minDistance = function(word1, word2) {
    const m=word1.length;
    const n=word2.length;
    const dp=new Array(m+1).fill(0).map(()=>new Array(n+1).fill(0));
    for(let i=0;i<=m;i++){
        dp[i][0]=i;
    }
    for(let j=0;j<=n;j++){
        dp[0][j]=j;
    }
    for(let i=1;i<=m;i++){
        for(let j=1;j<=n;j++){
            if(word1[i-1]===word2[j-1]){
                dp[i][j]=dp[i-1][j-1];
            }else{
                dp[i][j]=Math.min(
                    dp[i-1][j-1],
                    dp[i-1][j],
                    dp[i][j-1]
                )+1;
            }
        }
    }
    return dp[m][n];
};
```
## 扩展
初始化：减多少个能变成空串