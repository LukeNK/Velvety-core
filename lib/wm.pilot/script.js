let appLock;

function clock() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

    //Greet
    let greet = '';
    if (h < 6) greet = 'Good early morning'
    else if (h < 12) greet = 'Good morning'
    else if (h < 18) greet = 'Good afternoon'
    else if (h < 22) greet = 'Good evening'
    else greet = 'Goodnight';

    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);

    document.getElementById('topBarClock').innerHTML =
        h + ":" + m + ":" + s;

    let t = setTimeout(clock, 500)
}

function checkTime(i) {
    if (i < 10) { i = "0" + i };
    return i;
}

function bottomTrigger() {
    document.getElementById('menu').style.height = '40%';
}

function bottomClose() {
    document.getElementById('menu').style.height = '1px';
}

function menuSideTrigger() {
    document.getElementById('menu').style.height = (screen.height).toString() + 'px';
}


function onLoadCaller() {
    clock();
}

// Login 
function login() {
    asyncFS = new fs(document.getElementById('loginFormUser').value, document.getElementById('loginFormPass').value, 'pilot-fs-asyncFS', true, function(lock) {
        appLock = lock;
        if (appLock) { document.getElementById('lockScreen').style.display = 'none'; } else {
            //authentication failed
            document.getElementById('loginFormUser').value = '';
            document.getElementById('loginFormPass').value = '';

        }
    })
}