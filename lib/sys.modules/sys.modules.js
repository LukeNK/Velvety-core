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
}