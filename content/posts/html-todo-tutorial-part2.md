---
title: "HTML TODO Tutorial (Part 2)"
date: 2019-05-16T17:16:11-05:00
draft: false
categories: [general, development]
tags: [html, css, javascript]
---

So on our [previous post]({{< ref "html-todo-tutorial-part1.md" >}}) we started working on our TODO app that looks like:

![image alt text](/todos.jpg)

But it doesn't do nothing just yet. And that's what we're going to work on now. The same goes for JavaScript as for CSS, we can inline it on the page but when it gets too big, is better to create an external file and reference it. We're inlining it for now, so have your index.html code look like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>TODOS</title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <style>
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
            padding: 7px 5px;
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
    </style>
</head>
<body>
    <div id="main">
        <h1>TODOS</h1>
        <ul id="todos">
            <li>Feed the dog</li>
            <li>Walk the dog</li>
            <li>Mow the lawn</li>
            <li>Feed the chickens</li>
            <li>Read a book</li>
            <li>Do some exercise</li>
        </ul>
        <input type="text" id="todo">
        <button onclick="addTodo()">Add TODO</button>
    </div>
    <script>
        function addTodo() {
            let todo = document.getElementById('todo');
            let node = document.createElement('li');
            let textNode = document.createTextNode(todo.value);
            node.appendChild(textNode);
            document.getElementById('todos').appendChild(node);

            todo.value = '';
            todo.focus();
        }
    </script>
</body>
</html>
```

You can add a TODO now by entering it in the input field and clicking the **Add TODO** button. Notice that we added the **todo** id to the input and added the _onclick_ event to the button. After you add some todos in and are very excited because it worked, you begin to wonder why can't I hit enter to add a TODO? Let's do that by adding a little more JavaScript. Change your script block to look like this:

```html
    <script>
        let todo = document.getElementById("todo");
        todo.focus();
        todo.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                addTodo();
            }
        });

        function addTodo() {
            let node = document.createElement('li');
            let textNode = document.createTextNode(todo.value);
            node.appendChild(textNode);
            document.getElementById('todos').appendChild(node);

            todo.value = '';
            todo.focus();
        }
    </script>
```

We moved the todo element outside the function and use it to add a _keyup_ event. You could also add it as an attribute/property of the input (**onkeyup**) like we did for the button with the **onclick** event. It's just a matter of preference.

What if we wanted to add a task that's already in the list? Right now we'll get duplicates, let's add some validation before we add the task.

```javascript
        function addTodo() {
            let ul = document.getElementById("todos");
            let elements = ul.getElementsByTagName("li");
            for(let li of elements) {
                if (li.innerText === todo.value) {
                    alert('Already have that TODO in the list');
                    return;
                }
            }

            let node = document.createElement('li');
            let textNode = document.createTextNode(todo.value);
            node.appendChild(textNode);
            ul.appendChild(node);

            todo.value = '';
            todo.focus();
        }
```

Let's go through what we did. We go get the **ul** element at the beginning and then get the **li** elements from it and loop through them with the for...of. In the loop we check if the element's value equals that of the input. But wait, we didn't use the value property of the **li** element, why is that? Because the input elements are elements that expect user input, these have their value updated. A **li** on the other hand is like any other element where it's value it's 0, and we don't need it's value, we need that element's content. The content of an element can be HTML Content or Text Content and you obtain it with innerHTML or innerText. We are using innerText because we don't need the browser to parse the result so we just obtain the text inside the **li** element. Continuing with the code review, we see an alert that informs the user that we already have that TODO in the list. And then the next line is a _return_, this will break the flow of code and finish the function so the code underneath won't be executed, in the case we don't find that TODO it will finish going through the loop and then add the new TODO to the bottom of the list. We also made another change, since we need the **ul** element at the top of the function we create a variable to use it in both places (you don't want your browser to be looking for the same element over and over again when you can avoid it).

Ok, we've let the user know that he already has a TODO if he tries to add the same TODO again, but if the user has a long list he might want help finding it. So let's change the TODO's background to help him find it. First we need to add this CSS rules inside the style block in the head section.

```css
        .selected {
            background-color: #aaaaaa;
            font-size: 1.2em;
        }

        #error {
            background-color: #ed4337;
            font-size: 1.5em;
            text-align: center;
        }

        #error>p {
            margin-bottom: 0;
            padding: 10px 5px;
            font-size: 0.6em;
            color: #fafafa;
        }
```

And then we modify our html by adding the error div on top of the todo input.

```html
    <div id="main">
        <h1>TODOS</h1>
        <ul id="todos">
            <li>Feed the dog</li>
            <li>Walk the dog</li>
            <li>Mow the lawn</li>
            <li>Feed the chickens</li>
            <li>Read a book</li>
            <li>Do some exercise</li>
        </ul>
        <div id="error"></div>
        <input type="text" id="todo">
        <button onclick="addTodo()">Add TODO</button>
    </div>
