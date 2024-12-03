import { useEffect, useState } from "react"
import { getSensorWallet, Sensor } from "../hooks/useApi"

function Wallet() {
    const [sensors, setSensors] = useState<Sensor[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    
    useEffect(() => {
        setAllSensors();
    }, [])
    
    const setAllSensors = async () => {
        setLoading(true)
        const data: Sensor[] = await getSensorWallet()
        setSensors(data);
        setLoading(false)
    }
    
    
    const render = () => {
        return (
            <>
                {sensors.map((item) => {
                    return (
                        <div key={item.sensorType.concat(item.sensorID.toString())}>
                            {item.sensorType.concat(item.sensorID.toString())}: {item.balance}
                        </div>
                    )      
                })}
            </>
        )
    }
    
    return (
        <div>
            {loading ? "loading...": render()}
        </div>
    )
}

export default Wallet