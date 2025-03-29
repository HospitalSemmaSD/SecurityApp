using MySql.Data.MySqlClient;
using SecApp.Data;
using SecApp.Data.Interfaces;
using SecApp.Data.Repositories;
using SecApp.Model;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var mySqlConnection = new MySQLConfiguration(builder.Configuration.GetConnectionString("SecAppconnection"));
builder.Services.AddSingleton(mySqlConnection);

//DEBERIA DE SER DE ESTA FORMA... QUE CREE UNA CONNECION POR CADA SOLICITUD
//builder.Services.AddSingleton(new MySqlConnection(builder.Configuration.GetConnectionString("SecAppconnection")));

builder.Services.AddScoped<ICRUDtRepository<Agent>, AgentRepository>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(options => {
    options.AllowAnyOrigin();
});
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
