"use client";

import Image from "next/image";
import { useAppDispatch, useAppSelector } from "./store";

export default function Home() {
  const dispatch = useAppDispatch();

  // Example of using a selector
  // const isAuth = useAppSelector((state) => state.auth.isAuth);

  // Example of dispatching an action
  // dispatch(setJid(""));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Hello</p>
    </main>
  );
}
