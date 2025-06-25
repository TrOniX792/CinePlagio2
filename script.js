// Usuarios y sesión
let users = JSON.parse(localStorage.getItem('users')) || [];
let loggedUser = null;

// Variables selección y carrito
let selectedMovie = '';
let selectedTime = '';
let selectedSeats = [];
let bookedSeats = JSON.parse(localStorage.getItem('bookedSeats')) || {};

// Mostrar películas
const movies = [
  {
    name: 'Shrek',
    desc: 'Un ogro llamado Shrek emprende una misión para rescatar a la princesa Fiona y así recuperar la paz en su pantano...',
    img: '243.png',
    trailer: 'https://youtu.be/CwXOrWvPBPk?si=l0n16ciY2PXGQekj',
  },
  {
    name: 'Las Locuras Del Emperador',
    desc: 'El arrogante emperador Kuzco es transformado en llama por su ambiciosa consejera Yzma...',
    img: 'Locuras.webp',
    trailer: 'https://youtu.be/Bkh3heh_uHE?si=6gi0L4Zb25PZLVGm',
  },
  {
    name: 'Spirit',
    desc: 'Spirit, un valiente caballo salvaje, lucha por su libertad mientras enfrenta la captura por parte de los humanos...',
    img: 'MV5BMTgyOTUzNDA1N15BMl5BanBnXkFtZTYwNjgwMDM3._V1_FMjpg_UX1000_.jpg',
    trailer: 'https://youtu.be/-vGpe_8XiNk?si=867kyCOasHdsNKi8',
  },
  {
    name: 'El Planeta Del Tesoro',
    desc: 'Jim Hawkins encuentra un misterioso mapa que lo lleva en un viaje intergaláctico en busca del legendario Tesoro...',
    img: 'El_planeta_del_tesoro_portada.webp',
    trailer: 'https://youtu.be/Fe5csRmTpnI?si=ssuTyjz1lQLCtGby',
  },
  {
    name: 'El Origen De Los Guardianes',
    desc: 'Jack Frost descubre su destino como Guardián cuando es reclutado por Santa Claus, el Hada de los Dientes...',
    img: '20282576.jpg',
    trailer: 'https://youtu.be/e4bdD8owgDU?si=C0GvVlDoo_KSLHW2',
  },
  {
    name: 'Atlantis',
    desc: 'El joven cartógrafo Milo Thatch se une a una expedición para encontrar la legendaria ciudad perdida de Atlantis...',
    img: 'Atlantis.webp',
    trailer: 'https://youtu.be/r39ys9K3LgA?si=qkELNleXXvpQ62Wp',
  },
  {
    name: 'Big Hero 6',
    desc: 'Hiro, un joven genio de la robótica, forma un equipo de héroes junto a sus amigos y el adorable robot Baymax...',
    img: 'big.webp',
    trailer: 'https://youtu.be/gZgre_WKDuk?si=1-JbO00QbzkFXEMD',
  },
  {
    name: 'Tierra De Osos',
    desc: 'Kenai, un joven impulsivo, es transformado en oso como castigo por los espíritus tras un acto de venganza...',
    img: 'Tierra.webp',
    trailer: 'https://youtu.be/RUlTmkwpcLo?si=fneweEjBC02ycS4O',
  }
];

