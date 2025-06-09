import * as d3 from 'd3';
import * as dc from 'dc';

dc.constants.DEFAULT_DURATION = 1000;
export class SegmentedRingChart extends dc.ColorMixin(dc.BaseMixin) {
    constructor(parent, group) {
        super();
        this._segmentedRingCssClass = "segmented-ring-chart";
        this._g = undefined;
        this.colorAccessor(d => this.keyAccessor(d));
        this.title(d => `${this.keyAccessor(d)} : ${this.valueAccessor(d)}`);
        this.anchor(parent, group);
        this.translate = 0;
        this.customOrderFunction = undefined;
        this.extraDetails = [];
        this.resumeExtraDetails = [];
        this.unit = "";
    }

    getInitParams (){
        return {
            spaceBetweenArcAndCircle: 8,
            circleRadius: 50,
            arcWidth: 24,
            smallCircleRadius: 18
        };
    }

    _calcSegmentedRings (data){
        let chart = this;
        let ha = chart._height;
        let wa = chart._width;
        let cumul = 0;
        let ocupedSpace = 0;
        const { spaceBetweenArcAndCircle, circleRadius, arcWidth, smallCircleRadius } = chart.getInitParams();

        data.forEach(
            function (d,i){
                d.timeout = i*300;
                d.x = cumul;
                d.center = {
                    x: circleRadius + spaceBetweenArcAndCircle + arcWidth,
                    y: ha/2,
                };
                
                d.circle = {
                    radius: circleRadius,
                    filter: {
                        dx: "0",
                        dy: i % 2 == 0 ? "2" : "-2",
                        stdDeviation: "5"
                    }
                };

                d.smallCircle = {
                    radius: smallCircleRadius,
                    index: i + 1,
                    x: d.center.x,
                    y: d.center.y + ((circleRadius + spaceBetweenArcAndCircle + arcWidth/2))*(i % 2 == 0 ? -1 : 1)
                }

                d.arc = {
                    startAngle:  (1.5* Math.PI), 
                    endAngle: i % 2 == 0 ? (2.5*Math.PI) : (0.5*Math.PI),
                    outer: {
                        outerRadius: circleRadius + spaceBetweenArcAndCircle + arcWidth,
                        innerRadius: circleRadius + spaceBetweenArcAndCircle + arcWidth/2,
                        darkColor: i % 2 == 0 ? "0.5" : "0"
                    },
                    inner: {
                        outerRadius: circleRadius + spaceBetweenArcAndCircle + arcWidth/2,
                        innerRadius: circleRadius + spaceBetweenArcAndCircle,
                        darkColor: i % 2 == 0 ? "0" : "0.5"
                    }
                }

                d.label = {
                    x: d.center.x,
                    y: d.center.y + ((circleRadius + spaceBetweenArcAndCircle + arcWidth/2))*(i % 2 == 0 ? 1 : -1),
                    orientation:  i % 2 == 0 ? 1 : -1,
                }

                cumul += 2*(circleRadius + spaceBetweenArcAndCircle) + arcWidth;
                ocupedSpace += 2*(circleRadius + spaceBetweenArcAndCircle + arcWidth);
            }
        );
        return {ocupedSpace, cumul};
    }

    _calcResume (data, cumul, ocupedSpace){
        let chart = this
        let ha = chart._height;
        let wa = chart._width;
        const itemNumber  = data.length;
        const { spaceBetweenArcAndCircle, circleRadius, arcWidth} = chart.getInitParams();
        const center = {
            x: circleRadius + spaceBetweenArcAndCircle + arcWidth,
            y: ha/2,
        };

        let obj = [{
            timeout: itemNumber*300,
            x: cumul,
            center: center,
            arc: {
                startAngle:  (1.5* Math.PI), 
                endAngle: itemNumber % 2 == 0 ? (2*Math.PI) : (1*Math.PI),
                radius: (circleRadius + spaceBetweenArcAndCircle) + arcWidth/2,
                width: arcWidth
            },
            label: {
                x: 1.25*center.x,
                y: center.y + (circleRadius/2)*(itemNumber % 2 == 0 ? -1 : 1),
                orientation:  itemNumber % 2 == 0 ? 1 : -1,
            }
        }];

        const totalSpace = ocupedSpace + 2*(circleRadius + spaceBetweenArcAndCircle + arcWidth);
        this.translate = (wa - totalSpace) / 2;
        return obj;
    }


