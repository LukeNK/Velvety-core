// System recovery
const fs = require('fs')
module.exports = {
    configRecovery: function(path) {
        if (!path) { // Fully scan mode
        } else if (path == './var/sys.config') {
            // Download from the internet or get from local
            console.log(path)
        }
    }
}