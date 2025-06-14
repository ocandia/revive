// script.js

document.addEventListener('DOMContentLoaded', () => {
  // Team members array with names and initials
  const teamMembers = [
    { name: "Evelia Candia" },
    { name: "Arlene B. Welborn" },
    { name: "Bennie D. Cooley" },
    { name: "Consuelo G. Silva" },
    { name: "Gary P. Newton" },
    { name: "Gladys C. 'Boots' Healy" },
    { name: "Ira Batt, 'The Battman'" },
    { name: "Irene A. Fernandez" },
    { name: "Irene Porras Ortega" },
    { name: "Javier Jose Montenegro" },
    { name: "Jesus Lugo" },
    { name: "Julia Moore Jones" },
    { name: "Kevin Jay Jessup" },
    { name: "Lillian Del Socorro Goss" },
    { name: "Maria Elena Pantoja Perez" },
    { name: "Maria Luisa Hawkins" },
    { name: "Marilyn Wanda Denny Sowles" },
    { name: "Marvin Abrams" },
    { name: "Nancy Fairbanks Herndon" },
    { name: "Rebecca R. Cardenas" },
    { name: "Sandra Licon Tims" },
    { name: "Terry Arroyo Gómez" },
    { name: "Todd M Blaugrund" },
    { name: "Alfonso Carpio Jr." },
    { name: "Paula G. Garner" }
  ];

  // Compute last-name initials
  teamMembers.forEach(member => {
    const parts = member.name.split(' ');
    member.initial = parts[parts.length - 1][0].toUpperCase();
  });

  // DOM elements
  const carouselContainer = document.querySelector('.carousel-container');
  const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.card');
  const leftArrow = document.querySelector('.nav-arrow.left');
  const rightArrow = document.querySelector('.nav-arrow.right');
  const alphabetNav = document.getElementById('alphabet-nav');
  let currentIndex = 0;
  let letterButtons = [];

  // Build alphabet navigation
  function generateAlphabetNav() {
    const available = [...new Set(teamMembers.map(m => m.initial))].sort();
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
      const btn = document.createElement('button');
      btn.textContent = letter;
      btn.dataset.letter = letter;
      if (!available.includes(letter)) btn.classList.add('disabled');
      else btn.addEventListener('click', () => jumpToLetter(letter));
      alphabetNav.appendChild(btn);
    });
    letterButtons = Array.from(alphabetNav.children);
  }

  // Jump to the first member of that initial
  function jumpToLetter(letter) {
    const idx = teamMembers.findIndex(m => m.initial === letter);
    if (idx !== -1) updateCarousel(idx);
  }

  // Update carousel position
  function updateCarousel(newIndex) {
    currentIndex = (newIndex + cards.length) % cards.length;
    // Translate by percentage of one card
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    // Update active letter button
    letterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.letter === teamMembers[currentIndex].initial);
    });
  }

  // Arrow click handlers
  leftArrow.addEventListener('click', () => updateCarousel(currentIndex - 1));
  rightArrow.addEventListener('click', () => updateCarousel(currentIndex + 1));

  // Make each card clickable: navigate to person-specific HTML page
  cards.forEach((card, i) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const person = teamMembers[i].name;
      // Slugify name to match filename convention (e.g., Evelia-Candia.html)
      const slug = person.replace(/\s+/g, '-');
      window.location.href = `src/pages/${slug}.html`;
    });
  });

  // Initialize
  generateAlphabetNav();
  updateCarousel(0);

  // Swipe support for mobile
  let startX = 0;
  let isDragging = false;

  carouselContainer.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });
  carouselContainer.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const diffX = Math.abs(e.touches[0].clientX - startX);
    if (diffX > 10) e.preventDefault();
  }, { passive: false });
  carouselContainer.addEventListener('touchend', e => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) updateCarousel(currentIndex + 1);
      else updateCarousel(currentIndex - 1);
    }
    isDragging = false;
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') updateCarousel(currentIndex - 1);
    else if (e.key === 'ArrowRight') updateCarousel(currentIndex + 1);
  });
});
