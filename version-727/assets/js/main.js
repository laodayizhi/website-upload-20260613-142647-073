(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupMobileMenu() {
        var button = document.querySelector('.menu-toggle');
        var panel = document.querySelector('.mobile-panel');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function () {
            var open = panel.classList.toggle('is-open');
            button.setAttribute('aria-expanded', open ? 'true' : 'false');
            button.textContent = open ? '✕' : '☰';
        });
    }

    function setupSearchForms() {
        selectAll('form.site-search').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = form.querySelector('input[name="q"]');
                var query = input ? input.value.trim() : '';
                var target = './search.html';
                if (query) {
                    target += '?q=' + encodeURIComponent(query);
                }
                window.location.href = target;
            });
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = selectAll('.hero-slide', hero);
        var dots = selectAll('.hero-dot', hero);
        if (slides.length <= 1) {
            return;
        }
        var index = 0;
        var timer;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                slide.classList.toggle('is-active', position === index);
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle('is-active', position === index);
            });
        }
        function start() {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }
        dots.forEach(function (dot, position) {
            dot.addEventListener('click', function () {
                window.clearInterval(timer);
                show(position);
                start();
            });
        });
        show(0);
        start();
    }

    function applyFilter(input, cards, empty, countNode) {
        var query = (input.value || '').trim().toLowerCase();
        var visible = 0;
        cards.forEach(function (card) {
            var haystack = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
            var matched = !query || haystack.indexOf(query) !== -1;
            card.hidden = !matched;
            if (matched) {
                visible += 1;
            }
        });
        if (empty) {
            empty.classList.toggle('is-visible', visible === 0);
        }
        if (countNode) {
            countNode.textContent = visible;
        }
    }

    function setupLocalFilters() {
        selectAll('[data-filter-input]').forEach(function (input) {
            var target = document.querySelector(input.getAttribute('data-filter-target'));
            if (!target) {
                return;
            }
            var cards = selectAll('.movie-card', target);
            var empty = document.querySelector(input.getAttribute('data-empty-target') || '');
            var countNode = document.querySelector(input.getAttribute('data-count-target') || '');
            input.addEventListener('input', function () {
                applyFilter(input, cards, empty, countNode);
            });
            applyFilter(input, cards, empty, countNode);
        });
    }

    function setupSearchPage() {
        var input = document.getElementById('search-page-input');
        var grid = document.getElementById('search-results');
        if (!input || !grid) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        var cards = selectAll('.movie-card', grid);
        var empty = document.getElementById('search-empty');
        var countNode = document.getElementById('search-count');
        var form = document.getElementById('search-page-form');
        input.value = initial;
        function refreshUrl() {
            var query = input.value.trim();
            var next = './search.html' + (query ? '?q=' + encodeURIComponent(query) : '');
            window.history.replaceState(null, '', next);
        }
        input.addEventListener('input', function () {
            applyFilter(input, cards, empty, countNode);
            refreshUrl();
        });
        if (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                applyFilter(input, cards, empty, countNode);
                refreshUrl();
            });
        }
        applyFilter(input, cards, empty, countNode);
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMobileMenu();
        setupSearchForms();
        setupHero();
        setupLocalFilters();
        setupSearchPage();
    });
})();
