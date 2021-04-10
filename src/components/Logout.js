import React from 'react';
import { GoogleLogout } from 'react-google-login';

//google cilent Id 
const clientId ='808887656812-1tfa2ft0pom3hfttk2ol05ua8naklelk.apps.googleusercontent.com';

function Logout() {
  const onSuccessLogout = () => {
    console.log('Logout made successfully');
    alert('Logout made successfully ✌');
  };

  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccessLogout}
      />
    </div>
  );
}


export default Logout;