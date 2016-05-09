import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Data extends Component {
    constructor(props) {
        super(props);

        this.state = props;
    }
    componentDidMount()
    {
        var el = ReactDOM.findDOMNode(this);

        var $team_red = $(el).find('.red'),
            $team_blue = $(el).find('.blue');

        create($team_red[0], {
            width: '100%',
            height: '100%'
        }, this.getChartState('red'));

        create($team_blue[0], {
            width: '100%',
            height: '100%'
        }, this.getChartState('blue'));
    }

    componentDidUpdate()
    {
        var el = ReactDOM.findDOMNode(this);

        var $team_red = $(el).find('.red'),
            $team_blue = $(el).find('.blue');

        update($team_red[0], this.getChartState('red'));
        update($team_blue[0], this.getChartState('blue'));
    }

    getChartState(team)
    {
        return {
            data: this.props.team[team].data,
            domain: this.props.domain
        };
    }

    componentWillUnmount()
    {
        var el = ReactDOM.findDOMNode(this);

        var $team_red = $(el).find('.red'),
               $team_blue = $(el).find('.blue');

        destroy($team_red[0]);
        destroy($team_blue[0]);
    }

    render() {
        let t = (this.props.team.red.score + this.props.team.blue.score) / 100,
            w_red = 2,
            w_blue = 2;

        if(this.props.team.red.score && this.props.team.blue.score)
        {
            w_red = t / this.props.team.red.score * 100;
            w_blue = t / this.props.team.blue.score * 100;
        }
        
        let team_red = {
            width: 100 / w_red + "vw"
        };

        let team_blue = {
            width: 100 / w_blue + "vw"
        };

        return (
            <div className="Chart">
                <div className="red" style={team_red}>
                    <p>{Math.round(100 / w_red)}%</p>
                </div>
                <div className="blue" style={team_blue}>
                    <p>{Math.round(100 / w_blue)}%</p>
                </div>
            </div>
        );
    };
}

function create(el, props, state)
{
    var svg = d3.select(el).append('svg')
        .attr('class', 'd3')
        .attr('width', props.width)
        .attr('height', props.height);

    svg.append('g')
        .attr('class', 'd3-points');

    update(el, state);
}

function update(el, state)
{
    // Re-compute the scales, and render the data points
    setTimeout(function()
    {
        var scales = calcScales(el, state.domain);
        destroy(el);
        drawPoints(el, scales, state.data);
    }, 1500);
}

function destroy(el) {
        d3.select(el).selectAll('.d3-point')
                .remove();
}

// d3Chart.js
function drawPoints(el, scales, data) {
    var g = d3.select(el).selectAll('.d3-points');

    var point = g.selectAll('.d3-point')
        .data(data, function(d) { return d.id; });

    // ENTER
    point.enter().append('circle-container')
        .attr('class', 'd3-point');

    /*Create and place the "blocks" containing the circle and the text */
    var elemEnter = point.enter()
        .append("g")
        .attr('class', 'd3-point')
        .attr("transform", function(d){return "translate(0,0)"})

    /*Create the circle for each block */
    var circle = elemEnter.append("circle")
        .attr('class', 'circle')
        .attr("r", function(d){return d.y} )
        .style("fill", function(d) {return d.color})
        .attr('cx', function(d) { return scales.x(d.x); })
        .attr('cy', function(d) { return scales.y(d.y); })
        .attr('r', 0)

    elemEnter
        .on("mouseover", function() {
            d3.select(this).select(".circle").transition()
                .duration(200)
                .ease("linear")
                .attr("r", function(d) {return  scales.z(d.z) * 1.2;})})
        .on("mouseout", function() {
            d3.select(this).select(".circle").transition()
                .duration(200)
                .ease("linear")
                .attr("r", function(d) {return scales.z(d.z);})})

    /* Create the text for each block */
    elemEnter.append("text")
        .attr('x', function(d) { return scales.x(d.x); })
        .attr('y', function(d) { return scales.y(d.y) - 20; })
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text(function(d){return d.text})


    elemEnter.append("text")
        .attr('x', function(d) { return scales.x(d.x); })
        .attr('y', function(d) { return scales.y(d.y) + 20; })
        .style("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "30px")
        .style("font-weight", "bold")
        .text(function(d){return d.value});

    point.transition()
        .duration(750)
        .ease("linear")
        .style("opacity", 1)
        .each(function() {
            d3.selectAll(".circle").transition()
                .attr('r', function(d) { return scales.z(d.z); })
        });

    point.exit()
        .remove();
};

function calcScales(el, domain) {
    if (!domain) {
        return null;
    }

    var width = el.offsetWidth;
    var height = el.offsetHeight;

    var x = d3.scale.linear()
        .range([0, width])
        .domain(domain.x);

    var y = d3.scale.linear()
        .range([height, 0])
        .domain(domain.y);

    var z = d3.scale.linear()
        .range([5, 20])
        .domain([1, 10]);

    return {x: x, y: y, z: z};
};