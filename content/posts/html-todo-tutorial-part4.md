---
title: "HTML TODO Tutorial (Part 4)"
date: 2019-05-21T05:24:20-05:00
draft: false
categories: [general, development]
tags: [html, css, javascript]
---

Welcome to our fourth part of this tutorial.

In [part 1]({{< ref "html-todo-tutorial-part1.md" >}}) we setup our environment and start building with just HTML and CSS. On [part 2]({{< ref "html-todo-tutorial-part2.md" >}}) we start using JavaScript and make our app functional. On [part 3]({{< ref "html-todo-tutorial-part3.md" >}}) we introduce CSS Transitions and Animation. On part 4 we're going to introduce Webpack, but before we do that we'll first put the CSS and JavaScript into separate files and reference them from our index.html.

First we create a new file called index.css and copy everything inside the **style** tags and paste it in that file:

```css
body {
    background-color: #dddddd;
    color: #333333;
    font-family: 'Open Sans', sans-serif;
    font-size: 18px;
    letter-spacing: .03em;
}

div#main {
    max-width: 400px;
    margin: auto;
}

ul#todos {
    list-style-type: none;
    margin: 0 0 10px 2px;
    padding: 0;
}

ul#todos>li {
    overflow: hidden;
    height: 0;
    margin: 0;
    opacity: 0;
    transition: all 0.4s ease-out;
}

ul#todos>li.show {
    height: 2em;
    margin: 2px 3px;
    opacity: 1;
}

input {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    font-size: 1em;
    padding: 10px;
}

button {
    width: 100%;
    height: 50px;
    margin-top: 10px;
    font-size: 1em;
    background-color: #888888;
    color: #dddddd;
}

.selected {
    background-color: #aaaaaa;
    font-size: 1.2em;
    padding-left: 5px;
    padding-top: 8px;
}

#error {
    background-color: #ed4337;
}

#error>p {
    color: #fafafa;
}

#success {
    background-color: #4bb543;
}

#success>p {
    color: #fafafa;
}

.snackbar {
    visibility: hidden;
    min-width: 250px;
    margin-left: -125px;
    text-align: center;
    border-radius: 2px;
    padding: 16px;
    position: fixed;
    z-index: 1;
    left: 50%;
    bottom: 30px;
}

#error.show, #success.show {
    visibility: visible;
    animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
}

@keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}
```

We do the same for the JavaScript, we create a new file called index.js and copy everything inside the **script** tags in our index.html and paste it there:

```javascript
let todo = document.getElementById("todo");
todo.focus();
todo.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        addTodo();
    } else if (event.keyCode === 27) {
        todo.value = '';
    }
});
let todos = document.getElementById("todos");
todos.addEventListener("click", (event) => {
    let todo = event.target;
    todo.classList.remove('show');
    setTimeout(() => {
        todos.removeChild(todo);
    }, 500);
    let success = document.getElementById('success');
    success.innerHTML = '<p>Finished <strong>' + todo.innerText + '</strong> TODO!</p>'
    success.classList.add('show');
    setTimeout(() => {
        success.classList.remove('show');
    }, 2000);
})

function addTodo() {
    let elements = todos.getElementsByTagName("li");
    for(let li of elements) {
        if (li.innerText === todo.value) {
            li.classList.add('selected');
            let error = document.getElementById('error');
            error.innerHTML = '<p>Already have that TODO in the list</p>';
            error.classList.add('show');
            setTimeout(() => {
                li.classList.remove('selected');
                error.classList.remove('show');
            }, 2000);
            return;
        }
    }

    let node = document.createElement('li');
    let textNode = document.createTextNode(todo.value);
    node.appendChild(textNode);
    todos.appendChild(node);
    setTimeout(() => {
        node.classList.add('show')
    }, 10);

    todo.value = '';
    todo.focus();
}
```

To reference the files from our index.html the script has a src property that we just need to point to our new JavaScript file, but for the style HTML element there's no src attribute, we need to create a link HTML element like the one we used to reference our Google Font. Here's the full index.html:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>TODOS</title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <link href="index.css" rel="stylesheet">
</head>
<body>
    <div id="main">
        <h1>TODOS</h1>
        <ul id="todos">
            <li class="show">Feed the dog</li>
            <li class="show">Walk the dog</li>
            <li class="show">Mow the lawn</li>
            <li class="show">Feed the chickens</li>
            <li class="show">Read a book</li>
            <li class="show">Do some exercise</li>
        </ul>
        <input type="text" id="todo">
        <button onclick="addTodo()">Add TODO</button>
        <div id="success" class="snackbar"></div>
        <div id="error" class="snackbar"></div>
    </div>
    <script src="index.js"></script>
