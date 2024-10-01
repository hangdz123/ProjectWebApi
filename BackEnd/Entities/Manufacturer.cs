namespace BackEnd.Entities
{
    public class Manufacturer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<Items>? Items { get; set; }
    }
}
