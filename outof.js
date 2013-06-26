function outof() {
  var margin = {top: 5, right: 5, bottom: 5, left: 5},
      width = 400,
      height = 400,
      max = 100,
      xValue = function(d, i) { return i; },
      yValue = function(d) { return d; },
      symbol = d3.svg.symbol(),
      xScale = d3.time.scale(),
      yScale = d3.scale.linear(),
      area = d3.svg.area().x(X).y1(Y),
      line = d3.svg.line().x(X).y(Y),
      interpolate = 'linear';

  function chart(selection) {
    selection.each(function(data) {
        var total_space = (width - margin.top - margin.bottom) *
            (height - margin.left - margin.right);

        var per_feature = total_space / max;
        var feature_size = Math.floor(Math.sqrt(per_feature));

        var xmax = Math.floor(width / feature_size);
        var ymax = Math.floor(height / feature_size);

        // Select the svg element, if it exists.
        var svg = d3.select(this).selectAll("svg").data([data]);

        // Otherwise, create the skeletal chart.
        var gEnter = svg.enter().append("svg").append("g");

        // Update the outer dimensions.
        svg .attr("width", width)
            .attr("height", height);

        // Update the inner dimensions.
        var g = svg.select("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var filled_vs = d3.range(max).map(function(m) {
            return {
                x: m % xmax,
                y: Math.floor(m / xmax),
                on: m <= data,
                m: m
            };
        });

        var pts = g.selectAll('path.out-of')
            .data(filled_vs, function(d) {
                return d.m;
            });

        symbol.size((feature_size * feature_size) * 0.6);

        pts.exit();

        pts.enter()
            .append('path')
            .attr('class', 'out-of');

        pts
            .attr('d', symbol)
            .classed('on', function(d) { return d.on; })
            .attr('transform', function(d) {
                return 'translate(' + [d.x * feature_size, d.y * feature_size] + ')';
            });
    });
  }


  // The x-accessor for the path generator; xScale âˆ˜ xValue.
  function X(d) {
    return xScale(d[0]);
  }

  // The x-accessor for the path generator; yScale âˆ˜ yValue.
  function Y(d) {
    return yScale(d[1]);
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.max = function(_) {
    if (!arguments.length) return max;
    max = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  return chart;
}
