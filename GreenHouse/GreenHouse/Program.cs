using MongoDB.Driver;
using GreenHouse.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var mongoClient = new MongoClient(builder.Configuration["ConnectionStrings:MongoDB"]);
var database = mongoClient.GetDatabase("GreenHouseDB");

builder.Services.AddSingleton<MqttService>();

builder.Services.AddSingleton<IMongoDatabase>(database);
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<TokenService>();
builder.Services.AddSingleton<WebSocketService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseWebSockets();

app.MapControllers();

var mqttService = app.Services.GetRequiredService<MqttService>();
await mqttService.ConnectAsync(builder.Configuration["MqttBrokerAddress"]);

app.Run();
