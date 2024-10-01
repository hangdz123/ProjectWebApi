namespace BackEnd.Entities
{
    public class ItemsType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<Items>? Items { get; set; }
    }
}
