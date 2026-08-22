(function () {
  var body = document.body;
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function createElement(className) {
    var element = document.createElement("div");
    element.className = className;
    element.setAttribute("aria-hidden", "true");
    document.body.appendChild(element);
    return element;
  }

  var progress = createElement("scroll-progress");

  function updateProgress() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var amount = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = "scaleX(" + Math.max(0, Math.min(1, amount)) + ")";
    body.classList.toggle("has-scrolled", window.scrollY > 16);
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  if (!reduceMotion) {
    var tiltTargets = Array.prototype.slice.call(document.querySelectorAll([
      ".service-list a",
      ".service-detail-list article",
      ".about-photo-card"
    ].join(",")));

    tiltTargets.forEach(function (target) {
      target.addEventListener("pointermove", function (event) {
        var rect = target.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width;
        var y = (event.clientY - rect.top) / rect.height;
        var rotateY = (x - 0.5) * 2;
        var rotateX = (0.5 - y) * 2;
        target.style.setProperty("--tilt-x", rotateX.toFixed(2) + "deg");
        target.style.setProperty("--tilt-y", rotateY.toFixed(2) + "deg");
      }, { passive: true });

      target.addEventListener("pointerleave", function () {
        target.style.setProperty("--tilt-x", "0deg");
        target.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".service-list a"), function (link) {
    link.addEventListener("mouseenter", function () {
      link.classList.add("is-active");
    });
    link.addEventListener("mouseleave", function () {
      link.classList.remove("is-active");
    });
    link.addEventListener("focus", function () {
      link.classList.add("is-active");
    });
    link.addEventListener("blur", function () {
      link.classList.remove("is-active");
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-contact-service]"), function (card) {
    var service = card.getAttribute("data-contact-service");
    var heading = card.querySelector("h2, strong");
    var label = heading ? heading.textContent.replace(/\s+/g, " ").trim() : "";

    if (!service) {
      return;
    }

    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");

    if (label) {
      card.setAttribute("aria-label", label + " - request help");
    }

    function openContact() {
      window.location.assign("contact.html?service=" + encodeURIComponent(service));
    }

    card.addEventListener("click", function (event) {
      if (event.target.closest && event.target.closest("a, button, input, select, textarea, label")) {
        return;
      }

      openContact();
    });

    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openContact();
      }
    });
  });
})();
