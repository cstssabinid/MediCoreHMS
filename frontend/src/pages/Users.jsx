function Users() {
  return (
    <div>
      <div className="card"><h3>User Management</h3><p>Manage hospital users, roles, and account status.</p></div>
      <div className="card table-card">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
          <tbody><tr><td colSpan="4">Admin user management tools are available after integration with backend user APIs.</td></tr></tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
