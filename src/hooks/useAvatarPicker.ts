import * as ImagePicker from 'expo-image-picker'
import { useCallback } from 'react'

import type { AvatarUpload } from '@/api/contracts'

const TYPES_BY_EXTENSION: Record<string, string> = {
  heic: 'image/heic',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

function toUpload(asset: ImagePicker.ImagePickerAsset): AvatarUpload {
  const name = asset.fileName || asset.uri.split('/').pop() || 'avatar.jpg'
  const extension = name.split('.').pop()?.toLowerCase() ?? ''
  return {
    uri: asset.uri,
    name,
    type: asset.mimeType || TYPES_BY_EXTENSION[extension] || 'image/jpeg',
  }
}

/** Asks for library access, opens the device picker, and returns one square image. */
export function useAvatarPicker() {
  return useCallback(async (): Promise<AvatarUpload | null> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) return null

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (result.canceled) return null
    return toUpload(result.assets[0])
  }, [])
}
