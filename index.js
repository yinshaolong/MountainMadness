function handleMouseEnter(e, d) {
    const classes = e.target.classList;
    console.log(e.clientX, e.clientY);
    console.log(d)

    const tooltip = d3.select('#tooltip')
    .attr('display', true)
    .html(`<strong>Title: ${d.title}</strong><br>
    Author(s): ${d.authors}<br>
    Date Written: ${d.date.year_label}<br>
    Number of Translationed Languages: ${d.num_translations}<br>
    Original Language(s): ${d.original_language}<br>
`)
    .style('top', `${e.clientY}px`)
    .style('background', `white`)
    .style('border-width', `2px`)
    .style('border-style', `solid`)
    .style('left', `${e.clientX}px`)
    .style('position', `fixed`)
    console.log(tooltip);    
}

function handleMouseLeave(e) {
    console.log("test leaving")
    d3.select('#tooltip')
        .attr('display', false)
        .style('border-width', `0px`)
        .html('')
}

function parse_num_translated(string){
    if (isNaN(string)) {
        let num_as_strs = string.match(/([0-9]*(,[0-9]+)*)/g);
        num_as_strs = num_as_strs.filter((str) => str !== "");
        let first_num = num_as_strs[0].replace(",", "")

        return parseInt(first_num);
    } else {
        return parseInt(string);
    }
}

function parse_year_start(string){
    let indexOfDash = string.indexOf("–");
    string = indexOfDash > -1? string.slice(0, indexOfDash) : string;

    if (!isNaN(string)) {
        return {
            start_year: parseInt(string),
            year_label: string
        }
    } else {
        return {
            start_year: 0,
            year_label: string
        }
    }
}
const svg = d3.select(".canvas")
  .append("svg")
    .attr("width", 600)
    .attr("height", 600)
    //create margins and dimensions
const margin = {top: 20, right: 20, bottom: 100, left: 100};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg.append("g")
    .attr("width", graphWidth)
    .attr("height", graphHeight)
    .attr('transform', `translate(${margin.left},${margin.top})`);
const xAxisGroup = graph.append("g")
   .attr("transform", `translate(0,${graphHeight})`);
const yAxisGroup = graph.append('g');

d3.csv("books_for_hackathon.csv", function(d){
    return {
    title: d.Title,
    authors: d.Authors,
    date: parse_year_start(d.Date),
    num_translations: parse_num_translated(d['Number of Translations']),
    original_language: d['Original Language']
}}).then(data => {
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.num_translations)])
        .range([graphHeight, 0]);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.date.start_year)])
        .range([0, graphWidth]);    

    const rects = graph.selectAll("rect")
        .data(data)


    // const tip = d3.tip()
    // .attr('class', 'tip card')
    // .html(d => {
    //     return `<p>Hello there</p>`
    // })

    // graph.call(tip)

    rects.attr('width', 30)
    .attr("height", d => graphHeight - y(d.num_translations))
    .attr("fill", "steelblue")
    .attr('x', d => x(d.date.start_year) + 20)
    .attr('y', d => y(d.num_translations))
    .on('mouseenter', e => handleMouseEnter(e))
    .on('mouseleave', e => handleMouseLeave(e))

    rects.enter()
        .append('rect')
            .attr('width', 30)
            .attr("height", d => graphHeight - y(d.num_translations))
            .attr("fill", "steelblue")
            .attr('x', d => x(d.date.start_year) + 20)
            .attr('y', d => y(d.num_translations))
            .attr('class', d => d.date.year_label)
            .on('mouseenter', (e, d) => handleMouseEnter(e, d))
            .on('mouseleave', e => handleMouseLeave(e))


    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
    console.log(data)
})
