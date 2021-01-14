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
const displayMovements = function (movements) {
  //clean the element movements
  containerMovements.innerHTML = '';
  //loop into the movements array
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Add movement rows  into the movement element
displayMovements(account1.movements);

//PRINT the balance
const calcDisplayBalance = function (movement) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance}€`;
};

calcDisplayBalance(account1.movements);

//CREATE username
const createUsernames = function (accs) {
  // get the accounts array
  accs.forEach(function (acc) {
    // loop into the accoust array
    acc.username = acc.owner // create a new attribute "username" into the each account inside the accounts array
      .toLowerCase() // set the owner name to lower case
      .split() //split the owners name
      .map(name => name[0]) // return the first letter of each word of the name
      .join(''); // join all the letter and return it to the username attribute created
  });
};

createUsernames(accounts);

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

//CODING CHALLENGE #1
/*
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
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);




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
*/

// console.log(movements);

// //REDUCE accumulator -> SNOWBALL
// // const balance = movements.reduce(function (acc, cur, i, arr) {
// //   console.log(`Iteration ${i}: ${acc} + ${cur}`);
// //   return acc + cur;
// // }, 0);

// //REDUCE Arrow function
// const balance = movements.reduce((acc, cur, i, arr) => acc + cur, 0);

// console.log(balance);

// //USING FOR
// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
