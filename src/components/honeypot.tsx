// Hidden field that real visitors never see or fill. The server silently drops any submission where it has a value.
export function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="hp-field" aria-hidden="true">
      <label>Ne pas remplir<input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(event) => onChange(event.target.value)} /></label>
    </div>
  )
}
