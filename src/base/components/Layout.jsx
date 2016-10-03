import * as React from 'react';

import CapNav from './CapNav';
import '../styles/layout.scss';

const Layout = ({children}) => {
  return (
    <div className="layout">
      <CapNav />
      <div className="container">
        {children}
      </div>
    </div>
  );
};

export default Layout;
