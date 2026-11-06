import { CodeBox } from './ProgressDots'

interface InputOTPProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  autoFocus?: boolean
  className?: string
}

/** Six boxes, digits only. Delegates to the design system's `CodeBox`. */
export function InputOTP({
  length = 6,
  value,
  onChange,
  onComplete,
  autoFocus,
  className,
}: InputOTPProps) {
  return (
    <CodeBox
      length={length}
      value={value}
      onChangeText={onChange}
      onComplete={onComplete}
      autoFocus={autoFocus}
      className={className}
    />
  )
}
