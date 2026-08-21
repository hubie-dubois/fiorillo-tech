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
  var submitButton = form.querySelector('button[type="submit"]');
  var submitStatus = form.querySelector(".form-submit-status");
  var defaultSubmitText = submitButton ? submitButton.textContent : "";
  var successUrl = form.getAttribute("data-success-url") || "thanks.html";

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

  function setSubmitStatus(message, type) {
    if (!submitStatus) {
      return;
    }

    submitStatus.textContent = message;
    submitStatus.hidden = !message;
    submitStatus.className = "form-submit-status" + (type ? " " + type : "");
    submitStatus.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
  }

  function setSubmitting(isSubmitting) {
    form.classList.toggle("is-submitting", isSubmitting);
    form.setAttribute("aria-busy", String(isSubmitting));

    if (submitButton) {
      submitButton.disabled = isSubmitting;
      submitButton.textContent = isSubmitting ? "Sending..." : defaultSubmitText;
    }
  }

  function getFormspreeErrorMessage(response, data) {
    if (response && response.status === 429) {
      return "Too many requests were sent at once. Please wait a minute and try again.";
    }

    if (data && data.errors && data.errors.length) {
      var errorMessage = data.errors
        .map(function (error) {
          return error.message || error.code;
        })
        .filter(Boolean)
        .join(" ");

      if (errorMessage) {
        return errorMessage;
      }
    }

    if (data && data.error) {
      return data.error;
    }

    if (data && data.message) {
      return data.message;
    }

    return "The request could not be sent. Please try again, or email support@fiorillotech.com.";
  }

  function resetTurnstile() {
    if (window.turnstile && typeof window.turnstile.reset === "function") {
      window.turnstile.reset();
    }
  }

  function handleSubmit(event) {
    updateServiceValidation();

    if (!form.checkValidity()) {
      return;
    }

    if (!window.fetch || !window.FormData) {
      return;
    }

    event.preventDefault();
    setSubmitStatus("Sending your request...", "");
    setSubmitting(true);

    window.fetch(form.action, {
      method: (form.method || "POST").toUpperCase(),
      body: new FormData(form),
      headers: {
        Accept: "application/json"
      }
    })
      .then(function (response) {
        if (response.ok) {
          window.location.assign(successUrl);
          return null;
        }

        return response
          .json()
          .catch(function () {
            return {};
          })
          .then(function (data) {
            throw {
              response: response,
              data: data
            };
          });
      })
      .catch(function (error) {
        resetTurnstile();
        setSubmitting(false);
        setSubmitStatus(getFormspreeErrorMessage(error.response, error.data), "error");
      });
  }

  serviceOptions.forEach(function (option) {
    option.addEventListener("change", updateFormState);
  });

  form.addEventListener("submit", handleSubmit);
  updateFormState();
})();
