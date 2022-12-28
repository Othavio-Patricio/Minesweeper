window.addEventListener('contextmenu', (event) => { //Removes context menu on right-click in the whole page
  event.preventDefault();
});

const createRandomNumber = (limit) => { // Creates a random number to be used as mine place
  return Math.floor(Math.random() * limit);
};

const addMineCounter = (mineAmount) => { // Creates mine counter
  const mineCounter = document.getElementsByClassName('mineCounter')[0];
  mineCounter.innerText = mineAmount;
};

const reduceMineAmount = () => { // Reduce mine counter when flags placed
  const minesRemaining = document.getElementsByClassName('mineCounter')[0];
  minesRemaining.innerText = Number(minesRemaining.innerText) - 1;
};

const increaseMineAmount = () => { // Increase mine counter when flags placed
  const minesRemaining = document.getElementsByClassName('mineCounter')[0];
  minesRemaining.innerText = Number(minesRemaining.innerText) + 1;
};

const lossScreen = (completeSquares, index, square) => { // Create a losing possibility to the game when clicking a bomb
  if (completeSquares[index] === 'X') {
    document.getElementsByClassName('loss-screen')[0].style.display = 'flex';
    square.className += ' , mine';
    for (let index2 = 0; index2 < completeSquares.length; index2 += 1) {
      const newSquare = document.getElementById(index2);
      newSquare.style.pointerEvents = 'none'; // Stops interaction with the game
      if (completeSquares[index2] === 'X') {
        newSquare.innerText = 'X';
        newSquare.className += ' , clicked';
      }
    }
  }
};

const mineCreation = (mineAmount, squares, id, rowSize) => { // Create mines
  const mines = [];
  for (let index = 0; index < mineAmount; index += 1) { // Loop for creation of correct amount of mines
    let counter = 0;
    const mine = createRandomNumber(squares); // Create a number to the new mine
    for (let index2 = 0; index2 < mines.length; index2 += 1) { // Loop for check if this mine number is being used
      if (mines[index2] === mine
        || mine === id
        || mine === id - rowSize - 1
        || mine === id - rowSize
        || mine === id - rowSize + 1
        || mine === id + rowSize - 1
        || mine === id + rowSize
        || mine === id + rowSize + 1
        || mine === id - 1
        || mine === id + 1) { // if number id being used adds 1 to counter
        counter = 1;
      }
    }
    if (counter === 0) { // if counter still 0, the mine can be created
      mines.push(mine);
    } else { // if counter become 1, the mine can't be created and looping go back to choose another number
      index -= 1;
    }
    counter = 0;
  }
  mines.sort((a, b) => a - b); // Sort mines to make easier to place them later
  return mines;
};

const addNotMines = (squares, mines, id) => { // Adds empty spaces in the array to later place actual numbers
  const allSquares = [];
  for (let index = 0; index < squares; index += 1) {
    if (index === mines[0]) {
      allSquares.push('X');
      mines.shift();
    } else {
      allSquares.push('');
    }
  }
  return allSquares;
};

const addNumbers = (allSquares, rowSize) => {
  const completeSquares = allSquares.map((curr, index, arr) => {
    if (curr === 'X') return 'X';
    let counter = 0;
    if (
      curr === '' &&
      index % rowSize !== 0 &&
      arr[index - rowSize - 1] === 'X'
    ) {
      counter += 1;
    }
    if (curr === '' && arr[index - rowSize] === 'X') {
      counter += 1;
    }
    if (
      curr === '' &&
      index % rowSize !== rowSize - 1 &&
      arr[index - rowSize + 1] === 'X'
    ) {
      counter += 1;
    }
    if (curr === '' && index % rowSize !== 0 && arr[index - 1] === 'X') {
      counter += 1;
    }
    if (
      curr === '' &&
      index % rowSize !== rowSize - 1 &&
      arr[index + 1] === 'X'
    ) {
      counter += 1;
    }
    if (
      curr === '' &&
      index % rowSize !== 0 &&
      arr[index + rowSize - 1] === 'X'
    ) {
      counter += 1;
    }
    if (curr === '' && arr[index + rowSize] === 'X') {
      counter += 1;
    }
    if (
      curr === '' &&
      index % rowSize !== rowSize - 1 &&
      arr[index + rowSize + 1] === 'X'
    ) {
      counter += 1;
    }
    if (counter === 0) return '';
    return counter;
  });
  return completeSquares;
};

const openingZeroSideBlocks = (
  id,
  completeSquares,
  rowSize,
  index,
  squareAmount
) => {
  if (id >= 0 && id < squareAmount && completeSquares[id] !== 'X') {
    const element = document.getElementById(id);
    if (
      element &&
      completeSquares[id] >= 0 &&
      !element.className.includes('clicked') &&
      index % rowSize === rowSize - 1
        ? id % rowSize !== 0
        : true && index % rowSize === 0
        ? id % rowSize !== rowSize - 1
        : true
    ) {
      //element.click();
      element.dispatchEvent(new Event('click'));
    }
  }
};

