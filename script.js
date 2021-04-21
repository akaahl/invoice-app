const body = document.getElementsByTagName('body')[0];
const modeSelector = document.querySelector('.modes');
const addNewInvoiceBtn = document.getElementById('add-new-invoice');
const filterContainer = document.getElementById('filter-container');
const filterContent = document.getElementById('filter-content');
const mainContainer = document.getElementById('main-container');
const sectionElement = document.getElementById('section-element');
const formContainer = document.getElementById('form-container');
const invoiceDate = document.getElementById('invoice-date');
const discardBtn = document.getElementById('discard-btn');
const formContent = document.getElementById('form-content');
const addNewItem = document.getElementById('add-new-item');
const itemListContainer = document.getElementById('item-list');
const h4ItemList = document.getElementById('h4-item-list');
const inputFields = document.querySelectorAll('.fields');
const saveAsDraftBtn = document.getElementById('draft-btn');
const sendBtn = document.getElementById('send-btn');
const dataUrl = `data.json`;
let dataArray, fieldAlert;

// Reset input fields in modal
function resetInputFields() {
  inputFields.forEach(field => {
    field.value = '';
    field.classList.remove('empty');
    field.previousElementSibling.style.color = 'hsl(252, 94%, 67%)';
  });

  let items = document.querySelectorAll('.item');

  if (items) {
    items.forEach(item => {
      item.remove();
    });
  }

  itemListContainer.classList.remove('field-empty-alert');
  itemListContainer.classList.remove('item-empty-alert');
}

// Load color theme from local storage on document load
function setColorMode() {
  body.setAttribute('data-theme', localStorage.getItem('theme-mode'));
}

setColorMode();

// Show form modal
addNewInvoiceBtn.addEventListener('click', () => {
  body.classList.add('form-show');
});

// Remove form modal
discardBtn.addEventListener('click', () => {
  body.classList.remove('form-show');
  resetInputFields();
});

// Format datepicker based on today's date (form modal)
function formatInvoiceDate() {
  let today = new Date();
  invoiceDate.valueAsDate = today;
}

formatInvoiceDate();

// Click anywhere other than the inner form will trigger close form modal
formContainer.addEventListener('click', e => {
  if (e.target.matches('.form-container')) {
    body.classList.remove('form-show');
    resetInputFields();
  }
});

// Select and save color theme
modeSelector.addEventListener('click', e => {
  if (e.target.classList.contains('dark-mode-icon')) {
    body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme-mode', 'dark');
  }

  if (e.target.classList.contains('light-mode-icon')) {
    body.setAttribute('data-theme', 'light');
    localStorage.setItem('theme-mode', 'light');
  }
});

// Show/remove filter status selections
document.addEventListener('click', e => {
  const parentElement = e.target.parentElement;
  if (parentElement.classList.contains('filter-container')) {
    filterContainer.classList.toggle('show');
  }

  if (!e.target.closest('.filter-section')) {
    filterContainer.classList.remove('show');
  }
});

// Get data from data.json
async function getData(url) {
  const res = await fetch(url);
  const data = await res.json();

  return data;
}

getData(dataUrl);

// These 3 functions below are used in the initialUpdateDOM
function paymentStatus(str) {
  return str == 'paid' ? 'paid' : str == 'pending' ? 'pending' : 'draft';
}

function currencySymbol(location) {
  return location == 'United Kingdom' ? '&#163;' : '&#36;';
}

function formatDate(dateStr) {
  let dateArray = dateStr.split('-').reverse();
  let monthObject = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  };

  for (let i = 0; i < dateArray.length; i++) {
    if (i == 1) {
      dateArray[i] = monthObject[dateArray[i]];
    }
  }

  return dateArray.join(' ');
}

// Update DOM on document load
async function initialUpdateDOM() {
  dataArray = [...(await getData(dataUrl))];

  console.log(dataArray);

  dataArray.forEach(item => {
    const articleElement = document.createElement('article');
    articleElement.classList.add(paymentStatus(item.status));

    formatDate(item.paymentDue);

    articleElement.innerHTML = `
          <div class="left-side">
            <p class="code-id"><span>#</span>${item.id}</p>
            <p class="due-date">Due ${formatDate(item.paymentDue)}</p>
            <p class="name">${item.clientName}</p>
          </div>

          <div class="right-side">
            <p class="amount">${currencySymbol(item.clientAddress.country)}${
      item.total
    }</p>
            <div class="status">
              <i class="bx bxs-circle"></i>
              <p>${
                item.status.slice(0, 1).toUpperCase() + item.status.slice(1)
              }</p>
            </div>
            <img src="images/icon-arrow-right.svg" alt="right arrow icon" />
          </div>
    `;

    sectionElement.appendChild(articleElement);
  });
}

initialUpdateDOM();

