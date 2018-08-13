function startGame(){
  var _ = {
    compose : function(f, g) {return function() {return f(g.apply(g, arguments))}},
    control : function(o, f) {return function(s) {return o[f](s)}},
    get : function(o, k) {return o[k]},
    set : function(o, k, s) {return o[k] = s},
    add : function(x, y) {return x + y},
    memorize : function(f) {
      var cache = {}
      return function() {
        var arg_str = JSON.stringify(arguments);
        cache[arg_str] = cache[arg_str] || f.apply(f, arguments)
        return cache[arg_str]
      }
    },
    curry : function(fn) {
      var limit = fn.length
      return function judgeCurry (...args) {
        if (args.length >= limit) {
          return fn.apply(null, args)
        } else {
          return function(...args2) {
            return judgeCurry.apply(null, args.concat(args2))                                     
          }
        }
      }
    }
  }
  
  var Maybe = function(x) {this.__value = x}
  Maybe.of = function(x) {return new Maybe(x)}
  Maybe.prototype.isNothing = function() {return (this.__value === null || this.__value === undefined)}
  Maybe.prototype.map = function(f) {return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value))}
  
  var dom = function(str) {return document.querySelector(str)}
  var get_dom = _.memorize(dom)
  var get_dom_v = function(e, k) {return _.get(get_dom(e), k)}
  var set_dom_v = function(e, k, s) {return _.set(get_dom(e), k, s)}
  var set_dom_Attribute = function(e, k, s) {return get_dom(e).setAttribute(k, s)}
  var setListen = _.curry(function(f, ele) {return ele.addEventListener('click', f)}) 
  
  return {
    numberGuessGame : function() {
      var disabled = _.curry(function(bool) {
        set_dom_v('.GameSubmit', 'disabled', bool)
        set_dom_v('.GameText', 'disabled', bool)
      })
      
      var create = function(x) {return Maybe.of(x)}
      var getVal = _.curry(function(x) {return x.__value})
      var setVal = _.curry(function(x, v) {return Maybe.of(x.__value = v)})
      var map = _.curry(function(x, f) {return x.map(f)})

      var guess = create([])
      var turn = create(0)
      var ran =  create(0)

      var random =  _.curry(function(x) {return Math.floor(Math.random() * x) + 1})
      var ranRandom = _.compose(setVal(ran), random())
      var setTurn = setVal(turn)
      var setGuess = setVal(guess)

      var reStart = _.curry(function() {
        setGuess([])
        setTurn(0)
        disabled(false)
        ranRandom(100)
        set_dom_v('.guess', 'textContent', '')
        set_dom_v('.output', 'textContent', '')
        set_dom_v('.confirm', 'textContent', '')
      }) 
      var setGameOver = function() {
        disabled(true)
        var button = create(document.createElement('button'))
        _.set(getVal(button), 'textContent', 'Restart')
        document.body.appendChild(getVal(button))
        setListen(getVal(button), function reset() {
          resetButton.parentNode.removeChild(getVal(button))
          reStart()
        })
      }
      var domGameSubmitClick = function() {
        var value = get_dom_v('.GameText', 'value') | 0
        set_dom_v('.GameText', 'value', '')
        getVal(guess).push(value)

        var str = 'Previous guesses: ' + getVal(guess).join(' ')
        set_dom_v('.output', 'textContent', str)
    
        if (value === getVal(ran)) {
          set_dom_v('.guess', 'textContent', 'Right!')
          set_dom_Attribute('.guess', 'style', 'background-color:green;color:white;')
          set_dom_v('.confirm', 'textContent', 'This is right!')
          setGameOver()
          return;
        } else {
          set_dom_v('.guess', 'textContent', 'Wrong!')
          set_dom_Attribute('.guess', 'style', 'background-color:red;color:white;')
          value > getVal(ran) ? set_dom_v('.confirm', 'textContent', 'Last guess was too height!') :
          set_dom_v('.confirm', 'textContent', 'Last guess was too low!')
        }
        setTurn(_.add(getVal(turn) + 1))
        if (getVal(turn) > 9) {
          set_dom_v('.confirm', 'textContent', 'You lose!')
          setGameOver()
        }
        return
      }

      var listen = setListen(domGameSubmitClick)

      reStart()
      listen(get_dom('.GameSubmit'))
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