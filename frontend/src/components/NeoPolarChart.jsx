// src/components/NeoPolarChart.jsx
import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function NeoPolarChart({
  data = [],
  onSelect,
  width = 500,
  height = 500,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3
      .select(ref.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .classed("neo-chart", true);

    svg.selectAll("*").remove(); // clear

    const R = Math.min(width, height) / 2 - 40;
    const centerX = width / 2;
    const centerY = height / 2;
    const g = svg
      .append("g")
      .attr("transform", `translate(${centerX},${centerY})`);

    // extract extents
    const missKm = d3.extent(
      data,
      (d) => +d.close_approach_data[0].miss_distance.kilometers
    );
    const speedKm = d3.extent(
      data,
      (d) => +d.close_approach_data[0].relative_velocity.kilometers_per_hour
    );
    const diamM = d3.extent(
      data,
      (d) => d.estimated_diameter.meters.estimated_diameter_max
    );

    // scales
    const rScale = d3.scaleLinear().domain(missKm).range([40, R]);
    const size = d3.scaleSqrt().domain(diamM).range([4, 20]);
    const color = d3
      .scaleSequential()
      .domain(speedKm.reverse()) // so slow=dark, fast=bright
      .interpolator(d3.interpolateTurbo);

    // SVG FILTER FOR GLOW
    const defs = svg.append("defs");
    const glow = defs
      .append("filter")
      .attr("id", "glow")
      .attr("height", "300%");
    glow
      .append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur");
    const feMerge = glow.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // 1) radial grid rings
    const rings = 5;
    const ringG = g.append("g").attr("class", "grid-rings");
    for (let i = 1; i <= rings; i++) {
      ringG
        .append("circle")
        .attr("r", (R / rings) * i)
        .attr("fill", "none")
        .attr("stroke", "rgba(255,255,255,0.1)")
        .attr("stroke-dasharray", "4 4");
    }

    // 2) Earth at center with glow
    g.append("circle")
      .attr("r", 12)
      .attr("fill", "#3b82f6")
      .attr("filter", "url(#glow)");

    // 3) plot NEOs
    const angleStep = (2 * Math.PI) / data.length;
    const dots = g
      .selectAll("circle.neo")
      .data(data)
      .join("circle")
      .attr("class", "neo")
      .attr("cx", (_, i) =>
        rScale(+data[i].close_approach_data[0].miss_distance.kilometers) *
        Math.cos(i * angleStep)
      )
      .attr("cy", (_, i) =>
        rScale(+data[i].close_approach_data[0].miss_distance.kilometers) *
        Math.sin(i * angleStep)
      )
      .attr("r", 0) // start small
      .attr("fill", (d) =>
        color(+d.close_approach_data[0].relative_velocity.kilometers_per_hour)
      )
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.3)
      .style("cursor", "pointer")
      .on("mouseenter", (e, d) => {
        d3.select(e.currentTarget).transition().attr("stroke-width", 1.5);
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.name}</strong><br/>
             Speed: ${Math.round(
               +d.close_approach_data[0].relative_velocity.kilometers_per_hour
             )} km/h`
          )
          .style("left", e.pageX + 10 + "px")
          .style("top", e.pageY - 28 + "px");
      })
      .on("mouseleave", (e) => {
        d3.select(e.currentTarget).transition().attr("stroke-width", 0.3);
        tooltip.style("opacity", 0);
      })
      .on("click", (_, d) => onSelect?.(d));

    // dot entry animation
    dots
      .transition()
      .duration(800)
      .delay((_, i) => i * 20)
      .attr("r", (d) => size(d.estimated_diameter.meters.estimated_diameter_max));

    // 4) gradient legend
    const legendW = 200,
      legendH = 8;
    const legendG = svg
      .append("g")
      .attr("transform", `translate(${width / 2 - legendW / 2},${height - 20})`);

    // define linear gradient
    const lg = defs
      .append("linearGradient")
      .attr("id", "speed-gradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");
    // create stops
    d3.range(0, 1.01, 0.1).forEach((t) => {
      lg
        .append("stop")
        .attr("offset", `${t * 100}%`)
        .attr("stop-color", color(speedKm[0] + t * (speedKm[1] - speedKm[0])));
    });

    legendG
      .append("rect")
      .attr("width", legendW)
      .attr("height", legendH)
      .style("fill", "url(#speed-gradient)")
      .style("stroke", "rgba(255,255,255,0.2)")
      .style("stroke-width", 0.5)
      .style("rx", 4);

    legendG
      .append("text")
      .attr("x", 0)
      .attr("y", -4)
      .attr("fill", "#bbb")
      .attr("font-size", "0.7rem")
      .text("slow");

    legendG
      .append("text")
      .attr("x", legendW)
      .attr("y", -4)
      .attr("fill", "#bbb")
      .attr("font-size", "0.7rem")
      .attr("text-anchor", "end")
      .text("fast");

    // 5) tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "neo-tip")
      .style("opacity", 0);

    return () => {
      tooltip.remove();
    };
  }, [data, width, height, onSelect]);

  return <svg ref={ref} className="select-none bg-transparent" />;
}
