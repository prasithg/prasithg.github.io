(function () {
  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');
  if (!btn) return;
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var label = btn.firstChild;
  function apply(t) {
    root.setAttribute('data-theme', t);
    var dark = t === 'dark';
    label.nodeValue = dark ? 'Light' : 'Dark';
    btn.setAttribute('aria-pressed', String(dark));
  }
  var stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) {}
  apply(stored || (mq.matches ? 'dark' : 'light'));
  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
  mq.addEventListener('change', function (e) {
    try { if (localStorage.getItem('theme')) return; } catch (err) {}
    apply(e.matches ? 'dark' : 'light');
  });
})();
