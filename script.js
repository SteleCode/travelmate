// ====== Дані турів ======
const TOURS = {
  paris: [
    { id: 'paris-1', name: 'Вікенд у Парижі (3 дні)', price: 220, seats: 18, img: 'https://picsum.photos/800/450?paris1', desc: 'Ейфелева вежа, Лувр, романтичні вулиці.' },
    { id: 'paris-2', name: 'Мистецький Париж (4 дні)', price: 300, seats: 12, img: 'https://picsum.photos/800/450?paris2', desc: 'Галереї, музеї та гастрономія.' }
  ],
  barcelona: [
    { id: 'barcelona-1', name: 'Архітектурний тур (3 дні)', price: 180, seats: 20, img: 'https://picsum.photos/800/450?barcelona1', desc: 'Гауді, Бокерія, пляж.' },
    { id: 'barcelona-2', name: 'Барселона для гурманів (4 дні)', price: 210, seats: 14, img: 'https://picsum.photos/800/450?barcelona2', desc: 'Тапас-тури та виноробні.' }
  ],
  kyiv: [
    { id: 'kyiv-1', name: 'Гастро-тур по Києву (2 дні)', price: 120, seats: 20, img: 'https://picsum.photos/800/450?kyiv1', desc: 'Кав’ярні, ринки та локальні смаки.' },
    { id: 'kyiv-2', name: 'Історичний Київ (3 дні)', price: 160, seats: 15, img: 'https://picsum.photos/800/450?kyiv2', desc: 'Софія, музеї, оглядові майданчики.' }
  ],
  rome: [
    { id: 'rome-1', name: 'Рим за 3 дні', price: 200, seats: 16, img: 'https://picsum.photos/800/450?rome1', desc: 'Колізей, Римський форум, Ватикан.' }
  ],
  tokyo: [
    { id: 'tokyo-1', name: 'Токіо: традиції і сучасність (5 днів)', price: 420, seats: 10, img: 'https://picsum.photos/800/450?tokyo1', desc: 'Сакура, храми, сучасні райони.' }
  ],
  london: [
    { id: 'london-1', name: 'Лондон за 4 дні', price: 320, seats: 22, img: 'https://picsum.photos/800/450?london1', desc: 'Букінгемський палац, Британський музей.' }
  ],
  berlin: [
    { id: 'berlin-1', name: 'Берлін: історія та культура (3 дні)', price: 170, seats: 18, img: 'https://picsum.photos/800/450?berlin1', desc: 'Бранденбурзькі ворота, музеї, стріт-арт.' }
  ],
  prague: [
    { id: 'prague-1', name: 'Прага романтична (2 дні)', price: 140, seats: 16, img: 'https://picsum.photos/800/450?prague1', desc: 'Старе місто, Карлів міст.' }
  ],
  vienna: [
    { id: 'vienna-1', name: 'Відень: музика і кава (3 дні)', price: 210, seats: 15, img: 'https://picsum.photos/800/450?vienna1', desc: 'Оперні вечори, кавʼярні та музеї.' }
  ],
  lisbon: [
    { id: 'lisbon-1', name: 'Лісабон і околиці (4 дні)', price: 190, seats: 14, img: 'https://picsum.photos/800/450?lisbon1', desc: 'Пагорби, трамваї, морська кухня.' }
  ],
  amsterdam: [
    { id: 'amsterdam-1', name: 'Амстердам: канали та музеї (3 дні)', price: 200, seats: 17, img: 'https://picsum.photos/800/450?amsterdam1', desc: 'Канали, музеї, велосипедні маршрути.' }
  ]
};

