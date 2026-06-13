(function () {
    var body = document.body;
    var menuToggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function () {
            var open = mobileNav.classList.toggle('is-open');
            body.classList.toggle('nav-open', open);
            menuToggle.setAttribute('aria-expanded', String(open));
        });
    }

    var carousel = document.querySelector('[data-hero-carousel]');
    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function restart() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                restart();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                restart();
            });
        });

        restart();
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var filterType = document.querySelector('[data-filter-type]');
    var filterCategory = document.querySelector('[data-filter-category]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

    if (cards.length && (filterInput || filterType || filterCategory)) {
        var container = cards[0].parentElement;
        var empty = document.createElement('div');
        empty.className = 'no-results';
        empty.textContent = '没有找到匹配的影片';

        function getValue(element) {
            return element ? element.value.trim().toLowerCase() : '';
        }

        function applyFilters() {
            var keyword = getValue(filterInput);
            var type = getValue(filterType);
            var category = getValue(filterCategory);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-category')
                ].join(' ').toLowerCase();
                var typeValue = (card.getAttribute('data-type') || '').toLowerCase();
                var categoryValue = (card.getAttribute('data-category') || '').toLowerCase();
                var matched = true;

                if (keyword && haystack.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (type && typeValue !== type) {
                    matched = false;
                }

                if (category && categoryValue !== category) {
                    matched = false;
                }

                card.hidden = !matched;
                if (matched) {
                    visible += 1;
                }
            });

            if (visible === 0) {
                if (!empty.parentElement) {
                    container.appendChild(empty);
                }
            } else if (empty.parentElement) {
                empty.remove();
            }
        }

        [filterInput, filterType, filterCategory].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });

        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (query && filterInput) {
            filterInput.value = query;
        }
        applyFilters();
    }
}());
