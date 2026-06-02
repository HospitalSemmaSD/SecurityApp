namespace SecApp.Api.Services.Interfaces
{
    public interface IAuditService
    {
        Task LogActionAsync(string action, string entityType, string? entityId = null, string? details = null);
    }
}