function showSection(id) {
  document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function renderMovies() {
  const container = document.getElementById('movie-list');
  container.innerHTML = '';
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${movie.img}" alt="${movie.name}">
      <h3>${movie.name}</h3>
      <p>${movie.desc}</p>
    `;
    card.onclick = () => selectMovie(movie);
    container.appendChild(card);
  });
}

function selectMovie(movie) {
  selectedMovie = movie.name;
  document.getElementById('movie-name').textContent = movie.name;
  document.getElementById('movie-desc').textContent = movie.desc;
  document.getElementById('movie-img').src = movie.img;
  document.getElementById('trailer-btn').onclick = () => window.open(movie.trailer, '_blank');
  showSection('select-time');
  renderTimeButtons();
}

function renderTimeButtons() {
  document.querySelectorAll('.btn-time').forEach(btn => {
    btn.onclick = () => selectSeats(btn.textContent);
  });
}

function selectSeats(time) {
  selectedTime = time;
  selectedSeats = [];
  foodItemsSelected = [];
  showSection('seat-selection');
  renderSeats();
  updateCart();
}

function renderSeats() {
  const container = document.getElementById('seats-container');
  container.innerHTML = '';
  const key = `${selectedMovie}_${selectedTime}`;
  const occupied = bookedSeats[key] || [];
  for (let i = 1; i <= 50; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = 'seat';
    if (occupied.includes(i)) {
      btn.classList.add('booked');
      btn.disabled = true;
    }
    btn.onclick = () => toggleSeat(i, btn);
    container.appendChild(btn);
  }
  document.getElementById('accept-seats-btn').disabled = true;
}

function toggleSeat(number, btn) {
  if (selectedSeats.includes(number)) {
    selectedSeats = selectedSeats.filter(n => n !== number);
    btn.classList.remove('selected');
  } else {
    selectedSeats.push(number);
    btn.classList.add('selected');
  }
  document.getElementById('accept-seats-btn').disabled = selectedSeats.length === 0;
  updateCart();
}

document.getElementById('accept-seats-btn').onclick = () => {
  showSection('food-selection');
};

// Variables para guardar la selección de comida
let foodItemsSelected = [];

// Función para actualizar la selección de comida desde inputs
function updateFoodSelection() {
  foodItemsSelected = []; // reset

  // Palomitas
  const popcornSizeRadio = document.querySelector('input[name="popcorn-size"]:checked');
  const popcornQtyInput = document.getElementById('popcorn-qty');
  const popcornQty = Number(popcornQtyInput.value);
  if (popcornSizeRadio && popcornQty > 0) {
    foodItemsSelected.push({
      name: popcornSizeRadio.getAttribute('data-name'),
      price: Number(popcornSizeRadio.getAttribute('data-price')),
      quantity: popcornQty
    });
  }

  // Gaseosa
  const sodaSizeRadio = document.querySelector('input[name="soda-size"]:checked');
  const sodaQtyInput = document.getElementById('soda-qty');
  const sodaQty = Number(sodaQtyInput.value);
  if (sodaSizeRadio && sodaQty > 0) {
    foodItemsSelected.push({
      name: sodaSizeRadio.getAttribute('data-name'),
      price: Number(sodaSizeRadio.getAttribute('data-price')),
      quantity: sodaQty
    });
  }

  // Golosinas (checkbox + qty)
  const candiesCheckbox = document.getElementById('candies-checkbox');
  const candiesQtyInput = document.getElementById('candies-qty');
  const candiesQty = Number(candiesQtyInput.value);
  if (candiesCheckbox.checked && candiesQty > 0) {
    foodItemsSelected.push({
      name: candiesCheckbox.getAttribute('data-name'),
      price: Number(candiesCheckbox.getAttribute('data-price')),
      quantity: candiesQty
    });
  }
}

// Función para marcar los inputs según la selección (al volver a comida)
function markFoodSelected() {
  // Limpiar todo primero
  document.querySelectorAll('input[name="popcorn-size"]').forEach(r => r.checked = false);
  document.getElementById('popcorn-qty').value = 0;

  document.querySelectorAll('input[name="soda-size"]').forEach(r => r.checked = false);
  document.getElementById('soda-qty').value = 0;

  const candiesCheckbox = document.getElementById('candies-checkbox');
  const candiesQtyInput = document.getElementById('candies-qty');
  candiesCheckbox.checked = false;
  candiesQtyInput.value = 0;

  // Marcar según foodItemsSelected
  foodItemsSelected.forEach(item => {
    if (item.name.includes('Palomitas')) {
      const radios = document.querySelectorAll('input[name="popcorn-size"]');
      radios.forEach(r => {
        if (r.getAttribute('data-name') === item.name) r.checked = true;
      });
      document.getElementById('popcorn-qty').value = item.quantity;
    }
    if (item.name.includes('Gaseosa')) {
      const radios = document.querySelectorAll('input[name="soda-size"]');
      radios.forEach(r => {
        if (r.getAttribute('data-name') === item.name) r.checked = true;
      });
      document.getElementById('soda-qty').value = item.quantity;
    }
    if (item.name === 'Dulces') {
      candiesCheckbox.checked = true;
      candiesQtyInput.value = item.quantity;
    }
  });
}

// Mostrar sección comida y marcar la selección anterior
function showFoodSelection() {
  showSection('food-selection');
  markFoodSelected();
  updateCart();  // Opcional para mostrar resumen parcial
}

// Agregar eventos para actualizar la selección cada vez que cambie algo
document.querySelectorAll('input[name="popcorn-size"]').forEach(radio => {
  radio.onchange = updateFoodSelection;
});
document.getElementById('popcorn-qty').oninput = updateFoodSelection;

document.querySelectorAll('input[name="soda-size"]').forEach(radio => {
  radio.onchange = updateFoodSelection;
});
document.getElementById('soda-qty').oninput = updateFoodSelection;

document.getElementById('candies-checkbox').onchange = updateFoodSelection;
document.getElementById('candies-qty').oninput = updateFoodSelection;

document.querySelectorAll('.food-options input[type=checkbox]').forEach(chk => {
  chk.onchange = () => {
    const name = chk.getAttribute('data-name');
    const price = Number(chk.value);
    if (chk.checked) {
      if (!foodItemsSelected.find(f => f.name === name)) {
        foodItemsSelected.push({ name, price });
      }
    } else {
      foodItemsSelected = foodItemsSelected.filter(f => f.name !== name);
    }
    updateCart();
  };
});

document.getElementById('to-payment-btn').onclick = () => showSection('payment');

document.getElementById('pay-online-btn').onclick = () => processPayment('en línea');
document.getElementById('pay-voucher-btn').onclick = () => processPayment('con vale');

function processPayment(type) {
  const key = `${selectedMovie}_${selectedTime}`;
  if (!bookedSeats[key]) bookedSeats[key] = [];
  bookedSeats[key] = bookedSeats[key].concat(selectedSeats);
  localStorage.setItem('bookedSeats', JSON.stringify(bookedSeats));
  alert(`Pago ${type} procesado correctamente.`);
  selectedSeats = [];
  foodItemsSelected = [];
  updateCart();
  showSection('movies');
  updateUserInfoDisplay();
}

// Modal login/signup control
const modalLogin = document.getElementById('modal-login');
const modalSignup = document.getElementById('modal-signup');

function openModal(modal) {
  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  const firstInput = modal.querySelector('input, button, select, textarea');
  if (firstInput) firstInput.focus();
}

function closeModal(modal) {
  modal.classList.add('hidden');
  document.body.classList.remove('modal-open');
  clearForm(modal);
}

function clearForm(modal) {
  const form = modal.querySelector('form');
  if (form) form.reset();
  const error = modal.querySelector('.error-msg');
  if (error) error.textContent = '';
}

document.getElementById('login-btn').addEventListener('click', () => openModal(modalLogin));
document.getElementById('signup-btn').addEventListener('click', () => openModal(modalSignup));
document.getElementById('login-close-btn').addEventListener('click', () => closeModal(modalLogin));
document.getElementById('signup-close-btn').addEventListener('click', () => closeModal(modalSignup));

modalLogin.addEventListener('click', e => {
  if (e.target === modalLogin) closeModal(modalLogin);
});
modalSignup.addEventListener('click', e => {
  if (e.target === modalSignup) closeModal(modalSignup);
});

document.getElementById('to-signup-link').addEventListener('click', e => {
  e.preventDefault();
  closeModal(modalLogin);
  openModal(modalSignup);
});
document.getElementById('to-login-link').addEventListener('click', e => {
  e.preventDefault();
  closeModal(modalSignup);
  openModal(modalLogin);
});

// Login form
document.getElementById('login-form').onsubmit = e => {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

  if (!user) {
    errorEl.textContent = 'Usuario o contraseña incorrectos.';
    return;
  }

  loggedUser = user;
  alert(`Bienvenido, ${user.username}!`);
  closeModal(modalLogin);
  updateUserInfoDisplay();
};

// Signup form
document.getElementById('signup-form').onsubmit = e => {
  e.preventDefault();
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm-password').value;
  const errorEl = document.getElementById('signup-error');

  errorEl.textContent = '';

  if (!username || !email || !password || !confirmPassword) {
    errorEl.textContent = 'Por favor, complete todos los campos.';
    return;
  }
  if (password !== confirmPassword) {
    errorEl.textContent = 'Las contraseñas no coinciden.';
    return;
  }
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    errorEl.textContent = 'El usuario ya existe.';
    return;
  }
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    errorEl.textContent = 'El correo ya está registrado.';
    return;
  }

  users.push({ username, email, password });
  localStorage.setItem('users', JSON.stringify(users));
  alert('Cuenta creada exitosamente.');
  closeModal(modalSignup);
  clearForm(modalSignup);
  openModal(modalLogin);
};

// Mostrar info de usuario logueado y botón cerrar sesión
function updateUserInfoDisplay() {
  const authButtons = document.getElementById('auth-buttons');
  const userInfo = document.getElementById('user-info');
  const usernameDisplay = document.getElementById('username-display');
  const logoutBtn = document.getElementById('logout-btn');

  if (loggedUser) {
    authButtons.classList.add('hidden');
    userInfo.classList.remove('hidden');
    usernameDisplay.textContent = `Hola, ${loggedUser.username}`;
  } else {
    authButtons.classList.remove('hidden');
    userInfo.classList.add('hidden');
    usernameDisplay.textContent = '';
  }

  logoutBtn.onclick = () => {
    loggedUser = null;
    updateUserInfoDisplay();
    alert('Has cerrado sesión.');
    showSection('movies');
  };
}

// Botón ayuda
const helpBtn = document.getElementById('help-btn');
const helpForm = document.getElementById('help-form');
const helpContactForm = document.getElementById('help-contact-form');
const helpSuccess = document.getElementById('help-success');

helpBtn.onclick = () => {
  helpForm.style.display = helpForm.style.display === 'block' ? 'none' : 'block';
};

helpContactForm.onsubmit = e => {
  e.preventDefault();
  helpSuccess.classList.remove('hidden');
  helpContactForm.reset();
  setTimeout(() => {
    helpSuccess.classList.add('hidden');
    helpForm.style.display = 'none';
  }, 3000);
};

// Título Cine Plagio vuelve al inicio desde cualquier click en header menos botones
document.querySelector('header').addEventListener('click', e => {
  if (!e.target.closest('.auth-buttons') && !e.target.closest('#user-info')) {
    e.preventDefault();
    showSection('movies');
  }
});

// Inicializar
renderMovies();
showSection('movies');
updateCart();
updateUserInfoDisplay();

// Cambiar botón continuar en comida para mostrar carrito confirmación
document.getElementById('to-cart-btn').onclick = () => {
    showSection('cart-confirmation');
    renderCartConfirmation();
  };
  
// Función que actualiza el carrito de compra 
function updateCart() {
  const cartDetails = document.getElementById('cart-details');
  const cartTotal = document.getElementById('cart-total');
  let total = 0;
  let html = '';

  if (selectedSeats.length > 0) {
    html += '<strong>Asientos seleccionados:</strong><br>';
    selectedSeats.forEach(s => {
      html += `<div class="cart-item">Asiento ${s} - $5000</div>`;
      total += 5000;
    });
  }

  if (foodItemsSelected.length > 0) {
    html += '<br><strong>Comida seleccionada:</strong><br>';
    foodItemsSelected.forEach(item => {
      html += `<div class="cart-item">${item.name} - $${item.price}</div>`;
      total += item.price;
    });
  }

  if (html === '') html = '<p>No hay productos en el carrito.</p>';

  cartDetails.innerHTML = html;
  cartTotal.textContent = total;
}

// Función que muestra el resumen del carrito (asientos + comida) y total
function renderCartConfirmation() {
  const details = document.getElementById('cart-details-confirm');
  const totalElem = document.getElementById('cart-total-confirm');

  let total = 0;
  let html = '';

  if (selectedSeats.length > 0) {
    html += '<strong>Asientos seleccionados:</strong><br>';
    selectedSeats.forEach(s => {
      html += `<div class="cart-item">Asiento ${s} - $5000</div>`;
      total += 5000;
    });
  }

  if (foodItemsSelected.length > 0) {
    html += '<br><strong>Comida seleccionada:</strong><br>';
    foodItemsSelected.forEach(item => {
      const itemTotal = item.price * item.quantity;
      html += `<div class="cart-item">${item.name} x${item.quantity} - $${itemTotal}</div>`;
      total += itemTotal;
    });
  }

  if (html === '') html = '<p>No hay productos en el carrito.</p>';

  details.innerHTML = html;
  totalElem.textContent = total;
}


// Botón confirmar compra muestra la pantalla de pago
document.getElementById('confirm-purchase-btn').onclick = () => {
  if (!loggedUser) {
    alert('Debes iniciar sesión para poder realizar el pago.');
    openModal(modalLogin);
  } else {
    showSection('payment');
  }
};


// Botón para volver a seleccionar comida desde carrito
document.getElementById('back-to-food-btn').onclick = () => {
  showSection('food-selection');
};

// Botón continuar en selección de comida muestra el carrito de confirmación
document.getElementById('to-cart-btn').onclick = () => {
  showSection('cart-confirmation');
  renderCartConfirmation();
};

// Botón confirmar compra avanza a pago
document.getElementById('confirm-purchase-btn').onclick = () => {
  showSection('payment');
};

// Botón volver a comida desde carrito
document.getElementById('back-to-food-btn').onclick = () => {
  showSection('food-selection');
};

// Espera que el DOM esté listo antes de asignar eventos
document.addEventListener('DOMContentLoaded', () => {

  const toCartBtn = document.getElementById('to-cart-btn');

  if (toCartBtn) {
    toCartBtn.addEventListener('click', () => {
      showSection('cart-confirmation');
      renderCartConfirmation();
    });
  }

  const confirmPurchaseBtn = document.getElementById('confirm-purchase-btn');
  if (confirmPurchaseBtn) {
    confirmPurchaseBtn.addEventListener('click', () => {
      showSection('payment');
    });
  }

  const backToFoodBtn = document.getElementById('back-to-food-btn');
  if (backToFoodBtn) {
    backToFoodBtn.addEventListener('click', () => {
      showSection('food-selection');
    });
  }

});

// Al final del script.js, pon esto para que espere el DOM y se asigne correctamente el evento:

window.addEventListener('load', () => {
  const toCartBtn = document.getElementById('to-cart-btn');
  if (toCartBtn) {
    toCartBtn.addEventListener('click', () => {
      // Solo muestra la sección carrito confirmación
      showSection('cart-confirmation');
      renderCartConfirmation();
    });
  }

  const confirmPurchaseBtn = document.getElementById('confirm-purchase-btn');
  if (confirmPurchaseBtn) {
    confirmPurchaseBtn.addEventListener('click', () => {
      showSection('payment');
    });
  }

  const backToFoodBtn = document.getElementById('back-to-food-btn');
  if (backToFoodBtn) {
    backToFoodBtn.addEventListener('click', () => {
      showSection('food-selection');
    });
  }
});
document.getElementById('back-to-seats-btn').onclick = () => {
  // Mostrar la sección de selección de asientos
  showSection('seat-selection');

  // Renderizar todos los asientos (para que se muestren)
  renderSeats();

  // Marcar los asientos previamente seleccionados
  const seatButtons = document.querySelectorAll('#seats-container .seat');
  seatButtons.forEach(btn => {
    const seatNumber = Number(btn.textContent);
    if (selectedSeats.includes(seatNumber)) {
      btn.classList.add('selected');
      btn.disabled = false;
    }
  });

  // Activar o desactivar el botón "Aceptar" según si hay asientos seleccionados
  document.getElementById('accept-seats-btn').disabled = selectedSeats.length === 0;
};

document.getElementById('pay-online-btn').onclick = () => {
  if (!loggedUser) {
    alert('Debes iniciar sesión para pagar en línea.');
    openModal(modalLogin);
  } else {
    processPayment('en línea');
  }
};

document.getElementById('pay-voucher-btn').onclick = () => {
  if (!loggedUser) {
    alert('Debes iniciar sesión para pagar con vale.');
    openModal(modalLogin);
  } else {
    processPayment('con vale');
  }
};

// Función de búsqueda con coincidencias parciales (palabra clave)
function searchMovies() {
  const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
  
  // Si no se ingresa texto, mostrar todas las películas
  if (searchQuery === "") {
    renderMovies(movies);
    return;
  }

  // Filtrar las películas que contengan la palabra clave en cualquier parte del nombre
  const filteredMovies = movies.filter(movie =>
    movie.name.toLowerCase().includes(searchQuery) // Búsqueda por cualquier parte del nombre
  );

  renderMovies(filteredMovies);
}

// Modificar renderMovies para aceptar películas filtradas
function renderMovies(filteredMovies = movies) {
  const container = document.getElementById('movie-list');
  container.innerHTML = '';  // Limpiar la lista de películas
  
  // Si no hay resultados, mostrar mensaje
  if (filteredMovies.length === 0) {
    container.innerHTML = '<p>No se encontraron películas con ese nombre.</p>';
  }

  filteredMovies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${movie.img}" alt="${movie.name}">
      <h3>${movie.name}</h3>
      <p>${movie.desc}</p>
    `;
    card.onclick = () => selectMovie(movie);
    container.appendChild(card);
  });
}

