'use client'

import React from "react"
import { List, ListItem, Text } from "@fluentui/react-components"
import { getTagNameFromId } from "@/app/(main)/_components/feed-side-nav/create-nav"
import { useListClasses } from "@/app/(main)/_components/stream-content-panel/steam-content-list-item"
import { Folder } from "@/server/inoreader/subscription.types"

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