// ====== localStorage ключ і ініціалізація (доповнення нових турів) ======
const STORAGE_KEY = 'travelmate_seats';
function initSeats() {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  let updated = false;

  Object.keys(TOURS).forEach(city => {
    if (!stored[city]) {
      stored[city] = {};
      updated = true;
    }
    TOURS[city].forEach(t => {
      if (stored[city][t.id] == null) {
        stored[city][t.id] = Math.min(30, Math.max(10, t.seats));
        updated = true;
      }
    });
  });

  if (updated) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }
}
function getSeats(city, tourId) {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return (stored[city] && stored[city][tourId] != null) ? stored[city][tourId] : null;
}
function setSeats(city, tourId, value) {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (!stored[city]) stored[city] = {};
  stored[city][tourId] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

// ====== Пошук тексту з підсвічуванням ======
function searchText() {
  const inputEl = document.getElementById('searchInput');
  if (!inputEl) return;
  const query = inputEl.value.trim();
  if (!query) { alert('Введіть текст для пошуку.'); return; }

  const prev = document.querySelectorAll('.highlight');
  prev.forEach(el => el.replaceWith(document.createTextNode(el.textContent)));

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  let found = false;
  nodes.forEach(node => {
    const text = node.nodeValue;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx !== -1 && node.parentNode && !['SCRIPT','STYLE'].includes(node.parentNode.nodeName)) {
      found = true;
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode(text.slice(0, idx)));
      const match = document.createElement('span');
      match.className = 'highlight';
      match.textContent = text.slice(idx, idx + query.length);
      frag.appendChild(match);
      frag.appendChild(document.createTextNode(text.slice(idx + query.length)));
      node.parentNode.replaceChild(frag, node);
    }
  });

  if (!found) alert(`Текст "${query}" не знайдено.`);
}

// ====== Валідація контактної форми (очищення після відправки) ======
function validateForm() {
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  const formMessage = document.getElementById('formMessage');

  if (formMessage) {
    formMessage.textContent = '';
  }

  [name, email, message].forEach(el => { if (el) el.style.borderColor = '#ccc'; });

  let ok = true;
  if (!name || !name.value.trim()) { if (name) name.style.borderColor = 'red'; ok = false; }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email.value.trim())) { if (email) email.style.borderColor = 'red'; ok = false; }

  if (!message || !message.value.trim()) { if (message) message.style.borderColor = 'red'; ok = false; }

  if (!ok) {
    if (formMessage) { formMessage.textContent = 'Будь ласка, заповніть усі поля коректно.'; formMessage.style.color = 'red'; }
    return false;
  }

  if (name) name.value = '';
  if (email) email.value = '';
  if (message) message.value = '';

  if (formMessage) {
    formMessage.textContent = 'Дякуємо! Ваше повідомлення отримано.';
    formMessage.style.color = 'green';
  }
  return false;
}

// ====== UI: створення картки напрямку (кнопки праворуч від селектора) ======
function createDestinationCard(cityKey, tours) {
  const wrapper = document.createElement('article');
  wrapper.className = 'card';
  wrapper.dataset.city = cityKey;

  const img = document.createElement('img');
  img.className = 'card__image';
  img.src = tours[0].img;
  img.alt = cityKey;

  const body = document.createElement('div');
  body.className = 'card__body';

  const title = document.createElement('h3');
  title.className = 'card__title';
  title.textContent = cityTitle(cityKey);

  const subtitle = document.createElement('div');
  subtitle.className = 'card__subtitle';
  subtitle.textContent = tours[0].name;

  const text = document.createElement('p');
  text.className = 'card__text';
  text.textContent = tours.map(t => t.name).slice(0,3).join('; ') + (tours.length>3 ? ' та інші тури.' : '.');

  const meta = document.createElement('div');
  meta.className = 'card__meta';
  const duration = document.createElement('span');
  duration.className = 'card__meta-item';
  duration.textContent = 'Тривалість: ' + (tours[0].name.match(/\d+\s*дн/) ? tours[0].name.match(/\d+\s*дн/)[0] : 'різна');
  const price = document.createElement('span');
  price.className = 'card__meta-item';
  price.textContent = 'Від ' + tours[0].price + ' USD';
  meta.appendChild(duration);
  meta.appendChild(price);

  const label = document.createElement('label');
  label.textContent = 'Обрати тур';
  label.style.display = 'block';
  label.style.marginTop = '12px';
  label.style.fontWeight = '600';

  const controls = document.createElement('div');
  controls.className = 'card-controls';

  const select = document.createElement('select');
  select.className = 'tour-select';
  select.dataset.city = cityKey;

  tours.forEach(t => {
    const seats = getSeats(cityKey, t.id);
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = `${t.name} — ${t.price} USD — вільних: ${seats}`;
    select.appendChild(opt);
  });

  const buttons = document.createElement('div');
  buttons.className = 'card-controls__buttons';

  const viewBtn = document.createElement('button');
  viewBtn.className = 'view-btn';
  viewBtn.textContent = 'Переглянути';
  // "Переглянути" відкриває сторінку з формою бронювання (mode=book)
  viewBtn.addEventListener('click', () => {
    const sel = select.value;
    window.location.href = `destination.html?city=${encodeURIComponent(cityKey)}&tour=${encodeURIComponent(sel)}&mode=book`;
  });

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'confirm-btn';
  confirmBtn.textContent = 'Підтвердити';
  confirmBtn.addEventListener('click', () => {
    const sel = select.value;
    window.location.href = `destination.html?city=${encodeURIComponent(cityKey)}&tour=${encodeURIComponent(sel)}&mode=book`;
  });

  buttons.appendChild(viewBtn);
  buttons.appendChild(confirmBtn);

  controls.appendChild(select);
  controls.appendChild(buttons);

  const info = document.createElement('p');
  info.className = 'card-info';
  info.textContent = `Ціна: ${tours[0].price} USD. Вільних місць: ${getSeats(cityKey, tours[0].id)}.`;

  body.appendChild(title);
  body.appendChild(subtitle);
  body.appendChild(text);
  body.appendChild(meta);
  body.appendChild(label);
  body.appendChild(controls);
  body.appendChild(info);

  wrapper.appendChild(img);
  wrapper.appendChild(body);

  return wrapper;
}
function cityTitle(key) { return key.charAt(0).toUpperCase() + key.slice(1); }

