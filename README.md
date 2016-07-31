# WorldViewJS

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
  world.style.transform = transformation.transform
}, {
  container: container,
  world: world,
})

// Bind some event handlers, etc.
container.addEventListener('mousewheel', function(e) {
  view.zoomAtMouse(event.deltaY, {
    pageX: e.pageX,
    pageY: e.pageY,
  })
})
```

## API

[TODO]

## Acknowledgements

[TODO]

## License

MIT
