"use client";

import { MainChat } from "@/components/chat/mainChat/mainChat";
import { SideBar } from "@/components/chat/sideBar/sideBar";
import { useUserDocData } from "@/services/firebase/firestore";
import { useAuthUser } from "@/services/firebase/init";

export default function Page() {

  const user = useAuthUser();
  const userDoc = useUserDocData(user?.uid);

  return (
    <div className="flex flex-row bg-[rgb(42,42,41)]">
      <MainChat userDoc={userDoc} />
      <SideBar userDoc={userDoc} />
    </div>
  );
}