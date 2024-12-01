import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import {  Bar } from "react-chartjs-2";
import { sensorData } from "../hooks/useApi";
import { useState } from "react";

Chart.register(CategoryScale);

interface BarChartProps{
    sensorTypes: string[],
    data: sensorData[]
}

function CountPerSensorBarChart(props: BarChartProps) {
    const labels: string[] = []
    
    const getCount = () => {
        const dataset: number[] = [];
        props.sensorTypes.forEach((type) => {
          const typearray = props.data.filter((item) => item.sensorType == type);
          const ids = Array.from(new Set(typearray.map((item) => item.sensorID)))
          ids.forEach((id) => {
            labels.push(type.concat(id.toString()))
            const idarray = typearray.filter((item) => item.sensorID == id);
            dataset.push(idarray.length)
          })
        })
        return [{
            label: "Count",
            data: dataset
        }];
    }
      
    const data = {
        labels: labels,
        datasets: getCount()
    }

    return (
        <div
        className="w-[50%]"
        >
            <Bar      
                data={data}
            />
        </div>
    )
}

export default CountPerSensorBarChart