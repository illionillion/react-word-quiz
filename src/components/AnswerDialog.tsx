import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import { FC, RefObject } from "react";
import { wordProps } from "./DragQuiz";

interface AnswerDialogProps {
  isOpen: boolean;
  cancelRef: RefObject<HTMLButtonElement>;
  onClose: () => void;
  isCorrect: boolean;
  currentWord: wordProps | undefined;
  on_set_a_questions: () => void;
}

const AnswerDialog: FC<AnswerDialogProps> = ({
  isOpen,
  cancelRef,
  onClose,
  isCorrect,
  currentWord,
  on_set_a_questions,
}) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            結果
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text color={isCorrect ? "#f00" : "#00f"}>
              {isCorrect ? "正解！" : "不正解"}
            </Text>
            <Accordion allowToggle>
              <AccordionItem>
                <Heading>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      答えを見る
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Heading>
                <AccordionPanel pb={4}>
                  <Text display="inline">{currentWord?.eng}</Text>:
                  <Text display="inline" color={"#f00"} ml={5}>
                    {currentWord?.jap}
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={on_set_a_questions}>次の問題を出す</Button>
            <Button onClick={onClose} ml={3}>
              閉じる
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AnswerDialog;
