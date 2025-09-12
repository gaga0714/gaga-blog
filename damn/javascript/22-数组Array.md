# 数组 Array

### ES6 扩展元素符`...`

```js
console.log(...[1, 2, 3])
// 1 2 3

console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5

[...document.querySelectorAll('div')]
// [<div>, <div>, <div>]

function push(array, ...items) {
  array.push(...items);
}

//copy
const a1 = [1, 2];
const [...a2] = a1;
// [1,2]

//merge
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]

[...'hello']
// [ "h", "e", "l", "l", "o" ]
```
通过扩展运算符实现的是浅拷贝，修改了引用指向的值，会同步反映到新数组


### 解构赋值

```js
const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest  // [2, 3, 4, 5]

const [first, ...rest] = [];
first // undefined
rest  // []

const [first, ...rest] = ["foo"];
first  // "foo"
rest   // []
```

### swap 交换变量

```js
let a = 1;
let b = 2;
[a, b] = [b, a];
```

### `Array()`

```js
Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]
```

### `Array.from()`

将两类对象转为真正的数组：**类似数组的对象**和**可遍历（iterable）的对象**（包括 ES6 新增的数据结构 Set 和 Map）
还可以接受第二个参数接受处理函数

```js
Array.from({ length: 5 }, (v, i) => i);
// [0, 1, 2, 3, 4]

Array.from("foo");
// [ "f", "o", "o" ]

const set = new Set(["foo", "bar", "baz", "foo"]);
Array.from(set);
// [ "foo", "bar", "baz" ]

const map = new Map([
  [1, 2],
  [2, 4],
  [4, 8],
]);
Array.from(map);
// [[1, 2], [2, 4], [4, 8]]

Array.from({ length: 3 }, () => Array(3).fill(0));
//[ [ 0, 0, 0 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ]
```

### `Array.of()`

用于将一组值，转换为数组

```js
Array.of(7); // [7]
Array(7); // 由 7 个空槽组成的数组

Array.of(1, 2, 3); // [1, 2, 3]
Array(1, 2, 3); // [1, 2, 3]
```


### `sort()`

默认设置为稳定的排序算法

```js
const stableSorting = (s1, s2) => {
  if (s1[0] < s2[0]) return -1;
  return 1;
};

arr.sort(stableSorting)
// ["apple", "peach", "straw", "spork"]

arr.sort((a,b) => a - b)
```

### `push()`

push()方法接收任意数量的参数，并将它们添加到数组末尾，返回数组的最新长度
```js
const animals = ['pigs', 'goats', 'sheep'];

const count = animals.push('cows');
console.log(count);
// Expected output: 4
console.log(animals);
// Expected output: Array ["pigs", "goats", "sheep", "cows"]

animals.push('chickens', 'cats', 'dogs');
console.log(animals);
// Expected output: Array ["pigs", "goats", "sheep", "cows", "chickens", "cats", "dogs"]
```

### `unshift()`

unshift()在数组开头添加任意多个值，然后返回新的数组长度
```js
const array1 = [1, 2, 3];

console.log(array1.unshift(4, 5));
// Expected output: 5

console.log(array1);
// Expected output: Array [4, 5, 1, 2, 3]
```

### `splice()`

**（开始位置，要删的个数，插入的元素）**

splice() 方法`就地`移除或者替换已存在的元素和/或添加新的元素。
- 增：传入三个参数，分别是开始位置、0（要删除的元素数量）、插入的元素，返回空数组
- 删：传入两个参数，分别是开始位置，删除元素的数量，返回包含删除元素的数组
- 改：传入三个参数，分别是开始位置，要删除元素的数量，要插入的任意多个元素，返回删除元素的数组，对原数组产生影响

```js
const months = ['Jan', 'March', 'April', 'June'];
months.splice(1, 0, 'Feb');
// Inserts at index 1
console.log(months);
// Expected output: Array ["Jan", "Feb", "March", "April", "June"]

months.splice(4, 1, 'May');
// Replaces 1 element at index 4
console.log(months);
// Expected output: Array ["Jan", "Feb", "March", "April", "May"]

months.splice(4, 1);
// del 1 element at index 4
console.log(months);
// Expected output: Array ["Jan", "Feb", "March", "April"]

```

### `concat()`

首先会创建一个当前数组的副本，然后再把它的参数添加到副本末尾，最后返回这个新构建的数组，不会影响原始数组
```js
const array1 = ['a', 'b', 'c'];
const array2 = ['d', 'e', 'f'];
const array3 = array1.concat(array2);

console.log(array3);
// Expected output: Array ["a", "b", "c", "d", "e", "f"]
```

### `pop()`
pop()方法用于删除数组的最后一项，同时减少数组的`length` 值，返回被删除的项
```js
const plants = ['broccoli', 'cauliflower', 'cabbage', 'kale', 'tomato'];

console.log(plants.pop());
// Expected output: "tomato"

console.log(plants);
// Expected output: Array ["broccoli", "cauliflower", "cabbage", "kale"]

plants.pop();

console.log(plants);
// Expected output: Array ["broccoli", "cauliflower", "cabbage"]
```

### `shift()`
shift()方法用于删除数组的第一项，同时减少数组的`length` 值，返回被删除的项

```js
const array1 = [1, 2, 3];

const firstElement = array1.shift();

console.log(array1);
// Expected output: Array [2, 3]

console.log(firstElement);
// Expected output: 1
```

