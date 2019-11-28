(function () {
  function startGame() {
    let state = {
      difficulty: 'easy',
      bomb: 15,
      flag: 15,
      grid: 10*10,
      isGameOver: false,
      isTimerOn: false,
      time: 0
    }

    const newGame = document.querySelectorAll('.topBtn')[0];
    newGame.addEventListener('click', () => {
      initializeAll(state.difficulty);
      const left = document.querySelector('.left');
      for (let div of left.children) {
        if (div.classList.contains('difficultyActive')) {
          div.classList.remove('difficultyActive');
          break;
        }
      }
      for (let div of left.children) {
        if (div.children[1].textContent.toLowerCase() === state.difficulty) {
          if (!div.classList.contains('difficultyActive')) div.classList.add('difficultyActive');
        }
      }
    });

    return function () {
      initializeAll(); 
      selectDifficulty();
      addEventToDOM();
      setFlags();
    }

    function selectDifficulty() {
      const left = document.querySelector('.left');
      for (let div of left.children) {
        div.addEventListener('click', e => {
          const level = e.currentTarget.children[0].id;
          initializeAll(level, e);
        });
      }
    }

    function changeState(str = 'easy')  {
      if (str === 'easy') {
        state.difficulty = 'easy', state.bomb = 15, state.flag = 15, state.grid = 10*10;
        state.isGameOver = false, state.isTimerOn = false, state.time = 0;
      } else if (str === 'medium') {
        state.difficulty = 'medium', state.bomb = 40, state.flag = 40, state.grid = 15*15;
        state.isGameOver = false, state.isTimerOn = false, state.time = 0;
      } else if (str === 'hard') {
        state.difficulty = 'hard', state.bomb = 70, state.flag = 70, state.grid = 20*20
        state.isGameOver = false, state.isTimerOn = false, state.time = 0;
      }
    }

    function addActiveClass(event) {
      if (!event) return document.querySelector('.left').firstElementChild.classList.add('difficultyActive');

      const parent = event.currentTarget.parentElement;
      for (let div of parent.children) {
        if (div.classList.contains('difficultyActive')) {
          div.classList.remove('difficultyActive');
          break;
        }
      }
      event.currentTarget.classList.add('difficultyActive');
    }

    function paintGrid() {
      const grid = document.querySelector('.grid');
      if (grid.children.length > 0) {
        while (grid.children.length > 0) {
          grid.removeChild(grid.children[0]);
        }
      }

      let row = Math.sqrt(state.grid);
      for (let i = 0; i < row; i++) {
        const gridRow = document.createElement('div');
        gridRow.setAttribute('id', `row${i}`);
        gridRow.classList.add(state.difficulty);
        grid.appendChild(gridRow);
        
        for (let k = 0; k < row; k++) {
          const square = document.createElement('div');
          square.classList.add('squareCover');
          square.classList.add('box');
          square.setAttribute('id', `box${i === 0 ? k : i*row + k}`);
          gridRow.appendChild(square);
        }
      }
    }

    function setBombAndFlags() {
      const bomb = document.querySelector('#bombText');
      const flag = document.querySelector('#flagText');
      bomb.textContent = state.bomb;
      flag.textContent = state.flag;
    }

    function setTimer() {
      const timer = document.querySelector('#timerText');
      timer.textContent = 0;
    }

    function fillGrid() {
      const rows = document.querySelectorAll(`.${state.difficulty}`);
      const bombArr = makeBombArr();

      const gridArr = new Array(state.grid).fill(0);
      for (let bomb of bombArr) {
        gridArr[bomb] = '🔥';
      }

      let row = Math.sqrt(state.grid);
      for (let n = 0; n < state.grid; n++) {
        if (gridArr[n] === '🔥') {
          if (typeof(gridArr[n-row-1]) === 'number' && gridArr[n-row-1] !== '🔥') gridArr[n-row-1] += 1;
          if (typeof(gridArr[n-row]) === 'number' && gridArr[n-row] !== '🔥') gridArr[n-row] += 1;
          if (typeof(gridArr[n-row+1]) === 'number' && gridArr[n-row+1] !== '🔥') gridArr[n-row+1] += 1;
          if (typeof(gridArr[n-1]) === 'number' && gridArr[n-1] !== '🔥') gridArr[n-1] += 1;
          if (typeof(gridArr[n+1]) === 'number' && gridArr[n+1] !== '🔥') gridArr[n+1] += 1;
          if (typeof(gridArr[n+row-1]) === 'number' && gridArr[n+row-1] !== '🔥') gridArr[n+row-1] += 1;
          if (typeof(gridArr[n+row]) === 'number' && gridArr[n+row] !== '🔥') gridArr[n+row] += 1;
          if (typeof(gridArr[n+row+1]) === 'number' && gridArr[n+row+1] !== '🔥') gridArr[n+row+1] += 1;
          
          if (n % row === 0) {
            if (typeof(gridArr[n-row-1]) === 'number' && gridArr[n-row-1] !== '🔥') gridArr[n-row-1] -= 1;
            if (typeof(gridArr[n-1]) === 'number' && gridArr[n-1] !== '🔥') gridArr[n-1] -= 1;
            if (typeof(gridArr[n+row-1]) === 'number' && gridArr[n+row-1] !== '🔥') gridArr[n+row-1] -= 1;
          }

          if (n % row === row - 1) {
            if (typeof(gridArr[n-row+1]) === 'number' && gridArr[n-row+1] !== '🔥') gridArr[n-row+1] -= 1;
            if (typeof(gridArr[n+1]) === 'number' && gridArr[n+1] !== '🔥') gridArr[n+1] -= 1;
            if (typeof(gridArr[n+row+1]) === 'number' && gridArr[n+row+1] !== '🔥') gridArr[n+row+1] -= 1;
          }
        }
      }

      let currentIdx = 0;
      for (let line of rows) {
        for (let i = 0; i < row; i++) {
          if (gridArr[i+currentIdx] === '🔥' || gridArr[i+currentIdx] > 0) {
            line.children[i].textContent = gridArr[i+currentIdx];
          }
        }
        currentIdx += row;
      }
    }

    function makeBombArr() {
      const bombArr = [];
      const bombObj = {};
      while (bombArr.length < state.bomb) {
        let randNum = Math.floor(Math.random() * state.grid);
        if (!bombObj[randNum]) {
          bombArr.push(randNum);
          bombObj[randNum] = true;
        }
      }
      bombArr.sort((a, b) => a - b);
      return bombArr;
    }

    function addEventToDOM() {      
      const grid = document.querySelector('.grid');
      grid.addEventListener('click', (event) => playGame(event));
    }
    
    function playGame(e) {
      const grid = document.querySelector('.grid');
      const target = e.target;
      if (!(target.classList.contains('squareCover') && target.children.length === 1) && !(target.getAttribute('alt') === 'flag')) {
        if ((target.getAttribute('id') && target.getAttribute('id').slice(0,3) !== 'row') && target.getAttribute('class') !== 'grid') {
          runTimer();
          if (!state.isGameOver) {
            const userClickSquare = e.target;
            let current = userClickSquare;
    
            if (!e.target.classList.contains('square')) {
              if (parseInt(current.textContent) > 0) {
                current.classList.remove('squareCover');
                current.classList.add('square');
                colorNumber(current);
              } else if (current.textContent === '🔥') {
                const allNode = document.querySelectorAll('.box');
                for (let box of allNode) {
                  clearFlag(box);
                  colorNumber(box);
                  box.classList.remove('squareCover');
                  box.classList.add('square');
                }
                current.style.backgroundColor = 'red';
                state.isGameOver = true;
              } else if (current.textContent === '') {
                const traverse = traverseGrid(userClickSquare);
                const uncoverArr = traverse(userClickSquare);
                console.log(uncoverArr);
  
                for (let idx of uncoverArr) {
                  const target = document.querySelector(`#box${idx}`);
                  if (target.children.length > 0) target.removeChild(target.children[0]);
                  target.classList.remove('squareCover');
                  target.classList.add('square');
                  colorNumber(target);
                }
              }
            }
          }
        }
      }
    }

    function colorNumber(elem) {
      if (parseInt(elem.textContent) > 0) {
        if (parseInt(elem.textContent) === 1) elem.style.color = 'blue';
        else if (parseInt(elem.textContent) === 2) elem.style.color = 'darkgreen';
        else if (parseInt(elem.textContent) === 3) elem.style.color = 'red';
        else if (parseInt(elem.textContent) === 4) elem.style.color = 'navy';
        else if (parseInt(elem.textContent) === 5) elem.style.color = 'brown';
        else if (parseInt(elem.textContent) === 6) elem.style.color = 'teal';
        else if (parseInt(elem.textContent) > 7) elem.style.color = 'black';
      }
    }

    function traverseGrid(box) {
      const emptyObj = {}, numberObj = {};
      const row = Math.sqrt(state.grid);

      console.log(box); // test코드
      emptyObj[box.getAttribute('id').slice(3)] = true;

      function lookUp4Directions(elem) { // 현재 타겟의 상하좌우를 객체에 넣는 함수.
        let left = elem.previousSibling;
        let right = elem.nextSibling;
        let top = document.querySelector(`#box${parseInt(elem.getAttribute('id').slice(3)) - row}`);
        let bottom = document.querySelector(`#box${parseInt(elem.getAttribute('id').slice(3)) + row}`);
        putIntoObjs(left);
        putIntoObjs(right);
        putIntoObjs(top);
        putIntoObjs(bottom);
      }

      function putIntoObjs(elem) { // 대상이 되는 element가 비어있는지, 숫자인지 판단해서 해당 객체에 넣는 함수.
        if (elem) {
          if (!emptyObj[elem.getAttribute('id').slice(3)] && elem.textContent === '') {
            emptyObj[elem.getAttribute('id').slice(3)] = true;
          } else if (!numberObj[elem.getAttribute('id').slice(3)] && parseInt(elem.textContent) > 0) {
            numberObj[elem.getAttribute('id').slice(3)] = true;
          }
        }
      }

      function traverseLeft(elem) { // 대상이 되는 target을 왼쪽으로 이동시키는 함수.
        // debugger;
        lookUp4Directions(elem);
        elem = elem.previousSibling;
        if (elem) {
          if (elem.textContent === '') {
            traverseLeft(elem);
          }
          else if (parseInt(elem.textContent) > 0) {
            lookUp4Directions(elem.nextSibling);
            return;
          }
        } else return;
      }

      function traverseRight(elem) { // 대상이 되는 타겟을 오른쪽으로 이동시키는 함수.
        lookUp4Directions(elem);
        elem = elem.nextSibling;
        if (elem) {
          if (elem.textContent === '') traverseRight(elem);
          else if (parseInt(elem.textContent) > 0) {
            lookUp4Directions(elem.previousSibling);
            return;
          }
        } else return;
      }

      function traverseTop(elem) {
        if (elem.parentNode.previousSibling) {
          const upperRowStartIdx = parseInt(elem.parentNode.previousSibling.children[0].id.slice(3));
          const upperRowWEndIdx = upperRowStartIdx + Math.sqrt(state.grid) - 1;
          const upperArr = [];
          for (let idx in emptyObj) {
            if (parseInt(idx) >= upperRowStartIdx && parseInt(idx) <= upperRowWEndIdx) upperArr.push(parseInt(idx));
          }
  
          for (let idx of upperArr) {
            const target = document.querySelector(`#box${idx}`);
            traverseLeft(target);
            traverseRight(target);
            traverseTop(target);
          }
        }
      }

      function traverseBottom(elem) {
        if (elem.parentNode.nextSibling) {
          const lowerRowStartIdx = parseInt(elem.parentNode.nextSibling.children[0].id.slice(3));
          const lowerRowWEndIdx = lowerRowStartIdx + Math.sqrt(state.grid) - 1;
          const lowerArr = [];
          for (let idx in emptyObj) {
            if (parseInt(idx) >= lowerRowStartIdx && parseInt(idx) <= lowerRowWEndIdx) lowerArr.push(parseInt(idx));
          }

          for (let idx of lowerArr) {
            const target = document.querySelector(`#box${idx}`);
            traverseLeft(target);
            traverseRight(target);
            traverseBottom(target);
          }
        }
      }

      return function (box) { // box는 최초 user가 클릭한 정사각형을 의미한다.
        traverseLeft(box);
        traverseRight(box);
        traverseTop(box);
        traverseBottom(box);

        const emptyArr = Object.keys(emptyObj);
        const numberArr = Object.keys(numberObj);
        const result = emptyArr.concat(numberArr).map(idx => parseInt(idx)).sort((a, b) => a - b);
        return result;
      }
    }


    function runTimer() {
      const timerText = document.querySelector('#timerText');
      const difficulty = state.difficulty;

      if (!state.isTimerOn) {
        state.isTimerOn = true;
        let myTimer = setInterval(() => {
          state.time += 0.2;
          timerText.textContent = Math.floor(state.time);

          if (state.isGameOver || difficulty !== state.difficulty || state.isTimerOn === false) {
            clearInterval(myTimer);
            state.isTimerOn = false;
          }
        }, 200);
      }
    }

    function initializeAll(str, event) {
      changeState(str); // 1. 선택된 난이도에 따라서 state 변경시키기.
      addActiveClass(event); // 2. 선택한 버튼에 선택됐다는 class 붙이기. default는 easy.
      paintGrid(); // 3. grid 그리기.
      fillGrid(); // 4. grid 폭탄과 숫자로 채우기.
      setBombAndFlags(); //  bomb과 flag 숫자 초기화하기.
      setTimer(); // timer 초기화히기.
    }

    function setFlags() {
      const grid = document.querySelector('.grid');
      grid.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const box = e.target;
        if (state.flag > 0) {
          if (box.classList.contains('squareCover') && box.children.length === 0) {
            box.style.setProperty('color', 'transparent');
            box.style.setProperty('font-size', 0);
            const img = document.createElement('img');
            img.setAttribute('src', './assets/flags.png');
            img.setAttribute('alt', 'flag');
            img.style.height = '1.5rem';
            img.style.margin = '1rem';
            box.appendChild(img);
            state.flag = state.flag <= 0 ? 0 : state.flag - 1;
            setBombAndFlags();
            runTimer();
          } else if ((box.classList.contains('squareCover') && box.children.length === 1) || box.getAttribute('alt') === 'flag') {
            state.flag++;
            clearFlag(box);
            setBombAndFlags();
          }
        } else if (state.flag === 0) {
          if ((box.classList.contains('squareCover') && box.children.length === 1) || box.getAttribute('alt') === 'flag') {
            state.flag++;
            clearFlag(box);
            setBombAndFlags();
          }
        }
      });
    }

    function clearFlag(elem) {
      if (elem.getAttribute('alt') === 'flag') elem = elem.parentNode;

      if (elem.children.length > 0) {
        elem.removeChild(elem.children[0]);
        elem.style.removeProperty('color');
        elem.style.removeProperty('font-size');
      }
    }
  }

  const runGame = startGame();
  runGame();
})();