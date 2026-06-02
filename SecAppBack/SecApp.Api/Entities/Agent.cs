
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecApp.Api.Entities
{
    public class Agent
    {
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public required string Name { get; set; } = string.Empty;
        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        public string FullName => $"{Name} {LastName}";
        [Required]
        [StringLength(1)]
        public string Gender { get; set; } = string.Empty; 
        [Required]
        [StringLength(10)]
        public string Phone { get; set; } = string.Empty;
        [Required]
        [StringLength(11)]
        public string Identification { get; set; } = string.Empty;
        public string? Email { get; set; }
        [Required]
        public DateTime BirthDay { get; set; }
        [Required]
        public bool Status { get; set; }
        [Unicode(false)]
        public string? Photo { get; set; }
        public string? Address { get; set; }
        [Required]
        public string AgentCode { get; set; } = string.Empty;
        public int RankId { get; set; }
        public Rank? Rank { get; set; }

        public string? WorkDays { get; set; } 
        public int? DefaultShiftId { get; set; }
        [ForeignKey("DefaultShiftId")]
        public Shift? DefaultShift { get; set; }

        public int? DefaultDutyPostId { get; set; }
        [ForeignKey("DefaultDutyPostId")]
        public DutyPost? DefaultDutyPost { get; set; }
    }
}
