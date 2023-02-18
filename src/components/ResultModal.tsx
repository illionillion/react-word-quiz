import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FC } from "react";
import { resultDataProps } from "../type";

interface ResultModalProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  resultData: resultDataProps[];
}
const ResultModal: FC<ResultModalProps> = ({
  title,
  isOpen,
  onClose,
  onOpen,
  resultData,
}) => {
  const percent =
    Math.round(
      (resultData.reduce((prev, current) => {
        prev += current.isCorrect ? 1 : 0;
        return prev;
      }, 0) /
        resultData.length) *
        100 *
        10
    ) / 10;

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      motionPreset="slideInBottom"
      scrollBehavior="inside"
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title ?? "結果"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TableContainer>
            <Table variant="simple">
              <TableCaption>正答率{percent}%</TableCaption>
              <Thead>
                <Tr>
                  <Th>英語</Th>
                  <Th>日本語</Th>
                  <Th>正誤</Th>
                </Tr>
              </Thead>
              <Tbody>
                {resultData.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.word?.eng}</Td>
                    <Td>{item.word?.jap}</Td>
                    <Td
                      color={(() => {
                        switch (item.isCorrect) {
                          case true:
                            return "red";
                          case false:
                            return "blue";

                          default:
                            return "black";
                        }
                      })()}
                    >
                      {(() => {
                        switch (item.isCorrect) {
                          case true:
                            return "正解";
                          case false:
                            return "不正解";

                          default:
                            return "未解答";
                        }
                      })()}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>閉じる</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResultModal;
