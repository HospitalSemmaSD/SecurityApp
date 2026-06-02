using SecApp.Api.Interfaces;

namespace SecApp.Api.Repositories
{
    public class LocalFileSaver : IFileSaver
    {
        private readonly IWebHostEnvironment _env;

        public LocalFileSaver(IWebHostEnvironment env)
        {
            _env = env;
        }

        public Task DeleteFile(string? path, string folderPath)
        {
            if (string.IsNullOrEmpty(path)) return Task.CompletedTask;

            var fileName = Path.GetFileName(path);
            var fullPath = Path.Combine(_env.WebRootPath, folderPath, fileName);

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }

            return Task.CompletedTask;
        }

        public async Task<string> SaveFile(string folderPath, IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{extension}";
            var folder = Path.Combine(_env.WebRootPath, folderPath);

            if (!Directory.Exists(folder))
            {
                Directory.CreateDirectory(folder);
            }

            string filePath = Path.Combine(folder, fileName);

            // Optimización: Guardado directo al disco sin saturar la RAM
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Retorna ruta relativa estandarizada para BD (ej. "agents/234234-23423.jpg")
            return Path.Combine(folderPath, fileName).Replace("\\", "/");
        }

        public async Task<string> Update(string? currentRoute, string folderPath, IFormFile file)
        {
            await DeleteFile(currentRoute, folderPath);
            return await SaveFile(folderPath, file);
        }
    }
}