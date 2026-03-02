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

  // --- Init ---
  document.addEventListener('DOMContentLoaded', function () {
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
