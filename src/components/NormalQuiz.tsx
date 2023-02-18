import { useEffect, useRef, useState } from "react";
import wordData from "../data.json";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  List,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import AnswerDialog from "./AnswerDialog";
import { BellIcon } from "@chakra-ui/icons";
import ResultModal from "./ResultModal";
import { resultDataProps, wordProps } from "../type";

const NormalQuiz = () => {
  const [currentWord, setCurrentWord] = useState<wordProps>();
  const [selectWord, setSelectWord] = useState<wordProps>();
  const [isSelected, setIsSelected] = useBoolean(false);
  const [isCorrect, setIsCorrect] = useBoolean(false);
  const [optionWord, setOptionWord] = useState<wordProps[]>();
  const [pastWord, setPastWord] = useState<wordProps[]>();
  const {
    isOpen: isAnswerOpen,
    onOpen: onAnswerOpen,
    onClose: onAnswerClose,
  } = useDisclosure();
  const {
    isOpen: isResultOpen,
    onOpen: onResultOpen,
    onClose: onResultClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [resultData, setResultData] = useState<resultDataProps[]>();

  useEffect(() => {
    // 初回だけ実行
    wordSpeech("");
  }, []);
  useEffect(() => {
    console.log(pastWord);
  }, [pastWord]);
  useEffect(() => {
    console.log(resultData);
  }, [resultData]);

  /**
   * 選択肢から選択
   */
  const onSelectWord = (eng: string) => {
    setIsSelected.on();
    setSelectWord(optionWord?.find((item) => item.eng === eng));
  };

  /**
   * 出題
   */
  const on_set_a_questions = () => {
    if (wordData.length === pastWord?.length) {
      onAnswerClose();
      onResultOpen();
      return;
    }

    const get_rand_word = (data: wordProps[]) =>
      data[Math.floor(Math.random() * data.length)];

    const word = get_rand_word(
      pastWord ? wordData.filter((i) => pastWord?.indexOf(i) === -1) : wordData
    );

    setCurrentWord(word);
    // isCorrectなしで設定
    setResultData((prev) =>
      prev ? [...prev, { word: word }] : [{ word: word }]
    );

    // 既出単語に追加
    setPastWord((prev) => (prev ? [...prev, word] : [word]));
    const options: wordProps[] = [];
    options.push(word);

    for (let i = 0; i < 3; i++) {
      const filterWord = wordData.filter((item) => !options.includes(item)); // inclidesで判定できた
      options.push(filterWord[Math.floor(Math.random() * filterWord.length)]);
    }
    setOptionWord(shuffle(options));
    wordSpeech(word.eng);

    setSelectWord(undefined);
    setIsSelected.off();
    setIsCorrect.off();
    onAnswerClose();
  };

  /**
   * 解答する
   */
  const on_answer = () => {
    let correctFlag = false;
    if (selectWord?.eng === currentWord?.eng) {
      correctFlag = true;
      setIsCorrect.on();
    } else {
      setIsCorrect.off();
    }
    onAnswerOpen();
    // 正誤のデータを入れる
    setResultData((prev) =>
      prev?.map((data) =>
        data.word?.eng == currentWord?.eng && data.isCorrect === undefined
          ? { word: currentWord, isCorrect: correctFlag }
          : data
      )
    );
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
              <BellIcon
                onClick={() => wordSpeech(currentWord?.eng ?? "")}
                cursor="pointer"
              />
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
          gap={4}
        >
          {optionWord?.map((item, index) => (
            <motion.li
              key={index}
              onClick={() => onSelectWord(item.eng)}
              style={{
                fontSize: "1.875rem",
                background: "rgba(0,0,0,0.06)",
                opacity: 0,
                transition: "all 0.3s ease-out",
                borderBlock: "solid",
                borderColor: "#F0F0F0",
                borderWidth: 1,
                cursor: "pointer",
                ...(selectWord?.eng === item.eng
                  ? {
                      borderColor: "#000",
                    }
                  : {}),
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [25, 0] }}
              exit={{ opacity: 0, y: [25, 0] }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {item.jap}
            </motion.li>
          ))}
        </List>
        <HStack flex={1}>
          <Button flex={1} onClick={on_set_a_questions}>
            {wordData.length !== pastWord?.length ? "問題を出す" : "結果を見る"}
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
          isOpen={isAnswerOpen}
          onClose={onAnswerClose}
          on_set_a_questions={on_set_a_questions}
          title="答え"
          isExistNext={wordData.length !== pastWord?.length}
        />
        <ResultModal
          isOpen={isResultOpen}
          onClose={onResultClose}
          onOpen={onResultOpen}
          resultData={resultData ?? []}
        />
      </Flex>
    </Box>
  );
};

export default NormalQuiz;
