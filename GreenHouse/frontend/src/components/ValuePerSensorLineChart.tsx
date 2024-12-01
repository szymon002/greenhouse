import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import {  Line } from "react-chartjs-2";
import { sensorData } from "../hooks/useApi";

Chart.register(CategoryScale);

interface LineChartProps{
    sensorTypes: string[],
    data: sensorData[]
}

function ValuePerSensorLineChart(props: LineChartProps) {
      
  const getValuePerSensorData = () => {
    const dataset: any[] = [];
    props.sensorTypes.forEach((type) => {
      const typearray = props.data.filter((item) => item.sensorType == type);
      const ids = Array.from(new Set(typearray.map((item) => item.sensorID)))
      ids.forEach((id) => {
        const idarray = typearray.filter((item) => item.sensorID == id);
        dataset.push({
          label: type.concat(id.toString()),
          data: idarray.map((item) => item.value)
        })
      })
    })
    return dataset;
  }
  
  const getYPoints = () => {
    const arr = getValuePerSensorData();
    let max = 0;
    arr.forEach((item) => {
      max < item.data.length ? max = item.data.length : max = max;
    })
    return [...Array(max).keys()].map((item) => item.toString())
  }
    
    const data = {
        labels: getYPoints(),
        datasets: getValuePerSensorData()
    }
    
    const options = {
        responsive: true,
        scales: {
          x: {
            ticks: {
              display: false,
            },
            grid: {
              display: false,
            },
          },
        },
      };
    
    return (
        <div
         className="w-[50%]"
        >
            <Line      
                data={data}
                options={options}
            />
        </div>
    )
}

export default ValuePerSensorLineChart