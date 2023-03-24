import Layout from '@/components/Layout'
import TicketsList from '@/components/TicketsList'
import { useMounted } from '@/hooks'
import { useRetrieveHoldingTicketsByAddress } from '@/hooks/useTicketContract'
import { Box, Heading } from '@chakra-ui/react'
import { NextPage } from 'next'
import { FC } from 'react'
import { useAccount } from 'wagmi'
import useTranslation from 'next-translate/useTranslation'

const Entity: FC = () => {
  const { address } = useAccount()
  const { t } = useTranslation('common')
  const collectionTranslation = useTranslation('collection')
  const { data, isLoading, isError } = useRetrieveHoldingTicketsByAddress(
    address!
  )
  return (
    <Layout isError={isError} isLoading={isLoading}>
      <Heading as="h1" size="3xl">
        {t('COLLECTION_LINK')}
      </Heading>
      <Box mt={5}>{<TicketsList items={data} type='simple' />}</Box>
    </Layout>
  )
}

const CollectionPage: NextPage = () => {
  const isMounted = useMounted()

  return isMounted ? <Entity /> : <></>
}

export default CollectionPage
