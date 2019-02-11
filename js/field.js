(function($, google) {

    google.charts.load('current', {'packages':['charteditor']});

    google.charts.setOnLoadCallback(function () {
        $('.google-chart-field-wrapper').each(function () {
            savedChart = JSON.parse($(this).attr('chart_wrapper'));
            chartWrapper = new google.visualization.ChartWrapper(savedChart);
            chartWrapper.draw($(this).get(0));
        })
      });

})(jQuery, google);