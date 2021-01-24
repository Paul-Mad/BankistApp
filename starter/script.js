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
////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-01-20T14:11:59.604Z',
    '2021-01-22T17:01:17.194Z',
    '2021-01-23T23:36:17.929Z',
    '2021-01-24T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

// SELECT  Elements
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

///////////////           FUNCTIONS        ///////////////////////////////

// Format passed dates to be displayed
const formatMovementDate = function (date) {
  // Create movement dates
  const calcdaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcdaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0); // uses padStart() to add the 0 in the day if number is not two digits
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

//DISLAY MOVEMENTS
const displayMovements = function (acc, sort = false) {
  //clean the element movements
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  //loop into the movements array
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    //Create date from the account object
    const date = new Date(acc.movementsDates[i]);
    //Display date
    const displayDate = formatMovementDate(date);
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//PRINT the balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
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
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumOut.textContent = `${Math.abs(outcomes.toFixed(2))}€`;
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
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
  displayMovements(acc);
  //Display summary
  calcDisplaySummary(acc);
  //Display balance
  calcDisplayBalance(acc);
};

console.log(accounts);
//Event handlers

// set a variable so the current account can be accessed outside the fucntion block
let currentAccount;

//FAKE ALWAYS LOGGED IN -----------------------

currentAccount = account1;
updateIU(currentAccount);
containerApp.style.opacity = 100;

///////////////////           BUTTONS              //////////////////////////////////////////////////////////////////

//LOGIN BUTTON
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting (refreshing the page)   ******IMPORTANTE method on buttons****
  e.preventDefault();

  //look for the account submitted from the username input
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  //check if the pin is correct **using optional chaining(?) to check if the current account exists
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Discplay UI the welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0); // uses padStart() to add the 0 in the day if number is not two digits
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`; //day/month/Year hour:minutes

    //update UI
    updateIU(currentAccount);

    // Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    // Some useless method to make the input cleaning prettier
    inputLoginPin.blur();
  }
});

//TRANSFER BUTTON

btnTransfer.addEventListener('click', function (e) {
  // Prevent form from submitting (refreshing the page)   ******IMPORTANTE method on buttons****
  e.preventDefault();

  const amount = +inputTransferAmount.value;
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
    currentAccount.movementsDates.push(new Date().toISOString()); // Add new transfer date
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());
    //Update UI
    updateIU(currentAccount);
  }
});

// Close account event button
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
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
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Add movement
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString()); // Add new loan date

    //update UI
    updateIU(currentAccount);
    inputLoanAmount.value = '';
  }
});

//SORT button
let sortMode = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sortMode);
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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



//FILL method

const arr = [1, 2, 3, 4, 5, 6, 7];
const x = Array(7); // Empty array
console.log(x);
x.fill(1, 3, 5); //fill value "1" into position "3" until position 5
x.fill(1, 3);
console.log(x);

arr.fill(23, 2, 6); //fill value "23" into position "2" until position "6"
console.log(arr);

//Array.from  method
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1); // This callback (Arrow)function is used exacly the same as the map array
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'), // take all the movements elements from html
    el => Number(el.textContent.replace('€', '')) //loop into the array with all elements(like map method), and return the textecontent ofthe elements
  );
  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementsUI2);
});

/*
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

//CODING CHALLENGE #1 ------------------------------------------------------------------------------

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

//CODING CHALLENGE #2 ------------------------------------------------------------------------------

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

// // TO MUTATE THE ORIGINAL ARRAY
// Add to original:
// .push(end)
//   .unshift(start)

// Remove from original:

// .pop(end)
//   .shift(start)
//   .splice(any)

// Others:
//   .reverse
//     .sort
//     .fill

//     //A NEW ARRAY

// Computed from original:
//     .map(loop)

// Filtered using condition:
// .filter

// Portion of original:
// .slice

// Adding originao to other:
// .concat

// Flattening the original:
// .Flattening
//   .flatMap

//   //AN ARRAY INDEX

// Based on value:
//   .indexOf

// Based on test condition:
//   .findIndex

// //An Array element

// Based on test condition:
// .find

// //KNOW IF ARRAY INCLUDES

//   Based on value:
// .includes

// Based on test condition:
// .some
//   .every

//   // A NEW STRING

// Based on separator string:

// .join

// //TO TRANSFORM TO VALUE

// Based on accumulator:

// .reduce(Boil down array to single value of any type: Number, string, boolean, or even new array or object)

// //TO JUST LOOP ARRAY

// .forEach (Does not create a new array, just loops over it)

//CODING CHALLENGE #4 ------------------------------------------------------------------------------

/*
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//PART 1
dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);

//PART 2

const dog = dogs.find(dog => dog.owners.includes('Sarah'));
const isEating = function (doggy) {
  if (
    doggy.curFood > doggy.recommendedFood * 0.9 &&
    doggy.curFood < doggy.recommendedFood * 1.1
  ) {
    doggy.eating = 'okay';
    return doggy;
  } else if (doggy.curFood > doggy.recommendedFood * 0.9) {
    doggy.eating = 'too much';
    return doggy;
  } else {
    doggy.eating = 'too little';
    return doggy;
  }
  //console.log(`${doggy.owners}'s dog is eating ${doggy.eating}.`);
};

