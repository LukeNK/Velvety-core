// The core which send data to clients (display)
const express = require('express')
const app = express();
const fs = require('fs');
const path = require('path');

let SYSCONFIG; // Will init at readVar1();
let SYSMODULES; // Will init at readVar2();

function debugLog(lv, location, message) {
    let res;
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    var milisec = date.getMilliseconds();
    milisec = (milisec < 10 ? "00" : "") + milisec;
    milisec = (milisec < 100 ? "0" : "") + milisec;


    res = "> " + year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec + ':' + milisec;
    if (location != '') {
        res += ` | [${lv}@${location}] ${message}`;
    } else {
        res += ` | [${lv}] ${message}`;
    }

    function fileLog() {
        if (lv == 'CRIT' || lv == 'MESS') { console.log(res) } else if (lv == 'STOP') { process.kill(process.pid) }
        fs.appendFile('./var/session/log', res + '\n', function(err) {
            if (err) { debugLog('CRIT', 'node.js', err) }
        });
        if (location) {
            location = location.replace(/ /g, "");
            location = location.replace(/\//g, "");
            fs.appendFile(`./var/session/${location}-log`, res + '\n', function(err) {
                if (err) { debugLog('CRIT', 'node.js', err) }
            });
        }
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
    readVar2();
}

function readVar2() {
    // require modules for system to work
    SYSMODULES = require('./lib/sys.modules/sys.modules');
    startUpCompleted();
}

function startUpCompleted() {
    debugLog('MESS', '', 'Welcome to Velvety')

    app.get('/', (req, res) => {
        let rootWindows;
        rootWindows = SYSCONFIG.display.root;
        if (rootWindows == '') { rootWindows = SYSCONFIG.console.app };
        fs.readFile(rootWindows, "utf8", function(err, data) {
            if (err) { res.send('Cannot load basic root windows because\n' + err); return }
            res.set({
                'Content-Type': 'text/html',
            })
            res.send(data);
        })
    })

    app.get('/lib/:name', function(req, res) {
        // Only to serve excutable or defined file
        // Please use /lib/file to get your library's directory files
        let name = req.params.name;
        let startupPath; // The excutable location
        if (name.includes('.js')) {
            startupPath = `lib/${name.slice(0, name.length-3)}/${name}`
        } else if (name.includes('.html')) {
            startupPath = `lib/${name.slice(0, name.length-5)}/${name}`
        } else {
            let metaData = require(`./lib/${name}/package`)
            let startupData = metaData.main;
            startupPath = `lib/${name}/${startupData}`;
        }

        fs.readFile(startupPath, "utf8", function(err, data) {
            if (err) {
                debugLog('CRIT', 'GET /lib', err);
                res.send(err);
            } else {
                res.send(data);
                debugLog('INFO', 'GET /lib', `${startupPath} Served`)
            }
        })
    })

    app.use('/lib/file', express.static('lib'))

    app.get('/fs', function(req, res) {
        let type = req.query.type;
        let authID = req.query.id;
        let authPass = req.query.pass;
        let key = req.query.key;

        if ((authID != SYSCONFIG.auth.ID || authPass != SYSCONFIG.auth.pass) && (type != 'create' || type != 'getLock')) {
            res.send('err');
            debugLog('INFO', 'GET /fs', 'Authentication failed');
            return;
        } else {
            debugLog('INFO', 'GET /fs', 'Authentication ID passed')
            fsCheckRespond();
        }

        function fsCheckRespond() {
            if (type == 'create' || type == 'getLock') {
                SYSMODULES.createLock(key, function(err, lock) {
                    if (!err) {
                        res.send(lock);
                    } else { res.send(err) }
                })
            }
        }
    })

    app.post('/fs', function(req, res) {
        let path = req.body.path;
        let data = req.body.data;
        let key = req.body.key;
        let lock = req.body.lock;

        SYSMODULES.verifyLock(key, lock, function(result) {
            if (!result) {
                res.send('err: authentication');
                return
            } else {
                switch (type) {
                    case 'writeFile':
                        fs.writeFile(path, data, 'utf8', function(err) {
                            if (err) { res.json({ err, data }) } { res.send('') }
                        })
                        break;
                    case 'readFile':
                        fs.readFile(path, 'utf8', function(err, data) {
                            res.json({ e: err, d: data })
                        })
                        break;
                    default:
                        res.send('err: unknow type')
                }
            }
        })
    })

    app.get('/run/:path', function(req, res) {
        res.send('')
    })

    app.listen(SYSCONFIG.serverjs.port, () => {
        debugLog('STAT', '', `Port opened`)
    })
}

function shutdown() {

}