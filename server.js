// The core which send data to clients (display)
const express = require('express')
const app = express();
const fs = require('fs');
const path = require('path');

let SYSCONFIG; // Will init at readVar1();

function debugLog(lv, location, message) {
    let res;
    if (location != '') {
        res = `[${lv}@${location}] ${message}\n`;
    } else {
        res = `[${lv}] ${message}\n`;
    }

    function fileLog() {
        if (lv == 'CRIT' || lv == 'MESS') { console.log(res) } else if (lv == 'STOP') { process.kill(process.pid) }
        fs.appendFile('./var/session/log', res, function(err) {
            if (err) { debugLog('CRIT', 'node.js', err) }
        });

    }
    fileLog();
}

// Start Up
fs.readdir('./var/session', (err, files) => {
    if (err) { debugLog(`STOP`, 'node.js', 'Cannot read ./var/session\n------' + err); }

    for (const file of files) {
        fs.unlink(path.join('./var/session', file), err => {
            if (err) { debugLog(`STOP`, 'node.js', 'Cannot clean ./var/session\n------' + err); };
        });
    }
    debugLog(`MESS`, '', 'Waking up Velvety');
    readVar1();
});

function readVar1() {
    let tempID = Math.floor(Math.random() * 9999) + 1;
    tempID = tempID.toString();

    fs.writeFile('./var/session/ID', tempID, function(err) {
        if (err) { debugLog('CRIT', 'server.readVar1', 'Cannot create session ID: ' + tempID + `\n------ ${err}`) }
        debugLog('INFO', 'server.readVar1', `Session ID generated: ${tempID}`)
    })
    try {
        SYSCONFIG = require('./var/sys.config')
    } catch (err) {
        debugLog('CRIT', 'node.js', err)
        debugLog('CRIT', 'server.readVar1', 'Cannot find system config file, regenerate default setting');
        const recover = require('./lib/sys.recover/sys.recover')
        recover.configRecovery('./var/sys.config');
    }

    startUpCompleted();
}

function startUpCompleted() {
    app.get('/', (req, res) => {
        let rootWindows = SYSCONFIG.display.env.root;
        if (rootWindows == '') { rootWindows = SYSCONFIG.console.app };
        fs.readFile(rootWindows, function(err, data) {
            res.send(data);
        })
    })

    app.listen(3000, () => {
        debugLog('STAT', '', `Port opened`)
    })
}

function shutdown() {

}