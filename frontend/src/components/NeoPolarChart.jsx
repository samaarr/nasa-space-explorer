import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function NeoPolarChart({
  data = [],
  onSelect,
  earthImg = null,
  width = 480,
  height = 480,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!data.length) return;

    /* -------- scaffold -------- */
    const R = Math.min(width, height) / 2 - 40;
    const earthSize = earthImg ? 80 : 20;
    const earthRadius = earthSize / 2;
    const padding = 50;
    const dotRadius = 6; // constant dot size
    const siFormat = d3.format(".2s");

    const svg = d3
      .select(ref.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();
    const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

    /* -------- scales -------- */
    const missKmExtent = d3.extent(data, (d) => +d.close_approach_data[0].miss_distance.kilometers);
    const speedKmExtent = d3.extent(data, (d) => +d.close_approach_data[0].relative_velocity.kilometers_per_hour);
    const rScale = d3
      .scaleLinear()
      .domain(missKmExtent)
      .range([earthRadius + padding, R]);
    // color scale based on speed
    const color = d3.scaleLinear()
      .domain(speedKmExtent)
      .range(["#2196f3", "#e63946"]);

    /* -------- defs: gradient, glow filter -------- */
    const defs = svg.append("defs");
    // speed gradient
    const grad = defs
      .append("linearGradient")
      .attr("id", "speedGrad")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");
    grad.append("stop").attr("offset", "0%").attr("stop-color", "#2196f3");
    grad.append("stop").attr("offset", "100%").attr("stop-color", "#e63946");
    // glow filter for NEO dots
    const glow = defs.append("filter").attr("id", "glow");
    glow.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    const feMerge = glow.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    /* -------- tooltip helper -------- */
    const tip = (() => {
      const el = d3
        .select("body")
        .append("div")
        .style("position", "fixed")
        .style("padding", "2px 6px")
        .style("fontSize", ".75rem")
        .style("background", "rgba(0,0,0,.8)")
        .style("color", "#fff")
        .style("borderRadius", "3px")
        .style("pointerEvents", "none")
        .style("opacity", 0);
      return {
        show(ev, txt) {
          el.text(txt)
            .style("opacity", 1)
            .style("left", ev.pageX + 8 + "px")
            .style("top", ev.pageY - 8 + "px");
        },
        hide() {
          el.style("opacity", 0);
        },
        remove() {
          el.remove();
        },
      };
    })();

    /* -------- Earth (centre) -------- */
    if (earthImg) {
      g.append("image")
        .attr("href", earthImg)
        .attr("x", -earthRadius)
        .attr("y", -earthRadius)
        .attr("width", earthSize)
        .attr("height", earthSize)
        .attr("clip-path", `circle(${earthRadius}px)`);
    } else {
      g.append("circle").attr("r", earthRadius).attr("fill", "#3b82f6");
    }

    /* -------- orbit lines & labels -------- */
    const tickCount = 5;
    const distanceScale = d3.scaleLinear().domain(missKmExtent);
    const ticks = distanceScale.nice().ticks(tickCount);
    const orbits = g.append("g").attr("class", "orbits");

    orbits
      .selectAll("circle.orbit")
      .data(ticks.filter((d) => d > missKmExtent[0]))
      .join("circle")
      .attr("class", "orbit")
      .attr("r", (d) => rScale(d))
      .attr("fill", "none")
      .attr("stroke", "#888")
      .attr("stroke-dasharray", "2,2");

    orbits
      .selectAll("text.orbit-label")
      .data(ticks.filter((d) => d > missKmExtent[0]))
      .join("text")
      .attr("class", "orbit-label")
      .attr("y", (d) => rScale(d) + 10)
      .attr("x", 0)
      .attr("dy", "0.35em")
      .attr("fill", "#bbb")
      .attr("fontSize", ".6rem")
      .text(d => `${siFormat(d).toUpperCase()} km`);

    /* -------- NEO dots with hover labels -------- */
    const angleStep = (2 * Math.PI) / data.length;
    const labelsGroup = g.append("g").attr("class", "hover-labels");

    g.selectAll("circle.neo")
      .data(data)
      .join("circle")
      .attr("class", "neo")
      .attr("cx", (d, i) => rScale(+d.close_approach_data[0].miss_distance.kilometers) * Math.cos(i * angleStep))
      .attr("cy", (d, i) => rScale(+d.close_approach_data[0].miss_distance.kilometers) * Math.sin(i * angleStep))
      .attr("r", dotRadius)
      .attr("fill", (d) => color(+d.close_approach_data[0].relative_velocity.kilometers_per_hour))
      .attr("filter", "url(#glow)")
      .attr("opacity", 0)
      .style("cursor", "pointer")
      .on("mouseenter", function (ev, d) {
        const idx = data.indexOf(d);
        const x = rScale(+d.close_approach_data[0].miss_distance.kilometers) * Math.cos(idx * angleStep);
        const y = rScale(+d.close_approach_data[0].miss_distance.kilometers) * Math.sin(idx * angleStep);
        labelsGroup
          .append("text")
          .attr("class", "hover-label")
          .attr("x", x + (x > 0 ? dotRadius + 4 : -dotRadius - 4))
          .attr("y", y)
          .attr("dy", "0.35em")
          .attr("text-anchor", x > 0 ? "start" : "end")
          .attr("fill", "#fff")
          .attr("fontSize", ".75rem")
          .text(d.name);
      })
      .on("mouseleave", () => {
        labelsGroup.selectAll("text.hover-label").remove();
      })
      .on("click", (_, d) => onSelect?.(d))
      .transition()
      .duration(800)
      .delay((_, i) => i * 20)
      .attr("opacity", 1);

    /* -------- speed legend (blue → red) -------- */
    const legendW = 500,
      legendH = 4;
    svg
      .append("rect")
      .attr("x", width / 2 - legendW / 2 )
      .attr("y", height - 5)
      .attr("width", legendW)
      .attr("height", legendH)
      .attr("fill", "url(#speedGrad)")
      .attr("stroke", "rgba(255,255,255,.25)")
      .attr("stroke-width", 0.4)
      .attr("rx", 4);

    svg
      .append("text")
      .attr("x", width / 2 - legendW / 2)
      .attr("y", height - 10)
      .attr("fill", "#bbb")
      .attr("fontSize", ".7rem")
      .text("slow");

    svg
      .append("text")
      .attr("x", width / 2 + legendW / 2 - 30)
      .attr("y", height - 10)
      .attr("fill", "#bbb")
      .attr("fontSize", ".7rem")
      .attr("textAnchor", "end")
      .text("fast");

    return () => tip.remove();
  }, [data, width, height, earthImg, onSelect]);

  return <svg ref={ref} className="select-none" />;
}
