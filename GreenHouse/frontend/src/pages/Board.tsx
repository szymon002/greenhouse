import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setConnectionStatus, setData } from "../redux/socketSlice";

interface socketData{
    SensorType: string,
    SensorID: number,
    LastValue: number,
    AverageValue: number
}

function Board() {    
    const dispatch = useDispatch<AppDispatch>();
    const data = useSelector((state: RootState) => state.socket.data);
    const isConnected = useSelector((state: RootState) => state.socket.isConnected);
    const [socketRef, setSocketRef] = useState<WebSocket | null>(null)
    
    useEffect(() => {
      if(!isConnected){
        dispatch(setConnectionStatus(true));
        const socket = new WebSocket('ws://localhost:5001/api/websocket/connect');
        setSocketRef(socket);

        socket.onmessage = (event) => {
            const msgData: socketData[] = JSON.parse(event.data);
            dispatch(setData(msgData));
        };
  
        window.onbeforeunload = () => {
            socketRef?.close();
            dispatch(setConnectionStatus(false))
        };
      }

  }, []);
    
  const renderFirstRow = () => {
    return (
      <div className="flex flex-row bg-gray-800 text-white rounded-t-lg">
        <div className="h-10 w-[150px] p-2 font-bold border-b-2 border-gray-700">Sensor Name</div>
        <div className="h-10 w-[120px] p-2 font-bold border-b-2 border-gray-700">Last Value</div>
        <div className="h-10 w-[150px] p-2 font-bold border-b-2 border-gray-700">Average Value</div>
      </div>
    );
};

const renderItem = (item: socketData, index: any) => {
    return (
      <div className={`flex flex-row ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`} key={index}>
        <div className="h-10 w-[150px] p-2 border-b border-gray-300">{item.SensorType.concat(item.SensorID.toString())}</div>
        <div className="h-10 w-[120px] p-2 border-b border-gray-300">{item.LastValue}</div>
        <div className="h-10 w-[150px] p-2 border-b border-gray-300">{item.AverageValue}</div>
      </div>
    );
};

return (
    <div className="w-full h-screen p-6 bg-gray-100 flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-6 w-[500px]">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Sensor Board</h1>
            <div className="bg-white shadow-md rounded-lg">
              {renderFirstRow()}
              <div className="divide-y divide-gray-200">
                {data.map((item, index) => renderItem(item, index))}
              </div>
            </div>
        </div>
    </div>
);
}

export default Board