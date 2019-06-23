
function loadTable(tb_name) {
    // jQuery ajax
    $.ajax({
        // 获取 columns
        type: "HEAD",
        url: "/api/v1.0/" + tb_name,
        async: true,
        success: function (data, statusTest, xhr) {
            var columns = xhr.getResponseHeader('columns')
            columns = JSON.parse(columns)

            // 根据 columns 字段与查询的结果 构造table
            var table = '<thead><tr class="dropup">'
            for (i = 0; i < columns.length; i++) {
                table += '<th onclick="sort_by(' + "'" + columns[i][0] + "'" + ')">' + columns[i][0] + '&nbsp;&nbsp;<span class="caret"></span>' + "</th>"
            }
            table += "</tr></thead>"

            $.ajax({
                type: "GET",
                url: "/api/v1.0/" + tb_name,
                dataType: 'json',
                async: true,
                success: function (data) {
                    //console.log(data)
                    table += "<tbody>"
                    for (i = 0; i < data.length; i++) {
                        switch (i % 5) {
                            case 0: table += '<tr>'; break;
                            case 1: table += '<tr class="success">'; break;
                            case 2: table += '<tr class="error">'; break;
                            case 3: table += '<tr class="warning">'; break;
                            case 4: table += '<tr class="info">'; break;
                        }
                        for (j = 0; j < data[i].length; j++) {
                            table += '<td class="eye-protector-processed">' + data[i][j] + '</td>'
                        }
                        table += "</tr>"
                    }
                    table += "</tbody>"
                    $("#my_table_here").html(table)
                    $("#my_table_here").attr("secret_name", tb_name)
                    $("#my_functools_here").html('')
                }
            })
        }
    })
}

function myFunctools() {
    // 获取当前页面中的表名
    var tb_name = $("#my_table_here").attr("secret_name")
    if ($.inArray(tb_name, ['S', 'C', 'SC']) == -1) {
        $('#msg-box').html('<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>仅支持S C 和 SC 表操作 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;可点击关闭</div>')
        return
    }

    $.ajax({
        type: "HEAD",
        url: "/api/v1.0/" + tb_name,
        async: true,
        success: function (data, statusTest, xhr) {
            var columns = xhr.getResponseHeader('columns')
            columns = JSON.parse(columns)

            html = ''
            for (i = 0; i < columns.length; i++) {
                html += '<div class="input-group">'
                html += '<span class="input-group-addon">' + columns[i] + '</span>'
                html += '<input type="text" class="form-control" id="' + columns[i] + '"  placeholder="' + columns[i] + '" aria-describedby="basic-addon1">'
                html += '</div>'
            }
            html += '<button onclick="funcSearch()" type="button" class="btn btn-default">查询</button>'
            html += '<button onclick="funcInsert()" type="button" class="btn btn-default">插入</button>'
            html += '<button onclick="funcDelete()" type="button" class="btn btn-default">删除</button>'

            $("#my_functools_here").html(html)
        }
    })
}

function myUpdatetool() {
    // 获取当前页面中的表名
    var tb_name = $("#my_table_here").attr("secret_name")
    if ($.inArray(tb_name, ['S', 'C', 'SC']) == -1) {
        $('#msg-box').html('<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>仅支持S C 和 SC 表操作 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;可点击关闭</div>')
        return
    }

    $.ajax({
        type: "HEAD",
        url: "/api/v1.0/" + tb_name,
        async: true,
        success: function (data, statusTest, xhr) {
            var columns = xhr.getResponseHeader('columns')
            columns = JSON.parse(columns)

            html = ''
            for (i = 0; i < columns.length; i++) {
                html += '<div class="input-group">'
                html += '<span class="input-group-addon">' + columns[i] + '</span>'
                html += '<input type="text" class="form-control" id="' + columns[i] + '"  placeholder="' + columns[i] + '" aria-describedby="basic-addon1">'
                html += '</div>'
            }
            html += '<br>'
            for (i = 0; i < columns.length; i++) {
                html += '<div class="input-group">'
                html += '<span class="input-group-addon">new' + columns[i] + '</span>'
                html += '<input type="text" class="form-control" id="new' + columns[i] + '"  placeholder="new' + columns[i] + '" aria-describedby="basic-addon1">'
                html += '</div>'
            }
            html += '<button onclick="funcUpdate()" type="button" class="btn btn-default">修改</button>'

            $("#my_functools_here").html(html)
        }
    })
}

