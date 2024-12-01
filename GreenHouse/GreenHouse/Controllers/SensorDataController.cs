using GreenHouse.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System;
using System.Linq;
using System.Threading.Tasks;

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
    public async Task<IActionResult> Get([FromQuery] string? sensorType, [FromQuery] DateTime? start, [FromQuery] DateTime? end, [FromQuery] int? sensorId)
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

        var result = await _sensorDataCollection.Find(filter).ToListAsync();

        return Ok(result);
    }

    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportCsv([FromQuery] string? sensorType, [FromQuery] DateTime? start, [FromQuery] DateTime? end, [FromQuery] int? sensorId)
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
        var result = await _sensorDataCollection.Find(filter).ToListAsync();

        var csv = "SensorType,Value,Timestamp\n" + string.Join("\n", result.Select(d => $"{d.SensorType},{d.Value},{d.Timestamp}"));

        return File(System.Text.Encoding.UTF8.GetBytes(csv), "text/csv", "sensor_data.csv");
    }

    [HttpGet("export/json")]
    public async Task<IActionResult> ExportJson([FromQuery] string? sensorType, [FromQuery] DateTime? start, [FromQuery] DateTime? end, [FromQuery] int? sensorId)
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

        var result = await _sensorDataCollection.Find(filter).ToListAsync();

        return Ok(result);
    }

    [HttpGet("balance")]
    public async Task<IActionResult> GetAccountBalance([FromQuery] string sensorType, [FromQuery] int sensorId)
    {
        if (!WalletAddress.AddressMap.ContainsKey(Tuple.Create(sensorType, sensorId)))
        {
            return NotFound($"No wallet address found for sensorType: {sensorType}, sensorId: {sensorId}");
        }
        var walletAddress = WalletAddress.AddressMap[Tuple.Create(sensorType, sensorId)];

        return Ok(await TokenService.GetTokenBalanceOnAccount(walletAddress));
    }
}
