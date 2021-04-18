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
const dataUrl = `data.json`;

// Format datepicker based on today's date (form modal)
function formatInvoiceDate() {
  let today = new Date();
  invoiceDate.valueAsDate = today;
}

formatInvoiceDate();

// Load color theme from local storage on document load
function setColorMode() {
  body.setAttribute('data-theme', localStorage.getItem('theme-mode'));
}

setColorMode();

// Show form modal
addNewInvoiceBtn.addEventListener('click', () => {
  body.classList.toggle('form-show');
});

// Remove form modal
discardBtn.addEventListener('click', () => {
  body.classList.remove('form-show');
});

// Click anywhere other than the inner form will trigger close modal
formContainer.addEventListener('click', e => {
  if (e.target.matches('.form-container')) {
    body.classList.toggle('form-show');
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
filterContainer.addEventListener('click', () => {
  filterContainer.classList.toggle('show');
});

document.addEventListener('click', e => {
  if (
    filterContainer.classList.contains('show') &&
    e.target !== filterContainer
  ) {
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

async function initialUpdateDOM() {
  const dataArray = await getData(dataUrl);

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

formContainer.addEventListener('submit', e => {
  e.preventDefault();
});
