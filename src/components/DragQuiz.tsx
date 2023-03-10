import { Box } from "@chakra-ui/react";
import { FC, useEffect, useRef, useState } from "react";
import wordData from "../data.json";
import DragItem from "./DragItem";
import { motion } from "framer-motion";
import { wordProps } from "../type";


const DragQuiz: FC = () => {
  const [currentWord, setCurrentWord] = useState<wordProps>();
  const [optionWord, setOptionWord] = useState<wordProps[]>();

  const dragAreaRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const selectWord = () => {
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

  let ignore = false;
  useEffect(() => {
    const start = async () => {
      if (ignore) return;
      selectWord();
    };
    start();
    return () => {
      ignore = true;
    };
  }, []);

  const shuffle = ([...array]: wordProps[]) => {
    if (!array.length) return [];
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

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
        height="2xs"
      >
        <Box className="wordPanel" fontSize="2xl">
          {currentWord?.eng}
        </Box>
        <Box
          ref={dragAreaRef}
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
      <Box
        className="wordItems"
        position="absolute"
        bottom="15%"
        left="50%"
        display="flex"
        transform="translate(-50%,15%)"
        w="2xl"
        margin="auto"
      >
        {shuffle(optionWord ?? [])?.map((item, key) => (
          <DragItem
            key={key}
            item={item}
            questionItem={currentWord}
            constraintsRef={constraintsRef}
            dragAreaRef={dragAreaRef}
            selectWord={() => selectWord()}
          />
        ))}
      </Box>
    </motion.div>
  );
};

export default DragQuiz;