    _drawChart() {
        let chart = this;
        let data;
        if (this.customOrderFunction != undefined){
            data = chart.group().top(Infinity).sort(this.customOrderFunction)
        }else{
            data = chart.group().top(Infinity)
        }

        let {cumul, ocupedSpace} = chart._calcSegmentedRings(data);
        let resumeData = chart._calcResume(data, cumul, ocupedSpace);

        d3.select(".segmented-rings-group")
            .attr("transform", `translate(${this.translate > 0 ? this.translate : 0}, 0)`);

        chart._g.selectAll("." + chart._segmentedRingCssClass)
            .data(chart.data())
            .join(
                enter => {
                    let g = enter.append("g")
                        .attr("class", chart._segmentedRingCssClass)
                        .attr("transform",  d => "translate(" + d.x + ", 0)")
                        .on("click", function (e, d) {
                            chart.onClick(d);
                        })
                        .style("cursor", "pointer");

                    /****************************** CIRCULO PRINCIPAL *****************************/
                    g.append("defs")
                        .append("filter")  
                        .attr("id", (d, i) => "shadow_" + i)
                        .append("feDropShadow")  
                        .attr("dx", d => d.circle.filter.dx)
                        .attr("dy",d => d.circle.filter.dy)
                        .attr("stdDeviation", d => d.circle.filter.stdDesviation)
                        .attr("flood-color", "#000") 
                        .attr("flood-opacity", 0.5);

                    g.append("circle")
                        .style("fill", (d, i) => chart.getColor(d, i))
                        .attr("filter",  (d, i)=> "url(#shadow_" + i  + ")")
                        .attr("r", d => d.circle.radius)
                        .attr("transform", d => `translate(${d.center.x},${d.center.y})`);

                    /************************************ ARCO ************************************/
                    /******************************* ANILLO EXTERNO *******************************/
                    g.append("g")
                        .append("path")
                        .attr("class", 'chart-outer-arc')
                        .attr("d", (d, i) => {
                            let arc =  d3.arc().innerRadius(d.arc.outer.innerRadius).outerRadius(d.arc.outer.outerRadius).startAngle(0).endAngle(0)
                            return arc()
                        })
                        .attr("fill", (d, i) => d3.color(chart.getColor(d, i)).darker(d.arc.outer.darkColor))
                        .attr("transform", d => `translate(${d.center.x},${d.center.y})`)
                        .transition()
                        .duration(dc.constants.DEFAULT_DURATION)
                        .delay( d => d.timeout )
                        .attrTween('d', function(d) {
                            let arc = d3.arc().outerRadius(d.arc.outer.outerRadius).innerRadius(d.arc.outer.innerRadius);
                            let start = {startAngle: d.arc.startAngle, endAngle: d.arc.startAngle};
                            let interpolate = d3.interpolate(start, {startAngle: d.arc.startAngle, endAngle: d.arc.endAngle} );
                            return function (t) {
                                return arc(interpolate(t));
                            };
                          });

                    /******************************* ANILLO INTERNO *******************************/
                    g.append("g")
                        .append("path")
                        .attr("class", 'chart-inner-arc')
                        .attr("d", (d, i) => {
                            let arc =  d3.arc().innerRadius(d.arc.inner.innerRadius).outerRadius(d.arc.inner.outerRadius).startAngle(0).endAngle(0)
                            return arc()
                        })
                        .attr("fill", (d, i) => d3.color(chart.getColor(d, i)).darker(d.arc.inner.darkColor))
                        .attr("transform", d => `translate(${d.center.x},${d.center.y})`)
                        .transition()
                        .duration(dc.constants.DEFAULT_DURATION)
                        .delay( d => d.timeout )
                        .attrTween('d', function(d) {
                            let arc = d3.arc().outerRadius(d.arc.inner.outerRadius).innerRadius(d.arc.inner.innerRadius);
                            let start = {startAngle: d.arc.startAngle, endAngle: d.arc.startAngle};
                            let interpolate = d3.interpolate(start, {startAngle: d.arc.startAngle, endAngle: d.arc.endAngle} );
                            return function (t) {
                                return arc(interpolate(t));
                            };
                          });

                    /******************************* CIRCULO PEQUEÑO ******************************/
                    g.append("circle")
                        .style("fill", (d, i) => chart.getColor(d, i))
                        .attr("r", d => d.smallCircle.radius)
                        .attr("transform", d => `translate(${d.smallCircle.x},${d.smallCircle.y})`)
                        .style("stroke", "white")        
                        .style("stroke-width", 3);

                    /*********************** INDEX EN EL CIRCULO PEQUEÑO **************************/
                    g.append("g")
                        .attr("transform", d => `translate(${d.smallCircle.x},${d.smallCircle.y})`)
                        .append("text")
                        .text((d, i) => d.smallCircle.index)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", 'middle')
                        .attr("fill", "#fff")
                        .style("font-size", "14pt") 
                        .style("font-weight", "700")  

                    /********************* TEXTO PARA EL VALOR DE PROGRESO ************************/
                    const progressValue = g.append("g")
                            .attr('class', 'progress-value')
                            .attr('transform', d => `translate(${d.center.x},${d.center.y})`)
                            .append("text")
                            .attr("text-anchor", "middle")
                            .attr("dominant-baseline", 'middle')
                            .attr("fill", "#fff");
                                
                    progressValue
                        .append("tspan")
                        .text(d => chart._valueAccessor(d))
                        .style("font-size", "18pt")
                        .style("font-weight", "700")
                        .transition() 
                        .duration(dc.constants.DEFAULT_DURATION)
                        .tween("text", function(d) {
                            let i = d3.interpolateNumber(0, chart._valueAccessor(d)); 
                            return function(t) {
                                d3.select(this).text(Math.round(i(t)*10)/10);
                            };
                        });

                    progressValue
                        .append("tspan")
                        .text(this.unit)
                        .style("font-size", "14pt");

                    /****************** TEXTO PARA LA ETIQUETA DEL PROGRESO *********************/    

                    const label = g.append("g")
                        .attr('class', 'chart-label')
                        .attr('transform', d => `translate(${d.label.x},${d.label.y})`)
                        .append("text")
                            .attr("text-anchor", "middle")
                            .attr("dominant-baseline", "middle")
                            .attr("fill", "#aaa")
                            .style("font-size", "8pt")    

                    label.append("tspan")
                        .text(d => chart._keyAccessor(d))
                        .attr("class", "text-950")
                        .style("font-weight", "700");

                    label.selectAll(".chart-extra-label")
                        .data((d, i) => {
                            return chart.extraDetails?.[i]?.map(e => ({ ...e, ...d.label })) || [];
                        })
                        .enter()
                        .append("tspan")
                        .attr("fill", d => d.hexColor)
                        .html((d, i) => `<tspan>${d.label}: </tspan><tspan>${d.value}</tspan>`)
                        .attr("x", 0)
                        .attr("dy", (d, i) => `${(d.orientation)*1.2}em`);

                    g.append("title")
                        .text(d => `${chart._keyAccessor(d)} : ${chart._valueAccessor(d)}`);
                }
            );

        chart._g.selectAll(".resume-chart")
            .data(resumeData)
            .join(
                enter => {
                    /******************************* DEGRADADO A SER USADO EN EL ARCO *****************************/
                    let g = enter.append("g")
                        .attr("class", 'resume-chart')
                        .attr("transform",  d => "translate(" + d.x + ", 0)");

                    const defs = g.append("defs");
                    const gradient = defs.append("linearGradient")
                        .attr("id", "arcGradientLinear")
                        .attr("gradientUnits", "userSpaceOnUse")
                        .attr("x1", -100).attr("y1", 0)
                        .attr("x2", 100).attr("y2", 0);
                    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#fff");
                    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#000");

                    /********************************************* ARCO *******************************************/
                    g.append("g")
                        .append("path")
                        .attr("class", 'resume-chart-arc')
                        .attr("d", (d, i) => {
                            let arc = d3.arc()
                                .innerRadius(d.arc.radius)
                                .outerRadius(d.arc.radius)
                                .startAngle(0)
                                .endAngle(0);
                            return arc();
                        })
                        .attr("fill", "none") 
                        .attr("stroke", "url(#arcGradientLinear)") 
                        .attr("stroke-width", d => d.arc.width) 
                        .attr("transform", d => `translate(${d.center.x},${d.center.y})`)
                        .transition()
                        .duration(dc.constants.DEFAULT_DURATION)
                        .delay(d => d.timeout)
                        .attrTween('d', function (d) {
                            let arc = d3.arc()
                                .outerRadius(d.arc.radius)
                                .innerRadius(d.arc.radius);
                            let start = { startAngle: d.arc.startAngle, endAngle: d.arc.startAngle };
                            let interpolate = d3.interpolate(start, { startAngle: d.arc.startAngle, endAngle: d.arc.endAngle });

                            return function (t) {
                                return arc(interpolate(t));
                            };
                        });
                    
                    /***************************************** TEXTO RESUMEN **************************************/
                    const label = g.append("g")
                        .attr('class', 'resume-chart-label')
                        .attr('transform', d => `translate(${d.label.x},${d.label.y})`)
                        .append("text")
                            .attr("text-anchor", "middle")
                            .attr("dominant-baseline", "middle")
                            .attr("fill", "#aaa")
                            .style("font-size", "9pt")    

                    label.append("tspan")
                        .text("RESULT")
                        .style("font-size", "12pt")  
                        .attr("fill", "#5B9BD5")
                        .style("font-weight", "900");

                    label.selectAll(".resume-chart-extra-label")
                        .data((d, i) => {
                            return chart.resumeExtraDetails.map( e => ({...e, ...d.label}));
                        })
                        .enter()
                        .append("tspan")
                        .attr("fill", d => d.hexColor)
                        .html((d, i) => `<tspan>${d.label}: </tspan><tspan>${d.value}</tspan>`)
                        .attr("x", 0)
                        .attr("dy", (d, i) => `${(d.orientation)*1.2}em`);
                    g.append("title")
                        .text("Resumen");
                }
            );
    }

    _doRender() {
        this.resetSvg();
        this._g = this.svg().append("g").attr("class", "segmented-rings-group");
        this._drawChart();
    }

    _doRedraw() {
        this._drawChart();
    }

    _isSelectedSlice(d) {
        return this.hasFilter(this._keyAccessor(d));
    }

    order(customOrderFunction) {
        this.customOrderFunction = customOrderFunction;
        return this
    }

    details(extraDetails) {
        this.extraDetails = extraDetails;
        return this;
    }

    resume(resumeExtraDetails) {
        this.resumeExtraDetails = resumeExtraDetails;
        return this;
    }
};

