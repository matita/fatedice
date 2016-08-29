;(function () {
  var diceProbs = {
    '-1': 1/3,
     '0': 1/3,
     '1': 1/3
  }
  var resultProbs = {
    '-4':  1/81,
    '-3':  4/81,
    '-2': 10/81,
    '-1': 16/81,
     '0': 19/81,
     '1': 16/81,
     '2': 10/81,
     '3':  4/81,
     '4':  1/81
  }

  document.head.insertAdjacentHTML('beforeEnd', '<style>' +
    '.graph { max-width: 500px; margin-left: auto; margin-right: auto; font-size: 1rem; padding-bottom: 1em; border-bottom: 1px solid #999; color: #555; }' +
    '.bar { margin-top: .5rem; margin-bottom: .5rem; background: #d1e7f1; white-space: nowrap; text-align: left; padding: .2em; }' +
    '</style>')

  var funcs = [rollDie, rollDieWithEntropy, rollDieNative].reverse()
  funcs.forEach(function (roll) {
    var rollsCount = testRolls || 5000
    var valueCount = {
      '-1': 0,
      '0': 0,
      '1': 0
    }
    var resultsCount = {}
    
    var totDice = 0
    var total = 0
    
    for (var j = 0; j < rollsCount; j++) {
      rand = new Random()
      var results = rollDice(roll)
      for (var i = 0; i < results.length; i++) {
        var val = results[i]
        valueCount[val]++
      }

      var r = sumDice(results)
      if (!resultsCount[r])
        resultsCount[r] = 1
      else
        resultsCount[r]++
    }

    
    document.body.insertAdjacentHTML('afterBegin', '<div class="graph">' +
      '<h3>Distribution for ' + rollsCount + ' x 4 rolls with ' + roll.name + '</h3>' +
      '<h4>Per die</h4>' +
      bars(valueCount, diceProbs) +
      '<h4>Per result (sum of 4 dice)</h4>' +
      bars(resultsCount, resultProbs) +
      '</div>'
    )


    function bars(values, probs) {
      var maxCount = Math.max.apply(null, Object.keys(values).map(function(k) { return values[k] }))
      var total = Object.keys(values).reduce(function (t, k) { return t + values[k] }, 0)
      return Object.keys(values).sort(compareKeys).map(bar.bind(this, maxCount, values, probs, total)).join('')
    }

    function bar(maxCount, values, probs, total, val) {
      var count = values[val]
      var f = count/maxCount*100
      var perc = count / total * 100
      var estPerc = probs[val] * 100
      return '<div class="bar" style="width: ' + f + '%">' + val + ': ' + count + ' (' + perc.toFixed(2) + '% instead of estimated ' + estPerc.toFixed(2) + '%)</div>'
    }

    function compareKeys(a, b) {
      return (+a) - (+b)
    }
  })
})()