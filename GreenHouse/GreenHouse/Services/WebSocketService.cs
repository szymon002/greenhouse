using MongoDB.Driver;
using MQTTnet;
using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace GreenHouse.Services
{
    public class WebSocketService
    {
        private Dictionary<Tuple<string, int>, List<double>> PanelMap { get; } = new Dictionary<Tuple<string, int>, List<double>>();

        private readonly ConcurrentDictionary<string, WebSocket> _connectedClients = new();
        private readonly IMongoCollection<SensorData> _sensorDataCollection;

        public WebSocketService(IMongoDatabase database)
        {
            _sensorDataCollection = database.GetCollection<SensorData>("SensorData");
            PanelMap.Add(Tuple.Create("Temperature", 0), new List<double>());
            PanelMap.Add(Tuple.Create("Temperature", 1), new List<double>());
            PanelMap.Add(Tuple.Create("Temperature", 2), new List<double>());
            PanelMap.Add(Tuple.Create("Temperature", 3), new List<double>());
            PanelMap.Add(Tuple.Create("Humidity", 0), new List<double>());
            PanelMap.Add(Tuple.Create("Humidity", 1), new List<double>());
            PanelMap.Add(Tuple.Create("Humidity", 2), new List<double>());
            PanelMap.Add(Tuple.Create("Humidity", 3), new List<double>());
            PanelMap.Add(Tuple.Create("GasConcentration", 0), new List<double>());
            PanelMap.Add(Tuple.Create("GasConcentration", 1), new List<double>());
            PanelMap.Add(Tuple.Create("GasConcentration", 2), new List<double>());
            PanelMap.Add(Tuple.Create("GasConcentration", 3), new List<double>());
            PanelMap.Add(Tuple.Create("UVIntensity", 0), new List<double>());
            PanelMap.Add(Tuple.Create("UVIntensity", 1), new List<double>());
            PanelMap.Add(Tuple.Create("UVIntensity", 2), new List<double>());
            PanelMap.Add(Tuple.Create("UVIntensity", 3), new List<double>());
            Populate();
        }

        public Task AddClient(string clientId, WebSocket webSocket)
        {
            _connectedClients[clientId] = webSocket;
            return Task.CompletedTask;
        }

        public Task RemoveClient(string clientId)
        {
            _connectedClients.TryRemove(clientId, out var webSocket);
            webSocket?.Dispose();
            return Task.CompletedTask;
        }

        public async Task SendMessageToAllClientsAsync(SensorData sensor)
        {
            var map = PanelMap[Tuple.Create(sensor.SensorType, sensor.SensorID)];
            if (map.Count == 100)
            {
                map.RemoveAt(0);
            }
            map.Add(sensor.Value);

            var sensorMessages = new List<object>();

            foreach (var entry in PanelMap)
            {
                var sensorKey = entry.Key;
                var sensorType = sensorKey.Item1;
                var sensorId = sensorKey.Item2;

                var lastValue = entry.Value.Last();

                var averageValue = entry.Value.Average();

                var sensorMessage = new
                {
                    SensorType = sensorType,
                    SensorID = sensorId,
                    LastValue = lastValue,
                    AverageValue = averageValue
                };

                sensorMessages.Add(sensorMessage);
            }

            string jsonString = JsonSerializer.Serialize(sensorMessages);
            var messageBytes = Encoding.UTF8.GetBytes(jsonString);
            var buffer = new ArraySegment<byte>(messageBytes);

            foreach (var client in _connectedClients.Values)
            {
                if (client.State == WebSocketState.Open)
                {
                    await client.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                }
            }
        }

        public void Populate()
        {
            foreach (var entry in PanelMap)
            {
                var sensorKey = entry.Key; 
                var sensorType = sensorKey.Item1;
                var sensorId = sensorKey.Item2;

                var filter = Builders<SensorData>.Filter.Empty;

                filter &= Builders<SensorData>.Filter.Eq(x => x.SensorType, sensorType);

                filter &= Builders<SensorData>.Filter.Eq(x => x.SensorID, sensorId);
                
                var sort = Builders<SensorData>.Sort.Descending(x => x.Timestamp);

                var result = _sensorDataCollection
                    .Find(filter)
                    .Sort(sort)  
                    .Limit(100)
                    .ToList();

                PanelMap[sensorKey] = result.Select(data=>data.Value).ToList();
            }
        }
    }
}