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
    console.log(sortSwitch.current)
  }
  
  const sortBy = (field: SortField) => {
    const sortedData = [...tableData];
    switch (field) {
      case SortField.SensorID:
        setSwitch(field)
        if(sortSwitch.current.SensorID.order == "asc"){
          sortedData.sort((a,b) => b.sensorID-a.sensorID)          
          sortSwitch.current.SensorID.order = "desc"
          break;          
        }
        sortedData.sort((a,b) => a.sensorID-b.sensorID)        
        sortSwitch.current.SensorID.order = "asc"
        break;
      case SortField.SensorType:
        setSwitch(field)
        if(sortSwitch.current.SensorType.order == "asc"){
          sortedData.sort((a,b) => b.sensorType.localeCompare(a.sensorType))          
          sortSwitch.current.SensorType.order = "desc"
          break;          
        }
        sortedData.sort((a,b) => a.sensorType.localeCompare(b.sensorType))        
        sortSwitch.current.SensorType.order = "asc"
        break;
      case SortField.Timestamp:
        setSwitch(field)
        if(sortSwitch.current.Timestamp.order == "asc"){
          sortedData.sort((a,b) => new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime())          
          sortSwitch.current.Timestamp.order = "desc"
          break;          
        }
        sortedData.sort((a,b) => new Date(a.timestamp).getTime()-new Date(b.timestamp).getTime())        
        sortSwitch.current.Timestamp.order = "asc"
        break;
      case SortField.Value:
        setSwitch(field)
        if(sortSwitch.current.Value.order == "asc"){
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
      <div className="flex flex-row bg-gray-800 text-white rounded-t-lg">
        <div className="h-10 w-[90px] p-2 font-bold border-b-2 border-gray-700 flex items-center justify-between">
          <span>ID</span>
          <button onClick={() => sortBy(SortField.SensorID)}>
            Sort
          </button>
        </div>
        <div className="h-10 w-[180px] p-2 font-bold border-b-2 border-gray-700 flex items-center justify-between">
          <span>Sensor Type</span>
          <button onClick={() => sortBy(SortField.SensorType)}>
            Sort
          </button>
        </div>
        <div className="h-10 w-[130px] p-2 font-bold border-b-2 border-gray-700 flex items-center justify-between">
          <span>Value</span>
          <button onClick={() => sortBy(SortField.Value)}>
            Sort
          </button>
        </div>
        <div className="h-10 w-[250px] p-2 font-bold border-b-2 border-gray-700 flex items-center justify-between">
          <span>Timestamp</span>
          <button onClick={() => sortBy(SortField.Timestamp)}>
            Sort
          </button>
        </div>
      </div>
    );
  };

  const renderItem = (item: sensorData, index: any) => {
    return (
      <div className={`flex flex-row ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`} key={index}>
        <div className="h-10 w-[90px] p-2 border-b border-gray-300">{item.sensorID}</div>
        <div className="h-10 w-[180px] p-2 border-b border-gray-300">{item.sensorType}</div>
        <div className="h-10 w-[130px] p-2 border-b border-gray-300">{item.value}</div>
        <div className="h-10 w-[250px] p-2 border-b border-gray-300">{new Date(item.timestamp).toLocaleString()}</div>
      </div>
    );
  };
  
  const renderCheckList = () => {
    return (
      <div className="bg-white p-4 rounded-md shadow-md">
        <div className="mb-4">
          <span className="font-bold">Sensor type:</span>
          {Array.from(sensorTypes).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input type="radio" name="sensorType" id={item} value={item} onChange={handleSensorTypeChange} className="accent-blue-500"/>
              <label htmlFor={item} className="text-gray-700">{item}</label>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <span className="font-bold">Sensor ID:</span>
          {Array.from(sensorIds).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input type="radio" name="sensorID" id={`sensorID-${item}`} value={`${item}`} onChange={handleSensorIDChange} className="accent-blue-500"/>
              <label htmlFor={`sensorID-${item}`} className="text-gray-700">{item}</label>
            </div>
          ))}
        </div>
        <div className="flex flex-row space-x-4 mb-4">
          <div>
            <span className="font-bold">Start date:</span>
            <input id="startdate" type="datetime-local" onChange={handleStartDateChange} className="border border-gray-300 rounded p-1 mt-1 block w-full"/>
          </div>
          <div>
            <span className="font-bold">End date:</span>
            <input id="enddate" type="datetime-local" onChange={handleEndDateChange} className="border border-gray-300 rounded p-1 mt-1 block w-full"/>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={submitFilter}>Submit</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={resetRadios}>Reset</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => exportJSON(getExportProps())}>Download JSON</button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={() => exportCSV(getExportProps())}>Download CSV</button>
        </div>
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
       <div className="w-full h-screen p-6 bg-gray-100">
      <div className='bg-white shadow-md rounded-lg p-6'>
        <h1 className='text-2xl font-bold mb-6'>Sensor Dashboard</h1>
        <div className="flex flex-row space-x-4">
          <ValuePerSensorLineChart sensorTypes={Array.from(sensorTypes)} data={data} />
          <CountPerSensorBarChart sensorTypes={Array.from(sensorTypes)} data={data} />
        </div>
      </div>
      <div className='bg-white shadow-md rounded-lg p-6 mt-6 flex'>
        {renderCheckList()}
        <div className="mt-4 mb-4 flex space-x-4">
         
        </div>
        <div className="mb-4 ml-4">
          {renderFirstRow()}
          <div>
            {tableData.map((item, index) => renderItem(item, index))}
          </div>          
        </div>
       
      </div>
    </div>
    </>
  )
}

export default Home
