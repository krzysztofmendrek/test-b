const incomeSection = document.querySelector('.income-area');
const expensesSection = document.querySelector('.expenses-area');
const availableMoney = document.querySelector('.available-money');
const addTransactionPanel = document.querySelector('.add-transaction-panel');

const nameInput = document.querySelector('#name');
const amountInput = document.querySelector('#amount');
const categorySelect = document.querySelector('#category');

const addTransactionBtn = document.querySelector('.add-transaction');
const saveBtn = document.querySelector('.save');
const cancelBtn = document.querySelector('.cancel');
const deleteBtn = document.querySelector('.delete');

const deleteAllBtn = document.querySelector('.delete-all');
const lightStyleBtn = document.querySelector('.light');
const darkStyleBtn = document.querySelector('.dark');

const budgetTitle = document.querySelector('.budget-title');
const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
const alertTrigger = document.getElementById('liveAlertBtn');

let root = document.documentElement;
let ID = 0;
let categoryIcon;
let selectedCategory;
let moneyArr = [];

const showPanel = () => {
  addTransactionPanel.style.display = 'flex';
};

const closePanel = () => {
  addTransactionPanel.style.display = 'none';
  clearInputs();
};

const checkForm = () => {
  if (
    nameInput.value !== '' &&
    amountInput.value !== '' &&
    categorySelect.value !== 'none'
  ) {
    createNewTransaction();
  } else {
    alert('Wypełnij wszystkie pola!');
  }
};

const clearInputs = () => {
  nameInput.value = '';
  amountInput.value = '';
  categorySelect.selectedIndex = 0;
};

const createNewTransaction = () => {
  const newTransaction = document.createElement('div');
  newTransaction.classList.add('transaction');
  newTransaction.setAttribute('id', ID);
  const category = checkCategory(selectedCategory);

  const isIncome = category === 'income';

  newTransaction.innerHTML = `
        <p class="transaction-name">
        ${categoryIcon} ${nameInput.value}
        </p>
        <p class="transaction-amount">
        ${amountInput.value} 
        
        </p>
		<button class="delete" onclick="deleteTransatcion(${ID})"><i class="fas fa-times"></i></button>
		<button class="edit" onclick="editTransatcion(${ID})">EDIT</i></button>
		
    `;

  isIncome
    ? incomeSection.appendChild(newTransaction) &&
      newTransaction.classList.add('income')
    : expensesSection.appendChild(newTransaction) &&
      newTransaction.classList.add('expense');

  const properValueToPushToMoney = isIncome
    ? parseFloat(amountInput.value)
    : parseFloat(-amountInput.value);
  moneyArr.push(properValueToPushToMoney);
  countMoney(moneyArr);
  closePanel();
  ID++;
  clearInputs();
};

const selectCategory = () => {
  selectedCategory = categorySelect.options[categorySelect.selectedIndex].text;
};

const checkCategory = (transaction) => {
  switch (transaction) {
    case '[ + ] Przychód':
      categoryIcon = '<i class="fas fa-money-bill-wave"></i>';
      return 'income';
    case '[ - ] Wydatki':
      categoryIcon = '<i class="fas fa-cart-arrow-down"></i>';
      return 'expense';
  }
};

const countMoney = (money) => {
  const newMoney = money.reduce((a, b) => Number(a) + Number(b));

  availableMoney.textContent = `${newMoney}zł`;
  if (newMoney < 0) {
    return (budgetTitle.textContent = `Bilans jest ujemny. Jesteś na minusie:`);
  }
  if (newMoney > 0) {
    return (budgetTitle.textContent = `Możesz jeszcze wydać:`);
  }
  budgetTitle.textContent = `Bilans wynosi:`;
};

const deleteTransatcion = (id) => {
  const transactionToDelete = document.getElementById(id);
  const transactionAmount = parseFloat(
    transactionToDelete.childNodes[3].innerText
  );
  const indexOfTransaction = moneyArr.indexOf(transactionAmount);

  moneyArr.splice(indexOfTransaction, 1);

  transactionToDelete.classList.contains('income')
    ? incomeSection.removeChild(transactionToDelete)
    : expensesSection.removeChild(transactionToDelete);
  countMoney(moneyArr);
};
const editTransatcion = (id) => {
  const transactionToEdit = document.getElementById(id);
  const transactionName = transactionToEdit.querySelector('.transaction-name');
  const transactionAmount = transactionToEdit.querySelector(
    '.transaction-amount'
  );

  transactionName.setAttribute('contenteditable', true);
  transactionAmount.setAttribute('contenteditable', true);
  const editButton = transactionToEdit.querySelector('.edit');
  transactionToEdit.removeChild(editButton);

  const acceptButton = document.createElement('button');
  acceptButton.innerHTML = 'ACCEPT';
  transactionToEdit.appendChild(acceptButton);

  acceptButton.addEventListener('click', () => {
    const newAmount = transactionAmount.textContent;
    if (isNaN(newAmount)) {
      alert('Błędna wartość , akceptuje tylko liczby ');
    } else {
      transactionName.setAttribute('contenteditable', false);
      transactionAmount.setAttribute('contenteditable', false);

      moneyArr[id] = newAmount;
      countMoney(moneyArr);
      transactionToEdit.removeChild(acceptButton);
      transactionToEdit.insertAdjacentHTML(
        'beforeend',
        `<button class="edit" onclick="editTransatcion(${id})">EDIT</i></button>`
      );
    }
  });
};

const deleteAllTransactions = () => {
  incomeSection.innerHTML = '<h3>Przychód:</h3>';
  expensesSection.innerHTML = '<h3>Wydatki:</h3>';
  availableMoney.textContent = '0zł';
  moneyArr = [0];
};

const changeStyleToLight = () => {
  root.style.setProperty('--first-color', 'white');
  root.style.setProperty('--second-color', 'dark');
  root.style.setProperty('--border-color', 'rgba(0, 0, 0, .2)');
};

const changeStyleToDark = () => {
  root.style.setProperty('--first-color', '#14161F');
  root.style.setProperty('--second-color', '#F9F9F9');
  root.style.setProperty('--border-color', 'rgba(255, 255, 255, .4)');
};

addTransactionBtn.addEventListener('click', showPanel);
cancelBtn.addEventListener('click', closePanel);
saveBtn.addEventListener('click', checkForm);
deleteAllBtn.addEventListener('click', deleteAllTransactions);
lightStyleBtn.addEventListener('click', changeStyleToLight);
darkStyleBtn.addEventListener('click', changeStyleToDark);
