const fs = require('fs');

module.exports = {
    varLoader: function(reqVar, callback) {
        // callback(err, data)
        if (!reqVar) {
            fs.readdir('./var', (err, files) => {
                callback(err, files)
            });
        } else {
            fs.readFile('./var/' + reqVar, "utf8", function(err, data) {
                callback(err, data)
            })
        }
    },
    // Keyring functions
    createLock: function(key, callback) {
        // callback(err, lock)
        let tempLock = module.exports.makeLock(32);

        fs.writeFile(`./var/keys/${key}`, tempLock, function(err) { callback(err, tempLock) })
    },
    verifyLock: function(key, lock, callback) {
        // Checkkey 
        fs.readFile(`./var/keys/${key}`, "utf8", function(err, data) {
            if (!err) {
                if (lock = data) { callback(true) } else { callback(false) }
            } else { callback(false) }
        })
    },
    makeLock: function(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    getDateTimeFormated: function() {
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

        return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
    },
    isValidHttpUrl: function(string) {
        let url;

        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }
}