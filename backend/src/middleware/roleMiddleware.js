function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role_id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const roleMap = {
      1: 'Super Admin',
      2: 'Hospital Admin',
      3: 'Receptionist',
      4: 'Doctor',
      5: 'Nurse',
      6: 'Laboratory Staff',
      7: 'Pharmacist',
      8: 'Cashier'
    };
    const userRole = roleMap[req.user.role_id] || 'Unknown';
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient role permissions' });
    }
    next();
  };
}

module.exports = { authorizeRoles };
