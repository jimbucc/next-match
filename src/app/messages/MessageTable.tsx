'use client'
import { MessageDto } from '@/types'
import {
  Avatar,
  Button,
  Card,
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Key, useCallback, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { deleteMessage } from '../actions/messageActions'
import { truncateString } from '@/lib/util'

type Props = {
  messages: MessageDto[]
}

const MessageTable = ({ messages }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isOutBox = searchParams.get('container') === 'outbox'
  const [isDeleting, setDeleting] = useState({id: '', loading: false})

  const columns = [
    {
      key: isOutBox ? 'recipientName' : 'senderName',
      label: isOutBox ? 'Recipient' : 'Sender',
    },
    { key: 'text', label: 'Message' },
    { key: 'created', label: isOutBox ? 'Date sent' : 'Date Received' },
    { key: 'actions', label: 'Actions' },
  ]

  const handleDeleteMesssage = useCallback(async (message: MessageDto) => {
    setDeleting({id: message.id, loading: true})
    await deleteMessage(message.id, isOutBox)
    router.refresh()
    setDeleting({id: '', loading: false})
  },[isOutBox, router])

  const handleRowSelect = (key: Key) => {
    const message = messages.find((m) => m.id === key)
    const url = isOutBox
      ? `/members/${message?.recipientId}`
      : `/members/${message?.senderId}`
    router.push(url + '/chat')
  }

  const renderCell = useCallback(
    (item: MessageDto, columnKey: keyof MessageDto) => {
      const cellValue = item[columnKey]

      switch (columnKey) {
        case 'recipientName':
        case 'senderName':
          return (
            <div
              className='flex items-center gap-2 cursor-pointer'>
              <Avatar
                alt="Image of member"
                src={
                  (isOutBox ? item.recipientImage : item.senderImage) ||
                  '/images/user.png'
                }
              />
              <span>{cellValue}</span>
            </div>
          )

        case 'text':
          return (
            <div className="truncate">
                {truncateString(cellValue, 60)}
            </div>
            )
        case 'created':
          return cellValue
        default:
          return (
            <Button 
                isIconOnly 
                variant="light"
                onClick={() => handleDeleteMesssage(item)}
                isLoading={isDeleting.id === item.id && isDeleting.loading}>
              <AiFillDelete size={24} className="text-danger" />
            </Button>
          )
      }
    },
    [isOutBox, isDeleting.id, isDeleting.loading, handleDeleteMesssage]
  )

  return (
    <Card className="flex flex-col gap-3 h-[80vh] overflow-auto">
      <Table
        aria-label="Table with message"
        selectionMode="single"
        shadow="none"
        onRowAction={(key) => handleRowSelect(key)}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} width={column.key === 'text' ? '50%' : undefined}>
                {column.label}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={messages}
          emptyContent="No messages for this container"
        >
          {(item) => (
            <TableRow key={item.id} className="cursor-pointer">
              {(columnKey) => (
                <TableCell
                  className={`${
                    !item.dateRead && !isOutBox ? 'font-semibold' : ''
                  }`}
                >
                  {renderCell(item, columnKey as keyof MessageDto)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
export default MessageTable
