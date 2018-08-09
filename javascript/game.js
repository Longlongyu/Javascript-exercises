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

function CoinGame() {
  var GameSubmit = document.querySelector('.GameSubmit'),
      GameText = document.querySelector('.GameText'),
      Output= document.querySelector('.Output'),
      Count = document.querySelector('.Count'),
      Confirm = document.querySelector('.Confirm');

  function compute(money) {
    var A = 2, B = 5, count = 0, str = '';
		for (var i = 0; i <= money/B; i++) {
      var n = money - (i * B);
			for (var j = 0; j <= n/A; j++) {
        var x = n - (j * A);
				if (x >= 0) {
          str += '$5: ' + i + ' $2: ' + j + ' $1: ' + x + '<br />';
          count++;
        }
			}
    }
    return {count:count,str:str}
  }

  function GameSubmitClick(e) {
    var n = GameText.value | 0;
    GameText.value = '';
    var v = compute(n);
    Count.setAttribute('style', 'background-color:green;color:white;');
    Count.textContent = 'The total number of : ' + v.count;
    Confirm.textContent = 'Output : ';
    Output.innerHTML = v.str;
  }
  
  GameSubmit.addEventListener('click', GameSubmitClick);
}

function MultiplicationTable() {
  var GameSubmit = document.querySelector('.GameSubmit'),
      Output= document.querySelector('.Output');

  function GameSubmitClick(e) {
    var max = 9;
    Output.innerHTML = '';
    var table = document.createElement('table');
		for(var x = 1; x <= max; x++) {
      var tr = document.createElement('tr');
			for(var y = 1; y <= max; y++) {
        var td;
        x == 1 ? td = document.createElement('th') : td = document.createElement('td')
        td.textContent = x * y;
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    Output.appendChild(table);
  }
  GameSubmit.addEventListener('click', GameSubmitClick);
}