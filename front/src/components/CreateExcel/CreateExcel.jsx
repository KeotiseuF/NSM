import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

import separartor from "../../assets/images/separator.svg";

import './CreateExcel.css';
import { getListCrypto, getListStock } from "../../services/request";


function CreateExcel({nbStock, nbCrypto}) {
  const { t } = useTranslation();
  const [initStockList, setInitStockList] = useState(null);
  const [listStock, setListStock] = useState(null);
  const [listCrypto, setListCrypto] = useState(null);
  const [nameLine, setNameLine] = useState(null);

  const checkStock = nbStock > 0;
  const checkCrypto = nbCrypto > 0;
  const checkStockAndCrypto = checkStock && checkCrypto;

  const classContainerForms = checkStockAndCrypto ? "container-two-forms" : "container-one-form";

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
  
  const filterList = (name, value) => {
    const chekStockName = name.includes('stock') && value.length >= 3; 
    const chekCryptoName = name.includes('crypto') && value.length >= 2;
    let newList = undefined;
    let listWithDuplicata = undefined;

    if(chekStockName){
      listWithDuplicata = initStockList.filter((stock) => stock.name.toLowerCase().includes(value.toLowerCase()) || stock.symbol.toLowerCase().includes(value.toLowerCase()));
      newList = [...new Map(listWithDuplicata.map((stock) => [stock.symbol, stock])).values()];

      setListStock(newList);
      setNameLine(name);
    }
    if(chekCryptoName){
      newList = listCrypto?.filter((crypto) => crypto.name.includes(value))
    }
  }

  const cryptoChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    filterList(name, value);
  }

  useEffect(() => {
    checkStock && getListStock().then((list) => { setInitStockList(list?.data)});
    checkCrypto && getListCrypto().then((list) => { setListCrypto(list)});
  }, [checkCrypto, checkStock])

  return (
  <div className="top-container">
    <div className={classContainerForms}>
      {nbStock > 0 && initStockList ?
        <div className="container-form">
          <h2>{t('OPERATION.STOCK')}</h2>
          <form className="operation-form" action="">
            <div className="h3-form">
              <h3>Name</h3>
              <h3>Invest</h3>
              <h3>Date</h3>
            </div>
            <ol>
              { 
                createForm('stock').map((line) => {
                return (
                  <li key={line}>
                    <div>
                      <input className="input-form" type="text" name={line} onChange={cryptoChange}/>
                      <select name="pets" id="pet-select">
                      {
                        nameLine === line && listStock.map((stock) => {
                          return (
                            <>
                              <option value={stock.symbol}>{stock.name} / {stock.symbol}</option>
                            </>
                          )
                        })
                      }
                      </select>
                    </div>
                      <input className="input-form" type="text" name="value-stock" />
                      <input type="date" />
                      <button>X</button>
                    </li>
                  )
                }) 
              }
            </ol>
            <button>+</button>
          </form>
        </div> :
        <h2>Loading...</h2>
      }
      { checkStockAndCrypto && <img src={separartor} /> }
      { nbCrypto > 0 && 
        <div className="container-form">
          <h2>CRYPTO</h2>
          <form className="operation-form" action="">
            <div className="h3-form">
              <h3>Name</h3>
              <h3>Invest</h3>
              <h3>Date</h3>
            </div>
            <ol>
              { 
                createForm('crypto').map((line) => {
                  return (                
                    <li key={line}>
                        <select name="crypto">
                          <option value="">--Please choose an option--</option>
                          {
                            listCrypto && listCrypto?.map((crypto) => {
                              return (
                                <>
                                  <option value={crypto.symbol}>{crypto.name} / {crypto.symbol}</option>
                                </>
                              )
                            })
                          }
                        </select>
                        <input className="input-form" type="text" name="value-crypto"/>
                        <input type="date" />
                        <button>X</button>
                    </li>
                  )
                })
              }
            </ol>
            <button>+</button>
          </form>
        </div>
      }
    </div>
    <button onClick={() => ""} className="btn">{t('OPERATION.CREATE_EXCEL')}</button>
  </div>
  )
}

CreateExcel.propTypes  = {
  nbStock: PropTypes.number,
  nbCrypto: PropTypes.number,
}

export default CreateExcel;