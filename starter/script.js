'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//DISLAY MOVEMENTS
const displayMovements = function (movements, sort = false) {
  //clean the element movements
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  //loop into the movements array
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//PRINT the balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

//Display summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

//CREATE username
const createUsernames = function (accs) {
  // get the accounts array
  accs.forEach(function (acc) {
    // loop into the accounts array
    acc.username = acc.owner // create a new attribute "username" into the each account inside the accounts array
      .toLowerCase() // set the owner name to lower case
      .split(' ') //split the owners name
      .map(name => name[0]) // return the first letter of each word of the name
      .join(''); // join all the letter and return it to the username attribute created
  });
};
createUsernames(accounts);

//update the UI
const updateIU = function (acc) {
  //Display movements
  //Add movement rows  into the movement element
  displayMovements(acc.movements);
  //Display summary
  calcDisplaySummary(acc);
  //Display balance
  calcDisplayBalance(acc);
};

console.log(accounts);
//Event handlers

// set a variable so the current account can be accessed outside the fucntion block
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting (refreshing the page)   ******IMPORTANTE method on buttons****
  e.preventDefault();

  //look for the account submitted from the username input
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  //check if the pin is correct **using optional chaining(?) to check if the current account exists
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Discplay UI the welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //update UI
    updateIU(currentAccount);

    // Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    // Some useless method to make the input cleaning prettier
    inputLoginPin.blur();
  }
});

btnTransfer.addEventListener('click', function (e) {
  // Prevent form from submitting (refreshing the page)   ******IMPORTANTE method on buttons****
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Update UI
    updateIU(currentAccount);
  }
});

// Close account event button
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
//LOAN Button

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Add movement
    currentAccount.movements.push(amount);

    //update UI
    updateIU(currentAccount);
    inputLoanAmount.value = '';
  }
});

//SORT button
let sortMode = 0;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sortMode);
  sortMode = !sortMode;

  // MY WAY WORKS!!!
  // if (sortMode === 0) {
  //   displayMovements(currentAccount.movements.slice().sort((a, b) => a - b));
  //   sortMode = 1;
  // } else if (sortMode === 1) {
  //   displayMovements(currentAccount.movements);
  //   sortMode = 0;
  // }
});

// const eurotoToUsd = 1.1;
// const totalDepositUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurotoToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(accounts); // stw

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*


//for (const movement of movements) {
for (const [key, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${key + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${key + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log('--------forEach-----------');
movements.forEach(function (movement, index, array) {
  if (movement > 0) {
    console.log(`Movement ${index + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${index + 1}: You withdrew ${Math.abs(movement)}`);
  }
});

// 0: function(200)
// 1: function(450)
// 2: function(400)
// ...

/////////////////////////////////////////////////

//WORKING WITH ARRAYS

let arr = ['a', 'b', 'c', 'd', 'e'];

//SLICE does NOT mutate the array
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());

//SPLICE  mutate the array
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);

//REVERSE mutate the array

arr = ['a', 'b', 'c', 'd', 'e'];

const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT

const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]); // same thing

//JOIN
console.log(letters.join(' - '));



//FOREACH method with Map and Set

//MAP
currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//SET
const currenciesUnique = new Set(['USD', 'GPB', 'EUR', 'USD', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});


*/

/*



// LOOPING with MAP method and returning a new array
const eurotoToUsd = 1.1;

const movementsUSD = movements.map(function (mov) {
  return Math.trunc(mov * eurotoToUsd);
});

//Arrow functin way
//const movementsUSD = movements.map(mov => Math.trunc(mov * eurotoToUsd));

console.log(movements);
console.log(movementsUSD);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`

  // if (mov > 0) {
  //   return `Movement ${i + 1}: You deposited ${mov}`;
  // } else {
  //   return `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
  // }
);


// FILTER method returns an boolean value with the condition that we set
const deposits = movements.filter(mov => mov > 0);
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
//regular FOR loop
const depositsFor = [];
for (const mov of movements) if (mov > 0) deposits.push(mov);

console.log(movementsDescriptions);

// console.log(movements);


//REDUCE accumulator -> SNOWBALL
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc} + ${cur}`);
//   return acc + cur;
// }, 0);

//REDUCE Arrow function
const balance = movements.reduce((acc, cur, i, arr) => acc + cur, 0);

console.log(balance);

//Using FOR
let balance2 = 0;
for (const mov of movements) balance2 += mov;

//Maximum value
//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]); // set the accumulator as the first movement of the array

console.log(max);

//FIND method
const firstWithdrawal = movements.find(mov => mov < 0);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');

*/

//SORTING ARRAYS

//strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());

//Numbers
console.log(movements);

//return < 0 , A, B (keep order)
//return > 0 , B ,A (switch order)

//Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });

movements.sort((a, b) => a - b); //Simpler way for ascending sort

console.log(movements);

//Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });

movements.sort((a, b) => b - a); //Simpler way for Descending sort

console.log(movements);

/*
// SOME method

//Exemples with include that is different from some
//Includes shows equality
console.log(movements.includes(-130));

//Some shows condition and returns true or false for the condition

const anyDeposits = movements.some(mov => mov > 0);

// EVERY method
console.log(account4.movements.every(mov => mov > 0));

//Separate callback

const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

//FLAT method
const arr = [[1, 2, 3], [4, 5, 6], 7, 7]; //nested array

console.log(arr.flat()); // join all the nested array as one

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2)); // parameter goes deep in the nested array

const accountMovements = accounts.map(acc => acc.movements); // retrieve the movements from the accounts obeject
const allMovements = accountMovements.flat();
const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);

//Chained methods
const overalBalanceChained = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

//flatMap combine flat and map methods
const overalBalanceChained = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(allMovements);

//CODING CHALLENGE #1

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsOnlyJulia = dogsJulia.slice(1, -2);
  const bothDogsArray = dogsOnlyJulia.concat(dogsKate);
  console.log(bothDogsArray);

  bothDogsArray.forEach(function (age, index) {
    console.log(
      age <= 3
        ? `Dog number ${index + 1} is still a puppy🐶`
        : `"Dogs number ${index + 1} is and adult, and is ${age} years old"`
    );
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
//checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

//CODING CHALLENGE #2

const calcAverageHumanAge = function (ages) {
  //this methods creates 3 arrays of each  processed ages
  // const humanAge = ages.map((age, i) => (age <= 2 ? 2 * age : 16 + age * 4));// calculate the human age of each dog
  // const adults = humanAge.filter((age, i) => age >= 18); // exclude dogs under 18 years of the human age
  // const average = adults.reduce((acc, age, i, arr) => acc + age / arr.length,0); // calc the average of the human ages above 18 years

  //this method returns the average value of the dogs ages array using chaining method
  const humanAge = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4)) // calculate the human age of each dog
    .filter(age => age >= 18) // exclude dogs under 18 years of the human age
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0); // calc the average of the human ages above 18 years

  return humanAge;
};

//Same method in arrow function
/*
const calcAverageHumanAge = ages => ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4)) // calculate the human age of each dog
    .filter(age => age >= 18) // exclude dogs under 18 years of the human age
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0); // calc the average of the human ages above 18 years

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(avg1, avg2);
*/
