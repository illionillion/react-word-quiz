import { useEffect, useRef, useState } from "react";
import { wordProps } from "./DragQuiz";
import wordData from "../data.json";
import { Box, Button, HStack, List, ListItem } from "@chakra-ui/react";

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

  /**
   * 出題
   */
  const on_set_a_questions = () => {
    selectWord();
  }

  /**
   * シャッフル
   * @param param0 
   * @returns 
   */
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
          <Box borderWidth="1px" textAlign="center">{currentWord?.eng}</Box>
          <List>
            {shuffle(optionWord ?? []).map((item, index) => (
              <ListItem key={index}>{item.jap}</ListItem>
            ))}
          </List>
          <HStack>
            <Button flex={1} onClick={on_set_a_questions}>問題を出す</Button>
            <Button flex={1}>解答する</Button>
            <Button flex={1}>リセットする</Button>
          </HStack>
      </Box>
    </Box>
  );
};

export default NormalQuiz;
