'use client'

import React from "react"
import { List, ListItem, Text } from "@fluentui/react-components"
import { getTagNameFromId } from "@/features/subscription-source/utils"
import { useListClasses } from "@/app/(main)/_components/article-list-panel/article-list-item.style"
import { Folder } from "@/services/subscription"

export const FoldersTabContent = React.memo(({ folders }: { folders: Folder[] }) => {
  const listClasses = useListClasses()
  return (
    <List className={listClasses.list} >
      {
        folders.map(folder => {
          return (
            <ListItem key={folder.id} className={listClasses.listItem} >
              <Text>{getTagNameFromId(folder.id)}</Text>
            </ListItem>
          )
        })
      }
    </List >
  )
})