function initHomeGrid() {
  const grid = document.getElementById('destinations-grid');
  const gridFull = document.getElementById('destinations-grid-full');
  if (grid) grid.innerHTML = '';
  if (gridFull) gridFull.innerHTML = '';

  Object.keys(TOURS).forEach((city, index) => {
    const card = createDestinationCard(city, TOURS[city]);
    // На головній показуємо перші 3 напрямки
    if (grid && index < 3) grid.appendChild(card.cloneNode(true));
    if (gridFull) gridFull.appendChild(card);
  });
}

// ====== Сторінка destination.html: ініціалізація та обробка mode=book ======
function initDestinationPage() {
  const params = new URLSearchParams(window.location.search);
  const city = params.get('city');
  const tourId = params.get('tour');
  const mode = params.get('mode') || null;
  if (!city || !tourId) return;

  const tours = TOURS[city];
  if (!tours) return;
  const tour = tours.find(t => t.id === tourId);
  if (!tour) return;

  const titleEl = document.getElementById('tour-title');
  const nameEl = document.getElementById('tour-name');
  const descEl = document.getElementById('tour-desc');
  const priceEl = document.getElementById('tour-price');
  const seatsEl = document.getElementById('tour-seats');
  const imgEl = document.getElementById('tour-image');
  const qtyEl = document.getElementById('book-qty');
  const bookBtn = document.getElementById('book-btn');
  const msgEl = document.getElementById('book-message');

  if (titleEl) titleEl.textContent = tour.name;
  if (nameEl) nameEl.textContent = tour.name;
  if (descEl) descEl.textContent = tour.desc;
  if (priceEl) priceEl.textContent = `${tour.price} USD`;
  if (imgEl) { imgEl.src = tour.img; imgEl.alt = tour.name; }

  function refreshSeats() {
    const seats = getSeats(city, tourId);
    if (seatsEl) seatsEl.textContent = seats;
    if (qtyEl) {
      qtyEl.max = Math.min(5, seats);
      if (parseInt(qtyEl.value,10) > qtyEl.max) qtyEl.value = qtyEl.max || 1;
    }
    document.querySelectorAll(`select.tour-select[data-city="${city}"]`).forEach(select => {
      Array.from(select.options).forEach(opt => {
        const tid = opt.value;
        const tourObj = (TOURS[city] || []).find(tt => tt.id === tid);
        if (tourObj) opt.textContent = `${tourObj.name} — ${tourObj.price} USD — вільних: ${getSeats(city, tid)}`;
      });
    });
    const infoEl = document.getElementById(`${city}-info`);
    if (infoEl) infoEl.textContent = `Ціна: ${tour.price} USD. Вільних місць: ${getSeats(city, tourId)}.`;
  }
  refreshSeats();

  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      msgEl.textContent = '';
      const want = parseInt(qtyEl.value, 10) || 1;
      const seats = getSeats(city, tourId);
      if (want <= 0) { msgEl.textContent = 'Вкажіть кількість місць.'; msgEl.style.color='red'; return; }
      if (want > seats) { msgEl.textContent = `Доступно лише ${seats} місць.`; msgEl.style.color='red'; return; }
      const newSeats = seats - want;
      setSeats(city, tourId, newSeats);
      refreshSeats();
      msgEl.textContent = `Успіх! Ви забронювали ${want} місць. Залишилося ${newSeats}.`;
      msgEl.style.color = 'green';

      // Після успішного бронювання перекидаємо на ту ж сторінку з режимом booking
      // щоб показати форму, як після натискання "Підтвердити" або "Переглянути" на сторінці напрямків.
      setTimeout(() => {
        window.location.href = `destination.html?city=${encodeURIComponent(city)}&tour=${encodeURIComponent(tourId)}&mode=book`;
      }, 700);
    });
  }

  // Режим book => показати форму підтвердження
  const bookingForm = document.getElementById('booking-form');
  const bookBlock = document.getElementById('book-block');
  const bookingQty = document.getElementById('booking-qty');
  if (mode === 'book' && bookingForm) {
    bookingForm.style.display = 'block';
    if (bookBlock) bookBlock.style.display = 'none';
    const seats = getSeats(city, tourId);
    if (bookingQty) {
      bookingQty.max = Math.min(5, seats);
      bookingQty.value = 1;
    }
    const bookingName = document.getElementById('booking-name');
    if (bookingName) bookingName.focus();
  }
}

