This file is people who want to have a really quick start for a stable system.
# Index
- [Before code](#Before-code) Notes, environment setup
- [Simple app](#simple-app) For building an application

# Before code
## Note
This note will be update very frequently before Velvety version `1.0.0`, so please expect change in this document.

## Package initialize
Start with create a folder that name `<yourAppType>.<yourAppName>`.
Please select type of your app base on this list:
- `app` for applications. The system will serve your app with `text/html` header.
- `font` for fonts, including css, links file.
- `dm` for desktop manager
- `wm` for windows manager
- `test` for testing your package. The system will deliver files according to `package.json`. By using this type, package managers won't update your package or scan it.
We suggest you not to put any special character (include space (` `) but `-` and `_` are allowed) in your app name, since the server can misinterprete your app name. \
Next things is initialize your package with `npm init`, with the entry point (`main` field) point to where the server should serve when `/lib/<yourPackage>` called by other app.
To test your app, simply put it in `/lib` and run it with your windows manager, or connect to `/lib/<yourPackage>`.

# Simple app
## Requirement
You should understand HTML, CSS and Javascript code  \
## Hello world
To start with, let's create an Hello world app inside a folder name `test.hello-world`. \
Due to the nature of HTML and the laziness of the developer, you cannot create an simple console app (yet), so we will start with an simple HTML page that display "Hello world"
```HTML
<!DOCTYPE html>
<html>
<head></head>
<body>
    <p>Hello world</p>
</body>
</html>
```
Now test it, you should see something like this: \
![alt text](https://media.discordapp.net/attachments/797000085367422998/797000163612164106/unknown.png)  \
Now instead of wasting time to show you about HTML, there're many tutorial out there you can use to learn HTML, CSS and JS (I personally suggest [w3school](https://www.w3schools.com/html/)). Instead, we will continue with many system import, modules and library that you should know.

## Access files inside your project folder/ external configuration files
Now, to access all your files, you can use `/lib/file/<yourPackage>/<fileInsodeYourFolder>`. \

### External CSS
Some external CSS for special purpose like color palette or elements theme can be access with the link `/etc/appearance/*.css` \
For more information about these file, please refer to [css-theme](css-theme-md) and [File list](import.md#Appearance). \
For now, we will get the color palette by add the following line to `<head>` tag:
```html
<link rel="stylesheet" href="/etc/file/appearance/color-palette.css" type="text/css">
```
If you want, you can also add system element style by using:
```html
<link rel="stylesheet" href="/etc/file/appearance/elements.css" type="text/css">
```
Be mindful for some CSS conflict when coding.
### Local CSS
So first we need to create a CSS file, because put it inside HTML can make your code looks nasty in a big project. Let's call that file `style.css`. \
We then need to include it in your HTML file:
```html
<link rel="stylesheet" href="/lib/file/test.hello-world/style.css" type="text/css">
```
\
After import two css file, one local, one external, we now continue use the color palette to put the color configuration from your system to your app. Note that your system theme and color may differ from mine (I'm using the default theme). \
We first need to adjust to color of the text and the background. Please read [This document](css-theme-md) to understand what in the `color-palette.css` and how to use it.
```css
body {
    color: var(--text-color);
    background: var(--background-color)
}
```
Your app color should change to your system configurated color now.

## Read write file
You should read about `sys.fs.md` at [here](sys.fs.md#sys.fs.js-guide) before start.
### Create a file stream
After read that document, we now start with creating a script file and name it as `script.js`.
Import the script and the module into HTML by:
```html
<script src="/lib/sys.fs.js"></script>
<script src="/lib/file/test.hello-world/script.js"></script>
```
We will create a form that will take username, password and a button for user to login. I didn't warp this code around `<form>` tag to prevent it from reload the page after click login button.
```html
    <input type="text" placeholder="Username" id="loginFormUser"/>
    <input type="text" placeholder="Password" id="loginFormPass">
    <button id="loginButton" onclick="login()">Login</button>
```
See we create the button will call `login()` function? That's when we have to do a bit of Javascript code.
```js
let asyncFS, appLock;

function login() {
    asyncFS = new fs(document.getElementById('loginFormUser').value, document.getElementById('loginFormPass').value, 'hello-world-fs-asyncFS', true, function(lock) {
        appLock = lock;
        if (appLock) { console.log('OK') } else {
            //authentication failed
            document.getElementById('loginFormUser').value = '';
            document.getElementById('loginFormPass').value = '';
        }
    })
}
```
What happen in this function is it will create a new FS stream with the value that the user entered. If success, it will log into console "ok" and save the lock to `appLock`; if the authentication failed, it will clear both input field. \
After testing it, you can see in your browser console like this:
![alt text](https://media.discordapp.net/attachments/797000085367422998/797013720042962954/unknown.png) \
You have created a file stream!