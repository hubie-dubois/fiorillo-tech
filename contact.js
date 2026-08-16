(function () {
  var form = document.querySelector(".help-form");

  if (!form) {
    return;
  }

  var serviceOptions = Array.prototype.slice.call(
    form.querySelectorAll('input[name="service"]')
  );
  var firstServiceOption = serviceOptions[0];
  var tvOption = form.querySelector("#service-tv");
  var tvDetails = form.querySelector("#tv-details");

  if (!serviceOptions.length || !firstServiceOption || !tvOption || !tvDetails) {
    return;
  }

  function hasSelectedService() {
    return serviceOptions.some(function (option) {
      return option.checked;
    });
  }

  function updateServiceValidation() {
    firstServiceOption.setCustomValidity(
      hasSelectedService() ? "" : "Please choose at least one type of help."
    );
  }

  function updateTvDetails() {
    var showTvDetails = tvOption.checked;

    if (showTvDetails) {
      tvDetails.hidden = false;
      tvDetails.disabled = false;
      tvDetails.removeAttribute("hidden");
      tvDetails.removeAttribute("disabled");
      tvDetails.style.display = "";
    } else {
      tvDetails.hidden = true;
      tvDetails.disabled = true;
      tvDetails.setAttribute("hidden", "");
      tvDetails.setAttribute("disabled", "");
      tvDetails.style.display = "none";
    }

    tvOption.setAttribute("aria-expanded", String(showTvDetails));

    if (!showTvDetails) {
      Array.prototype.forEach.call(tvDetails.querySelectorAll("input"), function (input) {
        input.value = "";
      });
    }
  }

  function updateFormState() {
    updateServiceValidation();
    updateTvDetails();
  }

  serviceOptions.forEach(function (option) {
    option.addEventListener("change", updateFormState);
  });

  form.addEventListener("submit", updateServiceValidation);
  updateFormState();
})();
