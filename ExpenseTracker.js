document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transaction-form');
    const type = document.getElementById('type');
    const description = document.getElementById('description');
    const amount = document.getElementById('amount');
    const balance = document.getElementById('balance');
    const income = document.getElementById('income');
    const expense = document.getElementById('expense');
    const list = document.getElementById('transaction-list');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    function updateValues() {
        const amounts = transactions.map(transaction => transaction.amount);
        const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
        const totalIncome = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
        const totalExpense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

        balance.innerText = `$${total}`;
        income.innerText = `$${totalIncome}`;
        expense.innerText = `$${totalExpense}`;
    }

    function addTransactionDOM(transaction) {
        const sign = transaction.amount < 0 ? '-' : '+';
        const item = document.createElement('li');
        item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
        item.innerHTML = `
            ${transaction.description} <span>${sign}$${Math.abs(transaction.amount)}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        `;
        list.appendChild(item);
    }

    function addTransaction(e) {
        e.preventDefault();
        if (description.value.trim() === '' || amount.value.trim() === '') {
            alert('Please add a description and amount');
            return;
        }
        const transaction = {
            id: generateID(),
            description: description.value,
            amount: +amount.value * (type.value === 'expense' ? -1 : 1)
        };
        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();
        description.value = '';
        amount.value = '';
    }

    function generateID() {
        return Math.floor(Math.random() * 100000000);
    }

    function removeTransaction(id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateLocalStorage();
        init();
    }

    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function init() {
        list.innerHTML = '';
        transactions.forEach(addTransactionDOM);
        updateValues();
    }

    form.addEventListener('submit', addTransaction);
    init();
});