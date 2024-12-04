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

interface sortSwitchField{
  isSet: boolean,
  order: string
}

interface sortSwitch{
  SensorID: sortSwitchField,
  SensorType: sortSwitchField,
  Value: sortSwitchField,
  Timestamp: sortSwitchField
}

function Home() {
  const [pureData, setPureData] = useState<sensorData[]>([])
  const [data, setData] = useState<sensorData[]>([])
  const [tableData, setTableData] = useState<sensorData[]>([])
  const selectedSensorType = useRef<string | undefined>(undefined);
  const selectedSensorID = useRef<number | undefined>(undefined);
  const startDate = useRef<Date | undefined>(undefined);
  const endDate = useRef<Date | undefined>(undefined);
  const sortSwitch = useRef<sortSwitch>({
    SensorID: {isSet:false, order:"asc"},
    SensorType: {isSet:false, order:"asc"},
    Value: {isSet:false, order:"asc"},
    Timestamp: {isSet:false, order:"asc"}
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
      setTableData(responseData)
      setPureData(responseData);
    } catch (e){
      console.log(e);
    }
  }
  
  const getFilterData = async () => {
    try{
      const responsePureData:sensorData[] = await getSensorData({});
      const responseData:sensorData[] = await getSensorData({sensorId: selectedSensorID.current, sensorType: selectedSensorType.current, startDate: startDate.current, endDate: endDate.current});
      setData(responseData);
      setTableData(responseData)
      setPureData(responsePureData); 
    } catch (e){
      console.log(e);
    }
  }
  
  const handleSensorTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectedSensorType.current = event.target.value;
  };

  const handleSensorIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectedSensorID.current = parseInt(event.target.value, 10);
  };
  
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value)
    date.setHours(date.getHours()+1)
    startDate.current = date
    console.log(startDate.current.toISOString())
  }
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value)
    date.setHours(date.getHours()+1)
    endDate.current = date   
  }
   
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
    const start = document.getElementById("startdate") as HTMLInputElement
    const end = document.getElementById("enddate") as HTMLInputElement
    start.value = ""
    end.value = ""
    selectedSensorType.current = undefined
    selectedSensorID.current = undefined
    getData()
  }
  
  const setSwitch = (field: SortField) => {
    switch (field) {
      case SortField.SensorID:
        sortSwitch.current.SensorID.isSet = true
        sortSwitch.current.SensorType.isSet = false
        sortSwitch.current.Timestamp.isSet = false
        sortSwitch.current.Value.isSet = false
        break;
        case SortField.SensorType:
        sortSwitch.current.SensorID.isSet = false
        sortSwitch.current.SensorType.isSet = true
        sortSwitch.current.Timestamp.isSet = false
        sortSwitch.current.Value.isSet = false        
        break;
        case SortField.Timestamp:
        sortSwitch.current.SensorID.isSet = false
        sortSwitch.current.SensorType.isSet = false
        sortSwitch.current.Timestamp.isSet = true
        sortSwitch.current.Value.isSet = false        
        break;
        case SortField.Value:
        sortSwitch.current.SensorID.isSet = false
        sortSwitch.current.SensorType.isSet = false
        sortSwitch.current.Timestamp.isSet = false
        sortSwitch.current.Value.isSet = true        
        break;
    }
  }
  
  const sortBy = (field: SortField) => {
    const sortedData = [...tableData];
    switch (field) {
      case SortField.SensorID:
        setSwitch(field)
        if(!sortSwitch.current.SensorID.isSet){
          sortedData.sort((a,b) => b.sensorID-a.sensorID)          
          sortSwitch.current.SensorID.order = "desc"
          break;          
        }
        sortedData.sort((a,b) => a.sensorID-b.sensorID)        
        sortSwitch.current.SensorID.order = "asc"
        break;
      case SortField.SensorType:
        setSwitch(field)
        if(!sortSwitch.current.SensorType.isSet){
          sortedData.sort((a,b) => b.sensorType.localeCompare(a.sensorType))          
          sortSwitch.current.SensorType.order = "desc"
          break;          
        }
        sortedData.sort((a,b) => a.sensorType.localeCompare(b.sensorType))        
        sortSwitch.current.SensorType.order = "asc"
        break;
      case SortField.Timestamp:
        setSwitch(field)
        if(!sortSwitch.current.Timestamp.isSet){
          sortedData.sort((a,b) => new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime())          
          sortSwitch.current.Timestamp.order = "desc"
          break;          
        }
        sortedData.sort((a,b) => new Date(a.timestamp).getTime()-new Date(b.timestamp).getTime())        
        sortSwitch.current.Timestamp.order = "asc"
        break;
      case SortField.Value:
        setSwitch(field)
        if(!sortSwitch.current.Value.isSet){
          sortedData.sort((a,b) => b.value-a.value)          
          sortSwitch.current.Value.order = "desc"
          break;          
        }
        sortedData.sort((a,b) => a.value-b.value)        
        sortSwitch.current.Value.order = "asc"
        break;
    }
    setTableData(sortedData);
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
        <div className="flex flex-row">
          <div>
            Start date:
            <input id="startdate" type="datetime-local" onChange={handleStartDateChange}/>
            End date:
            <input id="enddate" type="datetime-local" onChange={handleEndDateChange}/>
          </div>
        </div>
        <button onClick={submitFilter}>Submit</button>
        <button onClick={resetRadios}>Reset</button>
      </div>
    )
  }

  const getExportProps = () => {
    const sensorId = selectedSensorID.current
    const sensorType = selectedSensorType.current
    let sortBy = undefined
    let sortOrder = undefined
    if(sortSwitch.current.SensorID.isSet){
      sortOrder = sortSwitch.current.SensorID.order
      sortBy = "sensorid"      
    }
    if(sortSwitch.current.SensorType.isSet){
      sortOrder = sortSwitch.current.SensorType.order
      sortBy = "sensortype"      
    }
    if(sortSwitch.current.Timestamp.isSet){
      sortOrder = sortSwitch.current.Timestamp.order
      sortBy = "timestamp"      
    }
    if(sortSwitch.current.Value.isSet){
      sortOrder = sortSwitch.current.Value.order
      sortBy = "value"      
    }
    return {sensorId: sensorId, sensorType: sensorType, sortBy: sortBy, sortOrder: sortOrder, startDate: startDate.current, endDate: endDate.current}
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
          {tableData.map((item, index) => renderItem(item, index))}
        </div>
        <button onClick={() => exportJSON(getExportProps())}>Download in JSON</button>
        <button onClick={() => exportCSV(getExportProps())}>Download in csv</button>
      </div>
    </>
  )
}

export default Home
