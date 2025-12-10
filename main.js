const balance = document.getElementById("balance");
const expenseDisplay = document.getElementById("expense");
const incomeDisplay = document.getElementById("income-amount");
const transactionList = document.getElementById("transaction-list");
const transactionForm = document.getElementById("transaction-form");
const descriptionEL = document.getElementById("description");
const amountEL = document.getElementById("amount");
const balanceLabel = document.getElementById("balance-label");

// Initialize transactions from local storage, or use an empty array
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Correct syntax for addEventListener
transactionForm.addEventListener("submit", addTransaction);

// Initial function calls to populate the UI when the script loads
updateTransactionList();
updateValues();

function addTransaction(e) {
  e.preventDefault();

  // Get form values
  const description = descriptionEL.value.trim();
  const amountValue = amountEL.value.trim();

  // Basic validation
  if (description === "" || amountValue === "") {
    alert("Please enter both a description and an amount.");
    return;
  }

  const amount = parseFloat(amountValue);

  const newTransaction = {
    id: Date.now(),
    description,
    amount,
  };

  transactions.push(newTransaction);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateValues(); // Update balance, income, and expense displays

  transactionForm.reset();
}

function updateTransactionList() {
  transactionList.innerHTML = "";

  const sortedTransactions = [...transactions].reverse();

  sortedTransactions.forEach((transaction) => {
    const transactionEL = createTransactionElement(transaction);
    transactionList.appendChild(transactionEL);
  });
}

function createTransactionElement(transaction) {
  const listItem = document.createElement("li");
  const sign = transaction.amount < 0 ? "-" : "+";
  const absAmount = Math.abs(transaction.amount);

  listItem.classList.add(
    "transaction",
    transaction.amount < 0 ? "expense" : "income"
  );

  listItem.innerHTML = `
    <span>${transaction.description}</span>
    <span>
      ${sign}$${absAmount.toFixed(2)}
      <button class="delete-btn" onclick="deleteTransaction(${
        transaction.id
      })">x</button>
    </span>
  `;

  return listItem;
}

function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  balance.textContent = `$${total}`;

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  incomeDisplay.textContent = `$${income}`;

  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);
  expenseDisplay.textContent = `$${expense}`;
}

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateValues();
  updateTransactionList();
}

// Function to update Balance, Income, and Expense displays
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);

  // Calculate Total Balance
  const total = amounts
    .reduce((acc, item) => (acc += item), 0); // Removed toFixed(2) here for comparison

  const displayTotal = total.toFixed(2);
  
  balance.textContent = `$${displayTotal}`;

  // --- LOGIC CHANGE HERE ---
  if (total < 0) {
    balanceLabel.textContent = "Your Debt";
    balance.classList.add('negative-balance'); 
  } else {
    balanceLabel.textContent = "Your Balance";
    balance.classList.remove('negative-balance');
  }


  // Calculatinnng the Income
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  incomeDisplay.textContent = `$${income}`;

  // Calculate Expense (as a positive number for display)
  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);
  expenseDisplay.textContent = `$${expense}`;
}
