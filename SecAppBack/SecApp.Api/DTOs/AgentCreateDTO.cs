using System.ComponentModel.DataAnnotations;

namespace SecApp.Api.DTOs
{
    public class AgentCreateDTO
    {
  
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(50, ErrorMessage = "El campo {0} debe tener {1} caracteres o menos")]
        public required string Name { get; set; } = string.Empty;
        [Required]
        [StringLength(50, ErrorMessage = "El campo {0} debe tener {1} caracteres o menos")]
        public string LastName { get; set; } = string.Empty;
        [Required]
        [StringLength(10, ErrorMessage = "Campo {0}: debe tener {1} digitos")]
        public string Phone { get; set; } = string.Empty;
        [Required]
        [StringLength(11, ErrorMessage = "El campo {0} debe tener {1} caracteres o menos")]
        public string Identification { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        [Required]
        public DateTime BirthDay { get; set; }
        [Required]
        public bool Status { get; set; }
        public string Photo { get; set; } = string.Empty;
        [Required]
        public int AgentCode { get; set; }
        public int RangeId { get; set; }

    }
}
