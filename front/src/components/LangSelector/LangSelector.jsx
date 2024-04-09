import { useState } from 'react';
import i18n from '../../hooks/i18n';

import flagFr from '../../assets/images/france.png';
import flagEn from '../../assets/images/united-states.png';
import downArrow from '../../assets/images/down-arrow.png';

import './LangSelector.css';

function LangSelector() {
  const [langSelect, setLangSelect] = useState('en');
  const [displayLang, setDisplayLang] = useState(false);
  const lang = {
    'fr':  <><img className='flags icon' src={flagFr} alt="french flang" />FR</>,
    'en': <><img className='flags icon' src={flagEn} alt="usa flang" />EN</>
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangSelect(lng)
    setDisplayLang(false);
  }
  
  return(
    <div>
      <button className='button-lang' style={displayLang ? {borderRadius: '10px 10px 0 0'} : {borderRadius: '10px'}} onClick={() => setDisplayLang(!displayLang)}>
        {langSelect == 'en' ? lang.en : lang.fr}
        <img className='icon' src={downArrow} />
      </button>
      <ul className='container-lang' style={displayLang ? {display:'block'} : {display:'none'}}>
        <li style={langSelect == 'fr' ? {display:'none'} : {display:'flex', borderRadius: '0 0 10px 10px'}}>
          <label className='lang-labels'>
            <input className='switcher-lang' type="checkbox" onClick={() => changeLanguage('fr')} disabled={langSelect === 'fr'}/>
            {lang.fr}
          </label>
        </li>
        <li style={langSelect == 'en' ? {display:'none'} : {display:'flex', borderRadius: '0 0 10px 10px'}}>
          <label className='lang-labels'>
            <input className='switcher-lang' type="checkbox" onClick={() => changeLanguage('en')} disabled={langSelect === 'en'}/>
             {lang.en}
          </label>
        </li>
      </ul>
    </div>
  )
}

export default LangSelector;