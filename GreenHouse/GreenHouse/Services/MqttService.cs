using MQTTnet;
using MQTTnet.Client;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace GreenHouse.Services {
    public class MqttService
    {
        private readonly IMongoCollection<SensorData> _sensorDataCollection;
        private readonly ILogger<MqttService> _logger;
        private IMqttClient _mqttClient;

        public MqttService(IMongoDatabase database, ILogger<MqttService> logger)
        {
            _sensorDataCollection = database.GetCollection<SensorData>("SensorData");
            var factory = new MqttFactory();
            _mqttClient = factory.CreateMqttClient();
        }

        public async Task ConnectAsync(string brokerAddress)
            {
                var options = new MqttClientOptionsBuilder()
                    .WithTcpServer(brokerAddress)
                    .Build();

                var connectResult = await _mqttClient.ConnectAsync(options);

                if (connectResult.ResultCode == MqttClientConnectResultCode.Success) {

                    var topicFilter = new MqttTopicFilterBuilder().WithTopic("greenhouse/sensors").Build();
                    await _mqttClient.SubscribeAsync(topicFilter);

                    _mqttClient.ApplicationMessageReceivedAsync += async (e) =>
                    {
                        try
                        {
                            string message = Encoding.UTF8.GetString(e.ApplicationMessage.PayloadSegment);
                            var sensorData = SensorData.FromJson(message);
                            await _sensorDataCollection.InsertOneAsync(sensorData);                        
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error processing message: {ex.Message}");
                        }
                    };
                }
                else
                {
                    Console.WriteLine($"Failed to connect to MQTT broker: {connectResult.ResultCode}");
                }
            }

        public async Task DisconnectAsync()
        {
            if (_mqttClient.IsConnected)
            {
                await _mqttClient.DisconnectAsync();
            }
        }
    }
}