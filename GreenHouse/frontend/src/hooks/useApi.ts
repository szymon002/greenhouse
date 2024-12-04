import axios from 'axios';

interface getSensorDataProps{
    sensorType?: string,
    sensorId?: number,
    sortOrder?: string,
    sortBy?: string,
    startDate?: Date,
    endDate?: Date
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

interface Sensor{
    sensorID: number,
    sensorType: string,
    balance: number
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
    if(props.sortBy !== undefined){
        changed ? url = url.concat("&") : url = url.concat("?")
        changed = true
        url = url.concat(`sortBy=${props.sortBy}`)
    }
    if(props.sortOrder !== undefined){
        changed ? url = url.concat("&") : url = url.concat("?")
        changed = true
        url = url.concat(`sortOrder=${props.sortOrder}`)
    }
    if(props.startDate !== undefined){
        changed ? url = url.concat("&") : url = url.concat("?")
        changed = true
        url = url.concat(`start=${props.startDate.toJSON()}`)
    }
    if(props.endDate !== undefined){
        changed ? url = url.concat("&") : url = url.concat("?")
        changed = true
        url = url.concat(`end=${props.endDate.toJSON()}`)
    }
    return url;
}

const getSensorData = async (props: getSensorDataProps) => {
    const url = makeQueryUrl("http://localhost:5173/api/sensordata", props)
    console.log(url)
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

const getSensorWallet = async () => {
    const url = "http://localhost:5173/api/sensordata/balance"
    const response = await axios.get<Sensor[]>(url);
    if(response.status == 200){
        return response.data;
    }
    throw new Error("Failed to fetch");
}

export {getSensorData, exportJSON, exportCSV, getSensorWallet};
export type {sensorData, Sensor};