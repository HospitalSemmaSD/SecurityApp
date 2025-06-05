using SecApp.Api.Interfaces;

namespace SecApp.Api.Repositories
{
    public class LocalFileSaver : IFileSaver
    {
        private readonly IWebHostEnvironment env;
        private readonly IHttpContextAccessor httpContextAccessor;

        public LocalFileSaver(IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor )
        {
            this.env = env;
            this.httpContextAccessor = httpContextAccessor;
        }
        public Task DeleteFile(string? path, string folderPath)
        {
            if (string.IsNullOrEmpty(path)) return Task.CompletedTask;
            var fileName = Path.GetFileName(path);
            var fullPath = Path.Combine(env.WebRootPath, folderPath, fileName);
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
            var folder = Path.Combine(env.WebRootPath, folderPath);
            if (!Directory.Exists(folder)) 
            {
                Directory.CreateDirectory(folder);
            }
            string filePath = Path.Combine(folder, fileName);
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                var content = ms.ToArray();
                await File.WriteAllBytesAsync(filePath, content);

            }
            var publicUrl = $"/agents/{fileName}";
            //var request = httpContextAccessor.HttpContext!.Request!;
            //var url = $"{request.Scheme}://{request.Host}";
            //var imageUrl = Path.Combine(url, filePath).Replace("\\","/");
            return publicUrl;

        }
    }

}