function funcSearch() {
    // 获取当前操作的表名 tb_name
    var tb_name = $("#my_table_here").attr("secret_name")

    // 获取 columns
    $.ajax({
        type: "HEAD",
        url: "/api/v1.0/" + tb_name,
        async: true,
        success: function (data, statusTest, xhr) {
            var columns = xhr.getResponseHeader('columns')
            columns = JSON.parse(columns)

            // 解析 query_str
            var arr = []
            for (i = 0; i < columns.length; i++) {
                if ($("#" + columns[i] + "").val() != "") {
                    arr.push(columns[i] + '=' + $("#" + columns[i] + "").val())
                }
            }
            var query_str = arr.join('&')

            // 根据 query_str 查询信息 并修改 table标签
            var table = '<thead><tr class="dropup">'
            for (i = 0; i < columns.length; i++) {
                table += '<th onclick="sort_by(' + "'" + columns[i][0] + "'" + ')">' + columns[i][0] + '&nbsp;&nbsp;<span class="caret"></span>' + "</th>"
            }
            table += "</tr></thead>"

            $.ajax({
                type: "GET",
                url: "/api/v1.0/" + tb_name + '?' + query_str,
                dataType: 'json',
                async: true,
                success: function (data) {
                    //console.log(data)
                    table += "<tbody>"
                    for (i = 0; i < data.length; i++) {
                        switch (i % 5) {
                            case 0: table += '<tr>'; break;
                            case 1: table += '<tr class="success">'; break;
                            case 2: table += '<tr class="error">'; break;
                            case 3: table += '<tr class="warning">'; break;
                            case 4: table += '<tr class="info">'; break;
                        }
                        for (j = 0; j < data[i].length; j++) {
                            table += '<td class="eye-protector-processed">' + data[i][j] + '</td>'
                        }
                        table += "</tr>"
                    }
                    table += "</tbody>"
                    $("#my_table_here").html(table)
                    $("#my_table_here").attr("secret_name", "查询的部分表")
                }
            })
        }
    })
}

function funcInsert() {
    // 获取当前操作的表名 tb_name
    var tb_name = $("#my_table_here").attr("secret_name")

    // 获取 columns
    $.ajax({
        type: "HEAD",
        url: "/api/v1.0/" + tb_name,
        async: true,
        success: function (data, statusTest, xhr) {
            var columns = xhr.getResponseHeader('columns')
            columns = JSON.parse(columns)

            // 解析成 json_str
            var arr = {}
            for (i = 0; i < columns.length; i++) {
                if ($("#" + columns[i] + "").val() != "") {
                    arr[columns[i]] = $("#" + columns[i] + "").val()
                }
            }
            var json_str = JSON.stringify(arr)

            $.ajax({
                type: "POST",
                url: "/api/v1.0/" + tb_name,
                dataType: "json",       // 返回数据格式!
                data: json_str,
                headers: {              // 请求头!!!
                    "Content-Type": "application/json"
                },
                async: true,
                success: function (data) {
                    //console.log(data)
                    // 插入成功
                    loadTable(tb_name)
                }
            })
        }
    })
}

