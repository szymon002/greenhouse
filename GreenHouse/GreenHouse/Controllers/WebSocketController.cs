using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using GreenHouse.Services;

namespace GreenHouse.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WebSocketController : ControllerBase
    {
        private readonly WebSocketService _webSocketService;

        public WebSocketController(WebSocketService webSocketService)
        {
            _webSocketService = webSocketService;
        }

        [HttpGet("connect")]
        public async Task Connect()
        {
            if (HttpContext.Request.Headers.ContainsKey("Upgrade") && HttpContext.Request.Headers["Upgrade"] == "websocket")
            {
                var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                string clientId = Guid.NewGuid().ToString();
                await _webSocketService.AddClient(clientId, webSocket);

                await HandleWebSocketAsync(clientId, webSocket);
            }
            else
            {
                HttpContext.Response.StatusCode = 400;
            }
        }

        private async Task HandleWebSocketAsync(string clientId, WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];

            while (webSocket.State == WebSocketState.Open)
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Close)
                {
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
                    await _webSocketService.RemoveClient(clientId);
                }
            }
        }
    }
}
