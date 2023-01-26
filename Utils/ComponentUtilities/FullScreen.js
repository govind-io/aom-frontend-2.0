export const FullScreenElement = (elem, exit) => {
  const object = elem || document.body;

  if (exit) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    }
    return;
  }

  if (object.requestFullscreen) {
    object.requestFullscreen();
  } else if (object.webkitRequestFullscreen) {
    /* Safari */
    object.webkitRequestFullscreen();
  } else if (object.msRequestFullscreen) {
    /* IE11 */
    object.msRequestFullscreen();
  }
};
