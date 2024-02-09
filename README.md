# Smart Building UI

This is the client-side component of the Smart Building project. It's a React application that allows users to record videos and upload them to the server for processing.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm

### Installing

1. Clone the repository:

```sh
git clone https://github.com/flhamaris/smartbuilding-ui.git
```

2. Navigate into the project directory:

```sh
cd smartbuilding-ui
```

3. Install the dependencies:

```sh
npm install
```

### Running the Application

To start the application, run:

```sh
npm start
```

## Environment variable

The application requires the following environment variables:

- `REACT_APP_MAX_RECORDING_TIME`: The maximum amount of time for a video recording (in ms).
- `REACT_APP_API_HOSTNAME`: The hostname of your server.

These should be placed in a `.env` file in the root of your project.

## Built With

- [React](https://reactjs.org/) - The web framework used
