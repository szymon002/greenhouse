using MongoDB.Bson;
using System.Text.Json;


namespace GreenHouse;

public class SensorData
{
    public ObjectId Id { get; set; }
    public string SensorType { get; set; }
    public double Value { get; set; }
    public DateTime Timestamp { get; set; }
    public int SensorID { get; set; }

     public static SensorData FromJson(string json)
        {
            var jsonDoc = JsonDocument.Parse(json);
                var timestamp = jsonDoc.RootElement.GetProperty("Timestamp").GetDouble();
                var unixTime = (long)timestamp;
                var fractionalSeconds = timestamp - unixTime;
            var sensorData = new SensorData
            {
                SensorType = jsonDoc.RootElement.GetProperty("SensorType").GetString(),
                Value = jsonDoc.RootElement.GetProperty("Value").GetDouble(), 
                Timestamp = DateTimeOffset.FromUnixTimeSeconds(unixTime)
                    .AddMilliseconds(fractionalSeconds * 1000) 
                    .DateTime.AddHours(1),
                SensorID = jsonDoc.RootElement.GetProperty("SensorID").GetInt32()
            };

            return sensorData;
        }   
}