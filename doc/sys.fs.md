# sys.fs.js guide
This is a guide how to use file system module for apps to use it. This module include file system read write, cookie set check.

## How file system work
Each app first need to create a `lock` by using user's password and username. The system will take the `key` (which given by the app) and generate a `lock`. Then to read and write, the app need to send both the `key` and the `lock` for the the system to verify and respond the data back. The whole process was managed by `sys.modules`.

## Timeline
### 1. Create
You should get the username and password from the user. Then import the module with HTML
```html
<script src="/lib/sys.fs"></script>
```
It is better to put this line in `<head>` tag so the system will be initialize before hand.
Then create a stream object
```js
let files = new fs(username, password, key, isAsync, callback);
```
- `key (string)` is your authentication key that your app will use to communicate and verify itself with the system. This key mayby delete by user at anytime, so we suggest to verify if your key still exist (refer to [confirmation](#2.-confirmation)). We suggest key that have special name in order to not infer with other app. We suggest keyname have the structure like: `<appname>-fs-<streamName>` \
- `isAync (boolean)` to set if your app will use as an async function or not. \
**We suggest you set this to `true` and use async, since synced function is in the process of removing out of the web standard, and synced function may hang your app if the system is busy or slow.**
- `callback (function)` system callback when finished, return lock. The data given back is `callback(lock)` if authentication is finished and ok, else it will pass an empty string \
- **For synced function**: You then need to perform `getLock()` method to get the lock.
Example:
```js
let username = usernameInput.value; //get the username
let password = passwordInput.value; //get the password
let appKey = 'appname-fs-mainstream';
let appLock;

// async
let asyncFS = new fs(username, password, appKey, true, function(lock) {
    console.log(lock); 
    appLock = lock;
});
// sync
let syncFS = new fs(username, password, appKey, false);
appLock = syncFS.getLock()
```

### 2. Confirmation
It's a good a good habit to check if the stream actually created by using global variable `FSSTREAMS`:
```js
if (appKey in FSSTREAMS && FSSTREAMS[appKey] == true) {console.log('Stream created')}
```

### 3. Close stream
We suggest you close stream everytime you shut down if it not affect user experience. close stream will clear key and authenticaion, which will increase system security. 
```js
appFS.close()
```

## Methods
### fs.writeFile(lock, path, data, callback)
Write data to path, can be use async (which `callback(error)`) or sync (return error)

### fs.readFile(lock, path, callback)
Read data from path. Callback return (`error`, `data`). Synced function will return `data` if there's no `error`, and reverse; `error` will have first four characters as `-err`, you can check the string before use.

### fs.syscallListener(lock, path, callback) 
Every syscall in Velvety will be a link that only send response back when there're a syscall (which will be cover as a file). This method will listen to that call. Some syscall can also be evoke by app. \
Callback and synced function will return string of `arguments`. \
We suggest to avoid using synced function on this method, since this will hang your application until the system call your app. \
Please refer to [Table-of-syscall](#appendix-1-Table-of-syscall) for list of syscall and its' arguments.