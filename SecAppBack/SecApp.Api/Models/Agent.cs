
using System.ComponentModel.DataAnnotations;

namespace SecApp.Api.Models
{
    public class Agent
    {
        public int AgentId { get; set; }
        [Required(ErrorMessage ="Field {0} is required")]
        [StringLength(50, ErrorMessage ="The field {0} must have {1} character or less")]
        public required string Name { get; set; } = string.Empty;
        [Required]
        [StringLength(50, ErrorMessage = "The field {0} must have {1} character or less")]
        public string LastName { get; set; } = string.Empty;
        [Required]
        [StringLength(10, ErrorMessage ="Invalid {0}: must have {1} digits")]
        public string Phone { get; set; } = string.Empty;
        [Required]
        [Range(18,65)]
        [StringLength(11, ErrorMessage = "The field {0} must have {1} character or less")]

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
