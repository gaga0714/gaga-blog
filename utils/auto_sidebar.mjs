import path from "node:path"
import fs, { link } from "node:fs"

// 文件根目录
const DIR_PATH = path.resolve();
// 白名单，过滤不是文章的文件和文件夹
const WHILE_LIST = [
    "index.md",
    ".vitepress",
    "node_modules",
    ".idea",
    "assets",
]

// 判断是否是文件夹
const isDirectory = (path) =>fs.lstatSync(path).isDirectory();

// 取差值
const intersections = (arr1,arr2) =>
    Array.from(new Set(arr1.filter((item)=>!new Set(arr2).has(item))));

// 按创建时间排序（最新在前），仅对 diary 目录
function sortByCreationTime(names, dirPath) {
    return [...names].sort((a, b) => {
        const pathA = path.join(dirPath, a);
        const pathB = path.join(dirPath, b);
        try {
            const timeA = fs.statSync(pathA).birthtimeMs;
            const timeB = fs.statSync(pathB).birthtimeMs;
            return timeB - timeA; // 降序，新的在前
        } catch {
            return 0;
        }
    });
}

// 把方法导出直接使用
function getList(params,path1,pathname){
    // diary 目录下按文件创建时间排序，最新在前
    const list = (pathname === "/diary" || pathname === "/diary/") ? sortByCreationTime(params, path1) : params;
    // 存放结果
    const res = [];
    // 开始遍历 list
    for(let file in list){
        // 拼接目录
        const dir = path.join(path1,list[file]);
        // 判断是否是文件夹
        const isDir = isDirectory(dir);
        if(isDir){
            // 如果是文件夹，读取之后作为下一次递归参数
            const files = fs.readdirSync(dir);
            res.push({
                text: list[file],
                collapsible: true,
                items: getList(files,dir,`${pathname}/${list[file]}`),
            });
        } else{
            // 获取名字
            const name = path.basename(list[file]);
            // 排除非md文件
            const suffix = path.extname(list[file]);
            if(suffix!==".md"){
                continue;
            }
            res.push({
                text: name,
                link: `${pathname}/${name}`,
            });
        }
    }
    res.map((item)=>{
        item.text = item.text.replace(/\.md$/,"");
    });
    return res;
}

export const set_sidebar = (pathname) =>{
    // 获取pathname的路径
    const dirPath =path.join(DIR_PATH,pathname);
    // 读取pathname下的所有文件或者文件夹
    const files = fs.readdirSync(dirPath);
    // 过滤掉
    const items = intersections(files,WHILE_LIST);
    // getList函数后面会讲到
    return getList(items,dirPath,pathname);
};
