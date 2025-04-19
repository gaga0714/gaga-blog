# vscode配置C/C++环境
## 安装插件
- C/C++
- Code Runner
- CodeLLDB
## 设置搜索RunInTerminal
勾选，会自动生成launch.json，task.json
## 修改launch.json内容
```
{
 
    "version": "0.2.0",
 
    "configurations": [
 
        {
 
            "type": "lldb",
 
            "request": "launch",
 
            "name": "Debug",
 
            //"program": "${workspaceFolder}/test.out",
 
            //上一行是官方写法，但是不同的cpp调试都要改配置，非常麻烦
 
            "program": "${workspaceFolder}/${fileBasenameNoExtension}",
 
            "args": [],
 
            "cwd": "${workspaceFolder}",
 
            "preLaunchTask": "C/C++: gcc 生成活动文件",

            "console": "externalTerminal",
 
        }
 
    ]
 
}

```

`"console": "externalTerminal"`:转为在终端里，可以交互了