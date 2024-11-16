import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const CO2FuelEfficiencyGraph = ({ data }) => {
  const [animatedData, setAnimatedData] = useState([]);
  const [layout, setLayout] = useState({
    title: {
      text: 'CO₂ Emissions vs Fuel Efficiency',
      font: { size: 20 },
    },
    xaxis: {
      title: 'CO₂ Emissions (g/km)',
      titlefont: { size: 16 },
      tickfont: { size: 12 },
    },
    yaxis: {
      title: 'Fuel Efficiency (km/l)',
      titlefont: { size: 16 },
      tickfont: { size: 12 },
    },
    autosize: true,
    width: 450, // Adjust width as needed
    height: 286, // Set a smaller height for a balanced look
    showlegend: false,
    plot_bgcolor: '#f7f7f7',
    paper_bgcolor: '#ffffff',
    hovermode: 'closest',
    shapes: [],
  });

  // Gradually add points to the graph to create an appearance effect
  useEffect(() => {
    let currentData = [];
    data.forEach((point, index) => {
      setTimeout(() => {
        currentData = [...currentData, point];
        setAnimatedData([...currentData]);

        const lineColor = point.co2 > 225 ? 'red' : 'green';

        // Update layout to add conditional lines
        setLayout((prevLayout) => ({
          ...prevLayout,
          shapes: [
            ...prevLayout.shapes,
            {
              type: 'line',
              x0: point.co2,
              x1: point.co2,
              y0: 0,
              y1: point.fuelEfficiency,
              line: { color: lineColor, width: 2, dash: 'dot' },
            },
            {
              type: 'line',
              x0: 0,
              x1: point.co2,
              y0: point.fuelEfficiency,
              y1: point.fuelEfficiency,
              line: { color: lineColor, width: 2, dash: 'dot' },
            },
          ],
        }));
      }, index * 200);
    });
  }, [data]);

  const co2Emissions = animatedData.map((d) => d.co2);
  const fuelEfficiency = animatedData.map((d) => d.fuelEfficiency);

  return (
    <div className="graph-container" style={{ maxWidth: '500px', maxHeight: '350px', margin: '0 auto' }}>
      <Plot
        data={[
          {
            x: co2Emissions,
            y: fuelEfficiency,
            type: 'scatter',
            mode: 'markers+lines',
            marker: {
              size: 10,
              color: '#1f77b4',
              opacity: 0.8,
              line: { color: '#1f77b4', width: 2 },
            },
            line: { shape: 'spline', smoothing: 1.3 },
            text: co2Emissions.map(
              (co2, i) =>
                `CO₂ Emissions: ${co2} g/km<br>Fuel Efficiency: ${fuelEfficiency[i]} km/l`
            ),
            hoverinfo: 'text',
          },
        ]}
        layout={layout}
        config={{
          responsive: true,
          displayModeBar: false,
        }}
      />
    </div>
  );
};

export default CO2FuelEfficiencyGraph;
