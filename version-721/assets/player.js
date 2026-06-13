(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    document.querySelectorAll('[data-video-player]').forEach(function (player) {
      var video = player.querySelector('video');
      var button = player.querySelector('[data-play-button]');
      var source = video ? video.getAttribute('data-src') : '';
      var hlsInstance = null;
      var attached = false;

      function attachSource() {
        if (!video || !source || attached) {
          return;
        }
        attached = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else {
          video.src = source;
        }
      }

      function playVideo() {
        attachSource();
        if (!video) {
          return;
        }
        video.controls = true;
        if (button) {
          button.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            if (button) {
              button.classList.remove('is-hidden');
            }
          });
        }
      }

      if (button) {
        button.addEventListener('click', playVideo);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (!attached || video.paused) {
            playVideo();
          }
        });
        window.addEventListener('pagehide', function () {
          if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
          }
        });
      }
    });
  });
})();
