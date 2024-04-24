const words = 'in one good real one not school set they state high life consider on and not come what also for set point can want as while with of order child about school thing never hold find order each too between program work end you home place around while place problem end begin interest while public or where see time those increase interest be give end think seem small as both another a child same eye you between way do who into again good fact than under very head become real possible some write know however late each that with because that place nation only for each change form consider we would interest with world so order or run more open that large write turn never over open each over change still old take hold need give by consider line only leave while what set'.split(' ');
const wordsCount = 144;
console.log(wordsCount);
const gameTime = 30 * 1000;
window.timer = null;
window.gameStart = null;
window.pauseTime = 0;

function addClass(el, name) {
  el.className += ' ' + name;
}
function removeClass(el, name) {
  el.className = el.className.replace(name, '');
}

function randomWord() {
  const randomIndex = Math.ceil(Math.random() * wordsCount);
  return words[randomIndex - 1];
}

function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
  document.getElementById('words').innerHTML = '';
  for (let i = 0; i < 28; i++) {
    document.getElementById('words').innerHTML += formatWord(randomWord());
  }
  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current');
  document.getElementById('info').innerHTML = (gameTime / 1000) + '';
  window.timer = null;
}

function getWpm() {
  const words = [...document.querySelectorAll('.word')];
  const lastTypedWord = document.querySelector('.word.current');
  const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
  const typedWords = words.slice(0, lastTypedWordIndex);
  const correctWords = typedWords.filter(word => {
    const letters = [...word.children];
    const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
    const correctLetters = letters.filter(letter => letter.className.includes('correct'));
    return incorrectLetters.length === 0 && correctLetters.length === letters.length;
  });
  return correctWords.length / gameTime * 60000;
}

function gameOver() {
  clearInterval(window.timer);
  addClass(document.getElementById('game'), 'over');
  const result = getWpm();
  document.getElementById('info').innerHTML = `WPM: ${result}`;
}

let charIndex = 0;
document.getElementById('game').addEventListener('keyup', ev => {
  let spacekey = ev.key;
  console.log(`real : ${ev.key}`);


  const keys = [...'abcdefghijklmnopqrstuvwxyz'];
  const values = [...'cjxtgueizslbaoqkmpnfhwyrd'];
  const buildMap = (keys, values) => {
    const map = new Map();
    for (let i = 0; i < keys.length; i++) {
      map.set(keys[i], values[i]);

    };

    let inputData = ev.key;

    console.log(map.get(`${inputData}`));
    key = `${map.get(`${inputData}`)}`;
    console.log(key);
    charIndex++;
    // return map;


  };
  let key = ev.key;
  buildMap(keys, values);

















  const currentWord = document.querySelector('.word.current');
  const currentLetter = document.querySelector('.letter.current');
  const expected = currentLetter?.innerHTML || ' ';
  const isLetter = key.length === 1 && key !== ' ';
  const isSpace = spacekey === ' ';
  const isBackspace = spacekey === 'Backspace';
  const isFirstLetter = currentLetter === currentWord.firstChild;

  if (document.querySelector('#game.over')) {
    return;
  }

  console.log({ key, expected });

  if (!window.timer && isLetter) {
    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = (new Date()).getTime();
      }
      const currentTime = (new Date()).getTime();
      const msPassed = currentTime - window.gameStart;
      const sPassed = Math.round(msPassed / 1000);
      const sLeft = Math.round((gameTime / 1000) - sPassed);
      if (sLeft <= 0) {
        gameOver();
        return;
      }
      document.getElementById('info').innerHTML = sLeft + '';
    }, 1000);
  }

  if (isLetter) {
    if (currentLetter) {
      addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
      removeClass(currentLetter, 'current');
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, 'current');
      }
    } else {
      // const incorrectLetter = document.createElement('span');
      // incorrectLetter.innerHTML = key;
      // incorrectLetter.className = 'letter incorrect extra';
      // currentWord.appendChild(incorrectLetter);
    }
  }

  if (isSpace) {
    if (expected !== ' ') {
      const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
      lettersToInvalidate.forEach(letter => {
        addClass(letter, 'incorrect');
      });
    }
    removeClass(currentWord, 'current');
    addClass(currentWord.nextSibling, 'current');
    if (currentLetter) {
      removeClass(currentLetter, 'current');
    }
    addClass(currentWord.nextSibling.firstChild, 'current');
  }

  if (isBackspace) {
    if (currentLetter && isFirstLetter) {
      // make prev word current, last letter current
      removeClass(currentWord, 'current');
      addClass(currentWord.previousSibling, 'current');
      removeClass(currentLetter, 'current');
      addClass(currentWord.previousSibling.lastChild, 'current');
      removeClass(currentWord.previousSibling.lastChild, 'incorrect');
      removeClass(currentWord.previousSibling.lastChild, 'correct');
    }
    if (currentLetter && !isFirstLetter) {
      // move back one letter, invalidate letter

      removeClass(currentLetter, 'current');

      addClass(currentLetter.previousSibling, 'current');
      removeClass(currentLetter.previousSibling, 'incorrect');
      removeClass(currentLetter.previousSibling, 'correct');
    }
    if (!currentLetter) {
      addClass(currentWord.lastChild, 'current');
      removeClass(currentWord.lastChild, 'incorrect');
      removeClass(currentWord.lastChild, 'correct');
    }

  }
  // move lines / words
  // if (currentWord.getBoundingClientRect().top > 400) {
  //   const words = document.getElementById('words');
  //   words.style.marginTop = '-35px';
  //   const margin = parseInt(words.style.marginTop || '0px');
  //   words.style.marginTop = (margin - 35) + 'px';
  //   alert("move");
  // }

  // forForwarding
  // if (currentWord.getBoundingClientRect().top > 450) {
  //   const words = document.getElementById('words');
  //   const margin = parseInt(words.style.marginTop || '0px');
  //   words.style.marginTop = (margin - 35) + 'px';

  // }

  // //forBackspace
  // if (currentWord.getBoundingClientRect().top > 200) {
  //   if (isBackspace) {

  //     const words = document.getElementById('words');
  //     const margin = parseInt(words.style.marginTop || '0px');
  //     if (words.style.marginTop != 0 + 'px') {
  //       words.style.marginTop = (margin + 35) + 'px';
  //       // alert("move");
  //     }
  //   }
  // }
  // move cursor
  const nextLetter = document.querySelector('.letter.current');
  const nextWord = document.querySelector('.word.current');
  const cursor = document.getElementById('cursor');
  cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
});
const startWord = document.getElementById('game');
console.log(startWord.offsetLeft);
const cursorTest = document.getElementById('cursor');
cursor.style.left = startWord.offsetLeft + 'px';
cursor.style.top = startWord.offsetTop + 25 + 'px';

newGame();