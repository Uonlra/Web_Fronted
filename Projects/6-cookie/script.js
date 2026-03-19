const CONSENT_COOKIE = "cookieConsentStatus";
const CONSENT_TTL_DAYS = 180;

const popup = document.getElementById("cookiePopup");
const backdrop = document.getElementById("cookieBackdrop");
const acceptBtn = document.getElementById("acceptCookieBtn");
const rejectBtn = document.getElementById("rejectCookieBtn");
const closeBtn = document.getElementById("closePopupBtn");
const pageContent = document.getElementById("pageContent");

let isVisible = false;

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; samesite=lax`;
}

function getCookie(name) {
  const target = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (const cookie of cookies) {
    if (cookie.startsWith(target)) {
      return decodeURIComponent(cookie.slice(target.length));
    }
  }

  return null;
}

function hidePopup() {
  if (!isVisible) {
    return;
  }

  isVisible = false;
  popup.classList.remove("show");
  popup.hidden = true;
  backdrop.hidden = true;
  pageContent.removeAttribute("inert");
}

function showPopup() {
  if (isVisible) {
    return;
  }

  isVisible = true;
  popup.hidden = false;
  backdrop.hidden = false;
  popup.classList.add("show");
  pageContent.setAttribute("inert", "");
  closeBtn.focus({ preventScroll: true });
}

function hasAcceptedCookieConsent() {
  return getCookie(CONSENT_COOKIE) === "accepted";
}

function persistCookieConsent(value) {
  setCookie(CONSENT_COOKIE, value, CONSENT_TTL_DAYS);
}

function acceptCookieConsent() {
  persistCookieConsent("accepted");
  hidePopup();
}

function rejectCookieConsent() {
  persistCookieConsent("rejected");
  hidePopup();
}

if (!hasAcceptedCookieConsent()) {
  window.setTimeout(showPopup, 300);
}

acceptBtn.addEventListener("click", acceptCookieConsent);
rejectBtn.addEventListener("click", rejectCookieConsent);
closeBtn.addEventListener("click", hidePopup);
backdrop.addEventListener("click", hidePopup);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isVisible) {
    hidePopup();
  }
});
