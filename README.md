# WorldViewJS

[![Build
Status](https://travis-ci.org/charlespwd/worldviewjs.svg?branch=master)](https://travis-ci.org/charlespwd/worldviewjs)
[![codecov](https://codecov.io/gh/charlespwd/worldviewjs/branch/master/graph/badge.svg)](https://codecov.io/gh/charlespwd/worldviewjs)

WorldViewJS is a tool for turning just about anything into a zoomable/pannable/rotatable map.

It is tiny (2kB, including dependencies).

## Installation

[TODO]

## Usage

```javascript
var container = document.getElementById('container')
var world = document.getElementById('world')

// Instantiate your new WorldView
var view = new WorldView(function render(transformation) {
  // The render function is called every time the view should be
  // updated. Since the rendering logic is up to you, you can plug
  // this transformation in the framework of your choice.
  world.style.transform = transformation.transform
})

// Set the container and world sizes
view.setDimensions(500, 500, 1000, 100)

// Bind some event handlers
container.addEventListener('mousewheel', function(e) {
  view.zoomAtMouse(e.deltaY, {
    pageX: e.pageX,
    pageY: e.pageY,
  })
})

// We're done!
```

## API

[TODO]

## Acknowledgements

[TODO]

## License

MIT
