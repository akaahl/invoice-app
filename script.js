const body = document.getElementsByTagName('body')[0];
const modeSelector = document.querySelector('.modes');
const addNewInvoiceBtn = document.getElementById('add-new-invoice');
const filterContainer = document.getElementById('filter-container');
const filterContent = document.getElementById('filter-content');
const mainContainer = document.getElementById('main-container');
const sectionElement = document.getElementById('section-element');
const formContainer = document.getElementById('form-container');

const dataUrl = `data.json`;

function setColorMode() {
  body.setAttribute('data-theme', localStorage.getItem('theme-mode'));
}

setColorMode();

addNewInvoiceBtn.addEventListener('click', () => {
  formContainer.classList.toggle('show');
});

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

filterContainer.addEventListener('click', () => {
  filterContainer.classList.toggle('show');
});

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
