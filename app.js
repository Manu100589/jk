(() => {
  const config = window.JK_CONFIG || {};
  const services = [
    ["Immatriculation", "Accompagnement dans les démarches d’immatriculation foncière.", "⌂"],
    ["Lotissement", "Organisation et accompagnement de projets de lotissement.", "▦"],
    ["Vente de terrains et de biens", "Accompagnement dans vos opérations de vente immobilière.", "↗"],
    ["Mutation foncière", "Assistance dans les démarches de transfert de propriété.", "⇄"],
    ["Construction", "Accompagnement de vos projets de construction immobilière.", "⌑"],
    ["Accompagnement immobilier", "Conseils et suivi personnalisés selon vos besoins.", "◎"],
    ["Règlement de litiges", "Orientation et accompagnement, avec recours aux professionnels compétents si nécessaire.", "⚖"],
    ["Gestion immobilière", "Suivi et gestion de vos biens immobiliers.", "▤"],
    ["Intermédiation financière", "Mise en relation et accompagnement dans le respect des règles applicables.", "◇"],
    ["Surveillance de sites", "Solutions de surveillance et de suivi de vos sites fonciers.", "⌖"],
    ["Levés topographiques", "Prestations de relevés topographiques adaptées à vos projets.", "⌁"],
    ["Location d’engins", "Solutions de location d’engins destinés aux travaux et chantiers.", "⚙"]
  ];
  const serviceImages = [
    "./assets/service-foncier.png",
    "./assets/terrain-survey-cameroon.png",
    "./assets/service-immobilier.png",
    "./assets/service-foncier.png",
    "./assets/service-construction.png",
    "./assets/service-immobilier.png",
    "./assets/service-foncier.png",
    "./assets/service-immobilier.png",
    "./assets/service-foncier.png",
    "./assets/terrain-survey-cameroon.png",
    "./assets/terrain-survey-cameroon.png",
    "./assets/service-construction.png"
  ];
  const grid = document.querySelector("#service-grid");
  services.forEach(([name, description, icon], i) => {
    const card = document.createElement("article");
    card.className = "service-card reveal";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `En savoir plus : ${name}`);
    card.dataset.service = String(i);
    card.innerHTML = `<div class="service-photo-wrap"><img class="service-photo" src="${serviceImages[i % serviceImages.length]}" alt="" loading="lazy" /><span class="service-index">${String(i + 1).padStart(2, "0")}</span><span class="service-photo-label" aria-hidden="true">Photo d’illustration</span></div><div class="service-card-copy"><div class="service-top"><span class="service-icon" aria-hidden="true">${icon}</span><span class="service-open-icon" aria-hidden="true">↗</span></div><h3>${name}</h3><p>${description}</p><span class="service-more">En savoir plus <span>↗</span></span></div>`;
    grid.append(card);
  });
  document.querySelectorAll("[data-service-scroll]").forEach(button => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.serviceScroll) || 1;
      if (typeof window.__serviceNavigate === "function") {
        window.__serviceNavigate(direction);
        return;
      }
      const card = grid.firstElementChild;
      const gap = parseFloat(getComputedStyle(grid).gap || "0") || 0;
      const distance = (card ? card.getBoundingClientRect().width : grid.clientWidth * 0.8) + gap;
      grid.scrollBy({ left: direction * distance, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  });

  const header = document.querySelector(".site-header");
  const progress = document.querySelector("#scroll-progress");
  const updateScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`;
  };
  updateScroll();
  window.addEventListener("scroll", updateScroll, { passive: true });

  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Ouvrir le menu");
    mobileNav.classList.remove("open");
    mobileNav.inert = true;
  };
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    mobileNav.classList.toggle("open", open);
    mobileNav.inert = !open;
  });
  mobileNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  const whatsapp = (config.whatsapp || "").replace(/\D/g, "");
  document.querySelectorAll(".js-whatsapp").forEach(link => {
    if (whatsapp) {
      link.href = `https://wa.me/${whatsapp}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.href = "#contact";
      link.addEventListener("click", event => {
        event.preventDefault();
        const note = document.querySelector("#form-note");
        note.textContent = "Le numéro WhatsApp doit être ajouté dans config.js avant utilisation.";
        note.dataset.state = "error";
        note.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  });
  const phoneText = document.querySelector(".contact-number");
  if (config.phone) phoneText.textContent = config.phone;

  const dialog = document.querySelector("#service-dialog");
  const openService = card => {
    const i = Number(card.dataset.service);
    dialog.querySelector(".dialog-number").textContent = `EXPERTISE ${String(i + 1).padStart(2, "0")}`;
    dialog.querySelector(".dialog-icon").textContent = services[i][2];
    dialog.querySelector("h2").textContent = services[i][0];
    dialog.querySelector("p").textContent = services[i][1];
    dialog.showModal();
  };
  grid.addEventListener("click", e => { const card = e.target.closest(".service-card"); if (card) openService(card); });
  grid.addEventListener("keydown", e => { const card = e.target.closest(".service-card"); if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openService(card); } });
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.querySelector(".dialog-cta").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });

  const listingGrid = document.querySelector("#listing-grid");
  const listingEmpty = document.querySelector("#listing-empty");
  const listingDialog = document.querySelector("#listing-dialog");
  const listingRecords = Array.isArray(config.listings) ? config.listings.filter(item => item && item.title && item.location && ["terrain", "maison", "appartement", "autre"].includes(item.type)) : [];
  const typeNames = { terrain: "Terrain", maison: "Maison", appartement: "Appartement", autre: "Autre bien" };
  const makeText = (tag, className, value) => { const el = document.createElement(tag); if (className) el.className = className; el.textContent = value; return el; };
  const renderListings = filter => {
    listingGrid.replaceChildren();
    const results = listingRecords.filter(item => filter === "tous" || item.type === filter);
    listingEmpty.hidden = results.length > 0;
    results.forEach(item => {
      const card = document.createElement("article");
      card.className = "listing-card";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Voir la fiche : ${item.title}`);
      const image = document.createElement("img");
      image.loading = "lazy";
      image.alt = item.imageAlt || "Photographie du bien immobilier";
      image.src = item.image || "";
      image.addEventListener("error", () => { image.hidden = true; });
      card.append(image);
      const body = document.createElement("div"); body.className = "listing-card-body";
      const top = document.createElement("div"); top.className = "listing-card-top";
      top.append(makeText("span", "listing-type", typeNames[item.type]));
      if (item.availabilityConfirmed === true && item.status) {
        const status = makeText("span", "listing-status", ""); status.append(document.createElement("i"), document.createTextNode(item.status)); top.append(status);
      }
      body.append(top, makeText("h3", "", item.title), makeText("p", "listing-location", item.location));
      if (item.area) body.append(makeText("p", "listing-meta", item.area));
      const bottom = document.createElement("div"); bottom.className = "listing-card-bottom";
      if (item.price) bottom.append(makeText("span", "listing-price", item.price));
      bottom.append(makeText("span", "listing-open", "Demander les informations ↗"));
      body.append(bottom); card.append(body);
      const showDetails = () => {
        const detailImage = listingDialog.querySelector("img");
        detailImage.src = item.image || "";
        detailImage.alt = item.imageAlt || "Photographie du bien immobilier";
        detailImage.hidden = !item.image;
        listingDialog.querySelector(".dialog-number").textContent = `${typeNames[item.type].toUpperCase()}${item.area ? ` · ${item.area}` : ""}`;
        listingDialog.querySelector("h2").textContent = item.title;
        listingDialog.querySelector(".listing-detail-meta").textContent = `${item.location}${item.price ? ` · ${item.price}` : ""}${item.availabilityConfirmed === true && item.status ? ` · ${item.status}` : ""}`;
        listingDialog.querySelector(".listing-detail-description").textContent = item.description || "Contactez-nous pour obtenir les informations concernant ce bien.";
        listingDialog.showModal();
      };
      card.addEventListener("click", showDetails);
      card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showDetails(); } });
      listingGrid.append(card);
    });
  };
  renderListings("tous");
  document.querySelectorAll(".filter-button").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach(b => { b.classList.toggle("active", b === button); b.setAttribute("aria-pressed", String(b === button)); });
    renderListings(button.dataset.filter);
  }));
  listingDialog.querySelector(".dialog-close").addEventListener("click", () => listingDialog.close());
  listingDialog.querySelector(".dialog-cta").addEventListener("click", () => listingDialog.close());
  listingDialog.addEventListener("click", e => { if (e.target === listingDialog) listingDialog.close(); });

  const form = document.querySelector("#contact-form");
  const formNote = document.querySelector("#form-note");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!config.formEndpoint) {
      formNote.textContent = "Votre demande est prête, mais son envoi n’est pas activé. Configurez une URL de réception sécurisée dans config.js.";
      formNote.dataset.state = "error";
      return;
    }
    const submit = form.querySelector("[type=submit]");
    submit.disabled = true;
    formNote.textContent = "Envoi de votre demande…";
    delete formNote.dataset.state;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch(config.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("La demande n’a pas pu être transmise.");
      form.reset();
      formNote.textContent = "Merci. Votre demande a bien été transmise à JK CONSULTING.";
      formNote.dataset.state = "success";
    } catch (error) {
      formNote.textContent = "L’envoi a échoué. Réessayez plus tard ou contactez-nous par téléphone.";
      formNote.dataset.state = "error";
    } finally { submit.disabled = false; }
  });

  const legalNote = document.querySelector("#legal-note");
  document.querySelectorAll("[data-legal]").forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    legalNote.hidden = false;
    legalNote.textContent = link.dataset.legal === "mentions"
      ? "Mentions légales à compléter avant publication : raison sociale et forme juridique, immatriculation, adresse de l’éditeur, directeur de publication et hébergeur."
      : "Politique de confidentialité à compléter avant publication : responsable du traitement, finalités, durée de conservation, base légale et modalités d’exercice des droits. Le formulaire reste inactif tant qu’aucun service n’est configuré.";
    legalNote.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }));
  document.querySelector("#year").textContent = String(new Date().getFullYear());

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.timeline({ defaults: { ease: "power2.out" } })
      .from(".hero .eyebrow", { opacity: 0, y: 12, duration: .65, delay: .12 })
      .from(".hero h1", { opacity: 0, y: 24, filter: "blur(5px)", duration: .9 }, "-=.3")
      .from(".hero-copy", { opacity: 0, y: 16, duration: .65 }, "-=.45")
      .from(".hero-actions > *", { opacity: 0, y: 12, duration: .5, stagger: .12 }, "-=.3");
    gsap.to(".hero-image", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .6 } });
    gsap.fromTo(".about-image", { clipPath: "inset(0 0 0 12%)", scale: 1.045 }, { clipPath: "inset(0 0 0 0%)", scale: 1, ease: "none", scrollTrigger: { trigger: ".about-image-wrap", start: "top 80%", end: "bottom 48%", scrub: .6 } });
    gsap.to(".cta-photo", { yPercent: 4, ease: "none", scrollTrigger: { trigger: ".cta-panel", start: "top bottom", end: "bottom top", scrub: .7 } });
  }

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.14 });
    document.querySelectorAll(".reveal, .commitment, .process-step, .difference-list article").forEach((el, i) => {
      el.classList.add("reveal");
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 75}ms`;
      observer.observe(el);
    });
    const stepObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
    }), { threshold: .48 });
    document.querySelectorAll(".process-step").forEach(step => stepObserver.observe(step));
    const track = document.querySelector(".process-track");
    const line = document.querySelector(".process-progress");
    const drawLine = () => {
      const rect = track.getBoundingClientRect();
      const viewport = window.innerHeight;
      const fraction = Math.max(0, Math.min(1, (viewport * .74 - rect.top) / (rect.height * .8)));
      if (window.innerWidth > 760) line.style.width = `${fraction * 100}%`;
      else line.style.height = `${fraction * 100}%`;
    };
    window.addEventListener("scroll", drawLine, { passive: true });
    window.addEventListener("resize", drawLine);
    drawLine();
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
  }
})();
