
class MyComponent {
    constructor() {

    }

    init() {
        this._loadDataSetting();
    }
    _loadDataSetting() {
        loadItemNew();
        function loadItemNew() {
            $.ajax({
                url: 'https://localhost:7132/Items/GetAllItem',
                method: 'GET',
                success: function (response) {
                    // Giả sử response có thuộc tính 'result' chứa mảng sản phẩm
                    let products = response.result.slice(0, 8); // Lấy 8 bản ghi mới nhất
                    let html = '';

                    products.forEach(function (product) {
                        html += `
                    <div class="col-sm-6 col-md-4 col-lg-3 fixed-size-box"> 
                        <div class="box">
                            <a href="">
                                <div class="img-box">
                                    <img src="/upload/${product.image}" >
                                </div>
                                <div class="detail-box">
                                    <h6>${product.name}</h6>
                                    <h6>
                                        Giá:
                                        <span>${product.price} đồng</span>
                                    </h6>
                                </div>
                                <div class="new">
                                    <span>New</span>
                                </div>
                            </a>
                        </div>
                    </div>`;
                    });

                    // Gắn HTML vào phần tử cha có id="product-list"
                    $('#product-list').html(html);
                },
                error: function (err) {
                    console.error('Error fetching products:', err);
                }
            });
        }
    }
}
$(document).ready(function () {
    const myComponent = new MyComponent();
    myComponent.init();
});