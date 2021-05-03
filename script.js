const body = document.getElementsByTagName('body')[0];
const modeSelector = document.querySelector('.modes');
const addNewInvoiceBtn = document.getElementById('add-new-invoice');
const filterContainer = document.getElementById('filter-container');
const filterContent = document.getElementById('filter-content');
const mainContainer = document.getElementById('main-container');
const header = document.getElementById('header');
const sectionElement = document.getElementById('section-element');
const articleElements = document.querySelectorAll('article');
const formContainer = document.getElementById('form-container');
const invoiceDate = document.getElementById('invoice-date');
const discardBtn = document.getElementById('discard-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formContent = document.getElementById('form-content');
const addNewItem = document.getElementById('add-new-item');
const itemListContainer = document.getElementById('item-list');
const h4ItemList = document.getElementById('h4-item-list');
const inputFields = document.querySelectorAll('.fields');
const saveAsDraftBtn = document.getElementById('draft-btn');
const sendBtn = document.getElementById('send-btn');
const saveChangesBtn = document.getElementById('save-changes-btn');
const invoiceDetails = document.getElementById('invoice-info-section');
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const dataUrl = `data.json`;
let dataArray, fieldAlert, invoiceName, idOfObject;

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
  body.style.overflowY = 'hidden';
  formContent.scrollTo(0, 0);
  resetInputFields();
});

// Remove form modal
discardBtn.addEventListener('click', () => {
  body.classList.remove('form-show');
  body.style.overflowY = 'scroll';
  resetInputFields();
});

// Remove edit form modal
cancelBtn.addEventListener('click', () => {
  body.classList.remove('edit-form');
  body.style.overflowY = 'scroll';
});

// Format datepicker based on today's date (form modal)
function formatInvoiceDate() {
  let today = new Date();
  invoiceDate.valueAsDate = today;
}

formatInvoiceDate();

