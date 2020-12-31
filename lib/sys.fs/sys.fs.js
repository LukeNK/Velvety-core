// File that handle file handle and auth
let FSSTREAMS = {};

class fs {
    constructor(authID, authPass, key, isAsync) {
        this.authID = authID;
        this.authPass = authPass;
        this.isAsync = isAsync;

        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", `/fs/?type=auth&id=${authID}&pass=${authPass}`, isAsync);
        xhttp.send();

        if (isAsync) {
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.responseText != "err") {
                        FSSTREAMS[key] = true;
                    }
                }
            };
        } else {
            if (xhttp.responseText != "err") {
                FSSTREAMS[key] = true;
            }
        }
    }
    info(key, name, callback) {
        // callback(err, data)
        xhttp.open("GET", "ajax_info.txt", true);
        xhttp.send();
        if (this.isAsync) {
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    callback(null, this.respondText)
                }
            };
        } else {
            return this.responseText
        }

    }
    send(path, data, callback) {}
}