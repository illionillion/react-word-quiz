import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import wordData from "./data.json";

interface wordProps {
  eng: string;
  jap: string;
}
interface optionWordProps<T> {
  0: T;
  1: T;
  2: T;
  3: T;
}

function App() {
  console.log(wordData);
  const [currentWord, setCurrentWord] = useState<wordProps>();
  const [optionWord, setOptionWord] = useState<
    // optionWordProps<wordProps> | undefined
    wordProps[]
  >();

  const constraintsRef = useRef<HTMLDivElement>(null);

  let ignore = false;
  useEffect(() => {
    const start = async () => {
      if (ignore) return;
      const word = wordData[Math.floor(Math.random() * wordData.length)];
      setCurrentWord(word);
      const options: wordProps[] = [];
      options.push(word);

      for (let i = 0; i < 3; i++) {
        const filterWord = wordData.filter((item) => !options.includes(item)); // inclidesで判定できた
        // console.log(filterWord);
        options.push(filterWord[Math.floor(Math.random() * filterWord.length)]);
      }
      console.log(options);
      setOptionWord(options);
    };
    start();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <motion.div
      className="App"
      ref={constraintsRef}
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Box
        className="wordContainer"
        backgroundColor="aquamarine"
        position="absolute"
        top="15%"
        left="50%"
        transform="translate(-50%,-15%)"
        width="2xl"
        height="28"
      >
        <Box className="wordPanel">{currentWord?.eng}</Box>
        <Box
          className="wordDragArea"
          display="flex"
          alignItems="center"
          justifyContent="center"
          margin="auto"
          w="90%"
          h="75%"
          backgroundColor="darkgrey"
          borderWidth="1px"
          borderColor="black"
          borderStyle="dashed"
        >
          Drag Word
        </Box>
      </Box>
      <Box className="wordItems">
        {optionWord?.map((item, key) => (
          <motion.div
            key={key}
            dragConstraints={constraintsRef}
            drag
            style={{ width: "fit-content", margin:0 }}
          >
            {item.jap}
            <br />
          </motion.div>
        ))}
      </Box>
    </motion.div>
  );
}

export default App;
