import './Header.css';
import NsmLogo from '../../assets/images/NSM_logo.png';
import { useTranslation } from 'react-i18next';
import '../../hooks/i18n';
import LangSelector from '../../components/LangSelector/LangSelector';
import Login from '../../components/Login/Login';

function Header() {
  const { t } = useTranslation();

  return (
    <header>
      <div className='sub-header'>
        <div className="container-nav">
          <nav>
            <ul className='container-main-links'>
              <li><a className="main-links"href="#">{t('HOME.HOME')}</a></li>
              <li><a className="main-links" href="#">{t('HOME.OPERATION')}</a></li>
            </ul>
          </nav>
        </div>

        <img className="logo" src={ NsmLogo } alt="NSM Logo" />
      
        <div className='container-nav'>
          <nav>
            <ul className='container-main-links'>
              <li><a className="main-links" href="#">{t('HOME.LEARN')}</a></li>
              <li><a className="main-links"href="#">QCM</a></li>
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