---
title: "HTML TODO Tutorial (Part 3)"
date: 2019-05-20T06:07:39-05:00
draft: false
categories: [general, development]
tags: [html, css, javascript]
---

On our [previous post]({{< ref "html-todo-tutorial-part2.md" >}}) we worked on making our TODO App functional. On this part of the tutorial we're working on adding some CSS Animations and Transitions to make our app a little more user friendly. Let's start by adding transition rules to our CSS:

```css
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
```

We modified the first set of rules **ul#todos>li**. In it we changed to use height instead of padding and if you notice we're setting it to 0, with the **overflow** rule set to hidden so when the element is inserted on the page the browser won't display it until you add the new **show** rule we're creating(**ul#todos>li.show**), where the height, margin and opacity values are changed. And the magic happens with the **transition** rule. This rule is set to transition all changes on our **li** element from starting value (0) to ending values in 0.4s with an ease-out animation. But the magic will only happen if the browser sees the change, so in order to do that we have to change our JavaScript to let the browser see the change.

```javascript
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
            setTimeout(() => {
                node.classList.add('show')
            }, 10);

            todo.value = '';
            todo.focus();
        }
```

In all this block of code we're only adding the setTimeout function near the bottom to add the class show to the **li** html element we're adding. And, again, we're doing this just so the browser notices the changes in the **li** element properties and animates them. That's why we only wait 10 milliseconds to add the **show** class to the element. But wait, what happened to our other TODO's we had, they're not showing up anymore. That's because the don't have the **show** class. Let's fix that:

```html
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
        <div id="success"></div>
        <div id="error"></div>
        <input type="text" id="todo">
        <button onclick="addTodo()">Add TODO</button>
    </div>
```

That's it right, well, no. If we click on a TODO, it goes away without an animation, and we would like it to fade out as well. To do that we need to remove the **show** class before we remove the element. Let's change that in our JavaScript:

```javascript
        todos.addEventListener("click", (event) => {
            let todo = event.target;
            todo.classList.remove('show');
            setTimeout(() => {
                todos.removeChild(todo);
            }, 500);
            let success = document.getElementById('success');
            success.innerHTML = '<p>Finished <strong>' + todo.innerText + '</strong> TODO!</p>'
            setTimeout(() => {
                success.innerHTML = '';
            }, 2000);
        })
```

Here you can see how we added the code to remove the **show** class and added a setTimeout function to remove the element after the animation has finished (if you remove it without waiting then there'll be no animation). Ok, that's much better, but we still have to improve how we show success or error messages, for that we're going to use something that **Material Design** calls **snackbar**. **Material Design** is a set of rules that Google proposed a few years ago to make a better user experience. It's based on a lot of research and if you want to learn more please visit [material.io](https://material.io). **Snackbars** are used to display messages on a screen, which is exactly what we need. So let's implement it:

```css
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

Few! That's a lot of CSS, let's go through it. In the **selected** class I made some changes to make it look better with the animation. In the **error** & **success** rules we've removed some rules that are going into our new **snackbar** class. And you'll see that we are also adding a **show** class to both our **#error** & **#success** rules. In this rule we have our **animation** rule in which we're telling our browser to use our **@keyframes fadein** rules for when the element is created and the **fadeout** for when the element is removed.

Now for our JavaScript, let's start with the **success** snackbar. We need to add and remove the **show** class to the snackbar.

```javascript
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
```

And for the **error** snackbar we do the same:

```javascript
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

Since we added the **snackbar** class we need to add it to our HTML elements like so:

```html
        <div id="success" class="snackbar"></div>
        <div id="error" class="snackbar"></div>
```

And that's it. Here's the final version:

{{< gist jdmr c085fcc27871243c4a04bb343fc9d30b >}}

As you might notice in this final version, the HTML part is rather small and the CSS and JavaScript are getting rather big. It's time to put them in different files and to manage them. We'll do this in our [next post]({{< ref "html-todo-tutorial-part4.md" >}}) and also introduce [NodeJS](https://nodejs.org) and [ParcelJS](https://parceljs.org).