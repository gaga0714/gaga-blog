## 问题
给你一个字符串 s，找到 s 中最长的 回文 子串。

示例 1：

输入：s = "babad"

输出："bab"

解释："aba" 同样是符合题意的答案。

示例 2：

输入：s = "cbbd"

输出："bb"

## 答案
```js
var longestPalindrome = function(s) {
    const len=s.length;
    if(len<2) return s;
    let maxLen=1;
    let begin=0;
    const dp=new Array(len).fill(null).map(()=>new Array(len).fill(false));
    for(let i=0;i<len;i++){
        dp[i][i]=true;
    }
    const charArray=s.split('');
    for(let j=1;j<len;j++){
        for(let i=0;i<j;i++){
            if(charArray[i]!==charArray[j]){
                dp[i][j]=false;
            }else{
                if(j-i<3){
                    dp[i][j]=true;
                }else{
                    dp[i][j]=dp[i+1][j-1];
                }
            }
            if(dp[i][j]&&j-i+1>maxLen){
                maxLen=j-i+1;
                begin=i;
            }
        }
    }
    return s.substring(begin,begin+maxLen);
};
```
## 扩展