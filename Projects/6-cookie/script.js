const CONSENT_KEY = "cookieConsentAccepted";

const popup = document.getElementById("cookiePopup");
const acceptBtn = document.getElementById("acceptCookieBtn");
const closeBtn = document.getElementById("closePopupBtn");

function hidePopup() {
  popup.classList.remove("show");
}

function showPopup() {
  popup.classList.add("show");
}

function hasAcceptedCookieConsent() {
  return localStorage.getItem(CONSENT_KEY) === "yes";
}

function acceptCookieConsent() {
  localStorage.setItem(CONSENT_KEY, "yes");
  hidePopup();
}

if (!hasAcceptedCookieConsent()) {
  window.setTimeout(showPopup, 300);
}

acceptBtn.addEventListener("click", acceptCookieConsent);
closeBtn.addEventListener("click", hidePopup);
