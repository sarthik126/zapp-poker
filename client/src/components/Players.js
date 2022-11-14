import React from "react";

export default function Players({ tempPlayers, board }) {
  // console.log(board)
  return (
    <div className="history">
      {tempPlayers.map((val, index) => (
        <button className="win-btn" key={index}>
          <span>{val.userName}</span> - <span>{board[val.index]}</span>
        </button>
      ))}
    </div>
  );
}
