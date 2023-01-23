
# Task Management App Client

This is the reporsitory for the front-end of a simple task management web app.


## Demo

The deployed application, hosted on AWS Amplify, can be accessed at the following URL:

https://main.d3uxpr24tjct0i.amplifyapp.com/


## Features / User Instructions

- Select a list from the dropdown box to view all associated tasks
- Click Create List to create a new list with a specified name
- Click Rename List to rename the selected list
- Click Delete List to delete the selected list and all associated tasks
- All columns in the task table are sortable in ascending and descending order by clicking each column heading
- Click Add Task to add a new task to the selected list with a task name, description and deadline
- Click Delete Task to delete all selected tasks (single or multiple)
- Click the tick icon in the rightmost Actions column to mark a task as complete/incomplete
- The text of completed tasks is formatted with ~strike-through~ styling
- Click Move Task to move all selected tasks (single or multiple) to a different chosen list


## Run Locally

Clone the project:

```bash
  git clone https://github.com/LoftyWarne/task-management-app-client.git
```

Go to the project directory:

```bash
  cd task-management-app-client
```

Install dependencies:

```bash
  npm install
```

Start the server:

```bash
  npm start
```


## Dependencies

See package.json
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file.

`REACT_APP_API_HOST` - address of the Node Express.js backend server


## Running Tests

To run tests, use the following command:

```bash
  npm run test
```


## Authors

- Conor Warne [@LoftyWarne](https://github.com/LoftyWarne)




## Support

For support, email conorwarne92@gmail.com


## Related

Here are some related projects that form the other elements of the full-stack:

[Task Management App Server](https://github.com/LoftyWarne/task-management-app-server.git)

[Task Management App Database](https://github.com/LoftyWarne/task-management-app-db.git)

