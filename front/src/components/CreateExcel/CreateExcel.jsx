import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

import { getListCrypto, getListStock } from "../../services/request";
import DataList from "../../common/DataList/DataList";

import horizontalSeparartor from "../../assets/images/horizontal-separator.svg";
import huskyThinks from "../../assets/images/husky-thinks.png";

import './CreateExcel.css';

CreateExcel.propTypes  = {
  nbStock: PropTypes.number,
  nbCrypto: PropTypes.number,
}

function CreateExcel({nbStock, nbCrypto}) {
  const { t } = useTranslation();
  const [initStockList, setInitStockList] = useState(null);
  const [initCryptoList, setInitCryptoList] = useState(null);

  const checkStock = nbStock > 0;
  const checkCrypto = nbCrypto > 0;
  const checkStockAndCrypto = checkStock && checkCrypto;

  const classContainerForms = checkStockAndCrypto ? "container-two-forms" : "container-one-form";
  const addMarginSoloForm = `operation-form ${!checkStockAndCrypto ? 'active-margin-bottom' : ''}`.trim();
  const addMarginSeparator = `vertical-separator ${checkStockAndCrypto ? 'active-margin-bottom' : ''}`.trim();
  
  const createForm = (value) => {
    const lines = [];
    let number = undefined;

    if (value === 'stock') {
      number = nbStock;
    } else {
      number = nbCrypto;
    }

    for(let i = 0; number > i; i++) { lines.push(`${value}-${i}`) }
    
    return lines;
  }
  
  useEffect(() => {
    checkStock && getListStock().then((list) => { setInitStockList(list)});
    checkCrypto && getListCrypto().then((list) => { setInitCryptoList(list)});
  }, [checkCrypto, checkStock]);
  
  return (
  <div className="top-container">
    { (initStockList && initCryptoList) || initStockList || initCryptoList ?
      <>
        <div className={classContainerForms}>
        {nbStock > 0 &&
          <div className="container-form">
            <h2>{t('OPERATION.STOCK')}</h2>
            <form className={addMarginSoloForm} action="">
              <div className="container-h3-form">
                <h3>{t('OPERATION.NAME')}</h3>
                <h3 className="invest-h3">{t('OPERATION.INVEST')}</h3>
                <h3>Date</h3>
              </div>
              <ol>
                {
                  createForm('stock').map((line, id) => {
                    return (
                      <>
                        <li key={line}>
                          <div className="container-input-btn-form">
                            <div className="container-input-form">
                              <DataList initList={initStockList} line={line} placeholder={t('OPERATION.PLACEHOLDER.STOCK')} />
                              <input className="input-form" type="text" name="value-stock" placeholder="0" />
                              <input type="date" />
                            </div>
                            <button className="delete-line">+</button>
                          </div>
                        </li>
                        { createForm('stock').length !== ++id && <img className='horizontal-separator' src={horizontalSeparartor} /> }
                      </>
                    )
                  })
                }
              </ol>
              <button className="add-line">+</button>
            </form>
          </div>
        }
        { checkStockAndCrypto && <div className={addMarginSeparator}></div> }
        { nbCrypto > 0 && 
          <div className="container-form">
            <h2>CRYPTO</h2>
            <form className={addMarginSoloForm} action="">
              <div className="container-h3-form">
                <h3>{t('OPERATION.NAME')}</h3>
                <h3 className="invest-h3">{t('OPERATION.INVEST')}</h3>
                <h3>Date</h3>
              </div>
              <ol>
                {
                  createForm('crypto').map((line, id) => {
                    return (
                      <>
                        <li key={line}>
                          <div className="container-input-btn-form">
                            <div className="container-input-form">
                              <DataList initList={initCryptoList} line={line} placeholder={t('OPERATION.PLACEHOLDER.CRYPTO')} />
                              <input className="input-form" type="text" name="value-crypto" placeholder="0"/>
                              <input type="date" />
                            </div>
                            <button className="delete-line">+</button>
                          </div>
                        </li>
                        {createForm('crypto').length !== ++id && <img className='horizontal-separator' src={horizontalSeparartor} />}
                      </>
                    )
                  })
                }
              </ol>
              <button className="add-line">+</button>
            </form>
          </div>
        }
        </div>
        <button onClick={() => ""} className="btn btn-form">{t('OPERATION.CREATE_EXCEL')}</button>
      </> :
      <div className="container-loading">
        <img className="husky-thinks" src={huskyThinks} alt="Mascotte husky thinks" />
        <h2 className="loading-h2">{t('OPERATION.LOADING')}</h2>
      </div>
    }
  </div>
  )
}

export default CreateExcel;