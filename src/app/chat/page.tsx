"use client";

import { MainChat } from "@/components/chat/mainChat/mainChat";
import { SideBar } from "@/components/chat/sideBar/sideBar";

export default function Page() {

  return (
    <div className="flex flex-row bg-[rgb(42,42,41)]">
      <SideBar />
      <MainChat/>
    </div>
  );
}