import { useEffect, useState, useRef } from "react"
import { exportCSV, exportJSON, getSensorData, sensorData } from "../hooks/useApi"
import ValuePerSensorLineChart from "../components/ValuePerSensorLineChart"
import CountPerSensorBarChart from "../components/CountPerSensorBarChart"

enum SortField{
  SensorID,
  SensorType,
  Value,
  Timestamp
}

interface sortSwitch{
  SensorID: boolean,
  SensorType: boolean,
  Value: boolean,
  Timestamp: boolean
}

function Home() {
  const [pureData, setPureData] = useState<sensorData[]>([])
  const [data, setData] = useState<sensorData[]>([])
  const [selectedSensorType, setSelectedSensorType] = useState<string | undefined>(undefined);
  const [selectedSensorID, setSelectedSensorID] = useState<number | undefined>(undefined);
  const sortSwitch = useRef<sortSwitch>({
    SensorID: false,
    SensorType: false,
    Value: false,
    Timestamp: false
  })
  
  let sensorIds = new Set(pureData.map((item) => item.sensorID))
  let sensorTypes = new Set(pureData.map((item) => item.sensorType))
  
  useEffect(() => {
    getData()
  }, [])
  
  const getData = async () => {
    try{
      const responseData:sensorData[] = await getSensorData({});
      setData(responseData);
      setPureData(responseData);
    } catch (e){
      console.log(e);
    }
  }
  
  const getFilterData = async () => {
    try{
      const responsePureData:sensorData[] = await getSensorData({});
      const responseData:sensorData[] = await getSensorData({sensorId: selectedSensorID, sensorType: selectedSensorType});
      setData(responseData);
      setPureData(responsePureData); 
    } catch (e){
      console.log(e);
    }
  }
  
  const handleSensorTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSensorType(event.target.value);
  };

  const handleSensorIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSensorID(parseInt(event.target.value, 10));
  };
   
  const submitFilter = async () => {
    getFilterData()
  }
  
  const resetRadios = () => {
    sensorIds.forEach((id) => {
      const item = document.getElementById(`sensorID-${id}`) as HTMLInputElement
      if(item){
        item.checked = false;
      }
    })
    sensorTypes.forEach((type) => {
      const item = document.getElementById(type) as HTMLInputElement
      if(item){
        item.checked = false;
      }
    })
    setSelectedSensorID(undefined)
    setSelectedSensorType(undefined)
    getData()
  }
  
  const sortBy = (field: SortField) => {
    const sortedData = [...data];
    switch (field) {
      case SortField.SensorID:
        if(sortSwitch.current.SensorID){
          sortedData.sort((a,b) => b.sensorID-a.sensorID)
          sortSwitch.current.SensorID = !sortSwitch.current.SensorID
          break;          
        }
        sortedData.sort((a,b) => a.sensorID-b.sensorID)
        sortSwitch.current.SensorID = !sortSwitch.current.SensorID
        break;
      case SortField.SensorType:
        if(sortSwitch.current.SensorType){
          sortedData.sort((a,b) => b.sensorType.localeCompare(a.sensorType))
          sortSwitch.current.SensorType = !sortSwitch.current.SensorType
          break;          
        }
        sortedData.sort((a,b) => a.sensorType.localeCompare(b.sensorType))
        sortSwitch.current.SensorType = !sortSwitch.current.SensorType
        break;
      case SortField.Timestamp:
        if(sortSwitch.current.Timestamp){
          sortedData.sort((a,b) => new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime())
          sortSwitch.current.Timestamp = !sortSwitch.current.Timestamp
          break;          
        }
        sortedData.sort((a,b) => new Date(a.timestamp).getTime()-new Date(b.timestamp).getTime())
        sortSwitch.current.Timestamp = !sortSwitch.current.Timestamp
        break;
      case SortField.Value:
        if(sortSwitch.current.Value){
          sortedData.sort((a,b) => b.value-a.value)
          sortSwitch.current.Value = !sortSwitch.current.Value
          break;          
        }
        sortedData.sort((a,b) => a.value-b.value)
        sortSwitch.current.Value = !sortSwitch.current.Value
        break;
    }
    setData(sortedData);
  }
  
  const renderFirstRow = () => {
    return (
      <div className="flex flex-row">
        <div className="bg-slate-400 h-6 w-[60px] p-1">
          ID
          <button className="pl-2" onClick={() => sortBy(SortField.SensorID)}>sort</button>
        </div>
        <div className="bg-slate-300 h-6 w-[180px] p-1">
          Sensor type
          <button className="pl-2" onClick={() => sortBy(SortField.SensorType)}>sort</button>
        </div>
        <div className="bg-slate-400 h-6 w-[130px] p-1">
          Value
          <button className="pl-2" onClick={() => sortBy(SortField.Value)}>sort</button>
        </div>
        <div className="bg-slate-300 h-6 w-[250px] p-1">
          Timestamp
          <button className="pl-2" onClick={() => sortBy(SortField.Timestamp)}>sort</button>
        </div>
      </div>
    )
  };
  
  const renderItem = (item:sensorData, index: any) => {
    return (
      <div className="flex flex-row" key={index}>
        <div className="bg-slate-400 h-6 w-[60px] p-1">{item.sensorID}</div>
        <div className="bg-slate-300 h-6 w-[180px] p-1">{item.sensorType}</div>
        <div className="bg-slate-400 h-6 w-[130px] p-1">{item.value}</div>
        <div className="bg-slate-300 h-6 w-[250px] p-1">{item.timestamp.toString()}</div>
      </div>
    )
  };
  
  const renderCheckList = () => {
    return (
      <div>
        Sensor type:
        {Array.from(sensorTypes).map((item, index) => (
          <div key={index}>
            <input type="radio" name="sensorType" id={item} value={item} onChange={handleSensorTypeChange}/>
            <label htmlFor={item}>{item}</label>
          </div>
        ))}
        Sensor ID:
        {Array.from(sensorIds).map((item, index) => (
          <div key={index}>
            <input type="radio" name="sensorID" id={`sensorID-${item}`} value={`${item}`} onChange={handleSensorIDChange}/>
            <label htmlFor={`sensorID-${item}`}>{item}</label>
          </div>
        ))}
        <button onClick={submitFilter}>Submit</button>
        <button onClick={resetRadios}>Reset</button>
      </div>
    )
  }


  return (
    <>
      <div className='w-full h-[200px] bg-white'>
        <div
         className="flex flex-row w-full"
        >
          <ValuePerSensorLineChart
            sensorTypes={Array.from(sensorTypes)}
            data={data}
          />
          <CountPerSensorBarChart
           sensorTypes={Array.from(sensorTypes)}
           data={data}
          />
        </div>
        <div>
          {renderCheckList()}
          {renderFirstRow()}
          {data.map((item, index) => renderItem(item, index))}
        </div>
        <button onClick={() => exportJSON({sensorId: selectedSensorID, sensorType: selectedSensorType})}>Download in JSON</button>
        <button onClick={() => exportCSV({sensorId: selectedSensorID, sensorType: selectedSensorType})}>Download in csv</button>
      </div>
    </>
  )
}

export default Home
