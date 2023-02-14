import { useEffect, useRef, useState } from "react";
import { wordProps } from "./DragQuiz";
import wordData from "../data.json";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  List,
  ListItem,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import AnswerDialog from "./AnswerDialog";
import { BellIcon } from "@chakra-ui/icons";

const NormalQuiz = () => {
  const [currentWord, setCurrentWord] = useState<wordProps>();
  const [selectWord, setSelectWord] = useState<wordProps>();
  const [isSelected, setIsSelected] = useBoolean(false);
  const [isCorrect, setIsCorrect] = useBoolean(false);
  const [optionWord, setOptionWord] = useState<wordProps[]>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // console.log(selectWord);
    wordSpeech("");
  }, []);

  /**
   * 選択肢から選択
   */
  const onSelectWord = (eng: string) => {
    setIsSelected.on();
    console.log(eng);
    setSelectWord(optionWord?.find((item) => item.eng === eng));
  };

  /**
   * 出題
   */
  const on_set_a_questions = () => {
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
    setOptionWord(shuffle(options));
    wordSpeech(word.eng);

    setSelectWord(undefined);
    setIsSelected.off();
    setIsCorrect.off();
    onClose();
  };

  /**
   * 解答する
   */
  const on_answer = () => {
    if (selectWord?.eng === currentWord?.eng) {
      setIsCorrect.on();
    } else {
      setIsCorrect.off();
    }
    onOpen();
  };

  /**
   * リセットする
   */
  const onReset = () => {
    window.location.reload();
  };

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

  /**
   * 音声よみあげ(英語)
   * @param text テキスト
   */
  const wordSpeech = (text: string) => {
    // if(!text || text === '') return
    // 発言を作成
    const uttr = new SpeechSynthesisUtterance();

    // 文章 (コンストラクタの引数以外に、この方法でも指定できます)
    uttr.text = text;

    // 言語 (日本語:ja-JP, アメリカ英語:en-US, イギリス英語:en-GB, 中国語:zh-CN, 韓国語:ko-KR)
    uttr.lang = "en-US";

    // // 速度 0.1-10 初期値:1 (倍速なら2, 半分の倍速なら0.5)
    // uttr.rate = 0.5;

    // // 高さ 0-2 初期値:1
    // uttr.pitch = 0.5;

    // // 音量 0-1 初期値:1
    // uttr.volume = 0.75;

    // 英語に対応しているvoiceを設定
    const voices = speechSynthesis.getVoices();

    for (let i = 0; i < voices.length; i++) {
      if (voices[i].lang === "en-US") {
        uttr.voice = voices[i];
      }
    }

    // 再生 (発言キュー発言に追加)
    speechSynthesis.speak(uttr);
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Flex direction="column" w="4xl" h="2xl">
        <Center borderWidth="1px" flex={1} fontSize="3xl">
          {currentWord ? (
            <>
              <BellIcon onClick={() => wordSpeech(currentWord?.eng ?? "")} />
              {currentWord?.eng}
            </>
          ) : (
            <></>
          )}
        </Center>
        <List
          flex={4}
          display="flex"
          flexDirection="column"
          textAlign="center"
          justifyContent="center"
          gap={5}
        >
          {optionWord?.map((item, index) => (
            <motion.li
              key={index}
              onClick={() => onSelectWord(item.eng)}
              style={{
                fontSize: "1.875rem",
                background: "rgba(0,0,0,0.06)",
                opacity: 0,
                ...(selectWord?.eng === item.eng
                  ? {
                      // transition:'0.5s',
                      borderBlock: "solid",
                      borderColor: "#000",
                      borderWidth: 1,
                    }
                  : {}),
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [50, 0] }}
              exit={{ opacity: 0, y: [50, 0] }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {item.jap}
            </motion.li>
          ))}
        </List>
        <HStack flex={1}>
          <Button flex={1} onClick={on_set_a_questions}>
            問題を出す
          </Button>
          <Button flex={1} onClick={on_answer} disabled={!isSelected}>
            解答する
          </Button>
          <Button flex={1} onClick={onReset}>
            リセットする
          </Button>
        </HStack>
        <AnswerDialog
          cancelRef={cancelRef}
          currentWord={currentWord}
          isCorrect={isCorrect}
          isOpen={isOpen}
          onClose={onClose}
          on_set_a_questions={on_set_a_questions}
        />
      </Flex>
    </Box>
  );
};

export default NormalQuiz;