// Añadir un input para búsqueda
const searchContainer = document.createElement('div');
searchContainer.innerHTML = `<input type="text" id="search-input" placeholder="Buscar película..." />`;
document.querySelector('main').insertBefore(searchContainer, document.getElementById('movies'));
document.getElementById('search-input').addEventListener('input', searchMovies);


function updateUserData() {
  if (!loggedUser) {
    alert('Debes iniciar sesión primero');
    return;
  }

  const newUsername = prompt('Nuevo nombre de usuario:', loggedUser.username);
  const newEmail = prompt('Nuevo correo electrónico:', loggedUser.email);

  if (newUsername && newEmail) {
    loggedUser.username = newUsername;
    loggedUser.email = newEmail;
    localStorage.setItem('users', JSON.stringify(users));
    alert('Datos actualizados correctamente');
    updateUserInfoDisplay(); // Actualiza la información en la pantalla
  } else {
    alert('Por favor, ingrese un nuevo nombre y correo válidos.');
  }
}

// Función para eliminar la cuenta del usuario
function deleteUserAccount() {
  if (!loggedUser) {
    alert('Debes iniciar sesión primero');
    return;
  }

  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');

  if (confirmDelete) {
    users = users.filter(user => user.username !== loggedUser.username);
    localStorage.setItem('users', JSON.stringify(users));
    loggedUser = null;
    updateUserInfoDisplay(); // Actualiza la pantalla
    alert('Tu cuenta ha sido eliminada.');
  }
}

