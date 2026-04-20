import { useEffect, useMemo, useState } from "react";
import {
  Trophy,
  Star,
  BookOpen,
  Calculator,
  Palette,
  Volume2,
} from "lucide-react";

import catImg from "./images/cat.jpg";
import dogImg from "./images/dog.jpg";
import sunImg from "./images/sun.jpg";
import moonImg from "./images/moon.jpg";
import fishImg from "./images/fish.jpg";
import bookImg from "./images/book.jpg";

import redShoesImg from "./images/redShoes.jpg";
import orangeSodaImg from "./images/orangeSoda.jpg";
import pinkBalloonImg from "./images/pinkBalloon.jpg";
import greenYarnImg from "./images/green yarn.jpg";
import blueBirdImg from "./images/blueBird.jpg";
import purpleJellyfishImg from "./images/purpleJellyfish.jpg";
import blackCatImg from "./images/blackCat.jpg";

const readingWords = [
  { word: "cat", image: catImg },
  { word: "dog", image: dogImg },
  { word: "sun", image: sunImg },
  { word: "moon", image: moonImg },
  { word: "fish", image: fishImg },
  { word: "book", image: bookImg },
];

const colorItems = [
  { word: "shoes", image: redShoesImg, color: "red" },
  { word: "soda", image: orangeSodaImg, color: "orange" },
  { word: "balloon", image: pinkBalloonImg, color: "pink" },
  { word: "yarn", image: greenYarnImg, color: "green" },
  { word: "bird", image: blueBirdImg, color: "blue" },
  { word: "jellyfish", image: purpleJellyfishImg, color: "purple" },
  { word: "cat", image: blackCatImg, color: "black" },
];

const colorChoices = ["red", "orange", "pink", "green", "blue", "purple", "black"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.15;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function playTone(frequency, duration, type = "sine", volume = 0.05) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);

    oscillator.onended = () => {
      ctx.close();
    };
  } catch {
    // ignore audio errors
  }
}

function playClickSound() {
  playTone(420, 0.05, "triangle", 0.04);
  setTimeout(() => playTone(620, 0.05, "triangle", 0.03), 45);
}

function playCorrectSound() {
  playTone(523, 0.08, "sine", 0.05);
  setTimeout(() => playTone(659, 0.08, "sine", 0.05), 90);
  setTimeout(() => playTone(784, 0.12, "sine", 0.05), 180);
}

function playWrongSound() {
  playTone(220, 0.12, "sawtooth", 0.04);
  setTimeout(() => playTone(180, 0.14, "sawtooth", 0.04), 100);
}

