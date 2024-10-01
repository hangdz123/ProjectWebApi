var idItem;
var idItemType;//id của loại sản phẩm
var idItemManu;//id của hãng sản phẩm
class MyComponent {
    constructor() {
        this.$el = null;
        this.table_direct = null;
    }

    init() {
        this.$el = $("#boxContainer");

        this._activeTab();
        this._initDataTable();
        this._eventCRUD();
    }
    _activeTab() {
        $("#nav-option .nav-link").removeClass("active");
        $("#box-link").addClass("active");
    }
    _initDataTable() {
        var url = "https://localhost:7132/Items/GetAllItem";

        $.ajax({
            url: url,
            type: 'GET',
            success: (response) => {
                console.log(response);
                var ds = response.result;
                this.table_direct = new DataTable('#itemTable', {
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
                        { "data": "name" }, // Tên sản phẩm
                        { "data": "quantity" }, // Số lượng
                        { "data": "dateUpdate" }, // Thời gian cập nhật
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
            }
        });
    }
    _eventCRUD() {
        loadItemType();
        loadItemManu();
        function loadItemType() {
            $.ajax({
                url: "https://localhost:7132/Items/GetAllItemType",  
                type: "GET",
                dataType: "json",
                success: function (response) {
                    // Kiểm tra nếu response có thuộc tính result và chứa dữ liệu
                    if (response.result && response.result.length > 0) {
                        var select = $('#TypeItem');

                        // Lặp qua từng bản ghi trong result và tạo các option
                        response.result.forEach(function (item) {
                            var option = $('<option>', {
                                value: item.id,
                                text: item.name
                            });

                            // Thêm option vào select
                            select.append(option);
                        });
                    }
                },
                error: function (error) {
                    console.error("Lỗi khi lấy dữ liệu từ API:", error);
                }
            });
        }

        function loadItemManu() {
            $.ajax({
                url: "https://localhost:7132/Items/GetAllItemManu",
                type: "GET",
                dataType: "json",
                success: function (response) {
                    // Kiểm tra nếu response có thuộc tính result và chứa dữ liệu
                    if (response.result && response.result.length > 0) {
                        var select = $('#ManuItem');

                        // Lặp qua từng bản ghi trong result và tạo các option
                        response.result.forEach(function (item) {
                            var option = $('<option>', {
                                value: item.id,
                                text: item.name
                            });

                            // Thêm option vào select
                            select.append(option);                           
                        });
                    }
                },
                error: function (error) {
                    console.error("Lỗi khi lấy dữ liệu từ API:", error);
                }
            });
        }
        // Xử lý sự kiện khi nhấp vào nút Sửa chuyển hướng vào giao diện thêm và sửa theo điều kiện
        $('#itemTable').on('click', '.edit-btn', function () {

            var createItem = document.querySelector('[data-bs-target="#createItem"]');
            createItem.click();

            var id = $(this).data('id');

            // Cập nhật tiêu đề và văn bản nút của modal cho chế độ chỉnh sửa
            $('#createItem .modal-title').text('Cập Nhật Thông Tin Sản Phẩm');
            $('#createItem .btn-modal-confirm').text('Cập Nhật');

            getItemEdit(id);

            updateModalForEdit();
        });
        function updateModalForEdit() {
            $('#createItem #itemForm').append(`
                <div class="mb-4">
                    <label for="currentImage">Ảnh hiện tại:</label>
                    <img id="currentImage" src="" alt="Ảnh hiện tại" style="max-width: 200px; height: 100px;"><br>
                </div>
            `);
        }
        // Khi modal bị đóng, quay về trạng thái mặc định
        $('#createItem').on('hidden.bs.modal', function () {
            $('#createItem .modal-title').text('Thêm Mới Sản Phẩm');
            $('#createItem .btn-modal-confirm').text('Thêm');
            idItem = null;
        });
        $('.btn-modal-close').on('click', function () {
            $('#createItem .modal-title').text('Thêm Mới Sản Phẩm');
            $('#createItem .btn-modal-confirm').text('Thêm');
            idItem = null;
            window.location.reload();
        });
        //Lấy dữ liệu của bản ghi vừa ấn nút sửa đổ vào các ô input 
        function getItemEdit(id) {
            var url = "https://localhost:7132/Items/GetItemById" + '?Id=' + id;
            $.ajax({
                url: url,
                type: 'GET',
                success: (data) => {
                    var info = data;
                    idItem = data.id;
                    $('#NameItem').val(data.name);
                    $('#TypeItem').val(data.itemsTypeId);
                    $('#ManuItem').val(data.manufacturerId);
                    $('#QuantityItem').val(data.quantity);
                    $('#PriceImportItem').val(data.priceImport);
                    $('#Price').val(data.price);
                    $('#PriceKM').val(data.promotionalPrice);
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
        $('.btn-create-item').on('click', function () {
            if (idItem != null) {
                updateItem();
            }
            else {
                createItem();
            }
            function createItem() {
                const name = $('#NameItem').val().trim();
                const itemsType = $('#TypeItem').val().trim();
                const manuItem = $('#ManuItem').val().trim();
                const quantityItem = $('#QuantityItem').val().trim();
                const priceImportItem = $('#PriceImportItem').val().trim();
                const price = $('#Price').val().trim();
                const priceKM = $('#PriceKM').val().trim();
                const imageFile = $('#imageItem')[0].files[0];

                // Tạo đối tượng FormData để gửi cả file và dữ liệu text
                const formData = new FormData();
                formData.append('Name', name);
                formData.append('ItemsTypeId', itemsType);
                formData.append('ManufacturerId', manuItem);
                formData.append('Quantity', quantityItem);
                formData.append('PriceImport', priceImportItem);
                formData.append('Price', price);
                formData.append('PromotionalPrice', priceKM);
                if (imageFile) {
                    formData.append('imageFile', imageFile);
                }

                $.ajax({
                    url: 'https://localhost:7132/Items/CreateItem',
                    type: 'POST',
                    contentType: 'application/json',
                    data: formData,
                    processData: false,  // Không tự động chuyển đổi dữ liệu
                    contentType: false,  // Không thiết lập content type (FormData sẽ tự động thiết lập)
                    success: function (data) {
                        console.log('Thêm thành công:', data);
                        alert('Thêm thành công');
                        window.location.reload();
                    },
                    error: function (xhr, status, error) {
                        console.error('Lỗi khi thêm:', error);
                        alert('Lỗi khi thêm sản phẩm');
                    }
                });
            }
            function updateItem() {
                const name = $('#NameItem').val().trim();
                const itemsType = $('#TypeItem').val().trim();
                const manuItem = $('#ManuItem').val().trim();
                const quantityItem = $('#QuantityItem').val().trim();
                const priceImportItem = $('#PriceImportItem').val().trim();
                const price = $('#Price').val().trim();
                const priceKM = $('#PriceKM').val().trim();
                const imageFile = $('#imageItem')[0].files[0];
               
                const formData = new FormData();
                formData.append('Name', name);
                formData.append('ItemsTypeId', itemsType);
                formData.append('ManufacturerId', manuItem);
                formData.append('Quantity', quantityItem);
                formData.append('PriceImport', priceImportItem);
                formData.append('Price', price);
                formData.append('PromotionalPrice', priceKM);
                if (imageFile) {
                    formData.append('imageFile', imageFile);
                }

                $.ajax({
                    url: 'https://localhost:7132/Items/UpdateItem',
                    type: 'POST',
                    contentType: 'application/json',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        console.log('Cập nhật thành công:', data);
                        alert('Cập nhật thành công');
                        window.location.reload();
                    },
                    error: function (xhr, status, error) {
                        console.error('Lỗi khi Sửa:', error);
                        alert('Lỗi cập nhật sản phẩm');
                    }
                });
            }
        });
        // Xử lý sự kiện khi nhấp vào nút Xóa
        $('#itemTable').on('click', '.delete-btn', (event) => {
            var id = $(event.currentTarget).data('id');
            if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
                $.ajax({
                    url: "https://localhost:7132/Items/DeleteItem" + "?id=" + id,
                    type: 'DELETE',
                    success: (result) => {
                        alert("Sản phẩm đã được xóa");
                        window.location.reload();
                    },
                    error: (xhr, status, error) => {
                        console.error("Xóa không thành công:", error);
                        alert("Có lỗi xảy ra khi xóa");
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
$(document).ready(function () {
    const myComponent = new MyComponent();
    myComponent.init();
});