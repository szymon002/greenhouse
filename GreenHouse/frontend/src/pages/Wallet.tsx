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
    
    
    const renderFirstRow = () => {
        return (
            <div className="flex flex-row bg-gray-800 text-white rounded-t-lg">
                <div className="h-10 w-[150px] p-2 font-bold border-b-2 border-gray-700">Sensor ID</div>
                <div className="h-10 w-[150px] p-2 font-bold border-b-2 border-gray-700">Balance</div>
            </div>
        );
    };

    const renderItem = (item: Sensor, index: number) => {
        return (
            <div className={`flex flex-row ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`} key={index}>
                <div className="h-10 w-[150px] p-2 border-b border-gray-300">
                    {item.sensorType.concat(item.sensorID.toString())}
                </div>
                <div className="h-10 w-[150px] p-2 border-b border-gray-300">
                    {item.balance}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-screen p-6 bg-gray-100 flex justify-center items-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-[500px]">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Wallet</h1>
                <div className="bg-white shadow-md rounded-lg">
                    {renderFirstRow()}
                    <div className="divide-y divide-gray-200">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading...</div>
                        ) : (
                            sensors.map((item, index) => renderItem(item, index))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Wallet