import { useEffect, useState } from "react"
import { getSensorData, getSensorWallet, Sensor, sensorData } from "../hooks/useApi"

function Wallet() {
    const [sensors, setSensors] = useState<Sensor[]>([])
    
    useEffect(() => {
        setAllSensors();
    }, [])
    
    const setAllSensors = async () => {
        const data: Sensor[] = await getSensorWallet()
        setSensors(data);
    }
    
    
    const render = () => {
        return (
            <>
                {sensors.map((item) => {
                    return (
                        <div key={item.sensorType.concat(item.sensorID.toString())}>
                            {item.sensorType.concat(item.sensorID.toString())}
                        </div>
                    )      
                })}
            </>
        )
    }
    
    return (
        <div>
            {render()}
        </div>
    )
}

export default Wallet