// Click anywhere other than the inner form will trigger close form modal
formContainer.addEventListener('click', e => {
  if (
    e.target.matches('.form-container') &&
    body.classList.contains('edit-form')
  ) {
    body.classList.remove('edit-form');
    body.style.overflowY = 'scroll';
  }

  if (
    e.target.matches('.form-container') &&
    body.classList.contains('form-show')
  ) {
    body.classList.remove('form-show');
    body.style.overflowY = 'scroll';

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

// Function to create element and push it into the DOM
function createElement(item) {
  if (item || item !== {}) {
    const articleElement = document.createElement('article');
    articleElement.classList.add(paymentStatus(item.status));
    articleElement.classList.add('article-element');
    articleElement.addEventListener('click', showInvoiceDetails);

    formatDate(item.paymentDue);

    articleElement.innerHTML = `
          <div class="child left-side">
            <p class="grand-child code-id"><span>#</span>${item.id}</p>
            <p class="grand-child due-date">Due ${formatDate(
              item.paymentDue
            )}</p>
            <p class="grand-child name">${item.clientName}</p>
            <p class="grand-child amount">${
              item.total == '0.00'
                ? ''
                : currencySymbol(item.clientAddress.country) + item.total
            }</p>
          </div>

          <div class="child right-side">
          <p class="grand-child name">${item.clientName}</p>
            <p class="grand-child amount">${
              item.total == '0.00'
                ? ''
                : currencySymbol(item.clientAddress.country) + item.total
            }</p>
            <div class="grand-child status">
              <i class="bx bxs-circle grand-grand-child"></i>
              <p class="grand-grand-child">${
                item.status.slice(0, 1).toUpperCase() + item.status.slice(1)
              }</p>
            </div>
            <img class="grand-child" src="images/icon-arrow-right.svg" alt="right arrow icon" />
          </div>
    `;

    sectionElement.appendChild(articleElement);
  }
}

// Update DOM on document load
async function initialUpdateDOM() {
  dataArray = [...(await getData(dataUrl))];

  dataArray.forEach(createElement);
}

initialUpdateDOM();

// Go back to home page in DOM
function goBack() {
  invoiceDetails.classList.remove('show-invoice-info');
  // invoiceName = undefined;

  setTimeout(() => {
    invoiceDetails.style.display = 'none';
    header.style.display = 'flex';
    sectionElement.style.display = 'flex';

    setTimeout(() => {
      mainContainer.classList.remove('show-invoice-details');
    }, 200);
  }, 350);
}

// Allow edit functionality on invoice details
function editInvoice(e) {
  body.classList.add('edit-form');
  body.style.overflowY = 'hidden';
  formContent.scrollTo(0, 0);

  const parentElement = e.target.parentElement;

  if (
    parentElement.classList.contains('pending') ||
    parentElement.classList.contains('paid')
  ) {
    validateFields();
  }
}

// Function to remove article elements
function removeArticles() {
  const articleElementsArray = [...document.querySelectorAll('article')];
  articleElementsArray.forEach(item => item.remove());
}

// Function to mark as paid
function markAsPaid(arg) {
  const parentElement = arg.parentElement;
  parentElement.classList = `invoice-status paid`;

  const previousElement = (arg.previousElementSibling.previousElementSibling.previousElementSibling.children[1].innerText =
    'Paid');

  const itemId =
    arg.parentElement.nextElementSibling.children[0].children[0].children[0]
      .children[0].innerText;

  let itemIndex = dataArray.findIndex(item => item.id == itemId);
  dataArray[itemIndex].status = 'paid';

  removeArticles();
  dataArray.forEach(createElement);
}

// Function to delete invoice
function deleteInvoice() {
  deleteModal.classList.add('show');
  const deleteMsg = document.getElementById('delete-msg');
  deleteMsg.innerHTML = `Are you sure you want to delete invoice ${idOfObject}? This action cannot be undone.`;
  body.style.overflowY = 'hidden';
}

// Remove delete modal
cancelDeleteBtn.addEventListener('click', () => {
  deleteModal.classList.remove('show');
  body.style.overflowY = 'scroll';
});

// Delete invoice from dataArray and DOM
confirmDeleteBtn.addEventListener('click', e => {
  deleteModal.classList.remove('show');
  let objectIndex = dataArray.findIndex(item => item.id == idOfObject);
  dataArray.splice(objectIndex, 1);
  removeArticles();
  dataArray.forEach(createElement);
  goBack();
});

// Click anywhere outside modal to remove delete modal
deleteModal.addEventListener('click', e => {
  if (
    e.target.matches('.delete-modal') &&
    deleteModal.classList.contains('show')
  ) {
    deleteModal.classList.remove('show');
    body.style.overflowY = 'scroll';
  }
});

// Populate invoice details
function updateInvoice(invoiceInfo) {
  invoiceDetails.innerHTML = `
        <button type="button" class="back-btn" onclick="goBack()">
          <img src="images/icon-arrow-left.svg" alt="left arrow icon" />
          <p>Go back</p>
        </button>

        <div class="invoice-status ${invoiceInfo.status}">
          <p>Status</p>
          <div class="status">
            <i class="bx bxs-circle"></i>
            <p>${
              invoiceInfo.status.slice(0, 1).toUpperCase() +
              invoiceInfo.status.slice(1)
            }</p>
          </div>
          <button type="button" class="edit-btn" id="edit-btn">Edit</button>
          <button type="button" class="delete-btn" id="delete-btn">Delete</button>
          <button type="button" class="mark-as-paid" onclick="markAsPaid(this)">Mark As Paid</button>
        </div>

        <div class="invoice-personal-details">
          <div class="top">
            <div class="left-side">
              <h4 class="id">#<span>${invoiceInfo.id}</span></h4>
              <p class="description">${invoiceInfo.description}</p>
            </div>

            <div class="right-side">
              <p>${invoiceInfo.senderAddress.street}</p>
              <p>${invoiceInfo.senderAddress.city}</p>
              <p>${invoiceInfo.senderAddress.postCode}</p>
              <p>${invoiceInfo.senderAddress.country}</p>
            </div>
          </div>

          <div class="middle">
            <div class="left-side">
              <div class="date">
                <p>Invoice Date</p>
                <h4>${formatDate(invoiceInfo.createdAt)}</h4>
              </div>

              <div class="due">
                <p>Invoice Due</p>
                <h4>${formatDate(invoiceInfo.paymentDue)}</h4>
              </div>
            </div>

            <div class="mid-side">
              <p>Bill To</p>
              <h4>${invoiceInfo.clientName}</h4>
              <p>${invoiceInfo.clientAddress.street}</p>
              <p>${invoiceInfo.clientAddress.city}</p>
              <p>${invoiceInfo.clientAddress.postCode}</p>
              <p>${invoiceInfo.clientAddress.country}</p>
            </div>

            <div class="right-side">
              <p>Sent To</p>
              <h4>${invoiceInfo.clientEmail}</h4>
            </div>
          </div>

          <div class="bottom">
            <div class="item-name" id="item-name">
              <p class="name">Item Name</p>
              
            </div>

            <div class="item-quantity" id="item-quantity">
              <p class="quantity">QTY:</p>
            </div>

            <div class="item-price" id="item-price">
              <p class="price">Price</p>
            </div>

            <div class="item-total" id="item-total">
              <p class="total">Total</p>
            </div>

            <div class="amount-due">
              <p class="due">Amount Due</p>
              <p class="total">${
                invoiceInfo.total == '0.00'
                  ? ''
                  : currencySymbol(invoiceInfo.clientAddress.country) +
                    invoiceInfo.total
              }</p>
            </div>
          </div>
        </div>
      `;

  const editBtn = document.getElementById('edit-btn');
  editBtn.addEventListener('click', editInvoice);

  const deleteBtn = document.getElementById('delete-btn');
  deleteBtn.addEventListener('click', deleteInvoice);

  // Update the invoiceDetails item section
  const itemName = document.getElementById('item-name');
  const itemQuantity = document.getElementById('item-quantity');
  const itemPrice = document.getElementById('item-price');
  const itemTotal = document.getElementById('item-total');

  const itemList = [...invoiceInfo.items];

  itemList.forEach(list => {
    const nameElement = document.createElement('p');
    nameElement.textContent = list.name;
    itemName.appendChild(nameElement);

    const quantityElement = document.createElement('p');
    quantityElement.textContent = list.quantity;
    itemQuantity.appendChild(quantityElement);

    const priceElement = document.createElement('p');
    priceElement.innerHTML = `${currencySymbol(
      invoiceInfo.clientAddress.country
    )}${list.price}`;
    itemPrice.appendChild(priceElement);

    const totalElement = document.createElement('p');
    totalElement.innerHTML = `${currencySymbol(
      invoiceInfo.clientAddress.country
    )}${list.total}`;
    itemTotal.appendChild(totalElement);
  });
}

// Function to show invoice details
function showInvoiceDetails(e) {
  let id;

  if (e.target.classList.contains('child')) {
    id = e.target.parentElement.children[0].children[0].innerText.slice(1);
  }

  if (e.target.classList.contains('grand-child')) {
    id = e.target.parentElement.parentElement.children[0].children[0].innerText.slice(
      1
    );
  }

  if (e.target.classList.contains('grand-grand-child')) {
    id = e.target.parentElement.parentElement.parentElement.children[0].children[0].innerText.slice(
      1
    );
  }

  if (e.target.classList.contains('article-element')) {
    id = e.target.children[0].children[0].innerText.slice(1);
    console.log(dataArray);
  }

  dataArray.forEach(item => {
    if (item.id == id) {
      // Update payment terms based on select index value
      function selectIndex(num) {
        return num == 1 ? 0 : num == 7 ? 1 : num == 14 ? 2 : 3;
      }

      idOfObject = id;

      // Populate form based on dataArray
      document.querySelector('.sender-street').value =
        item.senderAddress.street;
      document.querySelector('.sender-city').value = item.senderAddress.city;
      document.querySelector('.sender-post-code').value =
        item.senderAddress.postCode;
      document.querySelector('.sender-country').value =
        item.senderAddress.country;
      document.querySelector('.client-name').value = item.clientName;
      document.querySelector('.client-email').value = item.clientEmail;
      document.querySelector('.client-street').value =
        item.clientAddress.street;
      document.querySelector('.client-city').value = item.clientAddress.city;
      document.querySelector('.client-post-code').value =
        item.clientAddress.postCode;
      document.querySelector('.client-country').value =
        item.clientAddress.country;
      document.querySelector('.created-at').value = item.createdAt;
      document.querySelector('.payment-terms').selectedIndex = selectIndex(
        item.paymentTerms
      );
      document.querySelector('.client-description').value = item.description;

      // Delete all item elements first
      const items = document.querySelectorAll('.item');
      items.forEach(item => item.parentElement.removeChild(item));

      // Then add new items based on the item array length
      item.items.forEach(addListItem);
      updateInvoice(item);

      // Function to populate list of items value based on items array length
      function assignItemValues(arr1, arr2) {
        for (let i = 0; i < arr1.length; i++) {
          if (arr1[i].classList.contains('total-of-item')) {
            arr1[i].innerText = arr2[i].toFixed(2);
          }

          arr1[i].value = arr2[i];
        }
      }

      const listOfItems = [...item.items];

      let nameArray = listOfItems.map(list => list.name);
      let quantityArray = listOfItems.map(list => list.quantity);
      let priceArray = listOfItems.map(list => list.price);
      let totalArray = listOfItems.map(list => list.total);
      const nameOfItem = document.querySelectorAll('.name-of-item');
      const quantityOfItem = document.querySelectorAll('.quantity-of-item');
      const priceOfItem = document.querySelectorAll('.price-of-item');
      const totalOfItem = document.querySelectorAll('.total-of-item');

      assignItemValues(nameOfItem, nameArray);
      assignItemValues(quantityOfItem, quantityArray);
      assignItemValues(priceOfItem, priceArray);
      assignItemValues(totalOfItem, totalArray);

      mainContainer.classList.add('show-invoice-details');
      setTimeout(() => {
        sectionElement.style.display = 'none';
        header.style.display = 'none';
        invoiceDetails.style.display = 'flex';
      }, 350);

      setTimeout(() => {
        invoiceDetails.classList.add('show-invoice-info');
      }, 400);
    }
  });
}

// Allow dynamic filter functionality based on payment status
const checkboxes = document.querySelectorAll('.filter-checkbox');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', e => {
    const checkboxArray = [
      ...document.querySelectorAll('.filter-checkbox:checked'),
    ];
    const articles = [...document.querySelectorAll('article')];
    let checkedAttributeNames = [];

    checkboxArray.forEach(checkbox => {
      checkedAttributeNames.push(checkbox.getAttribute('name'));
    });

    function filterPaymentStatus() {
      let hiddenArticles = [];

      if (!articles || articles.length <= 0) {
        return;
      }

      for (let i = 0; i < articles.length; i++) {
        let article = articles[i];

        if (checkedAttributeNames.length > 0) {
          let isHidden = true;

          for (let j = 0; j < checkedAttributeNames.length; j++) {
            let name = checkedAttributeNames[j];

            if (article.classList.contains(name)) {
              isHidden = false;
              break;
            }
          }

          if (isHidden) {
            hiddenArticles.push(article);
          }
        } else {
          sectionElement.classList.remove('show-empty');
        }
      }

      for (let l = 0; l < articles.length; l++) {
        articles[l].style.display = 'flex';
      }

      if (hiddenArticles.length <= 0) {
        return;
      }

      for (let m = 0; m < hiddenArticles.length; m++) {
        hiddenArticles[m].style.display = 'none';
      }

      // If the filter checkedboxes do not exist
      if (hiddenArticles.length == articles.length) {
        sectionElement.classList.add('show-empty');
      } else {
        sectionElement.classList.remove('show-empty');
      }
    }

    filterPaymentStatus();
  });
});

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

