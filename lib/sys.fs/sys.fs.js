// File that handle file handle and auth
let FSSTREAMS = {};

class fs {
    constructor(authID, authPass, key, isAsync, callback) {
        // callback(lock);
        this.authID = authID;
        this.authPass = authPass;
        this.key = key;
        this.isAsync = isAsync;

        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", `/fs/?type=create&id=${this.authID}&pass=${this.authPass}&key=${this.key}`, isAsync);
        xhttp.send();

        if (this.isAsync) {
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.responseText != "err") {
                        FSSTREAMS[key] = true;
                        callback(this.responseText);
                    } else(callback(''))
                } else callback('')
            };
        } else {
            if (xhttp.responseText != "err") {
                FSSTREAMS[key] = true; // discard the responded text
            }
        }
    }
    getLock() {
        // return the lock for synced function
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", `/fs/?type=getLock&id=${this.authID}&pass=${this.authPass}&key=${this.key}`, false);
        xhttp.send();
        return xhttp.responseText
    }
    writeFile(lock, path, data, callback) {
        // callback(err);
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", `/fs`, this.isAsync);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(`type=writeFile&key=${this.key}&lock=${lock}&path=${path}&data=${data}`);
        if (this.isAsync) {
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    callback(respondText)
                }
            };
        } else { return xhttp.responseText; }
    }
    readFile(lock, path, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", `/fs`, this.isAsync);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({ "type": "readFile", "key": this.key, "lock": lock, "path": path }));
        if (this.isAsync) {
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if ((this.responseText).slice(0, 3) == 'err') {
                        callback(this.responseText, null)
                    } else { callback(null, this.responseText) }
                }
            };
        } else { return xhttp.responseText }
    }
    syscallListener(lock, path, callback) {
        // callback(arguments)
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", `/syscall`, this.isAsync);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({ "type": "syscallListener", "key": this.key, "lock": lock, "path": path }));
        if (this.isAsync) {
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    callback(this.responseText)
                }
            };
        } else { return xhttp.responseText }
    }
    close() {
        let i = 0;
        while (i < FSSTREAMS.length) {
            if (FSSTREAMS[i] === value) {
                FSSTREAMS.splice(i, 1);
            } else {++i; }
        }
        this.authID = undefined;
        this.authPass = undefined;
        this.key = undefined;
        this.isAsync = undefined;
    }
}


// From www.w3school.com
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}