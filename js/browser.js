var GUI = require('nw.gui');
var WIN = GUI.Window.get();
var fs = require('fs');
var log= require("noogger");
var CONFIG=false;
var http_server= require("http-server").createServer({root:"C:/node/falcon-project/web-ui"});
http_server.listen(3003);


CONFIG=JSON.parse( fs.readFileSync('./config.json','utf8') );
window.addEventListener(
    'DOMContentLoaded',
    loadApp
);
init();



function init(){
    console.log("init");
    WIN.title=CONFIG.name;
    
    if(CONFIG.url.indexOf('//')<0){
        CONFIG.url='http://'+CONFIG.url;
    }
    
    if(CONFIG.showDevTools){
        setTimeout(
            function(){
                WIN.showDevTools();
            },
            2000
        );
    }

    
}

function loadApp(){
    console.log("loadApp");  

    window.webView= document.querySelector('#webview');   
    document.getElementById("drag").style.backgroundColor = "#CE1139";
    
    load(CONFIG.url);

}

function load(url){
    webView.contentWindow.window.location.href=url;
    webView.style.opacity=1;
}

function closeWindow() {  WIN.close(); }
function minWindow()   { WIN.minimize(); }
function maxWindow()   { WIN.isMaximized ?  WIN.restore() :  WIN.maximize(); WIN.isMaximized= !WIN.isMaximized; }


function viewLoaded(url) {
    console.log('Loaded: '+url);
    if(url.toString().indexOf('app.html')>0)
        document.getElementById("drag").style.backgroundColor = "#f3f3f3";
    
}



// var exec = require('child_process').exec;
// var cmd = 'node C:/node/falcon-project/index.js';

// exec(cmd, function(error, stdout, stderr) {
//   if(error) log.error(error);
//   if(stdout) log.debug(stdout);
//   log.warning(stderr);
// });



var spawn = require('child_process').spawn;



var mongoDB = spawn('mongod');
mongoDB.stdout.on('data', function(chunk) {
    log.debug("{MONGODB} "+chunk);
});

// var http_server = spawn('http-server',['C:/node/falcon-project/web-ui']);
// http_server.stdout.on('data', function(chunk) {
//     log.debug("{HTTP-SERVER} "+chunk);
// });
var node_server
setTimeout( function () {
    node_server = spawn('node',['C:/node/falcon-project/index.js']);
    node_server.stdout.on('data', function(chunk) {
        log.debug("{NODE-SERVER} "+chunk);
    });    
},5000);


WIN.on('close', function () {
    node_server.kill();
    // http_server.kill();
    mongoDB.kill();

    this.close(true);

})


