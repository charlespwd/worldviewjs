# WorldViewJS

[![Build
Status](https://travis-ci.org/charlespwd/worldviewjs.svg?branch=master)](https://travis-ci.org/charlespwd/worldviewjs)
[![codecov](https://codecov.io/gh/charlespwd/worldviewjs/branch/master/graph/badge.svg)](https://codecov.io/gh/charlespwd/worldviewjs)

WorldViewJS is a tool for turning just about anything into a zoomable/pannable/rotatable map.

It is tiny (3.3kB (gzipped), including dependencies).

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

* `constructor(update, options)`
* `setDimensions(worldWidth, worldHeight, containerWidth, containerHeight)`
* `setContainerOrigin(x_document, y_document)`
* `resetContainerSize(containerWidth, containerHeight)`
* `zoomBy(change, event)`
* `panBy(dx, dy)`
* `isZoomedOut()`
* `zoomAtMouse(wheelDelta, event)`
* `panStart(event)`
* `panMove(event)`
* `panEnd(event)`
* `publish()`

## License

MIT
