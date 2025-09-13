const menuBtn = document.getElementById("menuBtn");
const menuList = document.getElementById("menuList");

menuBtn.addEventListener("click", () => {
  menuList.classList.toggle("hidden");
});
