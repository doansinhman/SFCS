async function showChangePassDialog() {
    const { value: password } = await Swal.fire({
        title: 'Nhập mật khẩu mới',
        input: 'text',
        inputPlaceholder: 'Enter your password',
        heightAuto: false
    })
    return password;
};

function cpw() {
    showChangePassDialog().then(
        newpass => {
            if (newpass.length < 6) {
                swal.fire("Độ dài mật khẩu phải từ 6 kí tự trở lên")
                return;
            }
            $.post('./api/ForceChangePass', {
                    user_name: user.user_name,
                    type: type,
                    new_pass: newpass
                },
                result => {
                    if (result == true) {
                        swal.fire("Đổi mật khẩu thành công");
                    } else swal.fire(result);
                });
        }
    )
}

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
                '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>' +
                '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>' +
                '</td>';
            $('#del-usr' + count).click(function() {
                $.post('./api/DeleteMember', { 'user_name': user.user_name },
                    result => {
                        if (result) {
                            swal.fire("Xoá thành công thành viên " + user_name)
                                .then(() => location.reload());
                        }
                    });
            });
            $('#ch-pass' + count).click(cpw);
        });
    });
}

function queryStaff(type) {
    var apiPath = './api/GetStaffs';

    var count = 1;
    var usertable = document.getElementById('user-table');
    $.get(apiPath, { ty: type }, data => {
        data.forEach(user => {
            var row = usertable.insertRow(count++);
            switch (type) {
                case 'cook': // court_id | user_name
                    row.insertCell().innerHTML = user.court_id;
                    row.insertCell().innerHTML = user.user_name;
                    row.insertCell().outerHTML =
                        '<td>' +
                        // '<button type=\'button\' id=\'check-order' + count + '\' class=\'btn-cp\'> Orders </button>'+
                        '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>' +
                        '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>' +
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
                        '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>' +
                        '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>' +
                        '</td>';
                    break
                case 'screen':
                    row.insertCell().innerHTML = user.user_name;
                    row.insertCell().outerHTML =
                        '<td>' +
                        '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>' +
                        '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>' +
                        '</td>';
                    break
                case 'cashier':
                    row.insertCell().innerHTML = user.user_name;
                    row.insertCell().outerHTML =
                        '<td>' +
                        '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>' +
                        '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>' +
                        '</td>';
                    break
                case 'screen':
                    row.insertCell().innerHTML = user.user_name;
                    row.insertCell().outerHTML =
                        '<td>' +
                        '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>' +
                        '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>' +
                        '</td>';
                default:
                    row.innerHTML = "Default"
            }
            $('#del-usr' + count).click(function() {
                $.post('./api/DeleteStaff', { 'user_name': user.user_name, 'type': type },
                    result => {
                        if (result == true) {
                            swal.fire("Xoá thành công " + user.user_name)
                                .then(() => location.reload());
                        }
                    });
            });
            $('#ch-pass' + count).click(cpw);
        })
    })
}
async function addStaff(eobj) {
    var apiPath = './api/AddStaff';

    var type = eobj.data;
    console.log(type);
    var inputHtml = '<input id="swal-input_username" class="swal2-input" placeholder="Tên đăng nhập">' +
        '<input id="swal-input_password" class="swal2-input" type="password" placeholder="Mật khẩu">';
    switch (type) {
        case "cook":
            inputHtml = '<input id="swal-input_courtid" class="swal2-input" placeholder="Mã quầy hàng">' + inputHtml;
            break
        case "vendor":
            inputHtml = '<input id="swal-input_courtname" class="swal2-input" placeholder="Tên quầy hàng">' +
                '<input id="swal-input_fullname" class="swal2-input" placeholder="Họ và Tên">' +
                '<label class="radio-inline">' +
                '<input id="swal-input_male" class="swal2-radio" type="radio" value="male" name="gender" checked>' + ' Nam ' +
                '</label>' +
                '<label class="radio-inline">' +
                '<input id="swal-input_female" class="swal2-radio" type="radio" value="female" name=gender>' + ' Nữ ' +
                '</label>' +
                '<input id="swal-input_birthday" class="swal2-input" type="date" placeholder="Ngày sinh">' +
                '<input id="swal-input_email" class="swal2-input" placeholder="Email">' +
                inputHtml;
            break
        case "cashier":

        case "screen":

        default:

    }
    var data = await swal.fire({
        title: "Đăng ký cho nhân viên mới",
        html: inputHtml,
        focusConfirm: false,
        heightAuto: false,
        preConfirm: () => {
            var preval = {
                user_name: document.getElementById('swal-input_username').value,
                password: document.getElementById('swal-input_password').value
            }
            if (typeof(preval.password) == 'undefined' || preval.password.length < 6) return false;
            switch (type) {
                case "cook":
                    preval.court_id = document.getElementById('swal-input_courtid').value
                    break
                case "vendor":
                    preval.court_name = document.getElementById('swal-input_courtname').value
                    preval.gender = $("input:radio[name=gender]:checked").val()
                    preval.full_name = document.getElementById('swal-input_fullname').value
                    preval.birthday = document.getElementById('swal-input_birthday').value
                    preval.email = document.getElementById('swal-input_email').value
                    break
                case "cashier":

                case "screen":

                default:
            }
            return preval;
        }
    });
    $.post(apiPath, { type: type, data: JSON.stringify(data.value) },
        (msg) => {
            if (msg == true) swal.fire("Tạo thành công")
            else swal.fire("Tạo thất bại: " + msg)
        }, 'json'
    )

}