using GreenHouse.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

namespace GreenHouse.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SensorDataController : ControllerBase
{
    private readonly IMongoCollection<SensorData> _sensorDataCollection;

    public SensorDataController(IMongoDatabase database)
    {
        _sensorDataCollection = database.GetCollection<SensorData>("SensorData");
    }

    [HttpGet]
    public async Task<IActionResult> Get(
                                        [FromQuery] string? sensorType, 
                                        [FromQuery] DateTime? start, 
                                        [FromQuery] DateTime? end, 
                                        [FromQuery] int? sensorId,
                                        [FromQuery] string? sortBy = "Timestamp",
                                        [FromQuery] string? sortOrder =  "asc"
    )
    {
        var filter = Builders<SensorData>.Filter.Empty;

        if (!string.IsNullOrEmpty(sensorType))
            filter &= Builders<SensorData>.Filter.Eq(x => x.SensorType, sensorType);

        if (start.HasValue)
            filter &= Builders<SensorData>.Filter.Gte(x => x.Timestamp, start.Value);

        if (end.HasValue)
            filter &= Builders<SensorData>.Filter.Lte(x => x.Timestamp, end.Value);

        if (sensorId.HasValue)
            filter &= Builders<SensorData>.Filter.Eq(x => x.SensorID, sensorId.Value);

        var sort = GetSort(sortBy, sortOrder);
        var result = await _sensorDataCollection.Find(filter).Sort(sort).ToListAsync();

        return Ok(result);
    }

    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportCsv(
                                                [FromQuery] string? sensorType, 
                                                [FromQuery] DateTime? start, 
                                                [FromQuery] DateTime? end, 
                                                [FromQuery] int? sensorId,
                                                [FromQuery] string? sortBy = "Timestamp",
                                                [FromQuery] string? sortOrder =  "asc"
                                                
    )
    {
        var filter = Builders<SensorData>.Filter.Empty;

        if (!string.IsNullOrEmpty(sensorType))
            filter &= Builders<SensorData>.Filter.Eq(x => x.SensorType, sensorType);

        if (start.HasValue)
            filter &= Builders<SensorData>.Filter.Gte(x => x.Timestamp, start.Value);

        if (end.HasValue)
            filter &= Builders<SensorData>.Filter.Lte(x => x.Timestamp, end.Value);

        if (sensorId.HasValue)
            filter &= Builders<SensorData>.Filter.Eq(x => x.SensorID, sensorId.Value);

        var sort = GetSort(sortBy, sortOrder);
        var result = await _sensorDataCollection.Find(filter).Sort(sort).ToListAsync();

        var csv = "SensorType,Value,Timestamp\n" + string.Join("\n", result.Select(d => $"{d.SensorType},{d.Value},{d.Timestamp}"));

        return File(System.Text.Encoding.UTF8.GetBytes(csv), "text/csv", "sensor_data.csv");
    }

    [HttpGet("export/json")]
    public async Task<IActionResult> ExportJson(
                                                [FromQuery] string? sensorType, 
                                                [FromQuery] DateTime? start, 
                                                [FromQuery] DateTime? end, 
                                                [FromQuery] int? sensorId,
                                                [FromQuery] string? sortBy = "Timestamp",
                                                [FromQuery] string? sortOrder =  "asc"
    )
    {
        var filter = Builders<SensorData>.Filter.Empty;

        if (!string.IsNullOrEmpty(sensorType))
            filter &= Builders<SensorData>.Filter.Eq(x => x.SensorType, sensorType);

        if (start.HasValue)
            filter &= Builders<SensorData>.Filter.Gte(x => x.Timestamp, start.Value);

        if (end.HasValue)
            filter &= Builders<SensorData>.Filter.Lte(x => x.Timestamp, end.Value);

        if (sensorId.HasValue)
            filter &= Builders<SensorData>.Filter.Eq(x => x.SensorID, sensorId.Value);

        var sort = GetSort(sortBy, sortOrder);
        var result = await _sensorDataCollection.Find(filter).Sort(sort).ToListAsync();

        return Ok(result);
    }

    [HttpGet("balance")]
    public async Task<IActionResult> GetAccountBalance()
    {
        var sensorMessages = new List<object>();

        foreach (var entry in WalletAddress.AddressMap)
        {
            var sensorKey = entry.Key;
            var sensorTyped = sensorKey.Item1;
            var sensorId = sensorKey.Item2;
            var lastValue = entry.Value;

            var sensorMessage = new
            {
                sensorType = sensorTyped,
                sensorID = sensorId,
                balance = await TokenService.GetTokenBalanceOnAccount(lastValue),
            };

            sensorMessages.Add(sensorMessage);
        }

        string jsonString = JsonSerializer.Serialize(sensorMessages);

        return Ok(jsonString);
    }

    private static SortDefinition<SensorData> GetSort(string? sortBy, string? sortOrder)
{
    var builder = Builders<SensorData>.Sort;
    var isDescending = string.Equals(sortOrder, "desc", StringComparison.OrdinalIgnoreCase);

    return sortBy?.ToLower() switch
    {
        "sensortype" => isDescending ? builder.Descending(x => x.SensorType) : builder.Ascending(x => x.SensorType),
        "value" => isDescending ? builder.Descending(x => x.Value) : builder.Ascending(x => x.Value),
        "timestamp" => isDescending ? builder.Descending(x => x.Timestamp) : builder.Ascending(x => x.Timestamp),
        "sensorid" => isDescending ? builder.Descending(x => x.SensorID) : builder.Ascending(x => x.SensorID),
        _ => builder.Ascending(x => x.Timestamp),
    };
}
}
