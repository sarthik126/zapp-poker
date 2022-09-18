import React from 'react'

export default function Result({mapperDict}) {
  return (
    <div className="history">
      {Object.keys(mapperDict).map((val) => (
        <button className="win-btn" key={val}>
          <span>{val}</span> - <span>{mapperDict[val]}</span>
        </button>
      ))}
    </div>
  )
}