### `slice()`
slice() 方法返回一个新的数组对象，这一对象是一个由 start 和 end 决定的原数组的浅拷贝（包括 start，不包括 end），其中 start 和 end 代表了数组元素的索引。原始数组不会被改变。
```js
const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];

console.log(animals.slice(2));
// Expected output: Array ["camel", "duck", "elephant"]

console.log(animals.slice(2, 4));
// Expected output: Array ["camel", "duck"]

console.log(animals.slice(1, 5));
// Expected output: Array ["bison", "camel", "duck", "elephant"]

console.log(animals.slice(-2));
// Expected output: Array ["duck", "elephant"]

console.log(animals.slice(2, -1));
// Expected output: Array ["camel", "duck"]

console.log(animals.slice());
// Expected output: Array ["ant", "bison", "camel", "duck", "elephant"]
```


### `indexOf()`
返回要查找的元素在数组中的位置，如果没找到则返回 -1
```js
const beasts = ['ant', 'bison', 'camel', 'duck', 'bison'];

console.log(beasts.indexOf('bison'));
// Expected output: 1

// Start from index 2
console.log(beasts.indexOf('bison', 2));
// Expected output: 4

console.log(beasts.indexOf('giraffe'));
// Expected output: -1
```

### `includes()`
返回数组中是否有要查找的元素，找到返回`true`，否则`false`

```js
const array1 = [1, 2, 3];

console.log(array1.includes(2));
// Expected output: true

const pets = ['cat', 'dog', 'bat'];

console.log(pets.includes('cat'));
// Expected output: true

console.log(pets.includes('at'));
// Expected output: false
```

### `find()`
返回第一个匹配的元素
```js
const array1 = [5, 12, 8, 130, 44];

const found = array1.find((element) => element > 10);

console.log(found);
// Expected output: 12
```

### `join()`
join() 方法接收一个参数，即字符串分隔符，返回包含所有项的字符串
```js
const elements = ['Fire', 'Air', 'Water'];

console.log(elements.join());
// Expected output: "Fire,Air,Water"

console.log(elements.join(''));
// Expected output: "FireAirWater"

console.log(elements.join('-'));
// Expected output: "Fire-Air-Water"
```

### `forEach()`
对数组每一项都运行传入的函数，没有返回值
```js
let numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];
numbers.forEach((item, index, array) => {
    // 执行某些操作
});
```

### `filter()`
对数组每一项都运行传入的函数，函数返回 `true` 的项会**组成数组**之后返回
```js
let numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];
let filterResult = numbers.filter((item, index, array) => item > 2);
console.log(filterResult); // [3, 4, 5, 4, 3]
```

### `map()`
对数组每一项都运行传入的函数，返回由每次函数调用的结果构成的数组
```js
let numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];
let mapResult = numbers.map((item, index, array) => item * 2);
console.log(mapResult) // [2, 4, 6, 8, 10, 8, 6, 4, 2]
```

### `reverse()`
reverse() 方法就地反转数组中的元素，并返回同一数组的引用。数组的第一个元素会变成最后一个，数组的最后一个元素变成第一个。换句话说，数组中的元素顺序将被翻转，变为与之前相反的方向。
```js
const arr = [1, 2, 3, 4, 5];
arr.reverse();
// [5, 4, 3, 2, 1]
```

### `fill()`
fill() 方法用一个固定值填充一个数组中从起始索引（默认为 0）到终止索引（默认为 array.length）内的全部元素。它返回修改后的数组。
fill(value, start, end)
```js
console.log([1, 2, 3].fill(4)); // [4, 4, 4]
console.log([1, 2, 3].fill(4, 1)); // [1, 4, 4]
console.log([1, 2, 3].fill(4, 1, 2)); // [1, 4, 3]
console.log([1, 2, 3].fill(4, 1, 1)); // [1, 2, 3]
console.log([1, 2, 3].fill(4, 3, 3)); // [1, 2, 3]
console.log([1, 2, 3].fill(4, -3, -2)); // [4, 2, 3]
console.log([1, 2, 3].fill(4, NaN, NaN)); // [1, 2, 3]
console.log([1, 2, 3].fill(4, 3, 5)); // [1, 2, 3]
console.log(Array(3).fill(4)); // [4, 4, 4]

// 一个简单的对象，被数组的每个空槽所引用
const arr = Array(3).fill({}); // [{}, {}, {}]
arr[0].hi = "hi"; // [{ hi: "hi" }, { hi: "hi" }, { hi: "hi" }]
```
为什么只赋值了 `arr[0]`, 所有都变成 `{ hi: "hi" }` 了？

`fill` 是浅拷贝，所有的 `{}` 都指向一个内存地址，一起变。

### 去重

```js
const arr = [1, 2, 2, 3, 4, 4, 5];
const uniqueArr = [...new Set(arr)];
console.log(uniqueArr); // [1, 2, 3, 4, 5]
```

```js
const arr = [1, 2, 2, 3, 4, 4, 5];
const uniqueArr = arr.filter((item, index) => arr.indexOf(item) === index);
console.log(uniqueArr); // [1, 2, 3, 4, 5]
```

```js
const unique = array => array.reduce((prev, curr) => prev.includes(curr) ? prev : [...prev, curr], []);

// 示例
const arr = [1, 2, 2, '3', '3'];
console.log(unique(arr)); // [1, 2, "3"]
```


```js
function unique(array) {
  const seen = new Map(); // 使用Map支持对象键
  return array.filter(item => {
    // 处理NaN（NaN !== NaN，需特殊判断）
    if (typeof item === 'number' && isNaN(item)) {
      return seen.has('NaN') ? false : seen.set('NaN', true);
    }
    // 处理其他类型
    const key = typeof item + JSON.stringify(item);
    return seen.has(key) ? false : seen.set(key, true);
  });
}

// 示例
const arr = [1, '1', 2, {a:1}, {a:1}, NaN, NaN];
console.log(unique(arr));
// [1, "1", 2, {a:1}, NaN]
```