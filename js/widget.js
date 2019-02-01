// Widget js
(function($, Drupal, Handsontable, google) {

  // console.log($);
  // console.log(Drupal);
  // console.log(Handsontable);
  // console.log(google);

  // Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages':['corechart']});

  // if string is empty
  function isEmpty(str) {
    return (!str || 0 === str.length);
  }

  // helper function to check last row
  function isLastRowEmpty (arr) {
    var empty = true;
    arr[arr.length - 1].forEach( function (item) {
      if ( !isEmpty(item) ) {
        empty = false;
      }
    });
    return empty;
  }

  // helper function check last column
  function isLastColumnEmpty (arr) {
    empty = true;
    arr.forEach( function (column) {
      if ( !isEmpty(column[column.length - 1]) ) {
        empty = false;
      }
    });
    return empty;
  }

  // helper function to trim edges of array
  function cleanArray (arr) {
    // remove last rows if null
    while (isLastRowEmpty(arr) && arr.length > 1 ) {
      arr.pop();
    }

    // remove last column if all empty
    while (isLastColumnEmpty(arr) && arr[0].length > 1 ) {
      arr.forEach( function (column) {
        column.pop();
      });
    }

    // convert to numbers
    arr.forEach( function (row, index) {
      row.forEach( function (column, i) {
        if (!isNaN(column)) {
          arr[index][i] = parseInt(column);
        }
      });
    });

    return arr;
  }

  // helper function to draw google chart
  function drawChart(elem, hotdata) {

    // Create the data table.
    var data = new google.visualization.arrayToDataTable(hotdata, true );

    // Set chart options
    var options = {'title':'How Much Pizza I Ate Last Night'};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(elem);
    chart.draw(data, options);

    return chart;
  }

  // helper function to redraw chart if data is edited
  function dataRedraw(chart, hotdata) {

    try {
      // Create the data table.
      var data = new google.visualization.arrayToDataTable(hotdata, true );

      // Set chart options
      var options = {'title':'How Much Pizza I Ate Last Night'};

      chart.draw(data, options);
    } catch (error) {
      console.log(hotdata);
      console.log(error);
    }
  }

  Drupal.behaviors.google_chart_field = {
    attach: function (context, settings) {
      $(".google-chart-field-wrapper", context).once("widget-builld").each(function (i, field) {

        // set up data
        var data = $(field).find("[name$='[data]']").val();
        if (data) {
          data = JSON.parse(data);
        } else {
          data = [
            ["",""],
            ["",""]
          ];
        }

        // create handsontable
        var hotContainer = $(field).find(".handsontable-wrapper").get(0);
        var hot = new Handsontable(hotContainer, {
          data: data,
          colHeaders: true,
          rowHeaders: true,
          manualColumnResize: true,
          manualRowResize: true,
          manualColumnMove: true,
          manualRowMove: true,
          minSpareRows: 1,
          minSpareCols: 1,
          contextMenu: true
        });

        // create google charts preview
        var chart;
        google.charts.setOnLoadCallback(function () {
          chart = drawChart($(field).find('.google-charts-preview-wrapper').get(0), cleanArray(data));
        });

        // when the handsontable updates
        hot.updateSettings({
          afterSelection: function () {
            var data = hot.getData();
            data = JSON.stringify(cleanArray(data));
            $(field).find("[name$='[data]']").val(data);
            dataRedraw(chart, JSON.parse(data));
          },
          afterChange: function () {
            var data = hot.getData();
            data = JSON.stringify(cleanArray(data));
            $(field).find("[name$='[data]']").val(data);
            dataRedraw(chart, JSON.parse(data));
          },
          afterColumnMove: function () {
            var data = hot.getData();
            data = JSON.stringify(cleanArray(data));
            $(field).find("[name$='[data]']").val(data);
            dataRedraw(chart, JSON.parse(data));
          },
          afterRowMove: function () {
            var data = hot.getData();
            data = JSON.stringify(cleanArray(data));
            $(field).find("[name$='[data]']").val(data);
            dataRedraw(chart, JSON.parse(data));
          },
          afterGetColHeader: function (column, TH) {
            if (column > 0) {
              $(TH).html('<div class="relative"><span class="colHeader">Y' + column + '</span></div>');
            } else if (column === 0) {
              $(TH).html('<div class="relative"><span class="colHeader">X</span></div>');
            }
          }
        });

        // create google charts form
      
      });
    }
  };

})(jQuery, Drupal, Handsontable, google);
