export interface FileSmallThumbnail {
  url: string
  width: number
  height: number
}

export interface FileLargeThumbnail {
  url: string
  width: number
  height: number
}

export interface FileThumbnails {
  small: FileSmallThumbnail
  large: FileLargeThumbnail
}

export interface FileCreatedBy {
  id: string
  email: string
  name: string
}

export interface FileAttachment {
  id: string
  url: string
  filename: string
  size: number
  type: string
  thumbnails: FileThumbnails
}

export interface FileInterface {
  Name: string
  Description?: string
  Resources: string[]
  URL: string
  'Created By': FileCreatedBy
  Created: string
  'Last Modified': string
  id: string
  Attachments?: FileAttachment[]
}
export type FileArray = FileInterface[]
