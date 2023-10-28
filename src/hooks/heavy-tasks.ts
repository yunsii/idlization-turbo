"use client";

import { rIC, cIC } from "idlization";
import { useEffect, useRef, useState } from "react";

const INITIAL_COUNT = 0;
const WHILE_LIMIT = 1e9;

export function useHeavyTask(id: string | number) {
  const [count, setCount] = useState(INITIAL_COUNT);
  if (typeof window !== "undefined") {
    console.log(`[${id}] count:`, count);
  }

  useEffect(() => {
    let count = INITIAL_COUNT;
    console.time(`[${id}] sync while`);
    while (count <= WHILE_LIMIT) {
      count += 1;
      continue;
    }
    console.timeEnd(`[${id}] sync while`);
    setCount(count);
  }, [id]);
}

export function useHeavyTaskTurbo(id: string | number) {
  const countCacheRef = useRef(INITIAL_COUNT);
  const idleHandlerRef = useRef(0);
  const [count, setCount] = useState(INITIAL_COUNT);
  if (typeof window !== "undefined") {
    console.log(`[${id}] count:`, count);
  }

  useEffect(() => {
    const callback: IdleRequestCallback = (deadline) => {
      console.time(`[${id}] idle while callback`);
      const timeEnd = Date.now() + deadline.timeRemaining();

      const taskRunning = () => {
        return countCacheRef.current <= WHILE_LIMIT;
      };

      // task running && not timeout (reserve 2ms)
      while (taskRunning() && timeEnd > Date.now() + 2) {
        countCacheRef.current += 1;
        continue;
      }

      if (taskRunning()) {
        console.log(`[${id}] idle while start next task with`, countCacheRef.current);
        idleHandlerRef.current = rIC(callback);
      } else {
        setCount(countCacheRef.current);
        console.log(`[${id}] idle while task end`, countCacheRef.current);
      }
      console.timeEnd(`[${id}] idle while callback`);
    };

    if (!idleHandlerRef.current) {
      idleHandlerRef.current = rIC(callback);
    } else {
      console.log(`[${id}] idle task created`);
    }

    return () => {
      cIC(idleHandlerRef.current);
      idleHandlerRef.current = 0;
    };
  }, [id]);
}