isEating(dog);
console.log(`${dog.owners}'s dog is eating ${dog.eating}.`);

//PART 3

const ownersEatTooMuch = dogs
  .map(dog => isEating(dog))
  .filter(dog => dog.eating === 'too much')
  .flatMap(dog => dog.owners);

const ownersEatTooLittle = dogs
  .map(dog => isEating(dog))
  .filter(dog => dog.eating === 'too little')
  .flatMap(dog => dog.owners);

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

//PART 4

console.log(
  `${ownersEatTooMuch[0]} and ${ownersEatTooMuch[1]} and ${ownersEatTooMuch[2]}'s dogs eat too much! and ${ownersEatTooLittle[0]} and ${ownersEatTooLittle[1]} and Michael's dogs eat too little!`
);

//PART 5

console.log(dogs);
dogs.forEach(dog =>
  console.log(`${dog.recommendedFood === dog.curFood ? true : false}`)
);

//PART 6
console.log(dogs.some(dog => dog.eating === 'okay'));

//PART 7

const dogsOkay = dogs.filter(dog => dog.eating === 'okay');
console.log(dogsOkay);

//PART 8
//ITS WORKS!!
const dogsRecommended = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);

console.log(dogsRecommended);


//WORKING WITH NUMBERS

// convert numbers

console.log(Number('23')); // string to number
console.log(+'23'); //string to number using type coercion

//parsing (Read the number out of the string)
console.log(Number.parseInt('30px', 10));
console.log(Number.parseFloat('2.5rem', 10));

// Check if value is NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20px'));
console.log(Number.isNaN(23 / 0));

//Checking if value is a number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'2px0'));
console.log(Number.isFinite(23 / 0));



console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.min(5, 18, 23, 11, 2));

console.log(Math.PI * Number.parseFloat('10px') ** 2);

//Random numbers
console.log(Math.trunc(Math.random() * 6) + 1);

const ramdomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min; //0...1 -> 0...(max - min) -> min...max

//Rounding integers
console.log(Math.trunc(23.3));

console.log(Math.round(23.9)); // Round number (Arredondar)

console.log(Math.ceil(23.3)); // Round up
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3)); //Round down
console.log(Math.floor(23.9));

console.log(Math.trunc(23.3)); // Trunc and floor do almost the same, but...
console.log(Math.floor(23.3));

console.log(Math.trunc(-23.3)); // Trunc doesnt work with negative numbers
console.log(Math.floor(-23.3)); // this value will be 24

//Rounding decimals
console.log((2.7).toFixed(0)); // toFixed return a string value using *Boxing*
console.log((2.7).toFixed(3)); //
console.log((2.345).toFixed(2)); // -> 2.34
console.log(+(2.345).toFixed(2)); // type coercion to return a number


//Remainder Operator %

console.log(5 % 2); //  5 divided by 2 equals 2 remainder 1
console.log(5 / 2); // 5 = 2 * 2 + 1

console.log(8 % 3);
console.log(8 / 3); // 8 = 2 * 3 + 2

console.log(6 % 2); // remainder is 0. 6 is an even number
console.log(6 / 2); //

const isEven = n => n % 2 === 0; // check is number is even

console.log(isEven(3));

//Simple methos to paint all the even rows of the movements table in the app
labelBalance.addEventListener('click', function () {
  //select all the elements into an array using spread operator and use forEach to check if the row is even, if so, it paints it with orange
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';

    if (i % 3 === 0) row.style.backgroundColor = 'blue'; // paint every 3 row
  });
});


// BigInt number
console.log(2 ** 53 - 1); // = 9007199254740991
console.log(Number.MAX_SAFE_INTEGER); // = 9007199254740991

console.log(7886547823647823678412647821n);
console.log(BigInt(7886547823647823678412647821));

//Operation

console.log(10000n + 10000n);
console.log(7683456831256381258632168n * 10000000n);

const huge = 6321563871526873321n;
const num = 23;
console.log(huge * BigInt(num));

// Exceptions
console.log(20n > 15); //true
console.log(20n === 20); //false
console.log(typeof 20n); //BigInt
console.log(20n == 20); //true

console.log(huge + 'Is REALLY big!!!');

//Division operations
console.log(10n / 3n); // = 3n
console.log(10 / 3); // = 3.3333333333


//Create a date

const now = new Date();

console.log(now);
console.log(new Date('Aug 02 2020 18:05:41'));
console.log(new Date('December 24, 2015'));

console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 31));
console.log(new Date(0)); // Date Sun Jan 01 1970 01:00:00 GMT+0100 (Horário do Meridiano de Greenwich)
console.log(new Date(3 * 24 * 60 * 60 * 1000)); // = Date Sun Jan 04 1970 01:00:00 GMT+0100 (Horário do Meridiano de Greenwich) £ DAYS LATER!

//Working with dates

const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear()); // ALWAY use getFullYear, never getYear
console.log(future.getMonth()); // Month
console.log(future.getDate()); //Day of the month
console.log(future.getDay()); // Day of the week
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime()); //get the timestamp
console.log(new Date(2142256980000));

console.log(Date.now());

future.setFullYear(2040); // set the year to the variable
console.log(future);
*/
const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);

const calcdaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcdaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));

console.log(days1);
