// Widget js
(function($, Drupal, Handsontable, google) {

  // Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages':['charteditor']});

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

  Drupal.behaviors.google_chart_field = {
    attach: function (context, settings) {
      $(".google-chart-field-wrapper", context).once("widget-builld").each(function (i, field) {

        var chartEditor;
        var chartWrapper;

        $(field).find('.google-charts-preview-wrapper').before('<button class="google-charts-editor-button">Edit Chart</button>');

        // helper function to draw google chart
        function drawChart(elem, hotdata) {
          // Create the chart to edit.
          data = new google.visualization.arrayToDataTable(hotdata, true );
          chartWrapper = new google.visualization.ChartWrapper({
            'chartType':'LineChart',
            'dataTable': data,
          });

          chartEditor = new google.visualization.ChartEditor();
          google.visualization.events.addListener(chartEditor, 'ok', redrawChart);
        }

        // helper function to redraw chart
        function redrawChart() {
          if (chartEditor){
            chartEditor.getChartWrapper().draw($(field).find('.google-charts-preview-wrapper').get(0));
            chartWrapper = chartEditor.getChartWrapper();
          }
        }

        // helper function to reset data
        function resetData(data) {
          if (chartEditor){
            data = new google.visualization.arrayToDataTable(data, true );
            chartWrapper.setDataTable(data);
            chartWrapper.draw($(field).find('.google-charts-preview-wrapper').get(0));
          }
        }

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
        google.charts.setOnLoadCallback(function () {
          drawChart($(field).find('.google-charts-preview-wrapper').get(0), cleanArray(data));
        });

        $('.google-charts-editor-button').on('click', function (e) {
          e.preventDefault();

          if (chartEditor && chartWrapper) {
            chartEditor.openDialog(chartWrapper, {});
          }
        });

        // when the handsontable updates
        hot.updateSettings({
          afterSelection: function () {
            var data = hot.getData();
            data = JSON.stringify(cleanArray(data));
            $(field).find("[name$='[data]']").val(data);
            resetData(JSON.parse(data));
          },
          afterChange: function () {
            var data = hot.getData();
            data = JSON.stringify(cleanArray(data));
            $(field).find("[name$='[data]']").val(data);
            resetData(JSON.parse(data));
          },
          afterColumnMove: function () {
            var data = hot.getData();
            data = JSON.stringify(cleanArray(data));
            $(field).find("[name$='[data]']").val(data);
            resetData(JSON.parse(data));
          },
          afterRowMove: function () {
            var data = hot.getData();
            data = JSON.stringify(cleanArray(data));
            $(field).find("[name$='[data]']").val(data);
            resetData(JSON.parse(data));
          },
          afterGetColHeader: function (column, TH) {
            if (column > 0) {
              $(TH).html('<div class="relative"><span class="colHeader">Y' + column + '</span></div>');
            } else if (column === 0) {
              $(TH).html('<div class="relative"><span class="colHeader">X</span></div>');
            }
          }
        });
      });
    }
  };

})(jQuery, Drupal, Handsontable, google);
