using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace TicTacToe.Hubs
{
    public class TicTacToeHub : Hub
    {
        public void Send(string command, string commandParams)
        {
            // Call the broadcastMessage method to update clients.
            Clients.Others.broadcastMessage(command, commandParams);
        }

    }
}