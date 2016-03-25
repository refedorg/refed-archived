    function getLabels(data) {
      return data.solutions.map(function(solution) {
        return solution.title
      })
    };
    function getSeries(data, key) {
      var k = key.replaceAll('-','_');
      return data.solutions.map(function(solution) {
        return solution.data[k]
      })
    };
    function getData(key) {
      return {
        labels: getLabels(solution_data),
        series: [
          getSeries(solution_data, key)
        ]
      }
    };

    function getPercentages(data, key) {
      var series = getSeries(data, key),
          max = Math.max.apply(0, series);

      return series.map(function(value) {
        var v = value / max * 100;
        return Math.round(v*100)/100;
      });
    }

    function updateCostCurve(key) {
      var l = window.location.pathname + "?sort="+key;
      window.history.pushState('', 'Cost Curve: '+key+' Solutions', l);
      $("#instructions input").val(window.location.href);

      var p = [];
      p = getPercentages(solution_data, key);
      $('#cost-curve .solution').popover('hide');
      $('#cost-curve ul').each(function() {
        var orientation = $(this).attr('class');
        $(this).find('.progress').each(function(index) {
          if(orientation == 'vertical') {
            $(this).css('height', p[index]+'%');
          } else {
            $(this).css('width', p[index]+'%');
          }
        });
      });
    }

    function updatePotentialCurve(data) {
      var p = [];
      p = getPercentages(data, 'profit-potential');
      $('#profit-chart .progress').each(function(index) {
        $(this).css('height', p[index]+'%');
      });
    }