
using Microsoft.Extensions.FileProviders;
using Microsoft.EntityFrameworkCore;
using SecApp.Api;
using SecApp.Api.Interfaces;
using SecApp.Api.Entities;
using SecApp.Api.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SecApp.Api.Utilities;
using SecApp.Api.Context;
using SecApp.Api.Services.Interfaces;
using SecApp.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using SecApp.Api.Middlewares;
using SecApp.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);

// 1. CONFIGURACIÓN DE CORS (DEBE SER MUY ESPECÍFICO PARA SIGNALR)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.SetIsOriginAllowed(origin => true)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .WithExposedHeaders("TotalRecords"));
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(config =>
{
    config.AddProfile<AutoMapperProfiles>();
});
builder.Services.AddDbContext<SecurityDBContext>(options => options.UseSqlServer("name=DefaultConnection"));


builder.Services.AddScoped<IBaseRepository<Agent>, AgentRepository>();
builder.Services.AddScoped<IBaseRepository<Institution>, InstitutionRepository>();
builder.Services.AddScoped<IBaseRepository<Rank>, RankRepository>();
builder.Services.AddScoped<IBaseRepository<Shift>, BaseRepository<Shift>>();
builder.Services.AddScoped<IBaseRepository<DutyPost>, BaseRepository<DutyPost>>();
builder.Services.AddScoped<IBaseRepository<DutyAssignment>, BaseRepository<DutyAssignment>>();
builder.Services.AddScoped<IBaseRepository<DepartmentResponsible>, BaseRepository<DepartmentResponsible>>();
builder.Services.AddScoped<IBaseRepository<WeeklyRoster>, BaseRepository<WeeklyRoster>>();

builder.Services.AddScoped<IAgentService, AgentService>();
builder.Services.AddScoped<IInstitutionService, InstitutionService>();
builder.Services.AddScoped<IRankService, RankService>();
builder.Services.AddScoped<IUserManagementService, UserManagementService>();
builder.Services.AddScoped<IShiftService, ShiftService>();
builder.Services.AddScoped<IDutyPostService, DutyPostService>();
builder.Services.AddScoped<IDutyRosterService, DutyRosterService>();
builder.Services.AddScoped<IResponsibleService, ResponsibleService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddTransient<IFileSaver, LocalFileSaver>();
builder.Services.AddHttpContextAccessor();

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.Password.RequiredUniqueChars = 1;
})
    .AddEntityFrameworkStores<SecurityDBContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<UserManager<ApplicationUser>>();
builder.Services.AddScoped<SignInManager<ApplicationUser>>();
builder.Services.AddTransient<IUsersServices, UsersServices>();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.MapInboundClaims = false;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["jwtkey"]!)),
        ClockSkew = TimeSpan.Zero,

    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("isAdmin", policy => policy.RequireRole("Admin"));
});
builder.Services.AddOutputCache(options =>
{
    options.DefaultExpirationTimeSpan = TimeSpan.FromMinutes(3);
});

builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});


var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngular");

app.UseDefaultFiles();
app.UseStaticFiles();

var angularPath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot", "sec-app-front", "browser");
if (Directory.Exists(angularPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(angularPath),
        RequestPath = ""
    });
}

app.UseRouting();

app.UseOutputCache();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/notificationHub");

if (Directory.Exists(angularPath))
{
    app.MapFallbackToFile("index.html", new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(angularPath)
    });
}

app.Run();
