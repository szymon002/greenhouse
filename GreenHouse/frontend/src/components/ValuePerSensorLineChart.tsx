import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import {  Line } from "react-chartjs-2";
import { sensorData } from "../hooks/useApi";

Chart.register(CategoryScale);

interface LineChartProps{
    sensorTypes: string[],
    data: sensorData[]
}

const getRandomColor = ( name: string) => {
  const hash = Array.from(name)
    .reduce((prev, char) => prev + char.charCodeAt(0), 0);

  const r = (hash * 19) % 256;
  const g = (hash * 23) % 256;
  const b = (hash * 29) % 256;

  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function ValuePerSensorLineChart(props: LineChartProps ) {
    
  const getValuePerSensorData = () => {
    const dataset: any[] = [];
    props.sensorTypes.forEach((type) => {
      const typearray = props.data.filter((item) => item.sensorType == type);
      const ids = Array.from(new Set(typearray.map((item) => item.sensorID)))
      ids.forEach((id) => {
        const idarray = typearray.filter((item) => item.sensorID == id);
        const label = type.concat(id.toString())
        const color = getRandomColor(label);
        dataset.push({
          label: label,
          data: idarray.map((item) => item.value),
          backgroundColor: color,
          borderColor: color
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
      plugins: {
        colors : {
          enabled: true
        }
      },
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