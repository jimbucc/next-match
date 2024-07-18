import CardInnerWrapper from "@/components/CardInnerWrapper"
import ChatForm from "./ChatForm"
import { getMessageThread } from "@/app/actions/messageActions"
import { getAuthUserId } from "@/app/actions/authActions"
import MessageList from "./MessageList"
import { createChatId } from "@/lib/util"

const ChatPage = async ({ params }: { params: { userId: string } }) => {
  const userId = await getAuthUserId()
  const messages = await getMessageThread(params.userId)
  const chatId = createChatId(userId, params.userId)


  return (
    <CardInnerWrapper
      header="Chat"
      body={
        <MessageList initialMessages={messages} currentUserId={userId} chatId={chatId}/>
      }
      footer={<ChatForm />}
    />
  )
}
export default ChatPage