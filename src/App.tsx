import { Box, Container, Link } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import DragItem from "./components/DragItem";
import wordData from "./data.json";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DragQuiz from "./components/DragQuiz";
import NormalQuiz from "./components/NormalQuiz";

interface optionWordProps<T> {
  0: T;
  1: T;
  2: T;
  3: T;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/Map"
          element={
            <Box
              w="100vw"
              h="100vh"
              display="flex"
              flexDirection="column"
              textAlign="center"
              alignItems="center"
              justifyContent="center"
            >
              <Link href="/DragQuiz" color="teal">DragQuiz</Link>
              <Link href="/NormalQuiz" color="teal">NormalQuiz</Link>
            </Box>
          }
        />
        <Route path="/DragQuiz" element={<DragQuiz />} />
        <Route path="/NormalQuiz" element={<NormalQuiz/>} />
        <Route path="/" element={<NormalQuiz/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
