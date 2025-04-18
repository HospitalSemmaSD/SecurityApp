﻿
namespace SecApp.Model
{
    public class Agent
    {
        public int AgentId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Identification { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime BirthDay { get; set; }
        public bool Status { get; set; }
        public string Photo { get; set; } = string.Empty;
        public int RangeId { get; set; }
    }
}