// Functions used for validations of input and email fields
function fieldsEmpty(element) {
  element.classList.add('empty');
  element.previousElementSibling.style.color = 'orangered';
}

function fieldsValid(element) {
  element.classList.remove('empty');
  element.previousElementSibling.style.color = 'hsl(252, 94%, 67%)';
}

function validateEmail(elem, email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (re.test(email.toLowerCase())) {
    fieldsValid(elem);
  } else {
    fieldsEmpty(elem);
  }
}

// Validate input text and email fields on focusout
formContent.addEventListener('focusout', e => {
  const targetElement = e.target;

  if (
    targetElement.classList.contains('fields') &&
    targetElement.value !== ''
  ) {
    fieldsValid(targetElement);
  }

  if (targetElement.classList.contains('fields') && targetElement.value == '') {
    fieldsEmpty(targetElement);
  }

  if (targetElement.getAttribute('type') == 'email') {
    validateEmail(targetElement, targetElement.value);
  }
});

// Add new item within the form
addNewItem.addEventListener('click', () => {
  const itemElement = document.createElement('div');
  itemElement.classList.add('item');

  itemElement.innerHTML = `
    <div class="name">
      <label for="item-name">Name</label>
      <input
        type="text"
        name="name-of-item"
        autocomplete="nope"
        class="fields item-name"
      />
    </div>

    <div class="quantity">
      <label for="item-quantity">Qty.</label>
      <input
        type="text"
        name="quantity-of-item"
        autocomplete="nope"
        class="fields item-quantity"
      />
    </div>

    <div class="price">
      <label for="item-price">Price.</label>
      <input
        type="text"
        name="price-of-item"
        autocomplete="nope"
        class="fields item-price"
        >
    </div>

    <div class="total">
      <label for="item-total">Total</label>
      <p class="item-total">0</p>
    </div>

    <img
      src="images/icon-delete.svg"
      alt="delete btn icon"
      class="delete-btn"
    />
  `;

  const quantity = itemElement.children[1].children[1];
  const price = itemElement.children[2].children[1];
  const total = itemElement.children[3].children[1];

  function updateTotal() {
    if (quantity.value == '' || price.value == '') {
      total.textContent = '0';
    }

    if (quantity.value >= 0 && price.value >= 0) {
      total.textContent = +quantity.value * +price.value;
    }
  }

  quantity.addEventListener('change', updateTotal);
  price.addEventListener('change', updateTotal);

  itemElement.addEventListener('click', e => {
    if (e.target.classList.contains('delete-btn')) {
      itemElement.classList.add('remove');
      setTimeout(() => {
        itemElement.remove();
      }, 350);
    }
  });
  addNewItem.insertAdjacentElement('beforebegin', itemElement);
});

// Prevent from adding new item when pressing Enter
addNewItem.addEventListener('keydown', e => {
  if (e.code == 'Enter' || e.key == 'Enter') {
    e.preventDefault();
  }
});

formContainer.addEventListener('submit', e => {
  e.preventDefault();
});

// Save all the information and add it into dataArray
saveAsDraftBtn.addEventListener('click', e => {
  let invoiceInfo = {};

  const alphabets = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

  function randomAlphabets() {
    return alphabets[Math.floor(Math.random() * alphabets.length)];
  }

  function randomNumbers() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  invoiceInfo.id = `${randomAlphabets()}${randomAlphabets()}${randomNumbers()}`;

  console.log(invoiceInfo);
});

// Perform validation if form is not complete and item is not added
sendBtn.addEventListener('click', () => {
  // Get all input fields including dynamically added fields
  const allFields = document.querySelectorAll('.fields');

  // The variable below copy inputFields into an array so that Array.prototype.every can be used
  let fieldsArray = [...allFields];

  fieldsArray.every(field =>
    field.value !== '' ? (fieldAlert = false) : (fieldAlert = true)
  );

  fieldsArray.forEach(field => {
    if (field.value !== '') {
      fieldsValid(field);
    }

    if (field.value == '') {
      fieldsEmpty(field);
      fieldAlert = true;
    }

    if (field.getAttribute('type') == 'email') {
      validateEmail(field, field.value);
    }
  });

  updateFormAlert(fieldAlert);
});

function updateFormAlert(alert) {
  const fieldEmptyElement = document.getElementById('field-alert');
  const itemEmptyElement = document.getElementById('item-alert');

  if (alert) {
    itemListContainer.classList.add('field-empty-alert');
    itemListContainer.classList.add('item-empty-alert');
  }

  if (!alert) {
    itemListContainer.classList.remove('field-empty-alert');
  }

  if (!document.querySelector('.item')) {
    itemListContainer.classList.add('item-empty-alert');
  }

  if (document.querySelector('.item')) {
    itemListContainer.classList.remove('item-empty-alert');
  }
}
