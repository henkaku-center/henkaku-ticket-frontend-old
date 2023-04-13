import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { FC } from 'react'
import PushChat from '../Push/Chat'
import { useDecryptedPvtKey, useInitPush } from '@/hooks/usePushProtocol'
import { IUser } from '@pushprotocol/restapi'

type Props = {
  receiverAddress: string
}

const ChatInner: FC<{ receiverAddress: string; user: IUser }> = ({
  receiverAddress,
  user
}) => {
  const { key } = useDecryptedPvtKey(user)

  return key ? (
    <PushChat
      user={user}
      decryptedKey={key}
      receiverAddress={receiverAddress}
    />
  ) : (
    <></>
  )
}

const ChatModal: FC<Props> = ({ receiverAddress }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { user, createUser } = useInitPush()

  return (
    <>
      {user ? (
        <>
          <Button width="full" colorScheme="teal" onClick={onOpen}>
            主催者とのメッセージスレッド
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxH="80vh">
              <ModalCloseButton />
              <ModalBody pt={12} pb={5}>
                <ChatInner receiverAddress={receiverAddress} user={user} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Button onClick={createUser}>Create User</Button>
      )}
    </>
  )
}

export default ChatModal
