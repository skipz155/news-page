"use strict";var hamburger=document.querySelector(".navbar__hamburger"),navMenu=document.querySelector(".navbar__menu"),navLink=document.querySelectorAll(".nav-link"),body=document.querySelector(".background");function mobileMenu(){hamburger.classList.toggle("active"),navMenu.classList.toggle("active"),body.classList.toggle("dark")}function closeMenu(){hamburger.classList.remove("active"),navMenu.classList.remove("active")}hamburger.addEventListener("click",mobileMenu),navLink.forEach((function(e){return e.addEventListener("click",closeMenu)}));
//# sourceMappingURL=script.js.map