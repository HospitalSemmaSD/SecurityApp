using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecApp.Api.Entities
{
    public class DutyAssignment
    {
        public int Id { get; set; }
        [Required]
        public DateTime WeekStartDate { get; set; }
        
        public int AgentId { get; set; }
        [ForeignKey("AgentId")]
        public Agent? Agent { get; set; }

        public int ShiftId { get; set; }
        [ForeignKey("ShiftId")]
        public Shift? Shift { get; set; }

        public int DutyPostId { get; set; }
        [ForeignKey("DutyPostId")]
        public DutyPost? DutyPost { get; set; }
    }
}
