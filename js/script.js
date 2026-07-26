const menuButton = document.querySelector("#menu-button");
const navbar = document.querySelector(".navbar");
const menuIcon = menuButton.querySelector("i");

function closeMenu() {
    navbar.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menuIcon.className = "fa-solid fa-bars";
}

menuButton.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuIcon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
});

document.querySelectorAll(".navbar a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".navbar a[href^='#']")];

function updateActiveLink() {
    const current = sections
        .filter((section) => window.scrollY >= section.offsetTop - 160)
        .at(-1)?.id || "home";

    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
}

window.addEventListener("scroll", updateActiveLink, { passive: true });
updateActiveLink();

const roles = [
    "full-stack web applications",
    "responsive React interfaces",
    "secure Django REST APIs",
    "useful digital products"
];
const typingElement = document.querySelector(".typing");
let roleIndex = 0;
let characterIndex = roles[0].length;
let deleting = true;

function typeRole() {
    const role = roles[roleIndex];
    characterIndex += deleting ? -1 : 1;
    typingElement.textContent = role.slice(0, characterIndex);

    if (!deleting && characterIndex === role.length) {
        deleting = true;
        setTimeout(typeRole, 1500);
        return;
    }

    if (deleting && characterIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
    }

    setTimeout(typeRole, deleting ? 42 : 75);
}

setTimeout(typeRole, 900);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const progressSection = document.querySelector(".skill-levels");
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".progress-fill").forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = `${bar.dataset.level}%`;
                bar.classList.add("animating");

                const item = bar.closest(".progress-item");
                const counter = item.querySelector(".progress-count");
                const target = Number(counter.dataset.target);
                const duration = 1400;
                const startTime = performance.now();

                function updateCount(now) {
                    const elapsed = Math.min((now - startTime) / duration, 1);
                    const eased = 1 - Math.pow(1 - elapsed, 3);
                    counter.textContent = Math.round(target * eased);
                    if (elapsed < 1) requestAnimationFrame(updateCount);
                }

                requestAnimationFrame(updateCount);
            }, index * 120);
        });
        progressObserver.unobserve(entry.target);
    });
}, { threshold: 0.3 });

if (progressSection) progressObserver.observe(progressSection);

const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const submitButton = form.querySelector("button[type='submit']");

if (window.emailjs) {
    emailjs.init({ publicKey: "9BDu55TJIWKvqOQp9" });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.classList.remove("error");
    formStatus.textContent = "Sending your message...";
    submitButton.disabled = true;

    try {
        if (!window.emailjs) throw new Error("Email service is unavailable");
        await emailjs.sendForm("service_52xkk2v", "template_0jym8b7", form);
        formStatus.textContent = "Message sent successfully. Thank you!";
        form.reset();
    } catch (error) {
        console.error(error);
        formStatus.classList.add("error");
        formStatus.textContent = "Message could not be sent. Please email me directly.";
    } finally {
        submitButton.disabled = false;
    }
});

document.querySelector("#year").textContent = new Date().getFullYear();
