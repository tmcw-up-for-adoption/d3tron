function eventsRadial() {

    var hours = d3.range(24),
        d2r = 180 / Math.PI;

    var width = 960,
        height = 500,
        innerRadius = Math.min(width, height) * 0.25,
        outerRadius = innerRadius * 1.1;

    var hrScale = d3.scale.linear()
        .domain([d3.time.day(new Date()), d3.time.day.offset(d3.time.day(new Date()),1)])
        .range([-Math.PI/2, (Math.PI * 2) - (Math.PI/2)]);

    var fill = d3.scale.ordinal()
        .domain(d3.range(4))
        .range(['#1695d0', '#70f2fe', '#0d417d']);

    function chart(selection) {
        selection.each(function(data) {

            var svg = selection.select('svg').data([data]);

            var svgEnter = svg.enter().append('svg')
                .attr('width', width)
                .attr('height', height)
              .append('g');

            var g = svg.select('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

            svgEnter.append('g').selectAll('path.rim')
                .data([{startAngle: 0, endAngle: Math.PI * 2 }])
              .enter().append('path')
                .attr('class', 'rim')
                .attr('d', d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius));

            svgEnter.append('g').selectAll('circle.hr')
                .data(hours)
              .enter().append('circle')
                .attr('r', 1)
                .attr('class', 'hr')
                .attr('transform', function(d) {
                    return 'translate(' + [Math.cos(d / 12 * Math.PI) * outerRadius, Math.sin(d / 12 * Math.PI) * outerRadius] + ')';
                });

            svgEnter.append('g').selectAll('circle.hr-inner')
                .data(hours)
                .enter().append('circle')
                .attr('r', 2)
                .attr('class', 'hr-inner')
                .attr('transform', function(d) {
                    return 'translate(' + [Math.cos(d / 12 * Math.PI) * innerRadius, Math.sin(d / 12 * Math.PI) * innerRadius] + ')';
                });

            // TICKS ---------------------------------------------
            var ticks = svgEnter.append('g').selectAll('g')
                .data(hours.map(function(hr) {
                    return { hour: hr, angle: hr / 12 * Math.PI };
                }))
                .enter().append('g')
                .attr('transform', function(d) {
                    return 'rotate(' + (d.angle * 180 / Math.PI - 90) + ')translate(' + outerRadius + ',0)';
                });
            ticks.append('text')
                .attr('class', 'hr-label')
                .attr('x', 8)
                .attr('dy', '.35em')
                .attr('transform', function(d) { return d.angle > Math.PI ? 'rotate(180)translate(-16)' : null; })
                .style('text-anchor', function(d) { return d.angle > Math.PI ? 'end' : null; })
                .text(function(d) { return d.hour; });

            // NOW BEACON ---------------------------------------------
            var nowEnter = svgEnter.append('g')
                .attr('class', 'now-beacon');
            nowEnter.append('rect')
                .attr('class', 'beacon')
                .attr('transform', 'translate(' + [0,0] + ')')
                .attr('width', innerRadius / 2)
                .attr('height', 1);
            nowEnter.append('text')
              .attr('class', 'beacon-text')
              .style('text-baseline', 'middle')
              .attr('transform', 'translate(' + [innerRadius / 2 + 5, 0] + ')');
            var now = g.select('g.now-beacon')
                .datum(new Date());
            now.datum(new Date());
            now.attr('transform', function(d) {
                return 'rotate(' + (hrScale(d) * d2r) + ')';
            });
            now.select('text').text(d3.time.format('%X'));

            // EVENTS ------------------------------------------------
            var gEvent = g.append('g').selectAll('g.event')
                .data(((data && data.events) || []).map(function(d) {
                    d.angle = hrScale(d.date);
                    return d;
                }), function(d) {
                    return d.id;
                });
            gEvent.exit().remove();
            var gEnter = gEvent.enter().append('g')
                .attr('class', 'event')
                .attr('transform', function(d) {
                    return 'rotate(' + (d.angle * 180 / Math.PI - 90) + ')translate(' + (outerRadius + 45) + ',0)';
                });
            gEnter.append('circle')
                .attr('r', 2)
                .attr('transform', function(d) {
                    return 'translate(' + (-10) + ',0)';
                });
            gEnter.append('text')
                .attr('dy', '.35em')
                .attr('transform', function(d) { return d.angle > Math.PI ? 'rotate(180)translate(-16)' : null; })
                .style('text-anchor', function(d) { return d.angle > Math.PI ? 'end' : null; })
                .text(function(d) {
                    return d.name;
                });
        });
    }

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

    return chart;
}
