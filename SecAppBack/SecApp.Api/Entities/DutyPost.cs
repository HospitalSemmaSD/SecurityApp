using System.ComponentModel.DataAnnotations;

namespace SecApp.Api.Entities
{
    public class DutyPost
    {
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public required string Name { get; set; }
    }
}
