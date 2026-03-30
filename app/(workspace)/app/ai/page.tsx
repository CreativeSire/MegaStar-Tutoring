const suggestions = [
  "Client B needs a new slot because Tuesday was missed.",
  "Client A has two sessions this week that should be billed together.",
  "You have enough free time on Thursday for a reschedule.",
];

export default function AiPage() {
  return (
    <section className="panel">
      <h2>AI assistant</h2>
      <div className="workspace-grid">
        {suggestions.map((item) => (
          <article key={item} className="panel" style={{ boxShadow: "none" }}>
            {item}
          </article>
        ))}
      </div>
    </section>
  );
}
