import {
  useAllChats,
  useChatHistory,
  useChatRequests,
  useInitPush,
  useSendChat
} from '@/hooks/usePushProtocol'
import { Box, Button, List, ListItem, Text, Textarea } from '@chakra-ui/react'
import { IUser } from '@pushprotocol/restapi'
import dayjs from 'dayjs'
import { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

type FormData = {
  message: string
}

type Props = {
  user: IUser
  decryptedKey: string
  chatId?: string
}

const PushChat: FC<Props> = ({ user, chatId, decryptedKey }) => {
  const { chatHistory, appendMessage } = useChatHistory(decryptedKey, chatId)
  const { sendChat } = useSendChat(user, decryptedKey)
  // const { approveRequest, chatRequests } = useChatRequests(user)

  const { control, handleSubmit, formState, reset } = useForm<FormData>({
    defaultValues: { message: '' }
  })

  const submit = async (data: FormData) => {
    if (formState.isSubmitting) return
    try {
      const res = await sendChat(data.message, chatId)
      if (!res) return
      appendMessage(res)
    } catch (error) {
      console.log(error)
    }
    reset({ message: '' })
  }

  return (
    <Box>
      <List p={5} h="calc(80vh - 250px)" overflow="auto" mb={4}>
        {chatHistory?.map((chat, index) => {
          if (chat.fromDID === user?.did) {
            return (
              <ListItem key={index} textAlign="right">
                <Box
                  textAlign="left"
                  px={3}
                  py={1}
                  mb={3}
                  w="250px"
                  borderRadius="10px 0 10px 10px"
                  display="inline-block"
                  backgroundColor="teal.200"
                >
                  <Text>{chat.messageContent}</Text>
                  <Text fontSize="xs" textAlign="right">
                    {dayjs(chat.timestamp).format('YYYY/MM/DD hh:mm')}
                  </Text>
                </Box>
              </ListItem>
            )
          } else {
            return (
              <ListItem key={index}>
                <Box
                  px={3}
                  py={1}
                  boxShadow="0 0 2px 0 grey"
                  mb={3}
                  w="250px"
                  borderRadius="0 10px 10px 10px"
                  display="inline-block"
                >
                  <Text>{chat.messageContent}</Text>
                  <Text fontSize="xs" textAlign="right">
                    {dayjs(chat.timestamp).format('YYYY/MM/DD hh:mm')}
                  </Text>
                </Box>
              </ListItem>
            )
          }
        })}
      </List>
      <form onSubmit={handleSubmit(submit)}>
        <Controller
          control={control}
          name="message"
          render={({ field }) => (
            <Textarea value={field.value} onChange={field.onChange} />
          )}
        />
        <Button
          isLoading={formState.isSubmitting}
          colorScheme="teal"
          type="submit"
          width="full"
          mt={5}
        >
          送信
        </Button>
      </form>
    </Box>
  )
}

export default PushChat
