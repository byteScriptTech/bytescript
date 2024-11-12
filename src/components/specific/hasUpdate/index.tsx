import { signOut } from 'firebase/auth';
import React, { useState } from 'react';

import Model from '@/components/common/Modal';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/context/LocalhostContext';

import { auth } from '../../../../lib/firebase';

const hasUpdateModel = {
  title: `Let's update?`,
  description:
    'Update is available. You can update to the latest version with some new features and fixes.',
  secondaryDescription:
    'You will be logged out and you will have to re-login to see the changes!',
  buttonText: 'Continue',
  cancelButtonText: 'Nah! I will do it later!',
};

const HasUpdate: React.FC = () => {
  const { getItem, removeItem } = useLocalStorage();
  const { updateUser } = useAuth();
  const user = getItem('user');
  const [showModel, setShowModel] = useState(user.has_update);
  if (!user.has_update) {
    return;
  }
  const handleContinue = async () => {
    updateUser(user, { has_update: false });
    removeItem('content_javascript');
    await signOut(auth);
  };
  return (
    <div>
      <Model
        {...hasUpdateModel}
        showModel={showModel}
        hideModel={() => setShowModel(false)}
        handleContinue={handleContinue}
      />
    </div>
  );
};

export default HasUpdate;
