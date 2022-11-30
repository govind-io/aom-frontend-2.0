export default function ScrollZoom(container, max_scale, factor) {
  var target = container; //targeting the video element;
  var size = { w: target.clientWidth, h: target.clientHeight };
  var pos = { x: 0, y: 0 };
  var scale = 1;
  var zoom_target = { x: 0, y: 0 };
  var zoom_point = { x: 0, y: 0 };
  var curr_tranform = target.style.transition;
  var last_mouse_position = { x: 0, y: 0 };
  var drag_started = 0;
  target.style.transformOrigin = "0 0";
  target.addEventListener("wheel", scrolled);
  target.addEventListener("mousemove", moved);
  target.addEventListener("mousedown", function (event) {
    drag_started = 1;
    target.style.cursor = "move";
    target.style.transition = "transform 0s";
    /* Save mouse position */
    last_mouse_position = { x: event.pageX, y: event.pageY };
  });

  target.addEventListener("mouseup", function () {
    drag_started = 0;
    target.style.cursor = "default";
    target.style.transition = curr_tranform;
  });

  target.addEventListener("mouseout", function () {
    drag_started = 0;
    target.style.cursor = "default";
    target.style.transition = curr_tranform;
  });

  function scrolled(e) {
    var offset = target.getBoundingClientRect();
    zoom_point.x = e.pageX - offset.left;
    zoom_point.y = e.pageY - offset.top;

    e.preventDefault();
    var delta = e?.deltaY || e?.originalEvent?.deltaY;
    if (delta === undefined) {
      //we are on firefox
      delta = e?.originalEvent?.detail;
    }
    if (!delta) return;
    delta = -delta;
    delta = Math.max(-1, Math.min(1, delta)); // cap the delta to [-1,1] for cross browser consistency

    // determine the point on where the slide is zoomed in
    zoom_target.x = (zoom_point.x - pos.x) / scale;
    zoom_target.y = (zoom_point.y - pos.y) / scale;

    // apply zoom
    scale += delta * factor * scale;
    scale = Math.max(1, Math.min(max_scale, scale));

    // calculate x and y based on zoom
    pos.x = -zoom_target.x * scale + zoom_point.x;
    pos.y = -zoom_target.y * scale + zoom_point.y;

    update();
  }

  function moved(event) {
    if (drag_started === 1) {
      var current_mouse_position = { x: event.pageX, y: event.pageY };
      var change_x = current_mouse_position.x - last_mouse_position.x;
      var change_y = current_mouse_position.y - last_mouse_position.y;

      /* Save mouse position */
      last_mouse_position = current_mouse_position;
      //Add the position change
      pos.x += change_x;
      pos.y += change_y;

      update();
    }
  }

  function update() {
    // Make sure the slide stays in its container area when zooming out
    if (pos.x > 0) pos.x = 0;
    if (pos.x + size.w * scale < size.w) pos.x = -size.w * (scale - 1);
    if (pos.y > 0) pos.y = 0;
    if (pos.y + size.h * scale < size.h) pos.y = -size.h * (scale - 1);

    target.style.transform = `translate( 
      ${pos.x}px, 
      ${pos.y}px)
    scale(${scale})`;
  }
}