function funcDelete() {
    // 获取当前操作的表名 tb_name
    var tb_name = $("#my_table_here").attr("secret_name")

    // 获取 columns
    $.ajax({
        type: "HEAD",
        url: "/api/v1.0/" + tb_name,
        async: true,
        success: function (data, statusTest, xhr) {
            var columns = xhr.getResponseHeader('columns')
            columns = JSON.parse(columns)

            // 解析 query_str
            var arr = []
            for (i = 0; i < columns.length; i++) {
                if ($("#" + columns[i] + "").val() != "") {
                    arr.push(columns[i] + '=' + $("#" + columns[i] + "").val())
                }
            }
            var query_str = arr.join('&')

            $.ajax({
                type: "DELETE",
                url: "/api/v1.0/" + tb_name + '?' + query_str,
                dataType: 'json',
                async: true,
                success: function (data) {
                    //console.log(data)
                    // 删除成功
                    loadTable(tb_name)
                }
            })
        }
    })
}

function funcUpdate() {
    // 获取当前操作的表名 tb_name
    var tb_name = $("#my_table_here").attr("secret_name")

    // 获取 columns
    $.ajax({
        type: "HEAD",
        url: "/api/v1.0/" + tb_name,
        async: true,
        success: function (data, statusTest, xhr) {
            var columns = xhr.getResponseHeader('columns')
            columns = JSON.parse(columns)

            // 解析 query_str
            var arr = []
            for (i = 0; i < columns.length; i++) {
                if ($("#" + columns[i] + "").val() != "") {
                    arr.push(columns[i] + '=' + $("#" + columns[i] + "").val())
                }
            }
            var query_str = arr.join('&')

            // 解析成 json_str
            var arr = {}
            for (i = 0; i < columns.length; i++) {
                if ($("#new" + columns[i] + "").val() != "") {
                    arr[columns[i]] = $("#new" + columns[i] + "").val()
                }
            }
            var json_str = JSON.stringify(arr)

            $.ajax({
                type: "PUT",
                url: "/api/v1.0/" + tb_name + '?' + query_str,
                dataType: "json",       // 返回数据格式!
                data: json_str,
                headers: {              // 请求头!!!
                    "Content-Type": "application/json"
                },
                async: true,
                success: function (data) {
                    //console.log(data)
                    // 修改成功
                    loadTable(tb_name)
                }
            })
        }
    })
}

function loadCourseTable() {
    // jQuery ajax
    $.ajax({
        type: "POST",
        url: "/api/this/is/a/secret/entrypoint",
        dataType: "json",       // 返回数据类型
        headers: {              // 请求头!!!
            "sql": "select S.Sname, C.Cname from S, C, SC where SC.Sno = S.Sno and SC.Cno = C.Cno"
        },
        async: true,
        success: function (data) {
            //console.log(data)
            var table = "<thead><tr>"
            table += '<th>' + "Sname" + "</th>"
            table += '<th>' + "Cname" + "</th>"
            table += "</tr></thead>"
            table += "<tbody>"
            for (i = 0; i < data.length; i++) {
                switch (i % 5) {
                    case 0: table += '<tr>'; break;
                    case 1: table += '<tr class="success">'; break;
                    case 2: table += '<tr class="error">'; break;
                    case 3: table += '<tr class="warning">'; break;
                    case 4: table += '<tr class="info">'; break;
                }
                for (j = 0; j < data[i].length; j++) {
                    table += '<td class="eye-protector-processed">' + data[i][j] + '</td>'
                }
                table += "</tr>"
            }
            table += "</tbody>"

            $("#my_table_here").html(table)
            $("#my_table_here").attr("secret_name", "联合查询的选课表")

            html = ''
            html += '<div class="input-group">'
            html += '<span class="input-group-addon">' + 'Sname' + '</span>'
            html += '<input type="text" class="form-control" id="' + 'Sname' + '"  placeholder="' + 'Sname' + '" aria-describedby="basic-addon1">'
            html += '</div>'
            html += '<div class="input-group">'
            html += '<span class="input-group-addon">' + 'Cname' + '</span>'
            html += '<input type="text" class="form-control" id="' + 'Cname' + '"  placeholder="' + 'Cname' + '" aria-describedby="basic-addon1">'
            html += '</div>'
            html += '<button onclick="filterCourseTable()" type="button" class="btn btn-default">filter </button>'
            $('#my_functools_here').html(html)
        }
    })
}

