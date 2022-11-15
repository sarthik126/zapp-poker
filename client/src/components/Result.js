import React, { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Result({mapperDict}) {
  const [label,setLabel] = useState([])
  const [data,setData] = useState([])

  useEffect(()=>{
    Object.keys(mapperDict).forEach(val => {
      setLabel(prev=>[...prev,val])
      setData(prev=>[...prev,mapperDict[val]])
    });
  },[mapperDict])

  const data1 = {
    labels: label,
    datasets: [
      {
        label: '%',
        data: data,
        backgroundColor: [
            'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
            'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="result">
      <div className="pie-chart">
      <Pie data={data1} />
      </div>
      <hr />
      {Object.keys(mapperDict).map((val) => (
        <button className="win-btn" key={val}>
          <span>Point {val}</span> {"->"} <span>{mapperDict[val]}</span>
        </button>
      ))}
    </div>
  )
}
