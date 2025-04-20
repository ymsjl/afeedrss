'use client'

import React from "react"
import { List, ListItem, Text } from "@fluentui/react-components"
import { getTagNameFromId } from "@/components/source-nav-panel/createNav"
import { useListClasses } from "@/components/stream-content-panel/article-list-item"
import { Folder } from "@/server/inoreader/subscription.types"

export const FoldersPanel = React.memo(({ folders }: { folders: Folder[] }) => {
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