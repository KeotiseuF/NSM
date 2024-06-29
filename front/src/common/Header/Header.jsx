import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import NsmLogo from '../../assets/images/NSM_logo.png';
import LangSelector from '../../components/LangSelector/LangSelector';
import Login from '../../components/Login/Login';

import '../../hooks/i18n';
import './Header.css';

function Header() {
  const { t } = useTranslation();

  return (
    <header>
      <div className='sub-header'>
        <div className="container-nav">
          <nav>
            <ul className='container-main-links'>
              <li><NavLink className="main-links" to="/home">{t('HEADER.HOME')}</NavLink></li>
              <li><NavLink className="main-links" to="/operation">{t('HEADER.OPERATION')}</NavLink></li>
            </ul>
          </nav>
        </div>

        <img className="logo" src={ NsmLogo } alt="NSM Logo" />
      
        <div className='container-nav'>
          <nav>
            <ul className='container-main-links'>
              <li><NavLink className="main-links" style={{color: 'grey', textDecoration: 'none'}} to="#">{t('HEADER.LEARN')}</NavLink></li>
              <li><NavLink className="main-links" style={{color: 'grey', textDecoration: 'none'}} to="#">QCM</NavLink></li>
            </ul>
          </nav>
        </div>
      </div>

      <div className='sub-header-bis'>
        <LangSelector />
        <Login />
      </div>
    </header>
  )
}

export default Header;