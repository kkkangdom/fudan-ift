(function () {
    'use strict';

    /* --------------------- 首页 Banner 轮播 --------------------- */
    function initBanner() {
        var banner = document.querySelector('.js-banner');

        if (!banner) {
            return;
        }

        var slides = Array.prototype.slice.call(banner.querySelectorAll('.js-banner-slide'));
        var dotsBox = banner.querySelector('.js-banner-dots');
        var tones = [];
        var index = 0;
        var timer = null;
        var INTERVAL = 6000;

        if (slides.length <= 0) {
            return;
        }

        slides.forEach(function (slide, i) {
            tones.push(slide.getAttribute('data-tone') || 'brand');

            if (i !== 0) {
                slide.setAttribute('hidden', 'hidden');
            }
        });

        slides[0].classList.add('is-active');

        function applyTone() {
            banner.className = banner.className.replace(/\bbanner--[a-z]+\b/g, '').replace(/\s+/g, ' ').trim();
            banner.classList.add('banner--' + (tones[index] || 'brand'));
        }

        if (dotsBox) {
            dotsBox.innerHTML = '';

            slides.forEach(function (slide, i) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'banner__dot';
                dot.setAttribute('aria-label', '切换到第 ' + (i + 1) + ' 张：' + (slide.querySelector('.banner__title') || {}).textContent);
                dot.addEventListener('click', function () {
                    go(i);
                });
                dotsBox.appendChild(dot);
            });
        }

        var dots = dotsBox ? Array.prototype.slice.call(dotsBox.querySelectorAll('.banner__dot')) : [];

        function render() {
            slides.forEach(function (slide, i) {
                var active = i === index;

                if (active) {
                    slide.removeAttribute('hidden');
                    slide.classList.add('is-active');
                } else {
                    slide.setAttribute('hidden', 'hidden');
                    slide.classList.remove('is-active');
                }
            });

            dots.forEach(function (dot, i) {
                if (i === index) {
                    dot.classList.add('is-active');
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.classList.remove('is-active');
                    dot.removeAttribute('aria-current');
                }
            });

            applyTone();
        }

        function go(next) {
            var count = slides.length;
            index = ((next % count) + count) % count;
            render();
        }

        function start() {
            if (slides.length <= 1) {
                return;
            }

            stop();
            timer = window.setInterval(function () {
                go(index + 1);
            }, INTERVAL);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        banner.addEventListener('mouseenter', stop);
        banner.addEventListener('mouseleave', start);
        banner.addEventListener('focus', stop);
        banner.addEventListener('blur', start);
        banner.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowLeft') {
                go(index - 1);
            } else if (event.key === 'ArrowRight') {
                go(index + 1);
            }
        });

        var prev = banner.querySelector('.js-banner-prev');
        var next = banner.querySelector('.js-banner-next');

        if (prev) {
            prev.addEventListener('click', function () {
                go(index - 1);
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                go(index + 1);
            });
        }

        render();
        start();
    }

    /* --------------------- 首页新闻标签切换 --------------------- */
    function initTabs() {
        var groups = document.querySelectorAll('.js-tabs');

        Array.prototype.forEach.call(groups, function (group) {
            var buttons = Array.prototype.slice.call(group.querySelectorAll('[data-tab]'));
            var root = group.closest('section');

            if (!root) {
                return;
            }

            buttons.forEach(function (button) {
                button.addEventListener('click', function () {
                    var key = button.getAttribute('data-tab');

                    buttons.forEach(function (item) {
                        var active = item === button;
                        item.classList.toggle('is-active', active);
                        item.setAttribute('aria-pressed', active ? 'true' : 'false');
                    });

                    Array.prototype.forEach.call(root.querySelectorAll('[data-tab-panel]'), function (panel) {
                        if (panel.getAttribute('data-tab-panel') === key) {
                            panel.removeAttribute('hidden');
                        } else {
                            panel.setAttribute('hidden', 'hidden');
                        }
                    });
                });
            });
        });
    }

    /* --------------------- 移动端主导航 --------------------- */
    function initMobileNav() {
        var toggle = document.querySelector('.js-nav-toggle');
        var panel = document.querySelector('.js-nav-mobile');

        if (toggle && panel) {
            toggle.addEventListener('click', function () {
                var open = panel.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
        }

        Array.prototype.forEach.call(document.querySelectorAll('.js-nav-expand'), function (button) {
            button.addEventListener('click', function () {
                var row = button.closest('li');
                var sub = row ? row.querySelector('.main-nav__mobile-sub') : null;

                if (!sub) {
                    return;
                }

                var open = sub.hasAttribute('hidden');

                if (open) {
                    sub.removeAttribute('hidden');
                } else {
                    sub.setAttribute('hidden', 'hidden');
                }

                button.setAttribute('aria-expanded', open ? 'true' : 'false');
                button.textContent = open ? '▲' : '▼';
            });
        });
    }

    /* --------------------- 返回顶部 --------------------- */
    function initBackToTop() {
        var button = document.querySelector('.js-back-to-top');

        if (!button) {
            return;
        }

        function onScroll() {
            button.classList.toggle('is-visible', window.scrollY > 400);
        }

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        button.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* --------------------- 年份 --------------------- */
    function initYear() {
        Array.prototype.forEach.call(document.querySelectorAll('.js-year'), function (node) {
            node.textContent = String(new Date().getFullYear());
        });
    }

    /* --------------------- 分享：复制链接 / 微博 --------------------- */
    function initShare() {
        Array.prototype.forEach.call(document.querySelectorAll('.js-copy-link'), function (button) {
            var label = button.textContent;

            button.addEventListener('click', function () {
                var url = window.location.href;

                function done() {
                    button.textContent = '链接已复制 ✓';
                    window.setTimeout(function () {
                        button.textContent = label;
                    }, 2000);
                }

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(done).catch(function () {});
                }
            });
        });

        Array.prototype.forEach.call(document.querySelectorAll('.js-weibo'), function (link) {
            var title = link.getAttribute('data-title') || document.title;
            link.setAttribute(
                'href',
                'https://service.weibo.com/share/share.php?title=' +
                    encodeURIComponent(title) +
                    '&url=' +
                    encodeURIComponent(window.location.href)
            );
        });
    }

    /* --------------------- 搜索：跳转到「全部内容」并筛选 --------------------- */
    function initSearch() {
        var pageForm = document.querySelector('.js-search-page-form');

        if (pageForm) {
            pageForm.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = pageForm.querySelector('input[name="q"]');
                var keyword = input ? input.value.trim() : '';
                var base = pageForm.getAttribute('data-hub-url') || 'posts.html';
                window.location.href = keyword ? base + '?q=' + encodeURIComponent(keyword) : base;
            });
        }

        var hubForm = document.querySelector('.js-hub-search');
        var list = document.querySelector('.js-section-list');

        if (!hubForm || !list) {
            return;
        }

        var items = Array.prototype.slice.call(list.querySelectorAll('.js-section-list li'));

        function applyFilter(keyword) {
            var needle = keyword.trim().toLowerCase();

            items.forEach(function (item) {
                var text = (item.textContent || '').toLowerCase();
                var match = !needle || text.indexOf(needle) > -1;

                if (match) {
                    item.removeAttribute('hidden');
                } else {
                    item.setAttribute('hidden', 'hidden');
                }
            });

            Array.prototype.forEach.call(list.querySelectorAll('.section-block'), function (block) {
                var visible = block.querySelectorAll('li:not([hidden])').length;
                block.style.display = visible ? '' : 'none';
            });
        }

        hubForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = hubForm.querySelector('input[name="q"]');
            applyFilter(input ? input.value : '');
        });

        var initial = new URLSearchParams(window.location.search).get('q');

        if (initial) {
            var input = hubForm.querySelector('input[name="q"]');

            if (input) {
                input.value = initial;
            }

            applyFilter(initial);
        }
    }

    function boot() {
        initBanner();
        initTabs();
        initMobileNav();
        initBackToTop();
        initYear();
        initShare();
        initSearch();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