// Add item list function
function addListItem() {
  const itemElement = document.createElement('div');
  itemElement.classList.add('item');

  itemElement.innerHTML = `
    <div class="name">
      <label for="item-name">Name</label>
      <input
        type="text"
        name="name-of-item"
        autocomplete="nope"
        class="fields name-of-item"
      />
    </div>

    <div class="quantity">
      <label for="item-quantity">Qty.</label>
      <input
        type="text"
        name="quantity-of-item"
        autocomplete="nope"
        class="fields quantity-of-item"
      />
    </div>

    <div class="price">
      <label for="item-price">Price.</label>
      <input
        type="text"
        name="price-of-item"
        autocomplete="nope"
        class="fields price-of-item"
        >
    </div>

    <div class="total">
      <label for="item-total">Total</label>
      <p class="total-of-item">0</p>
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
      total.textContent = (+quantity.value * +price.value).toFixed(2);
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
}

// Event listener for add new item
addNewItem.addEventListener('click', addListItem);

// Prevent from adding new item when pressing Enter
addNewItem.addEventListener('keydown', e => {
  if (e.code == 'Enter' || e.key == 'Enter') {
    e.preventDefault();
  }
});

formContainer.addEventListener('submit', e => {
  e.preventDefault();
});

// Function to generate paymentDue
function generatePayDue(dateString, paymentTerm) {
  let dateArray = dateString.split('-');
  let currentDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
  currentDate.setDate(currentDate.getDate() + paymentTerm);

  const year = currentDate.getFullYear() + '';
  const month = currentDate.getMonth() + 1 + '';
  const date = currentDate.getDate() + '';
  const output = `${year}-${month < 10 ? '0' + month : month}-${date}`;

  return output;
}

// Can reuse this function in saveChangesBtn
function updateObj(obj) {
  // Update invoiceInfo object based on user's input
  obj.clientAddress = {
    city: document.querySelector('.client-city').value,
    country: document.querySelector('.client-country').value,
    postCode: document.querySelector('.client-post-code').value,
    street: document.querySelector('.client-street').value,
  };

  obj.clientEmail = document.querySelector('.client-email').value;
  obj.clientName = document.querySelector('.client-name').value;
  obj.createdAt = document.querySelector('.created-at').value;
  obj.description = document.querySelector('.client-description').value;

  obj.senderAddress = {
    city: document.querySelector('.sender-city').value,
    country: document.querySelector('.sender-country').value,
    postCode: document.querySelector('.sender-post-code').value,
    street: document.querySelector('.sender-street').value,
  };

  obj.items = [];

  obj.paymentTerms = +document
    .querySelector('.payment-terms')
    .value.split('-')[1];

  const paymentDue = generatePayDue(obj.createdAt, obj.paymentTerms);

  obj.paymentDue = paymentDue;
  obj.total;

  if (document.querySelectorAll('.item')) {
    document.querySelectorAll('.item').forEach(item => {
      let moreItems = {
        name: item.children[0].children[1].value,
        price: item.children[2].children[1].value,
        quantity: item.children[1].children[1].value,
        total: +item.children[3].children[1].innerText,
      };

      obj.items.push(moreItems);
    });

    obj.total = obj.items.reduce((acc, item) => acc + item.total, 0).toFixed(2);
  }
}

function updateInvoiceObject(obj = {}) {
  updateObj(obj);

  const alphabets = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

  function randomAlphabets() {
    return alphabets[Math.floor(Math.random() * alphabets.length)];
  }

  function randomNumbers() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  obj.id = `${randomAlphabets()}${randomAlphabets()}${randomNumbers()}`;
  dataArray.unshift(obj);
}

// Function when save / send btn is clicked
function updateElements() {
  updateInvoiceObject();
  body.classList.remove('form-show');
}

// Function to move the last element into the first DOM position
function moveElement() {
  let lastElement = [...document.querySelectorAll('article')].pop(),
    firstElement = [...document.querySelectorAll('article')].shift();
  sectionElement.insertBefore(lastElement, firstElement);
}

// Save all the information and add it into dataArray
saveAsDraftBtn.addEventListener('click', e => {
  updateElements();
  dataArray[0].status = 'draft';
  createElement(dataArray[0]);
  moveElement();
  resetInputFields();
  body.style.overflowY = 'scroll';
});

// Function to update elements in DOM if fieldAlert is false and reset input fields
function update(alert) {
  if (!alert && document.querySelector('.item')) {
    // If all fields are filled and validated, then save the form info and update into DOM
    updateElements();
    dataArray[0].status = 'pending';
    createElement(dataArray[0]);
    moveElement();
    resetInputFields();
  }
}

// To be used in sendBtn click event (show/remove text alert)
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

function validateFields() {
  // Get all input fields including dynamically added fields
  const allFields = document.querySelectorAll('.fields');

  // The variable below copy inputFields into an array so that Array.prototype.every can be used
  let fieldsArray = [...allFields];

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

  fieldsArray.every(field => {
    if (field.value !== '') {
      fieldAlert = false;
      fieldsValid(field);
      updateFormAlert(fieldAlert);
    }
  });
}

// Perform validation if form is not complete and item is not added
sendBtn.addEventListener('click', e => {
  validateFields();
  update(fieldAlert);
  body.style.overflowY = 'scroll';
});

saveChangesBtn.addEventListener('click', e => {
  validateFields();

  if (!fieldAlert) {
    let itemNameIndex = dataArray.findIndex(item => item.id == idOfObject);
    updateObj(dataArray[itemNameIndex]);
    removeArticles();
    dataArray.forEach(createElement);
    updateInvoice(dataArray[itemNameIndex]);
    body.classList.remove('edit-form');
    body.style.overflowY = 'scroll';
  }
});
