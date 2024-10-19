import React from 'react';

const UserProfile = ({ user, onLogout }) => {
  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default UserProfile;
