const clients = [
  ["Client A", "3x weekly", "15/session", "Active"],
  ["Client B", "2x weekly", "18/session", "Needs attention"],
  ["Client C", "1x weekly", "20/session", "Active"],
];

export default function ClientsPage() {
  return (
    <section className="panel">
      <h2>Clients</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Frequency</th>
            <th>Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(([name, freq, rate, status]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{freq}</td>
              <td>{rate}</td>
              <td><span className="pill neutral">{status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
