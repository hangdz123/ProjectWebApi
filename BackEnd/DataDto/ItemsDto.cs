using BackEnd.Entities;

namespace BackEnd.DataDto
{
    public class ItemsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ItemsTypeId { get; set; } //Id loại sản phẩm 
        public int ManufacturerId { get; set; } //Id hãng sản xuất - xuất xứ
        public int Quantity { get; set; } //Số lượng
        public DateTime DateUpdate { get; set; } //Ngày nhập hàng gần nhất 
        public float PriceImport { get; set; } //Giá nhập
        public float Price { get; set; } //Giá bán
        public float? PromotionalPrice { get; set; } //Giá khuyến mãi manufacturer
        public string Image { get; set; }
    }
}
