const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const navDropdown = document.querySelector(".nav-dropdown");

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".main-nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    navDropdown?.classList.remove("open");
  });
});

document.querySelectorAll(".dropdown-toggle").forEach(toggle => {
  toggle.addEventListener("click", (event) => {
    if (window.innerWidth > 760) return;
    event.preventDefault();
    const parent = toggle.closest(".nav-dropdown");
    if (!parent) return;
    const open = parent.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
});

document.addEventListener("click", (event) => {
  if (!navDropdown?.contains(event.target)) {
    navDropdown?.classList.remove("open");
  }
});

const heroSlides = [...document.querySelectorAll(".hero-slide")];
if (heroSlides.length > 1) {
  let activeHeroSlide = 0;
  window.setInterval(() => {
    heroSlides[activeHeroSlide].classList.remove("is-active");
    activeHeroSlide = (activeHeroSlide + 1) % heroSlides.length;
    heroSlides[activeHeroSlide].classList.add("is-active");
  }, 7000);
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const solutionPages = ["protection.html", "investments.html", "retirement.html", "structured-investments.html"];
document.querySelectorAll(".main-nav a[data-page]").forEach(link => {
  const page = link.dataset.page || "";
  const shouldHighlight = page === currentPage || (solutionPages.includes(currentPage) && link.classList.contains("dropdown-toggle"));
  if (shouldHighlight) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

const form = document.getElementById("consultationForm");
const message = document.querySelector(".form-message");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("name")?.toString().trim() || "there";
  message.textContent = `Thanks, ${name}. Your consultation request is ready to be connected to Sun Global.`;
  form.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();
