(function () {
  'use strict';

  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var links = document.getElementById('nav-links');

  function setMenu(open) {
    links.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  }

  btn.addEventListener('click', function () {
    setMenu(btn.getAttribute('aria-expanded') !== 'true');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) setMenu(false);
  });

  // Scroll reveal: content stays visible unless we are sure we can reveal it later
  var pending = [];
  function revealVisible() {
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.classList.add('in');
        return false;
      }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener('scroll', revealVisible);
      window.removeEventListener('resize', revealVisible);
    }
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('pending');
        pending.push(el);
      }
    });
    window.addEventListener('scroll', revealVisible, { passive: true });
    window.addEventListener('resize', revealVisible);
    // Failsafe: never leave content hidden (e.g. in embedded previews that don't scroll)
    setTimeout(function () {
      pending.forEach(function (el) { el.classList.add('in'); });
      pending = [];
    }, 2500);
  }

  // Highlight the nav link for the section in view
  var navLinks = document.querySelectorAll('.links a');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id], footer[id]').forEach(function (s) { spy.observe(s); });
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
