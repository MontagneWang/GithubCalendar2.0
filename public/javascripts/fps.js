var showFPS = (function () {
  // noinspection JSUnresolvedVariable, SpellCheckingInspection
  var requestAnimationFrame =
    window.requestAnimationFrame || //Chromium
    window.webkitRequestAnimationFrame || //Webkit
    window.mozRequestAnimationFrame || //Mozilla Geko
    window.oRequestAnimationFrame || //Opera Presto
    window.msRequestAnimationFrame || //IE Trident?
    function (callback) {
      //Fallback function
      window.setTimeout(callback, 1000 / 60);
    };

  var dialog;
  var container;

  var fps = 0;
  var lastTime = Date.now();

  function setStyle(el, styles) {
    for (var key in styles) {
      el.style[key] = styles[key];
    }
  }

  function init() {
    dialog = document.createElement('dialog');
    setStyle(dialog, {
      display: 'block',
      border: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      margin: 0,
      padding: '4px',
      position: 'fixed',
      top: 'auto',
      right: 0,
      bottom: 0,
      left: 'auto',
      color: '#fff',
      fontSize: '12px',
      textAlign: 'center',
      borderRadius: '4px 0 0 0'
    });
    container.appendChild(dialog);
  }

  function calcFPS() {
    offset = Date.now() - lastTime;
    fps += 1;

    if (offset >= 1000) {
      lastTime += offset;
      displayFPS(fps);
      fps = 0;
    }

    requestAnimationFrame(calcFPS);
  }

  function displayFPS(fps) {
    var fpsStr = fps + ' FPS';

    if (!dialog) {
      init();
    }

    if (fpsStr !== dialog.textContent) {
      dialog.textContent = fpsStr;
    }
  }

  return function (parent) {
    container = parent;
    calcFPS();
  };
})();

showFPS(document.body);
