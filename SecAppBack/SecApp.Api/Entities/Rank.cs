using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecApp.Api.Entities
{
    public class Rank
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "El campo {0} es requerido")]
        public required string Name { get; set; } = string.Empty;

        public int InstitutionId { get; set; }

        [ForeignKey("InstitutionId")]
        public Institution? Institution { get; set; }

        public ICollection<Agent>? Agents { get; set; }
    }
}