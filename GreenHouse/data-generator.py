import paho.mqtt.client as mqtt
import time
import json
import random

client = mqtt.Client()
client.connect("localhost", 1883)

sensor_ranges = {
    "Temperature": (15.0, 35.0),
    "Humidity": (30.0, 80.0),
    "GasConcentration": (0.0, 500.0),
    "UVIntensity": (0.0, 15.0)
}

# 0 -> generowanie danych dla konkretnego sensora
# 1 -> generowanie danych num_of_generations razy
one_time_generated = 1
sensor_type = "Temperature"
sensor_id = 3
sensor_value = 25.32

num_of_generations = 10

sensors = [{"type": sensor_type, "id": i} for sensor_type in sensor_ranges for i in range(4)]


def send_data(target_sensor=None, target_value=None):
    if target_sensor and target_value:
        value = target_value
        timestamp = time.time()
        message = json.dumps({
            "SensorType": target_sensor["type"],
            "SensorID": target_sensor["id"],
            "Value": value,
            "Timestamp": timestamp
        })
        client.publish("greenhouse/sensors", message)
        print(f"Sent: {message}")
    else:
        for sensor in sensors:
            value_range = sensor_ranges[sensor["type"]]
            value = round(random.uniform(*value_range), 2)

            timestamp = time.time()
            message = json.dumps({
                "SensorType": sensor["type"],
                "SensorID": sensor["id"],
                "Value": value,
                "Timestamp": timestamp
            })

            client.publish("greenhouse/sensors", message)
            print(f"Sent: {message}")
            time.sleep(random.uniform(1, 5))


def main():
    if one_time_generated == 1:
        for _ in range(num_of_generations):
            send_data()
            time.sleep(1)
    else:
        target_sensor = {"type": sensor_type, "id": sensor_id}
        send_data(target_sensor=target_sensor, target_value=sensor_value)
        time.sleep(1)


if __name__ == "__main__":
    main()
