import { FC, RefObject, useRef, useState } from "react";
import { motion } from "framer-motion";
import { wordProps } from "../App";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

interface DragItemProps {
  constraintsRef: RefObject<HTMLDivElement>;
  dragAreaRef: RefObject<HTMLDivElement>;
  item: wordProps;
  questionItem: wordProps | undefined;
  //   selectWord: () => void;
}

type DragItemState = "correct" | "incorrect" | undefined;

const DragItem: FC<DragItemProps> = ({
  constraintsRef,
  dragAreaRef,
  item,
  questionItem,
  //   selectWord,
}) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const [isState, setIsState] = useState<DragItemState>();

  const checkAnswer = () => {
    if (!dragRef.current || !dragAreaRef.current || !questionItem) return;
    // 選択肢要素の位置 as A
    const dragClientRect = dragRef.current.getBoundingClientRect();
    const dragItem = {
      x: dragClientRect.x,
      y: dragClientRect.y,
      w: dragClientRect.width,
      h: dragClientRect.height,
    };

    console.log(dragItem);

    // ドラッグエリアの位置 as B
    const dragAreaClientRect = dragAreaRef.current.getBoundingClientRect();
    const dragAreaItem = {
      x: dragAreaClientRect.x,
      y: dragAreaClientRect.y,
      w: dragAreaClientRect.width,
      h: dragAreaClientRect.height,
    };
    console.log(dragAreaItem);

    // A が B の中にあることを書ければいい
    if (
      dragItem.x > dragAreaItem.x &&
      dragItem.y > dragAreaItem.y &&
      dragItem.x + dragItem.w < dragAreaItem.x + dragAreaItem.w &&
      dragItem.y + dragItem.h < dragAreaItem.y + dragAreaItem.h
    ) {
      console.log("エリア内");
      // 正誤判定
      if (item.eng == questionItem.eng) {
        console.log("正解");
        setIsState("correct");
        // (() => selectWord())();
      } else {
        console.log("不正解");
        setIsState("incorrect");
      }
    } else {
      setIsState(undefined);
    }
  };

  return (
    <motion.div
      ref={dragRef}
      dragConstraints={constraintsRef}
      drag
      onDrag={checkAnswer}
      onDragEnd={checkAnswer}
      onDragTransitionEnd={checkAnswer}
      style={{
        height: "5rem",
        margin: "2px",
        fontSize: "1.2rem",
        backgroundColor: "#5affff7d",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        borderRadius: "50px",
      }}
    >
      {item.jap}
      {(()=>{
        switch (isState) {
            case "correct":
                
                return <CheckIcon color="#72f122" position="absolute" fontSize="3xl"/>
                case "incorrect":
                    
                return <CloseIcon color="red" position="absolute" fontSize="3xl"/>;
        
            default:
                return;
        }
      })()}
    </motion.div>
  );
};

export default DragItem;
