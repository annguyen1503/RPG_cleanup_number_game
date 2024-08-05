import React, { useState, useRef } from 'react';
import './App.css';

// Utility functions
const genNums = (count) => {
  return Array.from({ length: count }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
};

const genPos = (count, contWidth, contHeight, btnSize) => {
  const pos = [];
  const posSet = new Set();

  while (pos.length < count) {
    const x = Math.random() * (contWidth - btnSize);
    const y = Math.random() * (contHeight - btnSize);
    const posKey = `${Math.round(x)},${Math.round(y)}`;
    // Duplicate ignore
    if (!posSet.has(posKey)) {
      posSet.add(posKey);
      pos.push({ x, y });
    }
  }

  return pos;
};

// Component
function App() {
  const [numCount, setNumCount] = useState(10);
  const [nums, setNums] = useState([]);
  const [pos, setPos] = useState([]);
  const [clickedNums, setClickedNums] = useState([]);
  const [msg, setMsg] = useState('');
  const [timer, setTimer] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [wrongBtn, setWrongBtn] = useState(null);
  const timerRef = useRef(null);
  const btnSize = 50;

  // Handlers
  const handleChange = (e) => setNumCount(e.target.value);
  
  const startGame = () => {
    const initNums = genNums(parseInt(numCount, 10));
    const container = document.querySelector('.numbers-container');
    const contWidth = container.offsetWidth;
    const contHeight = container.offsetHeight;
    const initPos = genPos(parseInt(numCount, 10), contWidth, contHeight, btnSize);

    setNums(initNums);
    setPos(initPos);
    setClickedNums([]);
    setMsg('');
    setWrongBtn(null);
    setPlaying(true);
    setTimer(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => setTimer(prevTime => prevTime + 1), 100);
  };

  const handleClick = (number) => {
    if (number === clickedNums.length + 1) {
      setClickedNums(prev => [...prev, number]);
      if (number === nums.length) {
        setMsg('You won!');
        setPlaying(false);
        clearInterval(timerRef.current);
      }
    } else {
      setWrongBtn(number);
      setMsg('YOU LOSE');
      setPlaying(false);
      clearInterval(timerRef.current);
    }
  };

  const handlePlayClick = () => startGame();

  const msgClass = msg.includes('LOSE') ? 'lose' : 'win';

  return (
    <div className="App">
      <div className="controller">
        <div className='header'><h3>LET'S PLAY</h3></div>
        <div className="input-container">
          <div>Point:</div>
          <input
            type="number"
            min="1"
            value={numCount}
            onChange={handleChange}
          />
        </div>
        <div className="timer">Time: <span>{Math.floor(timer / 10) + '.' + String(timer % 10)}s</span></div>
        <div className="message-box">
          <button onClick={handlePlayClick}>
            {playing ? 'Restart' : 'Play'}
          </button>
          <div className={`message ${msgClass}`}>{msg}</div>
        </div>
      </div>
      <div className="game-container">
        <div className="numbers-container">
          {nums.map((number, index) => (
            <button
              key={number}
              onClick={() => handleClick(number)}
              disabled={clickedNums.includes(number)}
              className={
                clickedNums.includes(number) ? 'clicked' : (wrongBtn === number ? 'wrong' : '')
              }
              style={{
                width: `${btnSize}px`,
                height: `${btnSize}px`,
                left: `${pos[index]?.x}px`,
                top: `${pos[index]?.y}px`,
                zIndex: numCount - number,
              }}
              data-number={number}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
