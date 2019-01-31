// Widget js
(function($, Drupal, Handsontable, google) {

  // console.log($);
  // console.log(Drupal);
  // console.log(Handsontable);
  // console.log(google);

  // if string is empty
  function isEmpty(str) {
    return (!str || 0 === str.length);
  }

  // check last row
  function isLastRowEmpty (arr) {
    var empty = true;
    arr[arr.length - 1].forEach( function (item) {
      if ( !isEmpty(item) ) {
        empty = false;
      }
    });
    return empty;
  }

  // check last column
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

    return arr;
  }

  Drupal.behaviors.google_chart_field = {
    attach: function (context, settings) {
      $(".google-chart-field-wrapper", context).once("widget-builld").each(function (i, field) {

        var hotContainer = $(field).find(".handsontable-wrapper").get(0);
        
        var data = $(field).find("[name$='[data]']").val();
        if (data) {
          data = JSON.parse(data);
        } else {
          data = [
            ["",""],
            ["",""]
          ];
        }
        
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

        hot.updateSettings({
          afterSelection: function () {
            var data = hot.getData();
            data = JSON.stringify(cleanArray(data));
            $(field).find("[name$='[data]']").val(data);
          },
          afterChange: function () {
            var data = hot.getData();
            data = JSON.stringify(cleanArray(data));
            $(field).find("[name$='[data]']").val(data);
          },
          afterColumnMove: function () {
            var data = hot.getData();
            data = JSON.stringify(cleanArray(data));
            $(field).find("[name$='[data]']").val(data);
          },
          afterRowMove: function () {
            var data = hot.getData();
            data = JSON.stringify(cleanArray(data));
            $(field).find("[name$='[data]']").val(data);
          }
        });
      
      });
    }
  };

})(jQuery, Drupal, Handsontable, google);
