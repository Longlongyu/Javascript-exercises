function NumberGuessGame() {
  var random, turn, guessNumbers, resetButton;
  var GameSubmit = document.querySelector('.GameSubmit'),
      GameText = document.querySelector('.GameText'),
      output = document.querySelector('.output'),
      guess = document.querySelector('.guess'),
      confirm = document.querySelector('.confirm');

  function switchDisabled(sw) {
    GameSubmit.disabled = sw;
    GameText.disabled = sw;
  }

  function setGameOver() {
    switchDisabled(true);
    resetButton = document.createElement('button');
    resetButton.textContent = 'Restart';
    document.body.appendChild(resetButton);
    function reset() {
      resetButton.parentNode.removeChild(resetButton);
      reStart();
    }
    resetButton.addEventListener('click', reset);
  }

  function reStart() {
    turn = 0;
    random = Math.floor(Math.random() * 100) + 1;
    guessNumbers = [];
    output.textContent = '';
    guess.textContent = '';
    confirm.textContent = '';
    switchDisabled(false);
  }
  reStart();

  function GameSubmitClick(e){
    var n = GameText.value | 0;
    if (typeof n !== 'number') n = 0;
    GameText.value = '';
    guessNumbers.push(n);
    output.textContent = 'Previous guesses: ' + guessNumbers.join(' ');

    if (n === random) {
      guess.setAttribute('style', 'background-color:green;color:white;');
      guess.textContent = 'Right!';
      confirm.textContent = 'This is right!';
      setGameOver();
      return true;
    } else {
      guess.setAttribute('style', 'background-color:red;color:white;');
      guess.textContent = 'Wrong!';
      n > random?confirm.textContent = 'Last guess was too height!':
      confirm.textContent = 'Last guess was too low!';
    }

    turn++;
    if (turn>9) {
      confirm.textContent = 'You lose!';
      setGameOver();
    }
  }
  GameSubmit.addEventListener('click', GameSubmitClick);
}

function CharacterStringCount() {
  var GameSubmit = document.querySelector('.GameSubmit'),
      GameText = document.querySelector('.GameText'),
      Info= document.querySelector('.Info'),
      Letters = document.querySelector('.EnglishLetters'),
      Spaces = document.querySelector('.Spaces'),
      Numbers = document.querySelector('.Numbers'),
      Other = document.querySelector('.Other'),
      regL = /[a-zA-Z]/, regS = /\s/, regN = /[0-9]/, regO = /[^a-zA-Z0-9\s]/;

  function regEx(reg, str) {
    var count = 0;
    while(str.search(reg) != -1) {
      str = str.replace(reg, '');
      count++;
    }
    return count;
  }
  function GameSubmitClick(e) {
    var n = GameText.value;
    GameText.value = '';
    n += '';
    Info.textContent = n;
    Info.setAttribute('style', 'background-color:green;color:white;');
    Letters.textContent = 'Letters : ' + regEx(regL, n);
    Spaces.textContent = 'Spaces : ' + regEx(regS, n);
    Numbers.textContent = 'Numbers : ' + regEx(regN, n);
    Other.textContent = 'Other : ' + regEx(regO, n);
  }
  
  GameSubmit.addEventListener('click', GameSubmitClick);
}