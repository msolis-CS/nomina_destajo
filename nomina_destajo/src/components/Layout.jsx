

import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {

  return (
    <div className="d-flex flex-column min-vh-100">
    <Header />
    <main className="flex-grow-1">{children}</main>
    <Footer />
  </div>
  );
};

export default Layout;
