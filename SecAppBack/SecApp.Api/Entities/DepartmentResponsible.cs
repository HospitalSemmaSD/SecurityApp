using System.ComponentModel.DataAnnotations;

namespace SecApp.Api.Entities
{
    public class DepartmentResponsible
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public required string FullName { get; set; }
        
        [Required]
        [StringLength(50)]
        public required string Rank { get; set; }
        
        [Required]
        [StringLength(50)]
        public required string Position { get; set; } // "Encargado" o "Sub-Encargado"
        
        public bool IsActive { get; set; } = true;
    }
}
