# autoCompleteMenu
自动填充菜单
autoCompleteMenu.js 使用说明;
描述： 自动补全菜单工具
autoCompleteMenu 插件依赖插件有： doT.js , jQuery;

使用方法：
elem 必须是 jquery 对象， options必须是对象
new autoCompleteMenu(elem, options);

options 默认参数必须如下：
...
        appendTo: null,
        templates: {
            wrap: '<div class="ui-dropdown-menu"></div>',
            li: "<li><a>{{!it.label}}</a></li>",
            ul: "<ul><ul>",
            close: '<span style="float:right;cursor:pointer;margin-right:5px;">关闭</span>',
            msg: '<span style="color: #B94A48;margin-left:5px">{{!it}}</span>',
            pagerbottom: '<div class="ui-ddm-toolbar ui-ddm-toolbar-bottom" menu-role="toolbar"><div class="ui-ddm-btn" style="width: 100%;">当前第<span menu-role="page-num">1</span>页</div><div style="clear:both"></div></div>',
            pagertop: '<div class="ui-ddm-toolbar" menu-role="toolbar"><div class="ui-ddm-btn disable" menu-role="prev"><div class="ui-ddm-btn-inner">上一页</div></div><div class="ui-ddm-btn disable" menu-role="next">下一页</div><div style="clear:both"></div></div>'
        },
        style: {},                                               //样式
        delay: 300,                                              //判断两次输入的值是否相等的时间间隔
        close: !1,                                               //是否启用 close按钮
        enableKeyControl: !0,                                    //是否启用按键模式 38 40 13
        source: null,                                            //$ajax请求， 如果不写的话插件就自己带；
        pager: !1,                                               //是否启用分页
        filter: !1,                                              //是否启用过滤
        response: null,
        search: function (a) {                                   //搜索时的过滤条件
            return a.length < 2 ? !1 : !0
        },
        beforeSelect: null,                                       //在下拉之前执行的方法
        select: null,                                             //下拉之后的执行的方法
        noChoice: null,
        selectDefault: !0
...
