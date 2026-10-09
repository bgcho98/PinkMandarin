// PinkMandarin - Main JavaScript

(function () {
  'use strict';

  // --- Language Toggle ---
  const LANG_KEY = 'pm-lang';

  // A choice made with the KO/EN buttons wins; otherwise follow the browser locale
  // (Korean for ko-*, English for everything else).
  function getLang() {
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    if (saved === 'ko' || saved === 'en') return saved;
    var prefs = navigator.languages && navigator.languages.length
      ? navigator.languages : [navigator.language || 'ko'];
    return /^ko\b/i.test(prefs[0]) ? 'ko' : 'en';
  }

  function setLang(lang, persist) {
    if (persist) {
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    }
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

  // --- Video Facades (click thumbnail to load YouTube iframe) ---
  function initVideoFacades() {
    function play(item) {
      var id = item.dataset.videoId;
      if (!id || item.dataset.playing === '1') return;
      item.dataset.playing = '1';
      var iframe = document.createElement('iframe');
      iframe.src =
        'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1';
      iframe.title = 'YouTube video player';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      item.innerHTML = '';
      item.appendChild(iframe);
    }

    document.querySelectorAll('.video-item').forEach(function (item) {
      item.addEventListener('click', function () {
        play(item);
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          play(item);
        }
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

  // --- Business Info ---
  // Single source for the About panel and the footer. Empty values are not shown.
  var BUSINESS = [
    { ko: '상호', en: 'Company', value: 'PinkMandarin' },
    { ko: '대표자', en: 'Representative', value: '' },
    { ko: '사업자등록번호', en: 'Business Reg. No.', value: '287-35-01613' },
    { ko: '통신판매업 신고번호', en: 'Mail-Order Reg. No.', value: '' },
    { ko: '사업장 주소', en: 'Address', value: '' },
    { ko: '이메일', en: 'Email', value: 'help@pinkmandarin.com', key: 'email' }
  ];

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function bizValueHtml(item) {
    var v = escapeHtml(item.value);
    if (item.key === 'email') return '<a href="mailto:' + v + '">' + v + '</a>';
    return v;
  }

  function filledBusiness() {
    return BUSINESS.filter(function (item) { return item.value; });
  }

  function renderBusinessInfo() {
    var dl = document.querySelector('[data-biz-info]');
    if (!dl) return;
    dl.innerHTML = filledBusiness().map(function (item) {
      return '<dt data-ko="' + item.ko + '" data-en="' + item.en + '">' + item.ko + '</dt>' +
        '<dd>' + bizValueHtml(item) + '</dd>';
    }).join('');
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
        '<a href="mailto:help@pinkmandarin.com">help@pinkmandarin.com</a>' +
        '<a href="https://www.instagram.com/pinkmandarin.help/" target="_blank" rel="noopener">Instagram @pinkmandarin.help</a>' +
        '<a href="https://ko-fi.com/pinkmandarin" target="_blank" data-ko="후원하기" data-en="Support Us">후원하기</a>' +
      '</div>' +
      '<div class="footer-biz">' +
        filledBusiness().filter(function (item) { return item.key !== 'email'; }).map(function (item) {
          return '<span><span data-ko="' + item.ko + '" data-en="' + item.en + '">' + item.ko + '</span> ' +
            escapeHtml(item.value) + '</span>';
        }).join('') +
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
                '<li><a href="' + base + 'mallang-studio/index.html" data-ko="말랑 공방" data-en="Mallang Studio">말랑 공방</a></li>' +
                '<li><a href="https://github.com/bgcho98/spring-config-table">Spring Config Table</a></li>' +
                '<li><a href="' + base + 'menubarmore/index.html">MenuBarMore</a></li>' +
              '</ul>' +
            '</div>' +
            '<div>' +
              '<h4 data-ko="법적 고지" data-en="Legal">법적 고지</h4>' +
              '<ul class="footer-links">' +
                '<li><a href="' + base + 'my-private-review/privacy.html" data-ko="My Private Review 개인정보처리방침" data-en="My Private Review Privacy Policy">My Private Review 개인정보처리방침</a></li>' +
                '<li><a href="' + base + 'petoxia/privacy.html" data-ko="Petoxia 개인정보처리방침" data-en="Petoxia Privacy Policy">Petoxia 개인정보처리방침</a></li>' +
                '<li><a href="' + base + 'petoxia/terms.html" data-ko="Petoxia 이용약관" data-en="Petoxia Terms of Service">Petoxia 이용약관</a></li>' +
                '<li><a href="' + base + 'math-move/privacy.html" data-ko="Math Move 개인정보처리방침" data-en="Math Move Privacy Policy">Math Move 개인정보처리방침</a></li>' +
                '<li><a href="' + base + 'mallang-studio/privacy.html" data-ko="말랑 공방 개인정보처리방침" data-en="Mallang Studio Privacy Policy">말랑 공방 개인정보처리방침</a></li>' +
                '<li><a href="' + base + 'mallang-studio/terms.html" data-ko="말랑 공방 이용약관" data-en="Mallang Studio Terms of Service">말랑 공방 이용약관</a></li>' +
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
    renderBusinessInfo();
    // Language buttons
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.dataset.lang, true);
      });
    });

    setLang(getLang());
    initMobileMenu();
    initScrollAnimations();
    initVideoFacades();
  });
})();
