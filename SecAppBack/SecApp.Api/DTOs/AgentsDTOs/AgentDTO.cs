using System.ComponentModel.DataAnnotations;

namespace SecApp.Api.DTOs.AgentDTOs
{
    public class AgentDTO
    {

        public int Id { get; set; }

        public required string Name { get; set; } = string.Empty;

        public required string LastName { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string Gender { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Identification { get; set; } = string.Empty;
        public string? Email { get; set; }

        public DateTime BirthDay { get; set; }

        public bool Status { get; set; }
        public string? Photo { get; set; }
        public string? Address { get; set; }

        public string AgentCode { get; set; } = string.Empty;
        public int RankId { get; set; }
        public int InstitutionId { get; set; }

        public string RankName { get; set; } = string.Empty;
        public string InstitutionName { get; set; } = string.Empty;

        public string? WorkDays { get; set; }
        public int? DefaultShiftId { get; set; }
        public int? DefaultDutyPostId { get; set; }
    }

    public class AgentCreateDTO
    {

        [Required]
        [MinLength(3)]
        [StringLength(50)]
        public required string Name { get; set; } = string.Empty;
        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;
        [Required]
        [StringLength(1)]
        public string Gender { get; set; } = string.Empty; 
        [Required]
        [StringLength(10)]
        public string Phone { get; set; } = string.Empty;
        [Required]
        [StringLength(11)]
        public string Identification { get; set; } = string.Empty;
        public string FullName => $"{Name} {LastName}";

        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        public DateTime BirthDay { get; set; }
        [Required]
        public bool Status { get; set; }
        public string? Address { get; set; }
        public IFormFile? Photo { get; set; }
        [Required]
        public string AgentCode { get; set; } = string.Empty;
        public int RankId { get; set; }

        public string? WorkDays { get; set; }
        public int? DefaultShiftId { get; set; }
        public int? DefaultDutyPostId { get; set; }
    }

}
