namespace BlockainOperations
{
    internal class Program
    {
        private static readonly string SensorWalletAddress1 = "0x51B99F31e2e2fE9649AA5a1B3EB967743AA5619E";
        private static readonly string SensorWalletAddress2 = "0xf9C3516150CB906D49267CD652B478eB6994E7Dc";
        private static readonly string SensorWalletAddress3 = "0x4854f60C0719018880fE913A8499f3212f0F2174";
        private static readonly string SensorWalletAddress4 = "0xc02ec6D828dB6738c98E3DcB0409CB2dd63586DC";
        private static readonly string SensorWalletAddress5 = "0xa7f839acAFCb201C7cf9a25880c02881f5E6D860";
        private static readonly string SensorWalletAddress6 = "0xC7C7f17387eCF44E445CE60f89e6Cd17ffDc1f0d";
        private static readonly string SensorWalletAddress7 = "0xF8459B4ae26ca1116C034C01aa7C3f34B34F952D";
        private static readonly string SensorWalletAddress8 = "0x97A64378C66BE99DAEd8d6AbAb79959Bedd9e183";
        private static readonly string SensorWalletAddress9 = "0xADcacA98cc8f829F87601563f04C15503EF73FD2";
        private static readonly string SensorWalletAddress10 = "0x18696e95F6CE794344c754D3FDF3693C44B967ad";
        private static readonly string SensorWalletAddress11 = "0x7e14b62f5058A61725304817eae1E7C3b71147Ed";
        private static readonly string SensorWalletAddress12 = "0x64942ea3E3a138F025B0dfEAD93F0cAE4c569eAd";
        private static readonly string SensorWalletAddress13 = "0x02b330AD3A65e46AF547F4ad4caA668152B69cA7";
        private static readonly string SensorWalletAddress14 = "0x5E5EecB46fDee687b3c44C6E200AC5e9019181a4";
        private static readonly string SensorWalletAddress15 = "0x35f7B6A26979B31115c71bA2a094438D0e06009a";
        private static readonly string SensorWalletAddress16 = "0x29c52e13e635F987525bbd73d21c1c05E4352D27";

        static async Task Main(string[] args)
        {
            var balance = await GreenhouseToken.GetTokenBalanceOnAccount("0x51B99F31e2e2fE9649AA5a1B3EB967743AA5619E");
            Console.WriteLine(balance);

            var transaction = await GreenhouseToken.TransferBalanceToAccount(SensorWalletAddress1);
            Console.WriteLine(transaction);
        }
    }
}
