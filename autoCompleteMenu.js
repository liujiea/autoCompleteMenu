(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.autoCompleteMenu = factory());
})(this, (function () {
    var b = require("../doT/doT"),
        c = {
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
            style: {},
            delay: 300,
            close: !1,
            enableKeyControl: !0,
            source: null,
            pager: !1,
            filter: !1,
            response: null,
            search: function (a) {
                return a.length < 2 ? !1 : !0
            }, beforeSelect: null,
            select: null,
            noChoice: null,
            selectDefault: !0
        },
        d = {
            type: "GET",
            name: {
                term: "term"
            },
            others: null
        },
        e = function (elem, e) {
            this.input = $( elem );
            e = $.extend(!0, {}, c, e);
            this.option = e;
            this.compiles = {
                li: b.template(e.templates.li),
                msg: b.template(e.templates.msg)
            };
            $.isArray(e.source) || "function" == typeof e.source || (e.source = $.extend(!0, {}, d, e.source));
            this._init();
        };
    e.prototype._init = function () {
        function a(a) {
            e.__wrap = $(c.templates.wrap).appendTo(a);
            var b = d.position(),
                f = d.outerHeight();
            e.__wrap.css({
                top: b.top + f,
                left: b.left
            }), 1 == c.pager && (c.pager = "top|bottom"), c.pager && c.pager.indexOf("top") > -1 && e.__wrap.append(c.templates.pagertop), e.menu = $(c.templates.ul).appendTo(e.__wrap), c.pager && c.pager.indexOf("bottom") > -1 && e.__wrap.append(c.templates.pagerbottom), c.style.width && e.__wrap.css("width", c.style.width), c.style.maxHeight && e.menu.css({
                maxHeight: c.style.maxHeight,
                overflowY: "auto"
            }), c.style.wrap && e.__wrap.css(c.style.wrap), c.style.ul && e.menu.css(c.style.ul)
        }

        function b() {
            var a = d.val();
            g === a && e.__wrap.is(":visible") || (clearTimeout(f), f = setTimeout(function () {
                var b = d.val();
                a === b && (e._changeValue(b), g = a)
            }, c.delay))
        }
        var c = this.option,
            d = this.input,
            e = this;
        c.appendTo ? (c.appendTo = $(c.appendTo), a(c.appendTo)) : (d.position(), d.outerHeight(), d.wrap('<span class="ui-dropdown" style="position:static"></span>'), d.before('<span style="width:0">&nbsp;</span>'), a(d.parent())), this._attachMenuEvent();
        var f, g;
        d.off("keyup.api-autoCompleteMenu").on("keyup.api-autoCompleteMenu", function (a) {
            if (e.option.enableKeyControl) switch (a.which) {
                case 38:
                    return e._move(!0), void 0;
                case 40:
                    return e._move(!1), void 0;
                case 13:
                    return e._getHoverItem().trigger("autoCompleteMenuSelect"), a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0, void 0
            }
            b()
        }), d.off("click.api-autoCompleteMenu").on("click.api-autoCompleteMenu", b), d.off("blur.api-autoCompleteMenu").on("blur.api-autoCompleteMenu", function () {
            var a = e.option.selectDefault,
                b = $(this).val();
            if (b) {
                var c = e._getHoverItem();
                if (c.length > 0 && (a === !0 || "function" == typeof a && a.call(e, b, c.data("autoCompleteMenuItem"), c) === !0)) return c.trigger("autoCompleteMenuSelect"), void 0
            }
            var d = e.option.noChoice;
            d && d.call(e, b), e.__wrap.trigger("autoCompletMenuClose")
        }), this.__wrap.trigger("autoCompletMenuClose")
    };
    e.prototype._attachMenuEvent = function () {
        var a = this.menu,
            b = this.__wrap,
            c = this;
        a.off("autoCompleteMenuSelect").on("autoCompleteMenuSelect", "[menu-role=menuItem]", function () {
            c._selectMenu($(this))
        }).off("mouseenter.api-autoCompleteMenu").on("mouseenter.api-autoCompleteMenu", "[menu-role=menuItem]", function () {
            var a = $(this);
            a.hasClass("hover") || a.addClass("hover").siblings("[menu-role=menuItem]").removeClass("hover")
        }).off("mousedown.api-autoCompleteMenu").on("mousedown.api-autoCompleteMenu", "[menu-role]", function () {
            var a = $(this),
                c = a.attr("menu-role");
            switch (c) {
                case "menuItem":
                    return a.trigger("autoCompleteMenuSelect"), !1;
                case "close":
                    b.trigger("autoCompletMenuClose")
            }
        }), b.off("autoCompletMenuClose").on("autoCompletMenuClose", function () {
            $(this).hide()
        }), b.find("[menu-role='toolbar']").find("[menu-role]").off("mousedown.api-autoCompleteMenu").on("mousedown.api-autoCompleteMenu", function () {
            var a = $(this);
            if (a.hasClass("disable")) return !1;
            var b = a.attr("menu-role");
            switch (b) {
                case "prev":
                    c._source(c.curSearchValue, c.pageNum - 1);
                    break;
                case "next":
                    c._source(c.curSearchValue, c.pageNum + 1)
            }
            return !1
        })
    };
    e.prototype._changeValue = function (a) {
        var b = this.option.search;
        (!b || b.call(this, a, this.input)) && (this.curSearchValue = a, this._source(a))
    };
    e.prototype._getHoverItem = function () {
        return this.menu.find("[menu-role=menuItem].hover")
    };
    e.prototype._move = function (a) {
        var b = this._getHoverItem(),
            c = a ? b.prev() : b.next();
        0 === c.length && (c = a ? this.menu.find("[menu-role=menuItem]").last() : this.menu.find("[menu-role=menuItem]").first()), c.addClass("hover").siblings("[menu-role=menuItem]").removeClass("hover");
        var d = this.menu.find("[menu-role=menuItem]:last").offset().top,
            e = this.menu.find("[menu-role=menuItem]:first").offset().top;
        if (this.menu.height() < d - e) {
            var f = c.offset().top;
            this.menu.scrollTop(f - e)
        }
    };
    e.prototype._filter = function (a, b) {
        return a = this._normalize(a), 0 == this.option.filter ? a : $.isArray(this.option.filter) ? this.filter(a, b, this.option.filter) : this.filter(a, b)
    };
    e.prototype._source = function (a, b) {
        var c = this.option.source,
            d = this;
        if (this.pageNum = null == b ? 1 : b, $.isArray(c)) {
            var e = this._filter(c, a);
            this.openMenu(e)
        } else if ("function" == typeof c) c.call(d, a, function (b, c) {
            if ("string" == typeof b) d.renderMsg(b), d.setPagerStatus(0);
            else {
                var e = d._filter(b, a);
                d.openMenu(e), d.setPagerStatus(c)
            }
        }, this.pageNum);
        else {
            var f = {};
            f[c.name.term] = a, f[c.name.pageNum] = this.pageNum, $.extend(f, c.others), $.ajax({
                url: c.url,
                data: f,
                dataType: "json",
                type: c.type || "GET",
                success: function (b) {
                    if (b.error) d._renderMsg(b.data), d.setPagerStatus(0);
                    else {
                        var c = this._filter(b.data, a);
                        d.openMenu(c), d.setPagerStatus(b.pagecount)
                    }
                }
            })
        }
    };
    e.prototype.setPagerStatus = function (a) {
        function b(a, b, c) {
            a.find('[menu-role="' + b + '"]').each(function () {
                var a = $(this);
                c ? a.removeClass("disable") : a.addClass("disable")
            })
        }
        if (this.option.pager) {
            var c = this.pageNum,
                d = this.__wrap.children('[menu-role="toolbar"]');
            a > c ? b(d, "next", !0) : b(d, "next", !1), 1 == c || 0 == a ? b(d, "prev", !1) : b(d, "prev", !0), d.find('[menu-role="page-num"]').text(c)
        }
    };
    e.prototype.openMenu = function (a) {
        if ("string" == typeof a) this.renderMsg(a);
        else {
            var b = this._normalize(a);
            this.option.response && (b = this.option.response.call(this, b, this.input)), b !== !1 && this._renderMenu(b)
        }
    };
    e.prototype._selectMenu = function (a) {
        var b, c = this.input;
        b = a ? a.data("autoCompleteMenuItem") : {
            id: "",
            name: ""
        };
        var d = this.option.beforeSelect && this.option.beforeSelect.call(this, b, c, a);
        d !== !1 && (c.val(b.label), this.__wrap.trigger("autoCompletMenuClose"), this.option.select && this.option.select.call(this, b, c, a))
    };
    e.prototype.renderMsg = function (a) {
        this.menu.html(this.compiles.msg(a)), this.__wrap.show()
    };
    e.prototype._renderMenu = function (a) {
        var b = this;
        0 === a.length ? this.menu.html(this.compiles.msg("没有数据")) : (this.menu.html(""), $.each(a, function (a) {
            b._renderItemData(this, a)
        }), this.option.close === !0 && $(this.option.templates.close).attr("menu-role", "close").appendTo(this.menu), this._move(!1)), this.__wrap.show()
    };
    e.prototype._renderItemData = function (a, b) {
        var c = $(this.compiles.li(a, b)).attr("menu-role", "menuItem").appendTo(this.menu).data("autoCompleteMenuItem", a);
        return this.option.style.li && c.css(this.option.style.li), c
    };
    e.prototype._normalize = function (a) {
        return a.length && a[0].label && a[0].value ? a : $.map(a, function (a) {
            return "string" == typeof a ? {
                label: a,
                value: a
            } : $.extend({
                label: a.label || a.value,
                value: a.value || a.label
            }, a)
        })
    };
    e.prototype.closeMenu = function () {
        this.menu.hide()
    };
    e.prototype.filter = function (a, b, c) {
        b = b.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
        var d = new RegExp(b, "i");
        return $.grep(a, function (a) {
            if (c && c.length > 0) {
                for (var b = 0, e = c.length; e > b; b++)
                    if (d.test(a[c[b]])) return !0;
                return !1
            }
            return d.test(a.label || a.value || a)
        })
    };
    return e;
}))
