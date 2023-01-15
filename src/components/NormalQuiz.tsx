import { useEffect, useRef, useState } from "react";
import { wordProps } from "./DragQuiz";
import wordData from "../data.json";
import { Box, List, ListItem } from "@chakra-ui/react";

const NormalQuiz = () => {
  const [currentWord, setCurrentWord] = useState<wordProps>();
  const [optionWord, setOptionWord] = useState<wordProps[]>();

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
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box>
          <Box borderWidth="1px">{currentWord?.eng}</Box>
          <List>
            {shuffle(optionWord ?? []).map((item, index) => (
              <ListItem key={index}>{item.jap}</ListItem>
            ))}
          </List>
      </Box>
    </Box>
  );
};

export default NormalQuiz;
