var idUser;
var settingIds = [];
var settingKeys = [];
var settingValues = [];
class MyComponent {
    constructor() {
        this.$el = null;
        this.table_direct = null;
    }

    init() {
        this.$el = $("#userContainer");

        this._activeTab();
        this._initDataTable();
        this._loadDataSetting();
        this._eventCRUD();
    }
    _activeTab() {
        $("#nav-option .nav-link").removeClass("active");
        $("#user-link").addClass("active");
    }
    _initDataTable() {
        var url = "https://localhost:7132/User/GetAllUser";

        $.ajax({
            url: url,
            type: 'GET',
            success: (response) => {
                console.log(response);
                var ds = response.result; 
                this.table_direct = new DataTable('#userTable', {
                    pageLength: 4,
                    "lengthChange": false,
                    "info": false,
                    language: {
                        search: "Tìm kiếm:" // Thay đổi nhãn tìm kiếm ở đây
                    },
                    data: ds,
                    "columns": [
                        {
                            "data": null,
                            "defaultContent": "",
                            "render": (data, type, row, meta) => {
                                return meta.row + 1; // Số thứ tự
                            }
                        },
                        { "data": "name" },
                        { "data": "email" },
                        //{ "data": "gender" },
                        {
                            "data": "gender",
                            "render": (data) => {
                                return data === false ? 'Nữ' : 'Nam'; // Chuyển đổi giá trị giới tính
                            }
                        },
                        { "data": "address" },
                        { "data": "phone" },
                        //{ "data": "image" },
                        {
                            data: 'image',
                            render: function (data) {
                                const imageUrl = `/upload/${data}`;
                                return `<img src="${imageUrl}" style="width:100px; height: 110px;" />`;

                            }
                        },
                        {
                            data: null,
                            defaultContent: "",
                            render: (data, type, row) => {
                                return `
                                <button class="edit-btn" data-id="${row.id}">Sửa</button>
                            `;
                            }
                        },
                        {
                            data: null,
                            defaultContent: "",
                            render: (data, type, row) => {
                                return `
                                <button class="delete-btn" data-id="${row.id}">Xóa</button>
                            `;
                            }
                        }
                    ]
                });
            },
            error: (xhr, status, error) => {
                console.error('Error fetching data:', status, error);
                //TokenMes();
            }
        });
    }
    _loadDataSetting() {
        getDataSetting();
        function getDataSetting() {
            var url = "https://localhost:7132/Setting/GetAllSetting";
            $.ajax({
                url: url,
                method: 'GET',
                success: (data) => {
                    // Mảng các SettingKey cần thiết
                    const requiredSettingKeys = [
                        //Kiểm tra cú pháp mật khẩu
                        'enablesyntaxchecking',
                        'minimumlength',
                        'minimumlowercase',
                        'minimumuppercase',
                        'minimumnumbers',
                        'minimumsymbols'
                    ];

                    settingIds = [];
                    settingKeys = [];
                    settingValues = [];
                    for (let i = 0; i < data.length; i++) {
                        var dataItem = data[i];
                        if (requiredSettingKeys.includes(dataItem.key)) {
                            settingIds.push(dataItem.id);
                            settingKeys.push(dataItem.key);
                            settingValues.push(dataItem.value);
                        }
                    }

                    UpdateForm();
                },
                error: (xhr, status, error) => {
                    console.error('Error fetching data:', status, error);
                }
            });
        }
    }
    _eventCRUD() {
        // Xử lý sự kiện khi nhấp vào nút Sửa chuyển hướng vào giao diện thêm và sửa theo điều kiện
        $('#userTable').on('click', '.edit-btn', function () {

            var createUser = document.querySelector('[data-bs-target="#createUser"]');
            createUser.click();

            var id = $(this).data('id');

            // Cập nhật tiêu đề và văn bản nút của modal cho chế độ chỉnh sửa
            $('#createUser .modal-title').text('Cập Nhật Thông Tin Người Dùng');
            $('#createUser .btn-modal-confirm').text('Cập Nhật');

            getUserEdit(id);

            updateModalForEdit();
        });
        function updateModalForEdit() {   
            $('#createUser #userForm').append(`
                <div class="mb-4">
                    <label for="currentImage">Ảnh hiện tại:</label>
                    <img id="currentImage" src="" alt="Ảnh hiện tại" style="max-width: 200px; height: 100px;"><br>
                </div>
            `);
        }
        // Khi modal bị đóng, quay về trạng thái mặc định
        $('#createUser').on('hidden.bs.modal', function () {
            $('#createUser .modal-title').text('Thêm Mới Người Dùng');
            $('#createUser .btn-modal-confirm').text('Thêm');
            idUser = null;
        });
        $('.btn-modal-close').on('click', function () {
            $('#createUser .modal-title').text('Thêm Mới Người DùngThêm Mới Cán bộ');
            $('#createUser .btn-modal-confirm').text('Thêm');
            idUser = null;
            window.location.reload();
        });
        //Lấy dữ liệu User của bản ghi vừa ấn nút sửa đổ vào các ô input 
        function getUserEdit(id) {            
            var url = "https://localhost:7132/User/GetUserById" + '?Id=' + id;
            $.ajax({
                url: url,
                type: 'GET',
                success: (data) => {
                    var info = data;
                    idUser = data.id;
                    $('#eIName').val(data.name);
                    $('#eIEmail').val(data.email);
                    $('#eIPass').val(data.password);
                    $('#gender-male').prop('checked', data.gender === true);
                    $('#gender-female').prop('checked', data.gender === false);
                    $('#eIAddress').val(data.address);
                    $('#eIPhone').val(data.phone);
                    if (info.image) {
                        var imageUrl = `/upload/${info.image}`;
                        $('#currentImage').attr('src', imageUrl);
                    }
                },
                error: (xhr, status, error) => {
                    console.error('Error fetching data:', status, error);
                }
            });
        }
        $('.btn-create-user').on('click', function () {
            if (idUser != null) {
                updateUser();
            }
            else {
                createUser();
            }
            function createUser() {
                const name = $('#eIName').val().trim();
                const password = $('#eIPass').val().trim(); 
                const email = $('#eIEmail').val().trim();
                const phone = $('#eIPhone').val().trim();
                const address = $('#eIAddress').val().trim();
                const imageFile = $('#imagePath')[0].files[0];

                const genderMaleChecked = $('#gender-male').is(':checked');
                const genderFemaleChecked = $('#gender-female').is(':checked');
                let gender = null;

                if (genderMaleChecked) {
                    gender = true;
                } else if (genderFemaleChecked) {
                    gender = false;
                }
                if (name == "") {
                    $('#nameError').text("Tên không được để trống").show();
                    return;
                } else {
                    $('#nameError').text('').hide();
                }
                if (email == "") {
                    $('#emailError').text("Email không được để trống").show();
                    return;
                } else {
                    $('#emailError').text('').hide();
                }
                if (genderMaleChecked == false && genderFemaleChecked == false) {
                    $('#genderError').text("Hãy chọn giới tính").show();
                    return;
                } else {
                    $('#genderError').text('').hide();
                }
                
                // Đảm bảo dữ liệu đã được tải
                if (settingValues.length === 0) {
                    alert('Chưa tải cấu hình hệ thống.');
                    return;
                }
                // Lấy các giá trị điều kiện từ settingValues
                const checkPassword = settingValues[0] === 'True'; // `enablesyntaxchecking`
                const minLength = parseInt(settingValues[1], 10); // `minimumlength`
                const minLower = parseInt(settingValues[2], 10);  // `minimumlowercase`
                const minUpper = parseInt(settingValues[3], 10);  // `minimumuppercase`
                const minNumber = parseInt(settingValues[4], 10); // `minimumnumbers`
                const minSpecialChar = parseInt(settingValues[5], 10); // `minimumsymbols`

                // Nếu checkbox enablesyntaxchecking được đánh dấu, thực hiện kiểm tra mật khẩu
                if (checkPassword) {
                    // Hàm kiểm tra mật khẩu
                    function validatePassword(password) {
                        let lowerCount = 0;
                        let upperCount = 0;
                        let numberCount = 0;
                        let specialCount = 0;

                        // Tính số ký tự của từng loại
                        for (let char of password) {
                            if (/[a-z]/.test(char)) lowerCount++;
                            else if (/[A-Z]/.test(char)) upperCount++;
                            else if (/[0-9]/.test(char)) numberCount++;
                            else if (/[^a-zA-Z0-9]/.test(char)) specialCount++;
                        }

                        // Kiểm tra điều kiện mật khẩu
                        if (password.length < minLength) return 'Mật khẩu phải dài ít nhất ' + minLength + ' ký tự.';
                        if (lowerCount < minLower) return 'Mật khẩu phải chứa ít nhất ' + minLower + ' chữ thường.';
                        if (upperCount < minUpper) return 'Mật khẩu phải chứa ít nhất ' + minUpper + ' chữ hoa.';
                        if (numberCount < minNumber) return 'Mật khẩu phải chứa ít nhất ' + minNumber + ' chữ số.';
                        if (specialCount < minSpecialChar) return 'Mật khẩu phải chứa ít nhất ' + minSpecialChar + ' ký tự đặc biệt.';

                        return null; // Mật khẩu hợp lệ
                    }

                    // Kiểm tra mật khẩu
                    const passwordError = validatePassword(password);
                    if (passwordError) {
                        $('#passwordError').text(passwordError).show();
                        return;
                    } else {
                        // Xóa thông báo lỗi nếu mật khẩu hợp lệ
                        $('#passwordError').text('').hide();
                    }
                }
                // Tạo đối tượng FormData để gửi cả file và dữ liệu text
                const formData = new FormData();
                formData.append('Name', name);
                formData.append('Email', email);
                formData.append('Password', password);
                formData.append('Address', address);
                formData.append('Phone', phone);
                formData.append('Gender', gender);
                if (imageFile) {
                    formData.append('imageFile', imageFile);
                }

                $.ajax({
                    url: 'https://localhost:7132/User/CreateUser',
                    type: 'POST',
                    contentType: 'application/json',
                    data: formData,
                    processData: false,  // Không tự động chuyển đổi dữ liệu
                    contentType: false,  // Không thiết lập content type (FormData sẽ tự động thiết lập)
                    success: function (data) {                     
                        console.log('Thêm người dùng thành công:', data);
                        alert('Thêm thành công');
                        window.location.reload();
                    },
                    error: function (xhr, status, error) {
                        console.error('Lỗi khi thêm người dùng:', error);
                        alert('Lỗi khi thêm người dùng');
                    }
                });
            }
            function updateUser() {
                const name = $('#eIName').val().trim();
                const password = $('#eIPass').val().trim();
                const email = $('#eIEmail').val().trim();
                const phone = $('#eIPhone').val().trim();
                const address = $('#eIAddress').val().trim();
                const imageFile = $('#imagePath')[0].files[0];
                const gender = $('#gender-male').is(':checked') ? true : false;

                if (settingValues.length === 0) {
                    alert('Chưa tải cấu hình hệ thống.');
                    return;
                }

                const checkPassword = settingValues[0] === 'True'; // `enablesyntaxchecking`
                const minLength = parseInt(settingValues[1], 10); // `minimumlength`
                const minLower = parseInt(settingValues[2], 10);  // `minimumlowercase`
                const minUpper = parseInt(settingValues[3], 10);  // `minimumuppercase`
                const minNumber = parseInt(settingValues[4], 10); // `minimumnumbers`
                const minSpecialChar = parseInt(settingValues[5], 10); // `minimumsymbols`

                if (checkPassword) {
                    function validatePassword(password) {
                        let lowerCount = 0;
                        let upperCount = 0;
                        let numberCount = 0;
                        let specialCount = 0;

                        for (let char of password) {
                            if (/[a-z]/.test(char)) lowerCount++;
                            else if (/[A-Z]/.test(char)) upperCount++;
                            else if (/[0-9]/.test(char)) numberCount++;
                            else if (/[^a-zA-Z0-9]/.test(char)) specialCount++;
                        }

                        if (password.length < minLength) return 'Mật khẩu phải dài ít nhất ' + minLength + ' ký tự.';
                        if (lowerCount < minLower) return 'Mật khẩu phải chứa ít nhất ' + minLower + ' chữ thường.';
                        if (upperCount < minUpper) return 'Mật khẩu phải chứa ít nhất ' + minUpper + ' chữ hoa.';
                        if (numberCount < minNumber) return 'Mật khẩu phải chứa ít nhất ' + minNumber + ' chữ số.';
                        if (specialCount < minSpecialChar) return 'Mật khẩu phải chứa ít nhất ' + minSpecialChar + ' ký tự đặc biệt.';

                        return null; // Mật khẩu hợp lệ
                    }

                    const passwordError = validatePassword(password);
                    if (passwordError) {
                        $('#passwordError').text(passwordError).show();
                        return;
                    } else {
                        // Xóa thông báo lỗi nếu mật khẩu hợp lệ
                        $('#passwordError').text('').hide();
                    }
                }
                const formData = new FormData();
                formData.append('Id', idUser);
                formData.append('Name', name);
                formData.append('Email', email);
                formData.append('Password', password);
                formData.append('Address', address);
                formData.append('Phone', phone);
                formData.append('Gender', gender);
                if (imageFile) {
                    formData.append('imageFile', imageFile);
                }

                $.ajax({
                    url: 'https://localhost:7132/User/UpdateUser',
                    type: 'POST',
                    contentType: 'application/json',
                    data: formData,
                    processData: false,  
                    contentType: false,  
                    success: function (data) {
                        console.log('Sửa người dùng thành công:', data);
                        alert('Sửa thành công');
                        window.location.reload();
                    },
                    error: function (xhr, status, error) {
                        console.error('Lỗi khi Sửa người dùng:', error);
                        alert('Lỗi khi Sửa người dùng');
                    }
                });
            }
        });
        // Xử lý sự kiện khi nhấp vào nút Xóa
        $('#userTable').on('click', '.delete-btn', (event) => {
            var id = $(event.currentTarget).data('id');
            if (confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
                $.ajax({
                    url: "https://localhost:7132/User/DeleteUser" + "?id=" + id,
                    type: 'DELETE',
                    success: (result) => {
                        alert("Người dùng đã được xóa");
                        window.location.reload();
                    },
                    error: (xhr, status, error) => {
                        console.error("Xóa người dùng không thành công:", error);
                        alert("Có lỗi xảy ra khi xóa người dùng");
                    }
                });
            }
        });
        //Xử lý các sự kiện import excel
        document.getElementById('btn-hdimport').addEventListener('click', function () {
            // Tạo dữ liệu mẫu cho file Excel
            const wsData = [
                ['Họ Và Tên', 'Email', 'Mật Khẩu', 'Giới Tính', 'Địa Chỉ', 'Số Điện thoại'],
                ['', '', '', '', '', '']
            ];

            // Tạo worksheet từ dữ liệu
            const ws = XLSX.utils.aoa_to_sheet(wsData);

            // Tạo workbook và thêm worksheet vào workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            // Tạo file Excel và tải về
            XLSX.writeFile(wb, 'mau_file.xlsx');
        });
        document.getElementById('btn-import').addEventListener('click', function () {
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];

            if (!file) {
                alert('Vui lòng chọn file Excel.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                // Xóa header và chuyển đổi dữ liệu
                jsonData.shift(); // Xóa header
                const users = jsonData.map(row => ({
                    Name: row[0],
                    Email: row[1],
                    Password: row[2],
                    Gender: row[3],
                    Address: row[4],
                    Phone: row[5]
                }));

                // Gửi từng bản ghi đến API
                users.forEach(user => {
                    createUsers(user);
                });
            };

            reader.readAsArrayBuffer(file);
        });
        function createUsers(user) {
            const formData = new FormData();
            formData.append('Name', user.Name);
            formData.append('Email', user.Email);
            formData.append('Password', user.Password);
            formData.append('Address', user.Address);
            formData.append('Phone', user.Phone.toString());
            formData.append('Gender', user.Gender == "Nam" ? true : false);

            $.ajax({
                url: 'https://localhost:7132/User/CreateUser',
                type: 'POST',
                contentType: 'application/json',
                data: formData,
                processData: false,
                contentType: false,  
                success: function (data) {
                    console.log('Thêm người dùng thành công:', data);
                    window.location.reload();
                },
                error: function (xhr, status, error) {
                    console.error('Lỗi khi thêm người dùng:', xhr.responseText);
                    alert('Lỗi khi thêm người dùng: ' + xhr.responseText);
                }
            });
        }
    }
}
$('#gender-male').on('change', function () {
    if ($(this).is(':checked') === true) {
        $('#gender-female').prop('checked', false);
    }
});
$('#gender-female').on('change', function () {
    if ($(this).is(':checked') === true) {
        $('#gender-male').prop('checked', false);
    }
});
$(document).ready(function () {
    const myComponent = new MyComponent();
    myComponent.init();
});