import React from 'react';

// Shared user context to provide simple personalization data across pages.
// Consumers can read names like migrantFirstName, migrantLastName, familyFirstName, familyLastName.
const UserContext = React.createContext({
  migrantFirstName: '',
  migrantLastName: '',
  familyFirstName: '',
  familyLastName: ''
});

export default UserContext;
