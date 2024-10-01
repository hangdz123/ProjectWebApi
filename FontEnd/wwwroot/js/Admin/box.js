
class MyComponent {
    constructor() {
        this.$el = null;
        this.table_direct = null;
    }

    init() {
        this.$el = $("#boxContainer");

        this._activeTab();
        this._initDataTable();
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

}
$(document).ready(function () {
    const myComponent = new MyComponent();
    myComponent.init();
});