```

And finally we modify our addTodo function to look like this:

```javascript
        function addTodo() {
            let ul = document.getElementById("todos");
            let elements = ul.getElementsByTagName("li");
            for(let li of elements) {
                if (li.innerText === todo.value) {
                    li.classList.add('selected');
                    document.getElementById('error').innerHTML = '<p>Already have that TODO in the list</p>';
                    return;
                }
            }

            let node = document.createElement('li');
            let textNode = document.createTextNode(todo.value);
            node.appendChild(textNode);
            ul.appendChild(node);

            todo.value = '';
            todo.focus();
        }
```

Notice that we've removed the alert and instead are adding an element into the page. There's nothing wrong with using alerts, but you can't style them, so in this case where we want to let the user know an error has ocurred we can do a better job by adding a styled element on the screen. Now that we've let the user know about the TODO is already in there, let's remove the cues after a couple of seconds. We do this with a timer function in JavaScript called **setTimeout**, which calls a function at the end of the milliseconds you specify:

```javascript
        function addTodo() {
            let ul = document.getElementById("todos");
            let elements = ul.getElementsByTagName("li");
            for(let li of elements) {
                if (li.innerText === todo.value) {
                    li.classList.add('selected');
                    let error = document.getElementById('error');
                    error.innerHTML = '<p>Already have that TODO in the list</p>';
                    setTimeout(() => {
                        li.classList.remove('selected');
                        error.innerHTML = '';
                    }, 2000);
                    return;
                }
            }

            let node = document.createElement('li');
            let textNode = document.createTextNode(todo.value);
            node.appendChild(textNode);
            ul.appendChild(node);

            todo.value = '';
            todo.focus();
        }
```

Note that all the extra stuff happens inside the for loop. Again, since we're using the error element twice, we assign it to a variable once found and use it as many times as we need. And even though **addTodo** function ended the browser will run the function inside the timeout at the specified **setTimeout** which in this case is in 2 seconds (2000 milliseconds). Now that the message has disappeared we need a quick way of getting rid of the text in the todo input. We're already listening for keys and we tied the **enter** to add a TODO, so let's use the **ESC** key to clear the text and make our **todo.addEventListener** look like this:

```javascript
        todo.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                addTodo();
            } else if (event.keyCode === 27) {
                todo.value = '';
            }
        });
```

Finally we need a way to finish our tasks, so let's create a click event listener on the **ul** element that removes the child that was clicked. And this is how the whole HTML should look like by now:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>TODOS</title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <style>
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
            padding: 7px 5px;
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
        }

        #error {
            background-color: #ed4337;
            font-size: 1.5em;
            text-align: center;
        }

        #error>p {
            margin-bottom: 0;
            padding: 10px 5px;
            font-size: 0.6em;
            color: #fafafa;
        }

        #success {
            background-color: #4bb543;
            font-size: 1.5em;
            text-align: center;
        }

        #success>p {
            margin-bottom: 0;
            padding: 10px 5px;
            font-size: 0.6em;
            color: #fafafa;
        }
    </style>
</head>
<body>
    <div id="main">
        <h1>TODOS</h1>
        <ul id="todos">
            <li>Feed the dog</li>
            <li>Walk the dog</li>
            <li>Mow the lawn</li>
            <li>Feed the chickens</li>
            <li>Read a book</li>
            <li>Do some exercise</li>
        </ul>
        <div id="success"></div>
        <div id="error"></div>
        <input type="text" id="todo">
        <button onclick="addTodo()">Add TODO</button>
    </div>
    <script>
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
            todos.removeChild(todo);
            let success = document.getElementById('success');
            success.innerHTML = '<p>Finished <strong>' + todo.innerText + '</strong> TODO!</p>'
            setTimeout(() => {
                success.innerHTML = '';
            }, 2000);
        })

        function addTodo() {
            let elements = todos.getElementsByTagName("li");
            for(let li of elements) {
                if (li.innerText === todo.value) {
                    li.classList.add('selected');
                    let error = document.getElementById('error');
                    error.innerHTML = '<p>Already have that TODO in the list</p>';
                    setTimeout(() => {
                        li.classList.remove('selected');
                        error.innerHTML = '';
                    }, 2000);
                    return;
                }
            }

            let node = document.createElement('li');
            let textNode = document.createTextNode(todo.value);
            node.appendChild(textNode);
            todos.appendChild(node);

            todo.value = '';
            todo.focus();
        }
    </script>
</body>
</html>
```

We solved it by adding another div for the success message and CSS rules to style it as well as adding the listener to the **ul**. On our next part we'll look into transitions and animations.