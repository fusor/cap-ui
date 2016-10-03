import * as React from 'react';
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem
} from 'react-bootstrap';

import { Link } from 'react-router';

const CapNav = () => {
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">CAP</Link>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <NavItem eventKey={1} href="/">
          <span><Link to="/">Nulecules</Link></span>
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default CapNav;
