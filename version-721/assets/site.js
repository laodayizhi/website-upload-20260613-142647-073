(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        menu.classList.toggle('open');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var index = 0;
      var timer = null;

      function show(next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === index);
        });
      }

      function start() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5000);
      }

      var prev = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      if (prev) {
        prev.addEventListener('click', function () {
          show(index - 1);
          start();
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          show(index + 1);
          start();
        });
      }
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
          start();
        });
      });
      show(0);
      start();
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var value = input ? input.value.trim() : '';
        window.location.href = './search.html' + (value ? '?q=' + encodeURIComponent(value) : '');
      });
    });

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
      var input = scope.querySelector('[data-filter-input]');
      var year = scope.querySelector('[data-filter-year]');
      var type = scope.querySelector('[data-filter-type]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
      var params = new URLSearchParams(window.location.search);
      var query = params.get('q');
      if (query && input) {
        input.value = query;
      }

      function normalize(value) {
        return String(value || '').toLowerCase();
      }

      function apply() {
        var keyword = normalize(input ? input.value : '');
        var yearValue = year ? year.value : '';
        var typeValue = type ? type.value : '';
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute('data-search'));
          var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchesYear = !yearValue || card.getAttribute('data-year') === yearValue;
          var matchesType = !typeValue || card.getAttribute('data-type') === typeValue;
          card.hidden = !(matchesKeyword && matchesYear && matchesType);
        });
      }

      [input, year, type].forEach(function (element) {
        if (element) {
          element.addEventListener('input', apply);
          element.addEventListener('change', apply);
        }
      });
      apply();
    });
  });
})();