const printGameNumbers = (completeSquares, rowSize, mineAmount, id) => {
  const squarePlace = document.getElementsByClassName('squares')[0];
  let counter = 1;
  for (let index = 0; index < completeSquares.length; index += 1) {
    const square = document.createElement('div');
    square.id = index;
    square.addEventListener('click', () => {
      if (!square.className.includes('clicked') && square.innerHTML !== 'F') {
        square.innerHTML = completeSquares[index];
        lossScreen(completeSquares, index, square);
        if (completeSquares[index] === '') {
          square.className += ' , empty';
        }
        square.className += ' , clicked';
        if (completeSquares[index] === '') {
          const squareAmount = rowSize * rowSize;
          let id = index - rowSize - 1;
          openingZeroSideBlocks(id, completeSquares, rowSize, index, squareAmount);
          id = index - rowSize;
          openingZeroSideBlocks(id, completeSquares, rowSize, index, squareAmount);
          id = index - rowSize + 1;
          openingZeroSideBlocks(id, completeSquares, rowSize, index, squareAmount);
          id = index - 1;
          openingZeroSideBlocks(id, completeSquares, rowSize, index, squareAmount);
          id = index + 1;
          openingZeroSideBlocks(id, completeSquares, rowSize, index, squareAmount);
          id = index + rowSize - 1;
          openingZeroSideBlocks(id, completeSquares, rowSize, index, squareAmount);
          id = index + rowSize;
          openingZeroSideBlocks(id, completeSquares, rowSize, index, squareAmount);
          id = index + rowSize + 1;
          openingZeroSideBlocks(id, completeSquares, rowSize, index, squareAmount);
        }
      }
    });
    square.addEventListener('mousedown', (event) => {
      const minesRemaining = Number(
        document.getElementsByClassName('mineCounter')[0].innerText
      );
      if (
        event.button === 2 &&
        square.innerHTML !== 'F' &&
        !square.className.includes('clicked') &&
        minesRemaining > 0
      ) {
        square.innerHTML = 'F';
        square.className += ' , flag';
        reduceMineAmount();
        if (minesRemaining === 1) {
          let counter2 = 0;
          for (let index2 = 0; index2 < completeSquares.length; index2 += 1) {
            const newSquare = document.getElementById(index2);
            if (
              newSquare.innerText === 'F' &&
              completeSquares[index2] === 'X'
            ) {
              counter2 += 1;
            }
          }
          if (counter2 === mineAmount) {
            document.getElementsByClassName('win-screen')[0].style.display =
              'flex';
          }
        }
      } else if (
        event.button === 2 &&
        !square.className.includes('clicked') &&
        square.className.includes('flag') &&
        minesRemaining < mineAmount
      ) {
        console.log(mineAmount);
        square.innerHTML = '';
        square.className = 'square';
        increaseMineAmount();
      }
    });
    square.className = 'square';
    squarePlace.appendChild(square);
    if (counter % Math.sqrt(completeSquares.length) === 0) {
      const stop = document.createElement('div');
      stop.className = 'break';
      squarePlace.appendChild(stop);
    }
    counter += 1;
  }
  document.getElementById(id).click();
};

const startGame = (mineAmount, rowSize) => {
  const squareAmount = rowSize * rowSize;
  addMineCounter(mineAmount); // Calls mine counter creation
  deleteSizeButtons();
  makeSizeButtons();
  createInitialSquares(mineAmount, rowSize, squareAmount);
  sizeButtons(squareAmount);
};

const deleteInitialSquares= (squareAmount) => {
  for (let index = 0; index < squareAmount; index += 1) {
    const test = document.getElementById(index);
    test.remove();
  }
}


const createInitialSquares = (mineAmount, rowSize, squareAmount) => {
  const squarePlace = document.getElementsByClassName('squares')[0];
  let counter = 1;
  for (let index = 0; index < squareAmount; index += 1) {
    const square = document.createElement('div');
    square.id = index;
    square.addEventListener('click', () => {
      const squareAmount = rowSize * rowSize;
      deleteInitialSquares(squareAmount);
      const minesCreated = mineCreation(mineAmount, squareAmount, index, rowSize);
      const notMinesAdd = addNotMines(squareAmount, minesCreated);
      const numbersAdd = addNumbers(notMinesAdd, rowSize);
      printGameNumbers(numbersAdd, rowSize, mineAmount, index);
    });
    square.className = 'square';
    squarePlace.appendChild(square);
    if (counter % Math.sqrt(squareAmount) === 0) {
      const stop = document.createElement('div');
      stop.className = 'break';
      squarePlace.appendChild(stop);
    }
    counter += 1;
  }
};

const makeSizeButtons = () => {
  const btnPlace = document.getElementById('btn-place');
  const btnSma = document.createElement('button');
  btnSma.innerText = 'Small';
  btnSma.id = 'sma-btn';
  btnPlace.appendChild(btnSma);
  const btnMed = document.createElement('button');
  btnMed.innerText = 'Medium';
  btnMed.id = 'med-btn';
  btnPlace.appendChild(btnMed);
  const btnLar = document.createElement('button');
  btnLar.innerText = 'Large';
  btnLar.id = 'lar-btn';
  btnPlace.appendChild(btnLar);
  const btnExt = document.createElement('button');
  btnExt.innerText = 'Extreme';
  btnExt.id = 'ext-btn';
  btnPlace.appendChild(btnExt);
  const btnPro = document.createElement('button');
  btnPro.innerText = 'Pro';
  btnPro.id = 'pro-btn';
  btnPlace.appendChild(btnPro);
}

const deleteSizeButtons = () => {
  const btnPlace = document.getElementById('btn-place');
  btnPlace.innerHTML = '';
}

const sizeButtons = (squareAmount) => {
  document.getElementById('sma-btn').addEventListener('click', () => {
    deleteInitialSquares(squareAmount);
    startGame(11, 8);
  });
  document.getElementById('med-btn').addEventListener('click', () => {
    deleteInitialSquares(squareAmount);
    startGame(25, 11);
  });
  document.getElementById('lar-btn').addEventListener('click', () => {
    deleteInitialSquares(squareAmount);
    startGame(40, 15);
  });
  document.getElementById('ext-btn').addEventListener('click', () => {
    deleteInitialSquares(squareAmount);
    startGame(80, 20);
  });
  document.getElementById('pro-btn').addEventListener('click', () => {
    deleteInitialSquares(squareAmount);
    startGame(170, 30);
  });
}

window.onload=startGame(11, 8);
