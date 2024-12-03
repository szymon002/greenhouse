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
    
    const render = () => {
      return (
          <>
              {data.map((item) => (
                  <div
                      className="flex flex-row"
                      key={item.SensorType.concat(item.SensorID.toString())}
                  >
                      <div>Name: {item.SensorType.concat(item.SensorID.toString())}</div>
                      <div>Value: {item.LastValue}</div>
                      <div>Average value: {item.AverageValue}</div>
                  </div>
              ))}
          </>
      );
  };
    
    return (
        <div>
            Board
            {render()}
        </div>
    )
}

export default Board