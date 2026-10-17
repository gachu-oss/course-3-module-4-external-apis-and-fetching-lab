// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

const initApp = () => {
  const stateInput = document.querySelector("input");
  const submitButton = document.querySelector("button");
  const alertsDisplay = document.querySelector("#alerts-display");
  const errorMessage = document.querySelector("#error-message");

  if (!submitButton || !stateInput) return;

  submitButton.addEventListener("click", () => {
    const state = stateInput.value.trim().toUpperCase();

    // Clear previous errors and display section before fetching new data
    if (errorMessage) {
      errorMessage.textContent = "";
      errorMessage.classList.add("hidden");
    }
    if (alertsDisplay) {
      alertsDisplay.innerHTML = "";
    }

    fetch(`${weatherApi}${state}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network failure");
        }
        return response.json();
      })
      .then((data) => {
        displayAlerts(data, alertsDisplay);
        stateInput.value = ""; // Clear input field upon success
      })
      .catch((error) => {
        showError(error.message, errorMessage);
      });
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

function displayAlerts(data, alertsDisplay) {
  if (!alertsDisplay) return;
  const title = data.title || "Weather Alerts";
  const features = data.features || [];
  const count = features.length;

  const summaryHeading = document.createElement("div");
  summaryHeading.textContent = `${title}: ${count}`;
  alertsDisplay.appendChild(summaryHeading);

  const ul = document.createElement("ul");
  features.forEach((alert) => {
    const li = document.createElement("li");
    li.textContent = alert.properties.headline;
    ul.appendChild(li);
  });
  alertsDisplay.appendChild(ul);
}

function showError(message, errorMessage) {
  if (!errorMessage) return;
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}