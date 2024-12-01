import { useEffect, useState } from "react"

interface socketData{
    SensorType: string,
    SensorID: number,
    LastValue: number,
    AverageValue: number
}

function Board() {    
    const [data, setData] = useState<socketData[]>([])
    useEffect(() => {
      const socket = new WebSocket("ws://localhost:5001/api/websocket/connect")
      
      socket.onopen = () => {
        console.log('WebSocket connected');
      };
  
      socket.onmessage = (event) => {
        const msgData: socketData[] = JSON.parse(event.data)
        setData(msgData)
      };
  
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      socket.onclose = () => {
        console.log('WebSocket disconnected');
      };
      return () => {
        socket.close()
      }
    }, [])
    
    const render = () => {
        return(
            <>
                {data.map((item) => {
                    return(
                    <div className="flex flex-row" key={item.SensorType.concat(item.SensorID.toString())}>
                        <div>
                            Name: {item.SensorType.concat(item.SensorID.toString())}
                        </div>
                        <div>
                            Value: {item.LastValue}
                        </div>
                        <div>
                            Average value: {item.AverageValue}
                        </div>                        
                    </div>)
                })}
            </>
        )
    }
    
    return (
        <div>
            Board
            {render()}
        </div>
    )
}

export default Board