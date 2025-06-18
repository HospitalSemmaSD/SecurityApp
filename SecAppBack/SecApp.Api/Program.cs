
using Microsoft.Extensions.FileProviders;
using Microsoft.EntityFrameworkCore;
using SecApp.Api;
using SecApp.Api.Interfaces;
using SecApp.Api.Models;
using SecApp.Api.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .WithExposedHeaders("TotalCount"));   
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddDbContext<SecurityDBContext>(options => options.UseSqlServer("name=DefaultConnection"));


builder.Services.AddScoped<ICRUDRepository<Agent>, AgentRepository>();
builder.Services.AddScoped<ICRUDRepository<Institution>, InstitutionRepository>();
builder.Services.AddTransient<IFileSaver, LocalFileSaver>();
builder.Services.AddHttpContextAccessor();

builder.Services.AddOutputCache(options =>
{
    options.DefaultExpirationTimeSpan = TimeSpan.FromMinutes(3);
});

//var allowedHosts = builder.Configuration.GetValue<string>("AllowedHosts")!.Split(",");

var app = builder.Build();

//app.UseStaticFiles();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
        RequestPath = ""
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAllOrigins");
app.UseOutputCache();
app.UseAuthorization();
app.MapControllers();

app.Run();
