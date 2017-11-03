/*
 * function: 获取浏览器地址栏中的指定参数.
 * key: 参数名
 * url: 默认为当前地址栏
 */
function getQueryParams(key, url){
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

function resHandler(res){
    console.log(res);
}

;(function(){
    var columnInfo = [
        {title: '模块', field: 'name'},
        {title: '设备数', field: 'sum'},
        {title: '创建时间', field: 'create_time'},
        {title: '是否已删除', field: 'delete_status'}
    ];
    var tableOpts = {
        init:   true,
        columns: [],
        classes: 'table table-hover table-no-bordered',
        sidePagination: 'server',
        idField: 'id',
        uniqueId: 'id',
        search: true,
        pagination: true,
        paginationVAlign: 'bottom',
        paginationHAlign: 'left',
        paginationDetailHAlign: 'right',
        pageList: [20, 50, 100, 500],
        striped: false,

        /*
         * 页面加载初, 从浏览器地址栏获取这5个参数
         */
        pageSize: getQueryParams('limit') ? parseInt(getQueryParams('limit')) : 20,
        pageNumber: getQueryParams('page') ? parseInt(getQueryParams('page')) : 1,
        searchText: getQueryParams('search') ? getQueryParams('search') : '',
        sortOrder: getQueryParams('order') ? getQueryParams('order') : 'asc',
        sortName: getQueryParams('sort') ? getQueryParams('sort') : 'id',

        columns:            columnInfo,                        
        url:                'http://172.16.3.50/enterprise/project/query2',
        queryParams: function(params){
            params.csrf_token = '1509550175##46383e4f5f1209706575c7d5a217b92cd82ead0b';            
            return params;
        },
        ajax: function (request) {
            request.dataType = 'jsonp';
            request.jsonp = 'callback';
            request.jsonpCallback = 'resHandler';
            $.ajax(request);
        },
    }
    $('#bt-table').bootstrapTable(tableOpts);
})();