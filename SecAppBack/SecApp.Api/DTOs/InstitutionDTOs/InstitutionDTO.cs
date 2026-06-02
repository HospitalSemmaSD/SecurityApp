using System.ComponentModel.DataAnnotations;

namespace SecApp.Api.DTOs.InstitutionDTOs
{
    public class InstitutionDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }

    }

    public class InstitutionCreateDTO
    {
        [Required]
        [StringLength(100, ErrorMessage = "Nombre de la institución es requerido")]
        public required string Name { get; set; }
    }
}
