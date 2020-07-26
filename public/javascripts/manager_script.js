function showChangePassDialog()
{
    return swal(
        "Mật khẩu mới:", {
        content: "input"
    });
};
function queryMember(ty) {
    var apiPath = './api/GetMember';
    
    var count = 1;
    var usertable = document.getElementById('user-table');
    $.get(apiPath, data => {
        data.forEach(user => {
            var row = usertable.insertRow(count++);
            row.insertCell().innerHTML = user.id;
            row.insertCell().innerHTML = user.full_name;
            row.insertCell().innerHTML = user.gender == 0 ? 'Nam' : 'Nữ';
            row.insertCell().innerHTML = user.birthday;
            row.insertCell().innerHTML = user.email;
            row.insertCell().innerHTML = user.phone_number;
            row.insertCell().innerHTML = user.user_name;
            row.insertCell().outerHTML = 
                '<td>' +
                    '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>'+
                    '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>'    +
                '</td>';
            $('#del-usr' + count).click(function() 
            {
                $.post('./api/DeleteMember', 
                {'user_name': user.user_name}, 
                result => 
                {
                    if (result) 
                    {
                        swal("Xoá thành công thành viên " + user_name)
                        .then(() => location.reload());                                
                    }
                });
            });
            $('#ch-pass' + count).click(function()
            {
                showChangePassDialog().then(
                    newpass =>
                    {
                        $.post('./api/ForceChangePass', 
                        {
                            user_name: user.user_name,
                            type: ty,
                            new_pass: newpass 
                        },
                        result =>
                        {
                            if (result == true) {
                                swal("Đổi mật khẩu thành công");
                            }
                            else swal(result);
                        });
                    }
                )                        
            });
        });
    });
}
function queryStaff(type) {
    var apiPath = './api/GetStaffs';
    
    var count = 1;
    var usertable = document.getElementById('user-table');
    $.get(apiPath, {ty : type}, data => {
        data.forEach(user => {
            var row = usertable.insertRow(count++);
            switch (type)
            {
                case 'cook': // court_id | user_name
                    row.insertCell().innerHTML = user.court_id;
                    row.insertCell().innerHTML = user.user_name;
                    row.insertCell().outerHTML = 
                        '<td>' +
                            // '<button type=\'button\' id=\'check-order' + count + '\' class=\'btn-cp\'> Orders </button>'+
                            '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>'+
                            '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>'    +
                        '</td>';
                    break
                case 'vendor':
                    row.insertCell().innerHTML = user.id;
                    row.insertCell().innerHTML = user.full_name;
                    row.insertCell().innerHTML = user.court_name;
                    row.insertCell().innerHTML = user.gender == 0 ? 'Nam' : 'Nữ';
                    row.insertCell().innerHTML = user.birthday;
                    row.insertCell().innerHTML = user.email;
                    row.insertCell().innerHTML = user.phone_number;
                    row.insertCell().innerHTML = user.user_name;
                    row.insertCell().outerHTML = 
                        '<td>' +
                            '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>'+
                            '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>'    +
                        '</td>';
                    break
                case 'screen':
                    row.insertCell().innerHTML = user.user_name;
                    row.insertCell().outerHTML = 
                        '<td>' +
                            '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>'+
                            '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>'    +
                        '</td>';
                    break
                case 'cashier':
                    row.insertCell().innerHTML = user.user_name;
                    row.insertCell().outerHTML = 
                        '<td>' +
                            '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>'+
                            '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>'    +
                        '</td>';
                    break
                case 'screen':
                    row.insertCell().innerHTML = user.user_name;
                    row.insertCell().outerHTML = 
                        '<td>' +
                            '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>'+
                            '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>'    +
                        '</td>';
                default: 
                        row.innerHTML = "Default"
                }
                    $('#del-usr' + count).click(function() 
                    {
                        $.post('./api/DeleteStaff', 
                        {'user_name': user.user_name, 'type' : type}, 
                        result => 
                        {
                            if (result == true) 
                            {
                                swal("Xoá thành công " + user.user_name)
                                .then(() => location.reload());                                
                            }
                        });
                    });
                    $('#ch-pass' + count).click(function()
                    {
                        showChangePassDialog().then(
                            newpass =>
                            {
                                $.post('./api/ForceChangePass', 
                                {
                                    user_name: user.user_name,
                                    type: type,
                                    new_pass: newpass 
                                },
                                result =>
                                {
                                    if (result == true) {
                                        swal("Đổi mật khẩu thành công");
                                    }
                                    else swal(result);
                                });
                            }
                        )                        
                    });
            }
        )}
    )
}