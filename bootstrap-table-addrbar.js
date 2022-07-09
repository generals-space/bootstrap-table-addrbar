/**
 * @author: general
 * @version: 1.0.0
 * @website: note.generals.space
 * @email: generals.space@gmail.com
 */

(function ($) {
    'use strict';

    /*
     * function: 获取浏览器地址栏中的指定参数.
     * key: 参数名
     * url: 默认为当前地址栏
     */
    function _GET(key, url){
        var url = url ? url : window.location.search;
        /* 
        * 注意这里正则表达式的书写方法
        * (^|&)key匹配: 直接以key开始或以&key开始的字符串
        * 同理(&|$)表示以&结束或是直接结束的字符串
        * ...当然, 我并不知道这种用法.
        */
        var reg = new RegExp('(^|&)'+ key +'=([^&]*)(&|$)');
        var result = url.substr(1).match(reg);

        // if(result != null) return unescape(result[2]);
        if(result != null) return decodeURIComponent(result[2]);
        return null;
    }

    function _buildParam(_bt, option){
        var _prefix     = option.addrPrefix || '';
        var _defaults   = _bt.defaults;

        // 优先级排序: 优先从地址栏获取, 没有读取到时使用用户的指定值, 用户未定义时采用默认值
        var _limit  = _GET(_prefix + 'limit');
        var _page   = _GET(_prefix + 'page');
        var _order  = _GET(_prefix + 'order');
        var _sort   = _GET(_prefix + 'sort');
        var _search = _GET(_prefix + 'search');
        option.pageSize     = _limit ? parseInt(_limit) : (option.pageSize || _defaults.pageSize);
        option.pageNumber   = _page ? parseInt(_page) : (option.pageNumber || _defaults.pageNumber);
        option.sortOrder    =  _order ? _order : (option.sortOrder || _defaults.sortOrder);
        option.sortName     = _sort ? _sort : (option.sortName || 'id');
        option.searchText   =  _search ? _search : (option.searchText || _defaults.searchText);
    }

    /*
    * function: 根据给定参数生成url地址
    * var dic = {name: 'genreal', age: 24}
    * var url = 'https://www.baidu.com?age=22';
    * _buildUrl(dic, url);
    * 将得到"https://www.baidu.com?age=24&name=genreal"
    * 哦, 忽略先后顺序吧...
    * 
    * 补充: 可以参考浏览器URLSearchParams对象, 更加方便和强大. 
    * 考虑到兼容性, 暂时不使用这个工具.
    */

    function _buildUrl(dict, url){
        var url = url ? url : window.location.search;

        for(var key in dict){
            var val = dict[key];

            // 搜索name=general这种形式的字符串(&是分隔符)
            var pattern = key + '=([^&]*)';
            var targetStr = key + '=' + val;

            /*
            * 如果目标url中包含了key键, 我们需要将它替换成我们自己的val
            * 不然就直接添加好了.
            */
            if(url.match(pattern)){
                var tmp = new RegExp('(' + key + '=)([^&]*)', 'gi');
                url = url.replace(tmp, targetStr);
            }else{
                var seperator = url.match('[\?]') ? '&' : '?';
                url = url + seperator + targetStr
            }
        }
        return url;
    }

    /*
    * 实例化bootstrapTable对象时, 合并用户自定义选项
    */
    var _bootstrapTable = $.fn.bootstrapTable;
    $.fn.bootstrapTable = function(option){
        // 这里是为 $().bootstrapTable('refreshOptions') 这种"静态函数"用法准备的.
        // 只有 option 是 object 的时候, 才算是构造函数.
        if(!(typeof option === 'object')){
            // 直接传入arguments不行, 因为它是一个类数组的对象, 
            // 而bt对参数的处理是面向原生参数列表的.
            // 目前来看, bt还没有超过2个参数的方法, 暂时先这么用着.
            return _bootstrapTable.call(this, arguments[0], arguments[1]);
        }

        // 拥有addrbar选项并且其值为true的才会继续执行
        if(!(option.hasOwnProperty('addrbar') && option.addrbar == true)) {
            return _bootstrapTable.call(this, option);
        }
        // 标志位, 初始加载后关闭
        option._addrbarInit = true;
        var _prefix = option.addrPrefix || '';

        _buildParam(_bootstrapTable, option);
        option._onLoadSuccess = option.onLoadSuccess;
        option.onLoadSuccess = function(data){
            // md, 这里的this是option是什么鬼(好像貌似就是option...ok, 当我没说)
            var opts = this;
            // 页面初始加载不必改写url
            if(opts._addrbarInit){
                opts._addrbarInit = false;
            }else{
                var params = {};
                params[_prefix + 'page']       = opts.pageNumber,
                params[_prefix + 'limit']      = opts.pageSize,
                params[_prefix + 'order']      = opts.sortOrder,
                params[_prefix + 'sort']       = opts.sortName,
                params[_prefix + 'search']     = opts.searchText
                // h5提供的修改浏览器地址栏的方法
                window.history.pushState({}, '', _buildUrl(params));
            }

            if(option._onLoadSuccess) option._onLoadSuccess.call(this, data);
        };

        var _window = this;
        window.addEventListener('popstate', function(){
            // 这里的 this 其实是全局的 window 对象, 
            // eventListener 回调函数内部的 this 为触发的元素对象,
            // 这两个是不同的.
            // console.log(this);
            // console.log(_window);
            _buildParam(_bootstrapTable, option);
            _bootstrapTable.call(_window, 'refreshOptions', option);
        });

        return _bootstrapTable.call(this, option);
    };
})(jQuery);
