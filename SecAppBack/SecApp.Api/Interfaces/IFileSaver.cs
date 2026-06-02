namespace SecApp.Api.Interfaces
{
    public interface IFileSaver
    {
        Task<string> SaveFile(string folderPath, IFormFile file);
        Task DeleteFile(string? path, string folderPath);
        async Task<string> Update(string? path, string folderPath, IFormFile file)
        {
            await DeleteFile(path, folderPath);
            return await SaveFile(folderPath, file);
        }
    }
}
