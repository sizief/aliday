/*
 * Shared photo viewer.
 * Each page defines, before loading this script:
 *
 *   window.VIEWER_CONFIG = {
 *     title: "Camino Frances 2026",
 *     folder: "../../assets/images/camino-frances-2026-optimized/",
 *     count: 10            // images are named 1.jpg ... count.jpg
 *   };
 */
(function () {
  var cfg = window.VIEWER_CONFIG || {};
  var title = cfg.title || "Photos";
  var baseOptim = cfg.folder || "";
  var count = cfg.count || 0;

  var imageIds = [];
  for (var i = 1; i <= count; i++) imageIds.push(String(i));

  var introEl = document.getElementById("intro");
  var thumbsEl = document.getElementById("thumbs");
  var imgEl = document.getElementById("photo");
  var prevEl = document.getElementById("prevLink");
  var nextEl = document.getElementById("nextLink");
  var counterEl = document.getElementById("counter");
  var introTitleEl = document.getElementById("introTitle");

  if (introTitleEl) introTitleEl.textContent = title;

  // Elements that belong to the single-photo view
  var photoViewEls = [
    imgEl,
    prevEl.parentNode,
    counterEl.parentNode,
    nextEl.parentNode,
  ];

  // Build thumbnails for every image
  imageIds.forEach(function (id) {
    var a = document.createElement("a");
    a.href = "#" + id;
    var t = document.createElement("img");
    t.src = baseOptim + id + ".jpg";
    t.alt = title + " — " + id;
    t.loading = "lazy";
    a.appendChild(t);
    thumbsEl.appendChild(a);
  });

  // Returns index of the image in the hash, or -1 if none/invalid
  function getIndexFromHash() {
    var id = (location.hash || "").replace("#", "").trim();
    return imageIds.indexOf(id);
  }

  function setAnchor(el, targetIndex) {
    if (targetIndex < 0 || targetIndex >= imageIds.length) {
      el.classList.add("disabled");
      el.removeAttribute("href");
      return;
    }
    el.classList.remove("disabled");
    el.setAttribute("href", "#" + imageIds[targetIndex]);
  }

  function showIntro() {
    introEl.hidden = false;
    photoViewEls.forEach(function (el) {
      el.hidden = true;
    });
    imgEl.removeAttribute("src");
    document.title = title + " — Viewer";
  }

  function showPhoto(index) {
    var id = imageIds[index];
    introEl.hidden = true;
    photoViewEls.forEach(function (el) {
      el.hidden = false;
    });

    imgEl.src = baseOptim + id + ".jpg";
    imgEl.setAttribute("alt", title + " — " + id);
    document.title = title + " — " + id;

    setAnchor(prevEl, index - 1);
    setAnchor(nextEl, index + 1);
    counterEl.textContent = id;
  }

  function onHashChange() {
    var index = getIndexFromHash();
    if (index < 0) showIntro();
    else showPhoto(index);
  }

  window.addEventListener("hashchange", onHashChange);
  onHashChange();
})();
