export default function SettingsPage() {
  return (
    <section className="panel">
      <h2>Workspace settings</h2>
      <div className="form-grid">
        <div className="field">
          <label>Calendar sync</label>
          <input defaultValue="Connected to Google Calendar" />
        </div>
        <div className="field">
          <label>Default currency</label>
          <input defaultValue="GBP" />
        </div>
      </div>
    </section>
  );
}
