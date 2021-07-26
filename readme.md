# bootstrap-table-addrbar

参考文章

1. [同时设置pageNumber和searchText初始值会冲突](https://github.com/wenzhixin/bootstrap-table/issues/2580)
    - v1.11.0版本中, `search`字段与`page`字段同时出现导致初始值冲突的问题, 请参考, 已于v1.14.2版本修复;

## 1. 有什么效果?

将页面切换, 排序事件和搜索事件都回显到地址栏中, 在刷新页面时, 优先读取地址栏的参数, 从而自动在请求时使用对应页码和搜索条件, 可以保持当前各种状态不变. 

如下图

![](https://gitee.com/generals-space/gitimg/raw/master/611efd443ea59eccd61744c5ebd09452.png)

![](https://gitee.com/generals-space/gitimg/raw/master/92515aa02c863a19daf76a8804990092.png)

可用选项

1. `addrbar`: 是否开启地址栏显示, true/false, 默认为false;
2. `addrPrefix`: 地址栏参数前缀, 默认为'', 同时存在多个表格时使用. 

## 2. 你需要做什么?

1. 引入插件

```html
    <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="https://cdn.bootcss.com/bootstrap-table/1.14.2/bootstrap-table.min.js"></script>
    <script src="./bootstrap-table-addrbar.js"></script>
```

2. 在bootstrapTable选项中加入`addrbar: true`即可开启, 完全不需要后端代码变动.

```js
    var tableOpts = {
        ...
        addrbar: true,
    }
    $('#bt-table').bootstrapTable(tableOpts);
```

### 2.1 多张表格的情况

当页面同时存在多张表格, 而你需要让它们都能使用这个功能, 就需要`addrPrefix`这个选项了.

默认情况下, 地址栏将有5个参数, 分别为

- `page`: 页码
- `limit`: 每页行数
- `order`: 升序/降序
- `sort`: 排序关键字
- `search`: 搜索关键字

如果多个表格同时使用这些参数, 就会导致一张表格的变动会影响其他表格. 在参数中添加`addrPrefix`字段, 为每个表格都指定一个唯一的前缀, 可以避免这个问题.

```js
    var tableOpts1 = {
        ...
        addrbar: true,
        addrPrefix: 'tbl1'
    };
    var tableOpts2 = {
        ...
        addrbar: true,
        addrPrefix: 'tbl2'
    };
    $('#bt-table1').bootstrapTable(tableOpts1);
    $('#bt-table2').bootstrapTable(tableOpts2);
```

![](https://gitee.com/generals-space/gitimg/raw/master/5badfcee02a1998e279b432090a3d2b2.png)

## 3. 注意:

1. 该插件不适用于客户端分页;
2. demo的后台中没有对排序和搜索做处理, 所以可能看不到效果;
