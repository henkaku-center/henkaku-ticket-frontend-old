import {
  useAllChats,
  useChatRequests,
  useDecryptedPvtKey,
  useInitPush
} from '@/hooks/usePushProtocol'
import {
  Box,
  Button,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { IUser } from '@pushprotocol/restapi'
import { FC, useState } from 'react'
import PushChat from '../Push/Chat'

type Props = {
  groupChatName: string
}

const ChatInner: FC<{
  user: IUser
}> = ({ user }) => {
  const { key } = useDecryptedPvtKey(user)
  const { chats } = useAllChats(key)
  const { chatRequests, approveRequest } = useChatRequests(user, key)
  const [selectedChatId, setSelectedChatId] = useState()

  return key ? (
    <>
      <Grid gridTemplateColumns="150px 1fr">
        <GridItem>
          {chats?.map((chat, index) => (
            <Box
              p={2}
              borderBottom="1px solid grey"
              mb={2}
              key={`chat${index}`}
            >
              {chat.groupInformation?.groupName}
            </Box>
          ))}
          {chatRequests?.map((request, index) => (
            <Box
              p={2}
              borderBottom="1px solid grey"
              mb={2}
              key={`request${index}`}
            >
              {request.groupInformation?.groupName}
            </Box>
          ))}
        </GridItem>
        <GridItem>
          {selectedChatId && key && user && (
            <PushChat decryptedKey={key} user={user} chatId={selectedChatId} />
          )}
        </GridItem>
      </Grid>
    </>
  ) : (
    <></>
  )
}

const OrganizerChatModal: FC<Props> = ({ groupChatName }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { user, createUser } = useInitPush()

  return (
    <>
      {user ? (
        <>
          <Button width="full" colorScheme="teal" onClick={onOpen}>
            参加者とのメッセージスレッド
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxH="80vh" maxW="90%">
              <ModalCloseButton />
              <ModalBody pt={12} pb={5}>
                <ChatInner user={user} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Button onClick={createUser} width="full">
          チャットを開始
        </Button>
      )}
    </>
  )
}

export default OrganizerChatModal
