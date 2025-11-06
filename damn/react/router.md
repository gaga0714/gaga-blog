# React-router

###  BrowserRouter、HashRouter

`Router`中包含了对路径改变的监听，并且会将相应的路径传递给子组件

`BrowserRouter`是`history`模式，`HashRouter`模式

使用两者作为最顶层组件包裹其他组件

### Route

`Route`用于路径的匹配，然后进行组件的渲染，

```jsx
 <Route path="/" render={() => <h1>Welcome!</h1>} />
```

### Link、NavLink

通常路径的跳转是使用`Link`组件，最终会被渲染成`a`元素，其中属性`to`代替`a`标题的`href`属性

`NavLink`是在`Link`基础之上增加了一些样式属性，例如组件被选中时，发生样式变化，则可以设置`NavLink`的一下属性：

- activeStyle：活跃时（匹配时）的样式
- activeClassName：活跃时添加的class


通过`Route`作为顶层组件包裹其他组件后,页面组件就可以接收到一些路由相关的东西，比如`props.history`


### redirect

用于路由的重定向，当这个组件出现时，就会执行跳转到对应的`to`路径中

```jsx
{name !== "tom" ? <Redirect to="/" /> : null}
```

### switch
swich组件的作用适用于当匹配到第一个组件的时候，后面的组件就不应该继续匹配

```jsx
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/about" component={About} />
  <Route path="/profile" component={Profile} />
  <Route path="/:userid" component={User} />
  <Route component={NoMatch} />
</Switch>
```

### useHistory
useHistory可以让组件内部直接访问history，无须通过props获取

```jsx
const history = useHistory();

onClick={() => history.push("/")}
```

### useParams

```jsx
const { name } = useParams();
```

### useLocation

`useLocation` 会返回当前 `URL`的 `location`对象


### 动态路由
例如将`path`在`Route`匹配时写成`/detail/:id`，那么 `/detail/abc`、`/detail/123`都可以匹配到该`Route`

```
props.match.params.xxx
```


/detail2?name=why&age=18
```
props.location.search
```