import axios from 'axios';

interface getSensorDataProps{
    sensorType?: string,
    sensorId?: number
}

interface ID{
    timestamp: number,
    creationTime: Date
}

interface sensorData{
    id: ID,
    sensorType: string,
    value: number,
    timestamp: Date,
    sensorID: number
}

const makeQueryUrl = (url: string, props: getSensorDataProps) => {
    let changed = false;
    if(props.sensorId !== undefined){
        changed ? url = url.concat("&") : url = url.concat("?")
        changed = true
        url = url.concat(`sensorId=${props.sensorId.toString()}`)
    }
    if(props.sensorType !== undefined){
        changed ? url = url.concat("&") : url = url.concat("?")
        changed = true
        url = url.concat(`sensorType=${props.sensorType.toString()}`)
    }
    return url;
}

const getSensorData = async (props: getSensorDataProps) => {
    const url = makeQueryUrl("http://localhost:5173/api/sensordata", props)
    const response = await axios.get<sensorData[]>(url);
    if(response.status == 200){
        return response.data;
    }
    throw new Error("Failed to fetch");
}

const exportJSON = async (props: getSensorDataProps) => {
    const url = makeQueryUrl("http://localhost:5173/api/sensordata/export/json", props)
    const response = await axios.get(url)
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(response.data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";
    link.click();
    link.remove();
}

const exportCSV = (props: getSensorDataProps) => {
    const url = makeQueryUrl("http://localhost:5173/api/sensordata/export/csv", props)
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    link.click();
    link.remove();
}

export {getSensorData, exportJSON, exportCSV};
export type {sensorData};