// Crear el botón para eliminar cuenta
const deleteBtn = document.createElement('button');
deleteBtn.classList.add('btn-danger');  // Estilo de Bootstrap para el botón
deleteBtn.textContent = 'Eliminar Cuenta';

// Crear el ícono de eliminar (papelera) con un nombre diferente para evitar el conflicto
const deleteIcon = document.createElement('i');
deleteIcon.classList.add('bi', 'bi-trash', 'me-2');  // Añadir clases para el ícono y margen

// Añadir el ícono al botón antes del texto
deleteBtn.prepend(deleteIcon);

// Asignar la acción de eliminación al botón
deleteBtn.onclick = deleteUserAccount;

// Agregar el botón al contenedor
document.getElementById('user-info').appendChild(deleteBtn);

// Función para actualizar los datos del usuario
function updateUserData() {
  if (!loggedUser) {
    alert('Debes iniciar sesión primero');
    return;
  }

  const newUsername = prompt('Nuevo nombre de usuario:', loggedUser.username);
  const newEmail = prompt('Nuevo correo electrónico:', loggedUser.email);

  if (newUsername && newEmail) {
    loggedUser.username = newUsername;
    loggedUser.email = newEmail;
    localStorage.setItem('users', JSON.stringify(users));
    updateUserInfoDisplay(); // Actualiza la pantalla con los nuevos datos
    alert('Datos actualizados correctamente.');
  } else {
    alert('Por favor, ingrese un nuevo nombre y correo válidos.');
  }
}

// Crear el botón para actualizar datos
const updateBtn = document.createElement('button');
updateBtn.classList.add('btn-secondary');  // Estilo de Bootstrap para el botón
updateBtn.textContent = 'Actualizar Datos';

// Crear el ícono de actualización
const updateIcon = document.createElement('i');
updateIcon.classList.add('bi', 'bi-arrow-clockwise', 'me-2');  // Añadir clases para el ícono y margen

// Añadir el ícono al botón antes del texto
updateBtn.prepend(updateIcon);

// Asignar la acción de actualización al botón
updateBtn.onclick = updateUserData;

// Agregar el botón al contenedor
document.getElementById('user-info').appendChild(updateBtn);

