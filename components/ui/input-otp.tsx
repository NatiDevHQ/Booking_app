import * as React from "react"
import { cn } from "../../lib/utils"

interface InputOTPProps {
    maxLength: number
    value?: string
    onChange?: (value: string) => void
    onComplete?: (value: string) => void
}

export const InputOTP: React.FC<InputOTPProps> = ({ maxLength, value = "", onChange, onComplete }) => {
    const inputs = React.useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const char = e.target.value.slice(-1)
        if (!/^\d*$/.test(char)) return

        const newValue = value.split('')
        newValue[index] = char
        const newStr = newValue.join('')
        
        onChange?.(newStr)

        if (char && index < maxLength - 1) {
            inputs.current[index + 1]?.focus()
        }
        
        if (newStr.length === maxLength) {
            onComplete?.(newStr)
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputs.current[index - 1]?.focus()
        }
    }

    return (
        <div className="flex gap-2 justify-center">
            {Array.from({ length: maxLength }).map((_, i) => (
                <div key={i} className="relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md shadow-sm">
                     <input
                        ref={el => inputs.current[i] = el}
                        type="text"
                        maxLength={1}
                        value={value[i] || ""}
                        onChange={(e) => handleChange(i, e)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className="absolute inset-0 w-full h-full text-center bg-transparent outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md z-10"
                    />
                </div>
            ))}
        </div>
    )
}

export const InputOTPGroup = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("flex items-center", className)}>{children}</div>
)

export const InputOTPSlot = ({ index, ...props }: { index: number }) => (
    <div className="relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md">
       {/* Visual Only for this mock implementation if needed, but the main component handles it */}
    </div>
)

export const InputOTPSeparator = () => (
    <div role="separator" className="mx-1 text-muted-foreground">-</div>
)