function filterCourseTable() {
    arr = []
    if ($("#" + "Sname" + "").val() != "") {
        arr.push('S.Sname' + '="' + $("#" + "Sname" + "").val() + '"')
    }
    if ($("#" + "Cname" + "").val() != "") {
        arr.push('C.Cname' + '="' + $("#" + "Cname" + "").val() + '"')
    }
    var where_clause_append = ""
    if (arr.length != 0){
        where_clause_append = ' and ' + arr.join(' and ')
    }
    var sql = "select S.Sname, C.Cname from S, C, SC where SC.Sno = S.Sno and SC.Cno = C.Cno" + where_clause_append
    sql = encodeURI(sql)        // str 转 bytes

    // jQuery ajax
    $.ajax({
        type: "POST",
        url: "/api/this/is/a/secret/entrypoint",
        dataType: "json",       // 返回数据类型
        headers: {              // 请求头!!!
            "sql": sql
        },
        async: true,
        success: function (data) {
            var table = ""
            for (i = 0; i < data.length; i++) {
                switch (i % 5) {
                    case 0: table += '<tr>'; break;
                    case 1: table += '<tr class="success">'; break;
                    case 2: table += '<tr class="error">'; break;
                    case 3: table += '<tr class="warning">'; break;
                    case 4: table += '<tr class="info">'; break;
                }
                for (j = 0; j < data[i].length; j++) {
                    table += '<td class="eye-protector-processed">' + data[i][j] + '</td>'
                }
                table += "</tr>"
            }
            
            $("#my_table_here tbody").html(table)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            /*弹出jqXHR对象的信息*/
            console.log(jqXHR.responseText);
            console.log(jqXHR.status);
            console.log(jqXHR.readyState);
            console.log(jqXHR.statusText);
            /*弹出其他两个参数的信息*/
            console.log(textStatus);
            console.log(errorThrown);
        }
    })
}

function sort_by(order_by_col) {
    // 获取当前操作的表名 tb_name
    var tb_name = $("#my_table_here").attr("secret_name")
    if ($.inArray(tb_name, ['S', 'C', 'SC']) == -1) {
        $('#msg-box').html('<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>仅支持S C 和 SC 表操作 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;可点击关闭</div>')
        return
    }
    
    // 升序还是降序
    var which_order = ''
    if ($('table thead tr').hasClass('dropup')) {
        which_order = 'desc'
        $('table thead tr').removeClass('dropup')
        $('table thead tr').addClass('dropdown')
    }
    else {
        if ($('table thead tr').hasClass('dropdown')) {
            $('table thead tr').removeClass('dropdown')
        }
        which_order = 'asc'
        $('table thead tr').addClass('dropup')
    }

    // jQuery ajax
    $.ajax({
        type: "POST",
        url: "/api/this/is/a/secret/entrypoint",
        dataType: "json",       // 返回数据类型
        headers: {              // 请求头!!!
            "sql": "select * from " + tb_name + " order by " + order_by_col + ' ' + which_order
        },
        async: true,
        success: function (data) {
            // 排序不更改表头，只更改表内数据
            table = ""
            for (i = 0; i < data.length; i++) {
                switch (i % 5) {
                    case 0: table += '<tr>'; break;
                    case 1: table += '<tr class="success">'; break;
                    case 2: table += '<tr class="error">'; break;
                    case 3: table += '<tr class="warning">'; break;
                    case 4: table += '<tr class="info">'; break;
                }
                for (j = 0; j < data[i].length; j++) {
                    table += '<td class="eye-protector-processed">' + data[i][j] + '</td>'
                }
                table += "</tr>"
            }
            $("#my_table_here tbody").html(table)
        }
    })
}

function clear_msg() {
    $('#msg-box').html('')
}
