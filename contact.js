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
  var phoneInput = form.querySelector('input[name="phone"]');
  var emailInput = form.querySelector('input[name="email"]');
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
    updateContactValidation();
    updateTvDetails();
  }

  function getDigits(value) {
    return value.replace(/\D/g, "");
  }

  function formatPhoneNumber(value) {
    var digits = getDigits(value);
    var formattedDigits = digits.slice(0, 10);
    var extraDigits = digits.slice(10);
    var formatted = formattedDigits;

    if (formattedDigits.length > 6) {
      formatted = "(" + formattedDigits.slice(0, 3) + ") " + formattedDigits.slice(3, 6) + "-" + formattedDigits.slice(6);
    } else if (formattedDigits.length > 3) {
      formatted = "(" + formattedDigits.slice(0, 3) + ") " + formattedDigits.slice(3);
    }

    return extraDigits ? formatted + " " + extraDigits : formatted;
  }

  function updatePhoneValidation() {
    if (!phoneInput) {
      return;
    }

    var digitCount = getDigits(phoneInput.value).length;

    phoneInput.setCustomValidity(
      digitCount === 0 || digitCount === 10 ? "" : "Please enter a 10-digit phone number."
    );
  }

  function formatPhoneInput() {
    if (!phoneInput) {
      return;
    }

    phoneInput.value = formatPhoneNumber(phoneInput.value);
    updatePhoneValidation();
  }

  function updateEmailValidation() {
    if (!emailInput) {
      return;
    }

    emailInput.setCustomValidity("");

    if (emailInput.value.trim() && !emailInput.validity.valid) {
      emailInput.setCustomValidity("Please enter a valid email address.");
    }
  }

  function updateContactValidation() {
    updatePhoneValidation();
    updateEmailValidation();
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
    formatPhoneInput();
    updateContactValidation();

    if (!form.checkValidity()) {
      event.preventDefault();
      if (typeof form.reportValidity === "function") {
        form.reportValidity();
      }
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

  if (phoneInput) {
    phoneInput.addEventListener("input", formatPhoneInput);
    phoneInput.addEventListener("blur", formatPhoneInput);
  }

  if (emailInput) {
    emailInput.addEventListener("input", updateEmailValidation);
    emailInput.addEventListener("blur", updateEmailValidation);
  }

  form.addEventListener("submit", handleSubmit);
  updateFormState();
})();
