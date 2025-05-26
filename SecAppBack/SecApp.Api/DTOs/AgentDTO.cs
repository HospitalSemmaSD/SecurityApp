using System.ComponentModel.DataAnnotations;

namespace SecApp.Api.DTOs
{
    public class AgentDTO
    {

        public int AgentId { get; set; }
        
        public required string Name { get; set; } = string.Empty;
        
        public string LastName { get; set; } = string.Empty;
      
        public string Phone { get; set; } = string.Empty;
        
        public string Identification { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
  
        public DateTime BirthDay { get; set; }
     
        public bool Status { get; set; }
        public string Photo { get; set; } = string.Empty;
       
        public int AgentCode { get; set; }
        public int RangeId { get; set; }
    }
}
