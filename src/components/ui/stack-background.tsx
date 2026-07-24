export function StackBackground() {
  return (
    <div className="stack-background" aria-hidden="true">
      <div className="stack-background__gradient" />
      <div className="stack-background__arc stack-background__arc--one" />
      <div className="stack-background__arc stack-background__arc--two" />
      <div className="stack-background__diagonal" />
      <div className="stack-background__vertical" />
      <div className="stack-background__dot-grid" />
      <div className="stack-background__point stack-background__point--primary" />
      <div className="stack-background__point stack-background__point--secondary" />
    </div>
  )
}
