function AuditLogs() {
  return (
    <div>
      <div className="card"><h3>Audit Logs</h3><p>Review recent system activity and security events.</p></div>
      <div className="card table-card">
        <table>
          <thead><tr><th>Event</th><th>User</th><th>Date</th></tr></thead>
          <tbody><tr><td colSpan="3">Audit logs will appear once the backend is seeded and activity is recorded.</td></tr></tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLogs;
