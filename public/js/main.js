function toggleFavorite(button) {
  if (button.textContent === "Favorite") {
    button.textContent = "Unfavorite";
  } else {
    button.textContent = "Favorite";
  }
}