function talkAndClick(text) {
  playClickSound();
  if (text) speak(text);
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #ffffff, #f8fbff)",
        color: "#111827",
        borderRadius: "26px",
        padding: "20px",
        minHeight: "125px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
        border: `3px solid ${accent}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "16px",
          fontWeight: "800",
          marginBottom: "10px",
          color: "#0f172a",
        }}
      >
        <div
          style={{
            background: accent,
            color: "white",
            borderRadius: "14px",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <span>{label}</span>
      </div>

      <div
        style={{
          fontSize: "42px",
          fontWeight: "900",
          lineHeight: 1,
          color: "#111827",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function KidButton({ children, onClick, active = false }) {
  return (
    <button
      onClick={() => {
        playClickSound();
        onClick?.();
      }}
      style={{
        padding: "14px 18px",
        borderRadius: "18px",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "800",
        background: active
          ? "linear-gradient(135deg, #0f172a, #334155)"
          : "linear-gradient(135deg, #ffffff, #f8fafc)",
        color: active ? "#ffffff" : "#111827",
        boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
      }}
    >
      {children}
    </button>
  );
}

function ReadAloudButton({ text }) {
  return (
    <button
      onClick={() => talkAndClick(text)}
      style={{
        padding: "10px 14px",
        borderRadius: "16px",
        border: "none",
        cursor: "pointer",
        background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
        color: "white",
        fontWeight: "800",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <Volume2 size={18} />
      Hear It
    </button>
  );
}

function ReadingGame({ onCorrect }) {
  const makeRound = () => {
    const correct = pickRandom(readingWords);
    const wrong = shuffle(
      readingWords.filter((item) => item.word !== correct.word)
    ).slice(0, 3);

    return {
      correct,
      choices: shuffle([correct.word, ...wrong.map((item) => item.word)]),
    };
  };

  const [round, setRound] = useState(makeRound());
  const [message, setMessage] = useState("Tap the word that matches the picture.");

  useEffect(() => {
    speak(`Find the word ${round.correct.word}`);
  }, [round.correct.word]);

  function checkAnswer(choice) {
    playClickSound();
    if (choice === round.correct.word) {
      setMessage("Great job! That is correct!");
      playCorrectSound();
      speak(`Great job! ${choice} is correct.`);
      onCorrect();
    } else {
      setMessage("Oops! Try again.");
      playWrongSound();
      speak("Oops. Try again.");
    }
  }

  return (
    <div style={gamePanelStyle}>
      <h2 style={panelHeadingStyle}>Reading Game</h2>
      <p style={panelTextStyle}>Look at the picture and choose the correct word.</p>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src={round.correct.image} alt={round.correct.word} style={mainImageStyle} />
        <div style={{ marginTop: "14px" }}>
          <ReadAloudButton text={round.correct.word} />
        </div>
      </div>

      <div style={answersGridStyle}>
        {round.choices.map((choice) => (
          <button
            key={choice}
            onClick={() => checkAnswer(choice)}
            style={answerButtonStyle}
          >
            {choice}
          </button>
        ))}
      </div>

      <p style={messageStyle}>{message}</p>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => {
            playClickSound();
            setRound(makeRound());
          }}
          style={primaryButtonStyle}
        >
          New Reading Word
        </button>
      </div>
    </div>
  );
}

function ColorGame({ onCorrect }) {
  const makeRound = () => {
    const correct = pickRandom(colorItems);
    const wrong = shuffle(
      colorChoices.filter((color) => color !== correct.color)
    ).slice(0, 3);

    return {
      correct,
      choices: shuffle([correct.color, ...wrong]),
    };
  };

  const [round, setRound] = useState(makeRound());
  const [message, setMessage] = useState("Choose the main color of the picture.");

  useEffect(() => {
    speak(`What color is this ${round.correct.word}?`);
  }, [round.correct.word]);

  function checkAnswer(choice) {
    playClickSound();
    if (choice === round.correct.color) {
      setMessage("Awesome! You got the color right!");
      playCorrectSound();
      speak(`${choice} is correct.`);
      onCorrect();
    } else {
      setMessage("That is not the best color. Try again.");
      playWrongSound();
      speak("Try again.");
    }
  }

  return (
    <div style={gamePanelStyle}>
      <h2 style={panelHeadingStyle}>Color Recognition</h2>
      <p style={panelTextStyle}>Choose the main color of the picture.</p>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src={round.correct.image} alt={round.correct.word} style={mainImageStyle} />
        <div style={{ marginTop: "14px" }}>
          <ReadAloudButton text={`What color is this ${round.correct.word}?`} />
        </div>
      </div>

      <div style={answersGridStyle}>
        {round.choices.map((choice) => (
          <button
            key={choice}
            onClick={() => checkAnswer(choice)}
            style={{
              ...answerButtonStyle,
              textTransform: "capitalize",
              background: choice,
              color: choice === "yellow" || choice === "pink" ? "#111827" : "white",
              border: "3px solid white",
            }}
          >
            {choice}
          </button>
        ))}
      </div>

      <p style={messageStyle}>{message}</p>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => {
            playClickSound();
            setRound(makeRound());
          }}
          style={primaryButtonStyle}
        >
          New Color Game
        </button>
      </div>
    </div>
  );
}

function MathGame({ type, onCorrect }) {
  const makeRound = () => {
    let num1 = 0;
    let num2 = 0;
    let answer = 0;
    let symbol = "+";

    if (type === "add") {
      num1 = randomInt(1, 12);
      num2 = randomInt(1, 12);
      answer = num1 + num2;
      symbol = "+";
    }

    if (type === "subtract") {
      num1 = randomInt(4, 18);
      num2 = randomInt(1, num1);
      answer = num1 - num2;
      symbol = "-";
    }

    if (type === "multiply") {
      num1 = randomInt(1, 10);
      num2 = randomInt(1, 10);
      answer = num1 * num2;
      symbol = "×";
    }

    let choices = shuffle([answer, answer + 1, answer - 1, answer + 2]).filter(
      (value, index, arr) => value >= 0 && arr.indexOf(value) === index
    );

    while (choices.length < 4) {
      const extra = Math.max(0, answer + randomInt(-3, 4));
      if (!choices.includes(extra)) {
        choices.push(extra);
      }
    }

    return {
      num1,
      num2,
      answer,
      symbol,
      choices: shuffle(choices.slice(0, 4)),
    };
  };

  const [round, setRound] = useState(makeRound());
  const [message, setMessage] = useState("Choose the correct answer.");

  const title =
    type === "add"
      ? "Addition Game"
      : type === "subtract"
      ? "Subtraction Game"
      : "Multiplication Game";

  useEffect(() => {
    speak(`${round.num1} ${round.symbol} ${round.num2}`);
  }, [round.num1, round.num2, round.symbol]);

  function checkAnswer(choice) {
    playClickSound();
    if (choice === round.answer) {
      setMessage("Correct! Nice work!");
      playCorrectSound();
      speak("Correct! Nice work!");
      onCorrect();
    } else {
      setMessage("Oops! Try another answer.");
      playWrongSound();
      speak("Oops. Try again.");
    }
  }

  return (
    <div style={gamePanelStyle}>
      <h2 style={panelHeadingStyle}>{title}</h2>
      <p style={panelTextStyle}>Solve the math problem.</p>

      <div style={mathProblemWrapStyle}>
        <div style={mathProblemStyle}>
          {round.num1} {round.symbol} {round.num2}
        </div>
        <ReadAloudButton text={`${round.num1} ${round.symbol} ${round.num2}`} />
      </div>

      <div style={answersGridStyle}>
        {round.choices.map((choice) => (
          <button
            key={choice}
            onClick={() => checkAnswer(choice)}
            style={answerButtonStyle}
          >
            {choice}
          </button>
        ))}
      </div>

      <p style={messageStyle}>{message}</p>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => {
            playClickSound();
            setRound(makeRound());
          }}
          style={primaryButtonStyle}
        >
          New Math Problem
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);
  const [activeGame, setActiveGame] = useState("reading");

  const progress = useMemo(() => Math.min((score / 20) * 100, 100), [score]);

  function handleCorrect() {
    setScore((prev) => prev + 1);
    setStars((prev) => prev + 5);
    setStreak((prev) => prev + 1);
  }

  function resetProgress() {
    playClickSound();
    setScore(0);
    setStars(0);
    setStreak(0);
    speak("Progress reset.");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background:
          "radial-gradient(circle at top left, #fde68a 0%, #f9a8d4 20%, #93c5fd 45%, #c4b5fd 70%, #86efac 100%)",
      }}
    >
      <div style={{ maxWidth: "1220px", margin: "0 auto" }}>
        <div style={heroStyle}>
          <div style={heroGlowStyle} />
          <h1 style={heroHeadingStyle}>Bright Minds Learning Playground</h1>
          <p style={heroTextStyle}>
            Talking learning games for ages 4–12 with reading, colors, and math fun.
          </p>

          <div style={statsGridStyle}>
            <StatCard
              icon={<Trophy size={22} />}
              label="Correct Answers"
              value={score}
              accent="#f59e0b"
            />
            <StatCard
              icon={<Star size={22} />}
              label="Stars"
              value={stars}
              accent="#8b5cf6"
            />
            <StatCard
              icon={<BookOpen size={22} />}
              label="Streak"
              value={streak}
              accent="#06b6d4"
            />
          </div>

          <div style={{ textAlign: "center", marginTop: "18px" }}>
            <button onClick={resetProgress} style={primaryButtonStyle}>
              Reset Progress
            </button>
          </div>
        </div>

        <div style={{ marginTop: "28px", ...gamePanelStyle }}>
          <h2 style={panelHeadingStyle}>Choose a Game</h2>
          <p style={panelTextStyle}>Tap a game button to play.</p>

          <div style={menuGridStyle}>
            <KidButton onClick={() => setActiveGame("reading")} active={activeGame === "reading"}>
              <BookOpen size={18} />
              Reading
            </KidButton>

            <KidButton onClick={() => setActiveGame("colors")} active={activeGame === "colors"}>
              <Palette size={18} />
              Colors
            </KidButton>

            <KidButton onClick={() => setActiveGame("add")} active={activeGame === "add"}>
              <Calculator size={18} />
              Adding
            </KidButton>

            <KidButton onClick={() => setActiveGame("subtract")} active={activeGame === "subtract"}>
              <Calculator size={18} />
              Subtracting
            </KidButton>

            <KidButton onClick={() => setActiveGame("multiply")} active={activeGame === "multiply"}>
              <Calculator size={18} />
              Multiplication
            </KidButton>
          </div>

          <div style={{ marginTop: "24px" }}>
            <div style={{ fontWeight: "800", marginBottom: "8px", color: "#0f172a" }}>
              Progress: {Math.round(progress)}%
            </div>
            <div style={progressBarOuterStyle}>
              <div style={{ ...progressBarInnerStyle, width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: "28px" }}>
          {activeGame === "reading" && <ReadingGame onCorrect={handleCorrect} />}
          {activeGame === "colors" && <ColorGame onCorrect={handleCorrect} />}
          {activeGame === "add" && <MathGame type="add" onCorrect={handleCorrect} />}
          {activeGame === "subtract" && (
            <MathGame type="subtract" onCorrect={handleCorrect} />
          )}
          {activeGame === "multiply" && (
            <MathGame type="multiply" onCorrect={handleCorrect} />
          )}
        </div>
      </div>
    </div>
  );
}

const heroStyle = {
  position: "relative",
  overflow: "hidden",
  background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 35%, #8b5cf6 100%)",
  color: "white",
  padding: "32px",
  borderRadius: "30px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.16)",
};

const heroGlowStyle = {
  position: "absolute",
  inset: "-60px auto auto -60px",
  width: "220px",
  height: "220px",
  background: "rgba(255,255,255,0.18)",
  borderRadius: "50%",
  filter: "blur(20px)",
};

const heroHeadingStyle = {
  textAlign: "center",
  marginTop: 0,
  marginBottom: "12px",
  fontSize: "44px",
  fontWeight: "900",
};

const heroTextStyle = {
  textAlign: "center",
  fontSize: "20px",
  marginBottom: "24px",
  fontWeight: "600",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginTop: "24px",
};

const gamePanelStyle = {
  background: "linear-gradient(180deg, #ffffff, #f8fbff)",
  borderRadius: "28px",
  padding: "26px",
  boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
};

const panelHeadingStyle = {
  textAlign: "center",
  marginTop: 0,
  marginBottom: "8px",
  color: "#111827",
  fontSize: "34px",
  fontWeight: "900",
};

const panelTextStyle = {
  textAlign: "center",
  color: "#64748b",
  marginBottom: "20px",
  fontSize: "18px",
  fontWeight: "600",
};

const menuGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: "12px",
};

const primaryButtonStyle = {
  padding: "14px 22px",
  borderRadius: "16px",
  border: "none",
  background: "linear-gradient(135deg, #f59e0b, #ef4444)",
  color: "white",
  fontWeight: "900",
  cursor: "pointer",
  fontSize: "16px",
  boxShadow: "0 8px 18px rgba(0,0,0,0.14)",
};

const answerButtonStyle = {
  padding: "16px 18px",
  borderRadius: "18px",
  border: "3px solid #dbeafe",
  background: "linear-gradient(180deg, #ffffff, #eff6ff)",
  color: "#111827",
  fontWeight: "800",
  cursor: "pointer",
  fontSize: "18px",
  boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
  textTransform: "capitalize",
};

const answersGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
  gap: "12px",
};

const mainImageStyle = {
  width: "160px",
  height: "160px",
  objectFit: "contain",
  borderRadius: "24px",
  background: "linear-gradient(180deg, #ffffff, #f8fafc)",
  padding: "12px",
  boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
};

const mathProblemWrapStyle = {
  textAlign: "center",
  marginBottom: "20px",
};

const mathProblemStyle = {
  textAlign: "center",
  fontSize: "58px",
  fontWeight: "900",
  margin: "20px 0",
  color: "#111827",
};

const messageStyle = {
  textAlign: "center",
  marginTop: "16px",
  color: "#475569",
  fontWeight: "800",
  fontSize: "18px",
};

const progressBarOuterStyle = {
  width: "100%",
  height: "18px",
  background: "#e2e8f0",
  borderRadius: "999px",
  overflow: "hidden",
};

const progressBarInnerStyle = {
  height: "100%",
  background: "linear-gradient(to right, #22c55e, #3b82f6, #8b5cf6)",
};