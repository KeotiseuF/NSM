import { useTranslation } from "react-i18next";
import { useState } from "react";

import regex from "../../services/regex";

import warning from "../../assets/images/warning.svg";

import CreateExcel from "../../components/CreateExcel/CreateExcel";

import './Operation.css'

function Operation() {
  const { t } = useTranslation();
  const [hideNoData, setHideNoData] = useState(false);
  const [nbStock, setNbStock] = useState(0);
  const [nbCrypto, setNbCrypto] = useState(0);
  const [hideHowMany, setHideHowMany] = useState(false);
  const checkValueHowMany = hideHowMany && (nbCrypto !== 0 || nbStock !== 0);

  const getValueHowMany = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    switch(name) {
      case 'nbStock':
        setNbStock(value);
        break;
        case 'nbCrypto':
        setNbCrypto(value);
      break;
    }
  }

  const createForm = () => {
    const regexNumber = new RegExp(regex.number);
    const checkIfNumber = regexNumber.test(nbStock) && regexNumber.test(nbCrypto);
    const checkSuperiorZero = nbStock > 0 || nbCrypto > 0;

    if(checkIfNumber && checkSuperiorZero) {
      setHideHowMany(true);
    } else {
      window.alert(t('OPERATION.ENTER_FOUND'));
    }
  }

  return (
    <main>
      {
        !hideNoData ?
          <>
            <img className="warning" src={warning} />
            <div className="container-import">
              <h1>{t('OPERATION.NO_DATA')}</h1>
              <div className="container-btn-import">
                <button className="btn" style={{color: 'grey'}}>{t('OPERATION.IMPORT')}</button>
                {t('OPERATION.OR')}
                <button onClick={() => setHideNoData(true)} className="btn">{t('OPERATION.CREATE')}</button>
              </div>
            </div>
          </> :
          !checkValueHowMany ?
            <div className="container-how-many">
              <div className="container-input-how-many">
                <h1>{t('OPERATION.HOW_MANY_STOCK')}</h1>
                <input className="input-how-many" type="text" name="nbStock" value={nbStock} onChange={getValueHowMany} />
              </div>
              <div className="container-input-how-many">
                <h1>{t('OPERATION.HOW_MANY_CRYPTO')}</h1>
                <input className="input-how-many" type="text" name="nbCrypto" value={nbCrypto} onChange={getValueHowMany} />
              </div>
              <button onClick={createForm} className="btn">{t('OPERATION.NEXT')}</button>
            </div> :
            <CreateExcel nbStock={Number(nbStock)} nbCrypto={Number(nbCrypto)} />
      }
    </main>
  )
}

export default Operation;