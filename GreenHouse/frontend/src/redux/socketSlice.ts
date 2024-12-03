import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface socketData {
    SensorType: string;
    SensorID: number;
    LastValue: number;
    AverageValue: number;
}

interface SocketState {
    data: socketData[];
    isConnected: boolean;
}

const initialState: SocketState = {
    data: [],
    isConnected: false
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<socketData[]>) => {
            state.data = action.payload;
        },
        setConnectionStatus: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
    },
});

export const { setData, setConnectionStatus } = socketSlice.actions;
export default socketSlice.reducer;
