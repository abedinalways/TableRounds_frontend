import Header from "@/components/admin-message/Header";
import MessageInput from "@/components/admin-message/MessageInput";
import MessageSection from "@/components/admin-message/MessageSection";


export default function ChatLayout() {
  return (
    <>
      <Header/>
      <MessageSection/>
      <MessageInput/>
    </>
  );
}
