namespace BackEnd.DataDto
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool Gender { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Image { get; set; }
    }
}
