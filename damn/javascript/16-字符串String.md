# 字符串 String

### `concat()`
用于将一个或多个字符串拼接成一个新字符串

```js
const str1 = 'Hello';
const str2 = 'World';

console.log(str1.concat(' ', str2));
// Expected output: "Hello World"

console.log(str2.concat(', ', str1));
// Expected output: "World, Hello"

const greetList = ["Hello", " ", "Venkat", "!"];
"".concat(...greetList); // "Hello Venkat!"

```

### `slice()、substring()、substr()`

```js
let stringValue = "hello world";
console.log(stringValue.slice(3)); // "lo world"截取n之后
console.log(stringValue.substring(3)); // "lo world"截取n之后
console.log(stringValue.substr(3)); // "lo world"截取n之后
console.log(stringValue.slice(3, 7)); // "lo w"截取n之后m之前
console.log(stringValue.substring(3, 7)); // "lo w"截取n之后m之前
console.log(stringValue.substr(3, 7)); // "lo worl"截取n之后m个
```

`substring` 会自动调整顺序，不支持负数

**substr和另外两个不一样，是长度不是下标**


### `trim()、trimLeft()、trimRight()、trimStart()、trimEnd()`
删除前、后或前后所有空格符，再返回新的字符串 中间的不删

```js
const greeting = '   Hello world!   ';

console.log(greeting);
// Expected output: "   Hello world!   ";

console.log(greeting.trim());
// Expected output: "Hello world!";

```

### `repeat()`
接收一个整数参数，表示要将字符串复制多少次，然后返回拼接所有副本后的结果

```js
const mood = 'Happy! ';

console.log(`I feel ${mood.repeat(3)}`);
// Expected output: "I feel Happy! Happy! Happy! "
```

### `padEnd()、padStart()`
复制字符串，如果小于指定长度，则在相应一边填充字符，直至满足长度条件

```js
const str1 = 'Breaded Mushrooms';

console.log(str1.padEnd(25, '.'));
// Expected output: "Breaded Mushrooms........"

const str2 = '200';

console.log(str2.padEnd(5));
// Expected output: "200  "
```

### `toLowerCase()、 toUpperCase()`
大小写转化
```js
const sentence = 'The quick brown fox jumps over the lazy dog.';
console.log(sentence.toLowerCase());
// expected output: "the quick brown fox jumps over the lazy dog."

console.log(sentence.toUpperCase());
// expected output: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG."
```

### `charAt()`
返回给定索引位置的字符，由传给方法的整数参数指定

```js
let stringValue = "hello world";
console.log(stringValue.charAt(1)); // "e"
```


### `codePointAt()`
返回给定索引位置的字符的Unicode码位值

```js
console.log('a'.codePointAt(0));
// 97
```

### `indexOf()`
从字符串开头去搜索传入的字符串，并返回位置（如果没找到，则返回 -1 ）
indexOf(searchString, position)

```js
"Blue Whale".indexOf("Blue"); // 返回  0
"Blue Whale".indexOf("Blute"); // 返回 -1
"Blue Whale".indexOf("Whale", 0); // 返回  5
"Blue Whale".indexOf("Whale", 5); // 返回  5
"Blue Whale".indexOf("Whale", 7); // 返回 -1
"Blue Whale".indexOf(""); // 返回  0
"Blue Whale".indexOf("", 9); // 返回  9
"Blue Whale".indexOf("", 10); // 返回 10
"Blue Whale".indexOf("", 11); // 返回 10
```

### `startWith()`
是否以某个子串开头，并返回一个布尔值
startsWith(searchString, position)

```js
const str = "To be, or not to be, that is the question.";

console.log(str.startsWith("To be")); // true
console.log(str.startsWith("not to be")); // false
console.log(str.startsWith("not to be", 10)); // true
```

### `includes()`
includes() 方法执行区分大小写的搜索，以确定是否可以在一个字符串中找到另一个字符串，并根据情况返回 true 或 false。
includes(searchString, position)

```js
const str = "To be, or not to be, that is the question.";

console.log(str.includes("To be")); // true
console.log(str.includes("question")); // true
console.log(str.includes("nonexistent")); // false
console.log(str.includes("To be", 1)); // false
console.log(str.includes("TO BE")); // false
console.log(str.includes("")); // true
```


### `split()`
把字符串按照指定的分割符，拆分成数组中的每一项
split(separator, limit)
```js
let str = "12+23+34"
let arr = str.split("+") // [12,23,34]
```

### `match()`
接收一个参数，可以是一个正则表达式字符串，也可以是一个RegExp对象，返回数组
```js
const paragraph = 'The quick brown fox jumps over the lazy dog. It barked.';
const regex = /[A-Z]/g;
const found = paragraph.match(regex);

console.log(found);
// Expected output: Array ["T", "I"]
```

### `search()`
接收一个参数，可以是一个正则表达式字符串，也可以是一个RegExp对象，找到则返回匹配索引，否则返回 -1
```js
const paragraph = "I think Ruth's dog is cuter than your dog!";

// Anything not a word character, whitespace or apostrophe
const regex = /[^\w\s']/g;

console.log(paragraph.search(regex));
// Expected output: 41

console.log(paragraph[paragraph.search(regex)]);
// Expected output: "!"
```

[^\w\s']：匹配不是字母、数字、下划线、空格或单引号的字符
→ 也就是说，匹配特殊符号（如标点

- ^（在中括号里）表示“取反”
- \w：匹配字母、数字、下划线（等价于 [A-Za-z0-9_]）
- \s：匹配空白字符（空格、tab、换行等）
- '：字面上的单引号字符


### `replace()`
接收两个参数，第一个参数为匹配的内容，第二个参数为替换的元素（可用函数）
```js
const paragraph = "I think Ruth's dog is cuter than your dog!";

console.log(paragraph.replace("Ruth's", 'my'));
// Expected output: "I think my dog is cuter than your dog!"

const regex = /Dog/i;
console.log(paragraph.replace(regex, 'ferret'));
// Expected output: "I think Ruth's ferret is cuter than your dog!"
```