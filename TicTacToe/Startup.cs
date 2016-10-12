using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using Microsoft.Owin.Host.SystemWeb;
using Microsoft.Owin.Security;

[assembly: OwinStartup(typeof(TicTacToe.Startup))]

namespace TicTacToe
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}
