var terminal = new Terminal({
    fontSize: 15,
    fontFamily: 'Fira Code, courier-new',
    experimentalCharAtlas: 'dynamic',
    fontWeight: 500,
    theme: {
        background: '#0d0d0d',
      },
});

const fitAddon = new FitAddon.FitAddon();

const ipc = require("electron").ipcRenderer;

document.getElementById('close').addEventListener('click', () => 
{
    window.close();

})
var type;
type = "Loading";
terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal'));
terminal.write("MauriTerminal v 0.01");
fitAddon.fit(terminal);


terminal.onData(e => {
    ipc.send("terminal.keystroke", e);
});

ipc.on("terminal.input", (event, data) => {
    terminal.write(data)
})

window.onresize = () => {
    fitAddon.fit(terminal);
};

ipc.on('type', (event, data) => {
    if(data == "cmd.exe")
    {
        type = "CMD";
    }
    document.getElementById('type').innerHTML = type;
})

