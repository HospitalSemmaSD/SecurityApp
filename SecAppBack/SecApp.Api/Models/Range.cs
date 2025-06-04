using System.ComponentModel.DataAnnotations;

namespace SecApp.Api.Models
{
    public class Range
    {
        [Required]
        public int RangeId { get; set; }

        [Required(ErrorMessage = "El campo {0} es requerido")]
        public required string Name { get; set; } = string.Empty;
        
        // Navigation property for related agents
        public ICollection<Agent>? Agents { get; set; }
        }
}
