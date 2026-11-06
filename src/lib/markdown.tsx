import { Text, View } from 'react-native'

export function renderMarkdown(text: string) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('- ') || line.startsWith('✅ ')) {
      const content = line.replace(/^[-✅]\s/, '')
      return (
        <View key={i} className="my-0.5 flex-row items-start gap-2">
          <View className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary opacity-70" />
          <Text className="flex-1 text-sm text-text">
            {parseBold(content)}
          </Text>
        </View>
      )
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <Text key={i} className="mb-1 mt-3 text-sm font-rubik-semibold text-text">
          {line.replace(/\*\*/g, '')}
        </Text>
      )
    }
    if (line.startsWith('> ')) {
      return (
        <View
          key={i}
          className="my-1 border-l-2 border-primary/40 pl-3"
        >
          <Text className="text-sm italic text-text-2">
            {parseBold(line.slice(2))}
          </Text>
        </View>
      )
    }
    if (line.trim() === '') return <View key={i} className="h-2" />
    return (
      <Text key={i} className="text-sm leading-6 text-text">
        {parseBold(line)}
      </Text>
    )
  })
}

function parseBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <Text key={i} className="font-rubik-semibold">
        {part.slice(2, -2)}
      </Text>
    ) : (
      part
    )
  )
}
