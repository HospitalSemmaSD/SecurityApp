using System.ComponentModel.DataAnnotations;

namespace SecApp.Api.Models
{
    public class Institution
    {
        public int InstitutionId { get; set; }
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(100, ErrorMessage = "El campo {0} debe tener {1} caracteres o menos")]
        public required string Name { get; set; } = string.Empty;
        public ICollection<Agent>? Agents { get; set; }

    }
}
