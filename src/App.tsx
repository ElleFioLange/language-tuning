import { useMIDI, useMIDIMessage } from "@react-midi/hooks";
import { useEffect, useState } from "react";
import "./App.css";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .?!";
const charsLength = characters.length;
const randomChar = () =>
  characters.charAt(Math.floor(Math.random() * charsLength));

const RATE = 50;

function App() {
  const [current, setCurrent] = useState("wahr03aoi 30a r309 a3 raj3 ra??3");
  const [destination, setDestination] = useState(
    "wahr03aoi 30a r309 a3 raj3 ra??3"
  );
  const [controls, setControls] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [timeoutID, setTimeoutID] = useState<NodeJS.Timeout>();
  const [status, setStatus] = useState("idle");

  const { inputs } = useMIDI();
  const message = useMIDIMessage(inputs[0]);

  useEffect(() => {
    if (message && message.data) {
      setStatus("changing");
      const newControls = controls.slice();
      newControls[message.data[1]] = message.data[2];
      setControls(newControls);
      clearTimeout(timeoutID);
      const id = setTimeout(() => {
        setStatus("idle");
      }, 2000);
      setTimeoutID(id);
    }
  }, [message]);

  useEffect(() => {
    if (status === "idle") {
      handleTest();
      console.log("generate");
    } else {
      setTimeout(() => {
        moveRandomly();
      }, RATE);
    }
  }, [status, controls]);

  useEffect(() => {
    if (status === "idle") {
      if (current !== destination) {
        setTimeout(() => {
          moveTowardsDest();
        }, RATE);
      }
    }
  }, [current, destination, status]);

  const handleTest = () => {
    const length = Math.ceil(Math.random() * 6 + 6);
    let result = "";
    for (var i = 0; i < length; i++) {
      result += randomChar();
    }

    setDestination(result);
  };

  const moveTowardsDest = () => {
    let cur = current;
    let dest = destination;

    // Handle length
    if (cur.length < dest.length) {
      cur += randomChar();
    } else if (cur.length > dest.length) {
      cur = cur.slice(0, cur.length - 1);
    }

    const dummy = new Array(cur.length).fill("_");

    const result = dummy.map((_, index) => {
      const curChar = cur.charAt(index);
      const destChar = dest.charAt(index);
      if (curChar === destChar) return curChar;
      else {
        if (curChar === characters.charAt(charsLength - 1))
          return characters.charAt(0);
        else return characters.charAt(characters.indexOf(curChar) + 1);
      }
    });

    setCurrent(result.reduce((a, b) => a + b));
  };

  const moveRandomly = () => {
    let cur = current;

    const dummy = new Array(cur.length).fill("_");

    const result = dummy.map((_, index) => {
      const curChar = cur.charAt(index);
      if (Math.random() < 0.3) {
        if (curChar === characters.charAt(charsLength - 1))
          return characters.charAt(0);
        else return characters.charAt(characters.indexOf(curChar) + 1);
      } else return curChar;
    });

    setCurrent(result.reduce((a, b) => a + b));
  };

  return (
    <div className="container">
      <p className="text">{current}</p>
      <br />
      <p className="text">{controls}</p>
      <button className="test-button" onClick={handleTest}>
        test
      </button>
    </div>
  );
}

export default App;
