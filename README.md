# wxDefer
> 将微信小程序中接受 `{ success: callback, fail: callback, complete: callback }` 的函数转化为类似 `jQuery.Deferred` 的形式

### 原接口对比`wxDefer`

```js
wx.request({
    url: 'https://example.com/data.json',
    data: {
        _: +new Date
    },
    success: (response) => {
        if ('request:ok' == response.errMsg) {
            this.setData({
                exampleData: response.data
            })
        }
    },
    fail: (response) => {
        console.log(response)
    }
})
```
使用 `wxDefer`
```js
var wxDefer = require('../../wxDefer.js')

wxDefer.request({
    url: 'https://example.com/data.json',
    data: {
        _: +new Date
    }
}).done((response) => {
    if ('request:ok' == response.errMsg) {
        this.setData({
            exampleData: response.data
        })
    }
}).fail((response) => {
    console.log(response)
})
```

### 支持的微信API列表

[完整的微信API列表](https://mp.weixin.qq.com/debug/wxadoc/dev/api/)

目前同步了微信所有可使用`{ success: callback, fail: callback, complete: callback }`参数的API

### 其它 API

#### `wxDefer.Deferred`
> `Deferred` 类

类似`jQuery.Deferred`[(文档)](https://api.jquery.com/category/deferred-object/)，_请注意：当前`wxDeferred`只是最小支持，部分`jQuery.Deferred`的接口并不支持_

| 函数 | 返回类型 | 说明 | 
| --- | ------- | ---- |
| `state()` | `pending` \| `resolved` \| `rejected` | 当前`Deferred`的状态 |
| `done(callback)` | `Deferred()` | `Deferred()`状态变成`resolved`时的回调函数 |
| `fail(callback)` | `Deferred()` | `Deferred()`状态变成`rejected`时的回调函数 |
| `always(callback)` | `Deferred()` | `Deferred()`状态变成`resolved`或`rejected`时均会触发的回调函数 |
| `resolve(...args)` | 无 | 改变`Deferred`的状态为`resolved`并使用`args`调用相关回调函数 |
| `resolveWith(thisObj, ...args)` | 无 | 改变`Deferred`的状态为`resolved`并使用`args`调用相关回调函数（可以设置回调函数中的`this`） |
| `reject(...args)` | 无 | 改变`Deferred`的状态为`resolved`并使用`args`调用相关回调函数 |
| `rejectWith(thisObj, ...args)` | 无 | 改变`Deferred`的状态为`resolved`并使用`args`调用相关回调函数（可以设置回调函数中的`this`） |

_另请注意：`wxDefer.Deferred`是类的*构造函数*，而`jQuery.Deferred()`则返回初始化后的对象_

```js
var defer = new wxDefer.Deferred()
defer.done(_ => console.log('done: ', _)).fail(_ => console.warn('fail'))

defer.resolve('success!')
// in console:
// done: success!
```

#### `wxDefer.MakeDeferred()`
> 将可以接受 `{ success: callback, fail: callback, complete: callback }` 的API函数转化为 `Deferred` 的形式

在`wxDefer`未更新的情况增加`Deferred`形式的函数

```js
function demoFunction(config) {
    // config 包含 success, fail, complete 三个回调函数
    // ...
}

var demoFunctionDeferred = wxDefer.MakeDeferred(demoFunction)
```

### 更新

* 2018.4.13 v1.0.1 修复错误
* 2018.4.13 v1.0.0 同步了微信小程序函数列表
* 2016.9.28 v0.1.0 初始版本
