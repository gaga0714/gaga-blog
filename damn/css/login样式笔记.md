# login样式笔记
确保背景图片覆盖整个页面并保持其比例。
```
background-size: cover;
```

flexbox 布局，居中对齐。
```
display: flex; 
justify-content: center; 
align-items: center;
```

使用 flexbox 布局，并将子元素垂直排列。
```
display: flex; 
flex-direction: column;
```
元素本身的背景会被模糊掉，但该元素的内容（如文本、图片等）会保持清晰。这种效果可以用来让元素的前景内容更加突出，同时将背景进行模糊，使得用户更容易关注到前景内容。
```
backdrop-filter: blur(10px);
```
