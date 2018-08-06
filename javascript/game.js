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

NumberGuessGame();