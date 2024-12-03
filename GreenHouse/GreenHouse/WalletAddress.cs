using System;
using System.Collections.Generic;

namespace GreenHouse
{
    public class WalletAddress
    {
        public static Dictionary<Tuple<string, int>, string> AddressMap { get; } = new Dictionary<Tuple<string, int>, string>();

        static WalletAddress()
        {
            AddressMap.Add(Tuple.Create("Temperature", 0), "0x51B99F31e2e2fE9649AA5a1B3EB967743AA5619E");
            AddressMap.Add(Tuple.Create("Temperature", 1), "0xf9C3516150CB906D49267CD652B478eB6994E7Dc");
            AddressMap.Add(Tuple.Create("Temperature", 2), "0x4854f60C0719018880fE913A8499f3212f0F2174");
            AddressMap.Add(Tuple.Create("Temperature", 3), "0xc02ec6D828dB6738c98E3DcB0409CB2dd63586DC");
            AddressMap.Add(Tuple.Create("Humidity", 0), "0xa7f839acAFCb201C7cf9a25880c02881f5E6D860");
            AddressMap.Add(Tuple.Create("Humidity", 1), "0xC7C7f17387eCF44E445CE60f89e6Cd17ffDc1f0d");
            AddressMap.Add(Tuple.Create("Humidity", 2), "0xF8459B4ae26ca1116C034C01aa7C3f34B34F952D");
            AddressMap.Add(Tuple.Create("Humidity", 3), "0x97A64378C66BE99DAEd8d6AbAb79959Bedd9e183");
            AddressMap.Add(Tuple.Create("GasConcentration", 0), "0xADcacA98cc8f829F87601563f04C15503EF73FD2");
            AddressMap.Add(Tuple.Create("GasConcentration", 1), "0x18696e95F6CE794344c754D3FDF3693C44B967ad");
            AddressMap.Add(Tuple.Create("GasConcentration", 2), "0x7e14b62f5058A61725304817eae1E7C3b71147Ed");
            AddressMap.Add(Tuple.Create("GasConcentration", 3), "0x64942ea3E3a138F025B0dfEAD93F0cAE4c569eAd");
            AddressMap.Add(Tuple.Create("UVIntensity", 0), "0x02b330AD3A65e46AF547F4ad4caA668152B69cA7");
            AddressMap.Add(Tuple.Create("UVIntensity", 1), "0x5E5EecB46fDee687b3c44C6E200AC5e9019181a4");
            AddressMap.Add(Tuple.Create("UVIntensity", 2), "0x35f7B6A26979B31115c71bA2a094438D0e06009a");
            AddressMap.Add(Tuple.Create("UVIntensity", 3), "0x29c52e13e635F987525bbd73d21c1c05E4352D27");
        }
    }
}
