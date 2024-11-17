# TODO APP

Introducing the ultimate task management solution: My Todo app offers a seamless experience for organizing your daily responsibilities with advanced features and unparalleled convenience.

With a robust authentication system powered by JWT, users can securely log in and sign up, ensuring their data remains confidential. Once logged in, users can effortlessly create tasks and sub-tasks, each equipped with checkbox functionality for easy tracking of progress.

Experience unparalleled organization and efficiency with our Todo app's comprehensive filtering capabilities. Seamlessly navigate through your tasks with precision and ease using advanced filters tailored to your specific needs.

Effortlessly sort tasks based on their status, whether they're Completed, Pending, In-Progress, or Canceled, ensuring you stay on top of your workload with clarity and confidence.

Take control of your task categories with customizable filters for task type. Whether it's Personal, Default, Shopping, or Work-related tasks, our app adapts to your diverse needs, ensuring every aspect of your life is organized seamlessly.

Stay ahead of deadlines by filtering tasks based on their timeline. Whether you need to focus on tasks for Today, Last Week, or the Last 30 Days, our app ensures you prioritize your time effectively and never miss a beat.

With intuitive filtering system, managing your tasks has never been easier. Experience unparalleled control and organization as you effortlessly navigate through your to-do list, staying productive and focused every step of the way.

Never miss a deadline again with our built-in reminder system, which notifies users as task deadlines approach, ensuring timely completion. Plus, users have the flexibility to categorize tasks as Completed, Pending, In-Progress, or Canceled, providing clarity on their task status at a glance.

But that's not all – my app takes task management to the next level with intelligent calling capabilities. By prioritizing both user and task urgency, cron job-based calling system ensures that users are reminded of critical tasks precisely when they need it most, streamlining productivity and efficiency like never before.

Say goodbye to disorganized to-do lists and hello to productivity mastery with my Todo app. Experience the power of seamless task management today!

## Requirements

  For development, you will only need Node.js and a node global package, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

  If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

  If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

### Install

    $ git clone https://github.com/shanmukh0504/todo-app.git
    $ cd todo-app
    $ npm install

### Running the project
- #### Running Backend
  ```
    $ cd server
    $ npm start
  ```
- #### Running Frontend
  ```
    $ cd client
    $ npm start
  ```
 ### Simple build for production

    $ npm build