// ====== Обробник форми бронювання на destination.html ======
function handleBookingForm(e) {
  e.preventDefault();
  const params = new URLSearchParams(window.location.search);
  const city = params.get('city');
  const tourId = params.get('tour');
  if (!city || !tourId) return false;

  const name = document.getElementById('booking-name');
  const email = document.getElementById('booking-email');
  const qty = document.getElementById('booking-qty');
  const msg = document.getElementById('booking-message');

  if (!name.value.trim() || !email.value.trim() || !qty.value) {
    msg.textContent = 'Будь ласка, заповніть усі поля.';
    msg.style.color = 'red';
    return false;
  }

  const want = parseInt(qty.value, 10);
  const seats = getSeats(city, tourId);
  if (want <= 0 || want > seats) {
    msg.textContent = `Недостатньо вільних місць (доступно ${seats}).`;
    msg.style.color = 'red';
    return false;
  }

  const newSeats = seats - want;
  setSeats(city, tourId, newSeats);

  msg.textContent = `Дякуємо, ${name.value.trim()}! Ви забронювали ${want} місць. Залишилося ${newSeats}.`;
  msg.style.color = 'green';

  const seatsEl = document.getElementById('tour-seats');
  if (seatsEl) seatsEl.textContent = newSeats;

  document.querySelectorAll('select.tour-select').forEach(select => {
    const citySel = select.dataset.city;
    Array.from(select.options).forEach(opt => {
      const tid = opt.value;
      const tourObj = (TOURS[citySel] || []).find(tt => tt.id === tid);
      if (tourObj) opt.textContent = `${tourObj.name} — ${tourObj.price} USD — вільних: ${getSeats(citySel, tid)}`;
    });
  });

  // Після підтвердження бронювання перенаправляємо користувача на режим booking тієї ж сторінки
  setTimeout(() => {
    window.location.href = `destination.html?city=${encodeURIComponent(city)}&tour=${encodeURIComponent(tourId)}&mode=book`;
  }, 700);

  return false;
}

// ====== Ініціалізація при завантаженні ======
document.addEventListener('DOMContentLoaded', () => {
  initSeats();
  initHomeGrid();
  initDestinationPage();

  // Підключаємо обробник форми контакту, якщо є (щоб форма очищалась після submit)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      validateForm();
    });
  }

  // Підключаємо обробник форми бронювання на сторінці destination.html, якщо є
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingForm);
  }
});