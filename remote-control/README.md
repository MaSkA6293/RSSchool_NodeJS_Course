# Websocket Remote Control

## Description

The task is to implement remote control backend using `nutjs.dev` library and websocket.

User interface for your remote control backend is [here](https://github.com/rolling-scopes-school/remote-control)

The backend should be able to do the following:

- Start websocket server
- Handle websocket connection
- Move mouse (Up, Down, Left, Right)
- Draw circle, rectangle and square
- Send current mouse coordinates
- Send desktop capture (optionally)

## Technical requirements

- Use 18 LTS version of Node.js

## Install

1. Install Node.js
2. Clone this repository
3. Switch branch <code>remote-control</code>
4. Go to remote-control folder
5. To install all dependencies use <code>npm install</code>

## Run the APP

- The program is started in production mode by npm script `start` in following way:

```bash
npm run start
```

- To start program in development mode use the command npm script `start:dev` in following way:

```bash
npm run start:dev
```

## List of websocket commands and their syntax (<- - cmd from frontend, -> - answer):

- Navigation over the x and y axis
  - Move mouse up
  ```bash
  <- mouse_up {y px}
  ```
  - Move mouse down
  ```bash
  <- mouse_down {y px}
  ```
  - Move mouse left
  ```bash
  <- mouse_left {x px}
  ```
  - Move mouse right
  ```bash
  <- mouse_right {x px}
  ```
  - Send mouse coordinates
  ```bash
  <- mouse_position
  -> mouse_position {x px},{y px}
  ```
- Drawing
  - Draw circle with pushed left button:
  ```bash
  <- draw_circle {px}
  ```
  - Draw rectangle with pushed left button:
  ```bash
  <- draw_rectangle {px} {px}
  ```
  - Draw square with pushed left button:
  ```bash
  <- draw_square {px}
  ```
- Print screen
  - Make print screen command and send image (a base64 buffer of the 200 px square around the mouse position):
  ```bash
  <- prnt_scrn
  -> prnt_scrn {base64 string (png buf)}
  ```
