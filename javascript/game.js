function startGame(){
  var compose = function(f, g) {return function() {return f(g.apply(g, arguments));};};
  var dom = function(str) {return document.querySelector(str);};
  var control = function(o, f) {return function(s) {return o[f](s);};};
  var get = function(o, k) {return o[k];};
  var set = function(o, k, s) {o[k] = s;};
  var memorize = function(f) {var cache = {};
    return function() {
      var arg_str = JSON.stringify(arguments);
      cache[arg_str] = cache[arg_str] || f.apply(f, arguments);
      return cache[arg_str];
    };
  };

  var get_dom = memorize(dom);
  var get_dom_v = function(e, k) {return get(get_dom(e), k);};
  var set_dom_v = function(e, k, s) {return set(get_dom(e), k, s);};
  var set_dom_Attribute = function(e, k, s) {return get_dom(e).setAttribute(k, s);};
  
  return {
    numberGuessGame : function() {
      
      var get_random =  function(x) {return Math.floor(Math.random() * x) + 1};
      
      var switchDisabled = function(bool) {
        set_dom_v('.GameSubmit', 'disabled', bool);
        set_dom_v('.GameText', 'disabled', bool);
      };

      var game = {
        turn : 0,
        random : 0,
        guessArray : [],
        reStart : function() {
          turn = 0;
          random = get_random(100);
          guessArray = [];
          set_dom_v('.guess', 'textContent', '');
          set_dom_v('.output', 'textContent', '');
          set_dom_v('.confirm', 'textContent', '');
          switchDisabled(false);
        },
        setGameOver : function() {
          switchDisabled(true);
          resetButton = document.createElement('button');
          resetButton[textContent] = 'Restart';
          document.body.appendChild(resetButton);
          resetButton.addEventListener('click', function reset() {
            resetButton.parentNode.removeChild(resetButton);
            reStart();
          });
        },
        domGameSubmitClick : function() {
          var value = get_dom_v('.GameText', 'value') | 0;
          set_dom_v('.GameText', 'value', '');
    
          guessArray.push(value);
    
          var str = 'Previous guesses: ' + guessArray.join(' ');
          set_dom_v('.output', 'textContent', str);
    
          if (value === random) {
            set_dom_v('.guess', 'textContent', 'Right!');
            set_dom_Attribute('.guess', 'style', 'background-color:green;color:white;');
            set_dom_v('.confirm', 'textContent', 'This is right!');
            setGameOver();
            return;
          } else {
            set_dom_v('.guess', 'textContent', 'Wrong!');
            set_dom_Attribute('.guess', 'style', 'background-color:red;color:white;');
            value > random ? set_dom_v('.confirm', 'textContent', 'Last guess was too height!') :
            set_dom_v('.confirm', 'textContent', 'Last guess was too low!');
          }
    
          turn++;
          if (turn > 9) {
            set_dom_v('.confirm', 'textContent', 'You lose!');
            setGameOver();
          }
          return;
        }
      };

      game.reStart();
      get_dom('.GameSubmit').addEventListener('click', game.domGameSubmitClick);
    },
    characterStringCount : function() {
      var regEx = function(reg, str) {
        var count = 0;
        while(str.search(reg) != -1) {
          str = str.replace(reg, '');
          count++;
        }
        return count;
      }
      var domGameSubmitClick = function(e) {
        var n = get_dom_v('.GameText', 'value');
        set_dom_v('.GameText', 'value', '');
        n += '';
        set_dom_v('.Info', 'textContent', n);
        set_dom_Attribute('.Info', 'style', 'background-color:green;color:white;');
        set_dom_v('.Letters', 'textContent', 'Letters : ' + regEx(/[a-zA-Z]/, n));
        set_dom_v('.Spaces', 'textContent', 'Spaces : ' + regEx(/\s/, n));
        set_dom_v('.Numbers', 'textContent', 'Numbers : ' + regEx(/[0-9]/, n));
        set_dom_v('.Other', 'textContent', 'Other : ' + regEx(/[^a-zA-Z0-9\s]/, n));
      }
      
      get_dom('.GameSubmit').addEventListener('click', domGameSubmitClick);
    },
    coinGame : function () {
      var compute = function(money) {
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
      var domGameSubmitClick = function(e) {
        var n = get_dom_v('.GameText', 'value') | 0;
        set_dom_v('.GameText', 'value', '');
        var v = compute(n);
        set_dom_Attribute('.Count', 'style', 'background-color:green;color:white;');
        set_dom_v('.Count', 'textContent', 'The total number of : ' + v.count);
        set_dom_v('.Confirm', 'textContent', 'Output : ');
        set_dom_v('.Output', 'innerHTML', v.str);
      }
      
      get_dom('.GameSubmit').addEventListener('click', domGameSubmitClick);
    },
    multiplicationTable : function() {
      var outputTable = function(max) {
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
        return table;
      }
      var domGameSubmitClick = function(e) {
        set_dom_v('.Output', 'innerHTML', '');
        get_dom('.Output').appendChild(outputTable(9));
      }
      get_dom('.GameSubmit').addEventListener('click', domGameSubmitClick);
    }
  }
}