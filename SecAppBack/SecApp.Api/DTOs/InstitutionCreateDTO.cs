using Microsoft.EntityFrameworkCore.Metadata;
using System.ComponentModel.DataAnnotations;

namespace SecApp.Api.DTOs
{
    public class InstitutionCreateDTO
    {
        [Required]
        [StringLength(100, ErrorMessage = "Nombre de la institución es requerido")]
        public required string  Name { get; set; }
    }
}
