
using System.ComponentModel.DataAnnotations;

namespace SecApp.Model
{
    public class Agent
    {
        public int AgentId { get; set; }
        [Required(ErrorMessage ="Field {0} is required")]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        [Required]
        [StringLength(10, ErrorMessage ="Invalid {0}: must have {1} digits")]
        public string Phone { get; set; } = string.Empty;
        [Required]
        [Range(18,65)]
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
