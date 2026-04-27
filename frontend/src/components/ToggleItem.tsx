type ToggleItemProps = {
  label: string
  desc: string
  value: boolean
  onToggle: () => void
}

export function ToggleItem({ label, desc, value, onToggle }: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
      <div>
        <div className="font-bold mb-1 text-foreground">{label}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>

      <button
        onClick={onToggle}
        className={`w-14 h-8 rounded-full transition-colors shadow-inner ${
          value ? "bg-green-600" : "bg-border"
        }`}
      >
        <div
          className={`w-6 h-6 bg-white rounded-full transition-transform shadow-md ${
            value ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}