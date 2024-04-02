const dismissPopup = document.getElementById("dismissPopupBtn");

export function popupAdd() {
  var popup = document.getElementById("popup");
  popup.classList.add("active");
}

export function popupRemove() {
  var popup = document.getElementById("popup");
  popup.classList.add("active");
  window.location.reload();
}

dismissPopup.addEventListener("click", popupRemove);