</body>
</html>
```

Notice how small our HTML file is and although there's nothing wrong with deploying this to production. It's not fully optimized. For starters, the browsers don't need the HTML, CSS and JavaScript in human readable code so we can minimize the code and it would still work. Making our code smaller means smaller downloads, and smaller downloads means faster time for our users to start using our app and this is something we want. On the CSS rules we just used the standard rules, but it turns out that some browsers use custom ones. In order to support those browsers we need to add these custom rules besides our standard rules. And like these optimizations there's more. [ParcelJS](https://parceljs.org/) is a tool that helps us do exactly that. In order to use ParcelJS we need to use [NodeJS](https://nodejs.org). Please go to the [NodeJS](https://nodejs.org) website and follow the instructions for downloading and installing it on your environment (if you find this hard, google **install nodejs on** whatever your platform is and you should find a bunch of tutorials, just follow the one that suits you better).

Once NodeJS is installed let's try something new, VS Code comes with a terminal so let's use it by clicking on the **Terminal** Menu Item and then **New Terminal** and execute the following instruction:

```bash
npm init -y
```

This will create a file called package.json in the same folder. This file configures our project as a NodeJS project and we will be updating it to manage it. Now we need to install ParcelJS in our project by running this other instruction:

```bash
npm install -D parcel-bundler
```

This will download and install the **ParcelJS** library in our project, and this library will reside in a new folder that was created by the **npm install** instruction called **node_modules**. This is where all our libraries (and their dependencies) will reside. If you open the folder you'll notice a bunch of folders not just the parcel-bundler folder. This is because the parcel-bundler library depends on a bunch of other libraries and they all get downloaded and installed into our project. That is that in order for ParcelJS to run it needs some other libraries to do so, and **npm** takes care of it (**npm** stands for Node Package Manager). Anyway, now that the library has been installed we need to use it, so we open our **package.json** file to configure a couple of instructions that will run and build our project:

```json
{
  "name": "todos",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "parcel index.html",
    "build": "parcel build index.html",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "parcel-bundler": "^1.12.3"
  }
}
```

In the scripts section we add two instructions: **dev** and **build**. The first one is to run the page locally like what we've been doing from VS Code when we run the page on the live server. The second one is to build a version to deploy to production. To run the **dev** script we execute the following from our terminal:

```bash
npm run dev
```

To build the production version you run it like this:

```bash
npm run build
```

Easy right? If you look in the dist folder after you've run these instructions you'll have to look in the terminal for the file names you need because there will be a lot more than the ones you need in there. That's the intended behaviour the parcel build script, this is to create new files and send them to the dist folder, so you'll have a lot a files in no time. To prevent this you can either call a platform specific instruction that deletes the dist folder before parcel builds the new version or we can use a plugin that does exactly that. Let's opt for the second option. We need to install this plugin in our project like we installed ParcelJS. In our terminal we run the following command:

```bash
npm i -D parcel-plugin-clean-dist
```

Notice we didn't use the full **install** instruction, we used the shorthand **_i_**. And now when we run the same commands (either **dev** or **build**) and we'll get only the latest version in the dist folder. And if you open the **dist/index.html** file, you'll notice that's minimized now. These is to reduce size so it downloads faster, the same goes for the JavaScript and CSS files.

To optimize CSS a little more we'll use PostCSS following the instructions found in [ParcelJS website](https://parceljs.org/css.html).

```bash
npm i -D autoprefixer
```

Create a file named **.browserslistrc** with the following content:

```text
> 1%
last 2 versions
```

And create a file named **.postcssrc with the following content:

```text
{
  "plugins": {
    "autoprefixer": true
  }
}
```

Now if we run the ```npm run build``` command and we open the todos.*.css file and scroll to the right you'll find a **-webkit-transition** rule before the **transition** rule we had in our code. This is because some browsers have not built support for the standard transition rule and need custom rules and with the **autoprefixer** plugin we're covered.
