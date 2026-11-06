import { Txt as Text } from './Txt'

interface LabelProps {
  text: string
  className?: string
}

/** Small caps label. */
export function Label({ text, className }: LabelProps) {
  return <Text className={className ?? 'text-caption text-text-2'}>{text}</Text>
}
