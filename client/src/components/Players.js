import React from "react";

export default function Players({ allPlayers, board }) {
  // console.log(board)
  return (
    <div className="history">
      {allPlayers.map((val, index) => (
        <button className="win-btn" key={index}>
          <span>{val.userName}</span> - <span>{board[val.index]}</span>
        </button>
      ))}
    </div>
  );
}
