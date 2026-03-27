// PinkMandarin - Main JavaScript

(function () {
  'use strict';

  // --- Language Toggle ---
  const LANG_KEY = 'pm-lang';

  function getLang() {
    return localStorage.getItem(LANG_KEY) || 'ko';
  }

  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-ko]').forEach(function (el) {
      el.textContent = lang === 'ko' ? el.dataset.ko : el.dataset.en;
    });
    document.querySelectorAll('[data-ko-html]').forEach(function (el) {
      el.innerHTML = lang === 'ko' ? el.dataset.koHtml : el.dataset.enHtml;
    });
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    // Show/hide language-specific blocks (exclude lang toggle buttons)
    document.querySelectorAll('[data-lang]:not(.lang-btn)').forEach(function (el) {
      el.style.display = el.dataset.lang === lang ? '' : 'none';
    });
  }

  // --- Mobile Menu ---
  function initMobileMenu() {
    var toggle = document.querySelector('.mobile-toggle');
    var nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
      });
    });
  }

  // --- Scroll Animations ---
  function initScrollAnimations() {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Footer ---
  function renderFooter() {
    var footer = document.querySelector('footer.footer');
    if (!footer) return;

    var isFull = footer.dataset.footer === 'full';
    var base = footer.dataset.base || '';

    var charsHtml =
      '<div class="footer-characters">' +
        '<img src="' + base + 'assets/petoxia-footer-characters.png" alt="Petoxia Characters">' +
      '</div>';

    var bottomHtml =
      '<div class="footer-bottom">' +
        '<span>&copy; 2025-2026 PinkMandarin. All rights reserved.</span>' +
        '<a href="mailto:pinkmandarin.help@gmail.com">pinkmandarin.help@gmail.com</a>' +
        '<a href="https://ko-fi.com/pinkmandarin" target="_blank" data-ko="후원하기" data-en="Support Us">후원하기</a>' +
      '</div>';

    footer.insertAdjacentHTML('beforebegin', charsHtml);

    if (isFull) {
      footer.innerHTML =
        '<div class="container">' +
          '<div class="footer-grid">' +
            '<div class="footer-brand">' +
              '<div class="logo">' +
                '<div class="logo-icon"><img src="' + base + 'assets/logo.png" alt="PinkMandarin"></div>' +
                '<span>PinkMandarin</span>' +
              '</div>' +
              '<p data-ko="일상을 더 스마트하고 즐겁게 만드는 모바일 앱을 개발합니다."' +
              '   data-en="Developing mobile apps that make everyday life smarter and more enjoyable.">' +
                '일상을 더 스마트하고 즐겁게 만드는 모바일 앱을 개발합니다.' +
              '</p>' +
            '</div>' +
            '<div>' +
              '<h4 data-ko="앱" data-en="Apps">앱</h4>' +
              '<ul class="footer-links">' +
                '<li><a href="' + base + 'index.html#apps">My Private Review</a></li>' +
                '<li><a href="' + base + 'index.html#apps">Petoxia</a></li>' +
                '<li><a href="' + base + 'math-move/index.html">Math Move</a></li>' +
                '<li><a href="https://github.com/bgcho98/spring-config-table">Spring Config Table</a></li>' +
              '</ul>' +
            '</div>' +
            '<div>' +
              '<h4 data-ko="법적 고지" data-en="Legal">법적 고지</h4>' +
              '<ul class="footer-links">' +
                '<li><a href="' + base + 'my-private-review/privacy.html" data-ko="My Private Review 개인정보처리방침" data-en="My Private Review Privacy Policy">My Private Review 개인정보처리방침</a></li>' +
                '<li><a href="' + base + 'petoxia/privacy.html" data-ko="Petoxia 개인정보처리방침" data-en="Petoxia Privacy Policy">Petoxia 개인정보처리방침</a></li>' +
                '<li><a href="' + base + 'petoxia/terms.html" data-ko="Petoxia 이용약관" data-en="Petoxia Terms of Service">Petoxia 이용약관</a></li>' +
                '<li><a href="' + base + 'math-move/privacy.html" data-ko="Math Move 개인정보처리방침" data-en="Math Move Privacy Policy">Math Move 개인정보처리방침</a></li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
          bottomHtml +
        '</div>';
    } else {
      footer.innerHTML =
        '<div class="container">' +
          bottomHtml +
        '</div>';
    }
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', function () {
    renderFooter();
    // Language buttons
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.dataset.lang);
      });
    });

    setLang(getLang());
    initMobileMenu();
    initScrollAnimations();
  });
})();
