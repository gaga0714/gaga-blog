# 组合总和
## 问题
给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，并以列表形式返回。你可以按 任意顺序 返回这些组合。

candidates 中的 同一个 数字可以 无限制重复被选取 。如果至少一个数字的被选数量不同，则两种组合是不同的。 

对于给定的输入，保证和为 target 的不同组合数少于 150 个。
## 答案
```js
var combinationSum = function(candidates, target) {
    let res=[];
    let path=[];
    candidates.sort((a,b)=>a-b);
    let dfs=(index,sum)=>{
        if(sum==target){
            res.push([...path]);
            return;
        }
        if(sum>target) return;
        for(let i=index;i<candidates.length;i++){
            if(candidates[i]>target) break;
            path.push(candidates[i]);
            sum+=candidates[i];
            dfs(i,sum);
            path.pop();
            sum-=candidates[i];
        }
    }
    dfs(0,0);
    return res;
};
```
## 扩展
