const sessions = [
  ["Client A", "Mon 9:00", "Completed"],
  ["Client B", "Tue 13:00", "Missed"],
  ["Client C", "Fri 16:30", "Planned"],
];

export default function SessionsPage() {
  return (
    <section className="panel">
      <h2>Session log</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(([client, time, status]) => (
            <tr key={`${client}-${time}`}>
              <td>{client}</td>
              <td>{time}</td>
              <td><span className="pill neutral">{status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
