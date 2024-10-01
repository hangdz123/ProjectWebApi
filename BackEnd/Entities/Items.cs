namespace BackEnd.Entities
{
    public class Items
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ItemsTypeId { get; set; } //Id loại sản phẩm 
        public ItemsType? ItemsType { get; set; }
        public int ManufacturerId { get; set; } //Id hãng sản xuất - xuất xứ
        public Manufacturer? Manufacturer { get; set; }
        public int Quantity {  get; set; } //Số lượng
        public DateTime DateUpdate { get; set; } //Ngày nhập hàng gần nhất 
        public float PriceImport { get; set; } //Giá nhập
        public float Price {  get; set; } //Giá bán
        public float? PromotionalPrice { get; set; } //Giá khuyến mãi manufacturer
        public string Image {  get; set; }
    }
}
