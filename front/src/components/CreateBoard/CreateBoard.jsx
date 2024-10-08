import { useEffect, useState, useRef, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getListCrypto } from "../../services/crypto/cryptoRequest";
import { getListStock } from "../../services/stock/stockRequest";
import regex from "../../services/regex";
import DataList from "../../common/DataList/DataList";
import DotLoading from "../../common/DotLoading/DotLoading";

import horizontalSeparartor from "../../assets/images/horizontal-separator.svg";
import huskyThinks from "../../assets/images/husky-thinks.png";

import './CreateBoard.css';

CreateBoard.propTypes  = {
  nbStock: PropTypes.number,
  nbCrypto: PropTypes.number,
}

function CreateBoard({nbStock, nbCrypto}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stockLines, setStockLines] = useState([]);
  const [cryptoLines, setCryptoLines] = useState([]);
  const [initStockList, setInitStockList] = useState(null);
  const [initCryptoList, setInitCryptoList] = useState(null);
  const [errorsForm, setErrorsForm] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [list, setList] = useState(null);

  const refListStock = useRef(null);
  const refListCrypto = useRef(null);

  const checkStock = nbStock > 0;
  const checkCrypto = nbCrypto > 0;
  const checkLists = stockLines.length > 0 && cryptoLines.length > 0;

  const classContainerForms = checkLists ? "container-two-forms" : "container-one-form";
  const addMarginSoloForm = `operation-form ${!checkLists ? 'active-margin-bottom' : ''}`.trim();
  const addMarginSeparator = `vertical-separator ${checkLists ? 'active-margin-bottom' : ''}`.trim();

  const setupForm = (status, idLine) => {
    let number = undefined;
    let lines = idLine.includes('stock') ? stockLines : cryptoLines;

    if (idLine === 'stock') {
      number = nbStock;
    } else {
      number = nbCrypto;
    }

    if (status === 'init') {
      for(let i = 0; number > i; i++) {
        let data = {
          id: `${idLine}-${i}`,
          name: '',
          invest: '0',
          date: ''
        }

        lines.push(data);
      }
    }

    if (status === 'deleteLine') {
      const takeOffError = errorsForm.filter((err) => {
        const errSplit = err.split('_');

        if(errSplit[0] === idLine ) {
          return false;
        } else {
          return true;
        }
      });

      setErrorsForm(takeOffError);

      if((stockLines.length === 0 && cryptoLines.length === 1) || (stockLines.length === 1 && cryptoLines.length === 0)) {
        navigate(`/home`, {replace: true});
      } else if (lines.length === 1 && (stockLines.length > 0 || cryptoLines.length > 0)) {
        lines = [];
      } else {
        lines = lines.filter((line) => line.id !== idLine);
        lines = lines.filter((line, id) => line.id = `${idLine.split('-')[0]}-${id}`);
      }
    }

    if (status === 'addLine') {
      const lastLine = lines.slice(lines.length - 1);
      const splitId = lastLine[0].id.split('-');

      let data = {
        id: `${splitId[0]}-${++splitId[1]}`,
        name: '',
        invest: '0',
        date: ''
      }

      lines.push(data);

      lines = lines.filter((line) => line && true);
      setButtonDisabled(true);
    }
    return lines;
  }

  const deleteLine = (e) => {
    const idLine = e.target.value;
    const clientX = e.clientX;
    const clientY = e.clientY;
    const newLines = setupForm('deleteLine', idLine);

    e.preventDefault();
    // Check where the client click because stop.propagation not work.
    if (clientX > 0 || clientY > 0) {
      if(idLine.includes("stock")) setStockLines(newLines);
      if(idLine.includes("crypto")) setCryptoLines(newLines);
      enableButton(errorsForm, newLines, idLine);
    }
  }

  const addLine = (e) => {
    const idLine = e.target.value;

    e.preventDefault();

    if(idLine.includes("stock")) setStockLines(setupForm('addLine', idLine));
    if(idLine.includes("crypto")) setCryptoLines(setupForm('addLine', idLine));
    
    setTimeout(() => {
      if(idLine.includes("stock")) refListStock.current.scrollTo(0, refListStock.current.scrollHeight);
      if(idLine.includes("crypto")) refListCrypto.current.scrollTo(0, refListCrypto.current.scrollHeight);
    }, 100);
  }

  const checkNumber = (value) => {
    const regexNumber = new RegExp(regex.number);
    const checkIfNumber = regexNumber.test(value);
    const checkSuperiorZero = value > 0;

    if(checkIfNumber && checkSuperiorZero) {
      return true;
    } else {
      return false;
    }
  }

  const getData = (name, value) => {
    const nameSplit = name.split('_')
    const checkDevise = nameSplit[1] === '($)' ? '$' : '€';
    const arrayData = name.includes('stock') ? stockLines : cryptoLines;

    arrayData.map((data) => {
      if(data.id === nameSplit[0]) {
        if(nameSplit[1] === 'date') {
          data.date = value.trim();
        } else if(nameSplit[1] === 'name') {
          data.name = value.trim();
        } else {
          data.invest = value.trim() +' '+ checkDevise;
        }
      }
    });

    if(name.includes('stock')) {
      setStockLines(arrayData);
    } else {
      setCryptoLines(arrayData);
    }
  }

  const enableButton = (arrayErr, lines, id) => {
    const assetIsStock = id.includes('stock');
    const assetIsCrypto = id.includes('crypto');
    const linesEmpty = lines.length === 0;

    let check = true;
    const checkName = (line) => line.name !== '';
    const checkInvest = (line) => line.invest !== '0';
    const checkDate = (line) => line.date !== '';
    const checkAll = (toCheck) => toCheck.every(checkName) && toCheck.every(checkInvest) && toCheck.every(checkDate);

    if(arrayErr.length === 0) {
      if(assetIsStock && cryptoLines.length >= 1) {
          if(!linesEmpty) check = checkAll(lines);

          check &&
          checkAll(cryptoLines) && 
          setButtonDisabled(false);
      } else if (assetIsCrypto && stockLines.length >= 1) {
        if(!linesEmpty) check = checkAll(lines);

          check &&
          checkAll(stockLines) && 
          setButtonDisabled(false);
      } else if (!linesEmpty && (assetIsStock || assetIsCrypto)) {
        checkAll(lines);
        setButtonDisabled(false);

      } else {
        setButtonDisabled(true);
      }
    } else {
      setButtonDisabled(true);
    }
  }

  const resetList = () => setList(null);

  const filterList = (name, value) => {
    const chekStockName = name.includes('stock') && value.length >= 3; 
    const chekCryptoName = name.includes('crypto') && value.length >= 2;
    let newListStock = undefined;
    let newListCrypto = undefined;
    let listWithDuplicata = undefined;

    if(chekStockName){
      listWithDuplicata = initStockList?.filter((stock) => (stock.name.toLowerCase() + ' / ' + stock.symbol.toLowerCase()).includes(value.toLowerCase()));
      newListStock = [...new Map(listWithDuplicata?.map((stock) => [stock.symbol, stock])).values()];
    }
    if(chekCryptoName){
      newListCrypto = initCryptoList?.filter((stock) => (stock.name.toLowerCase() + ' / ' + stock.symbol.toLowerCase()).includes(value.toLowerCase()));
    }

    !chekStockName && resetList();
    !chekCryptoName && resetList();
    
    newListStock && setList(newListStock);
    newListCrypto && setList(newListCrypto);
  }

  const checkValueValid = (list, value) => list?.find((line) => `${line.name.toLowerCase()} / ${line.symbol.toLowerCase()}` === value.toLowerCase());

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const checkNum = name.includes('$') || name.includes('€') ? checkNumber(value) : undefined;
    const splitValue = value.split('-');
    let arrayErr = errorsForm;

    if(name.includes('name')) {
      const checkNameList = name.includes('stock') ? initStockList : initCryptoList;

      filterList(name, value);

      if(checkValueValid(checkNameList, value)) {
        arrayErr = errorsForm.filter((err) => err !== name);

        setErrorsForm(arrayErr);
        getData(name, value);
      } else {
        const findErr = errorsForm.find((err) => err === name);

        if(!findErr) {
          arrayErr.push(name);
          setErrorsForm([...errorsForm, name]);
        }
      }
    } else if(checkNum) {
      arrayErr = errorsForm.filter((err) => err !== name);

      setErrorsForm(arrayErr);
      getData(name, value);
    } else if(splitValue[0] >= 1900 && name.includes('stock')) {
      arrayErr = errorsForm.filter((err) => err !== name);

      setErrorsForm(arrayErr);
      getData(name, value);
    } else if (splitValue[0] >= 2009 && name.includes('crypto')) {
      arrayErr = errorsForm.filter((err) => err !== name);

      setErrorsForm(arrayErr);
      getData(name, value);
    } else {
      const findErr = errorsForm.find((err) => err === name);

      if(!findErr) {
        arrayErr.push(name);
        setErrorsForm([...errorsForm, name]);
      }
    }

    const lines = name.includes('stock') ? stockLines : cryptoLines;
    const typeAsset = name.includes('stock') ? 'stock' : 'crypto';
    enableButton(arrayErr, lines, typeAsset);
  }

  // const

  const createBoard = (e) => {
    let data = {};

    e.preventDefault();

    if(checkLists) {
      data = {
        stocks: stockLines,
        cryptos: cryptoLines
      }
    } else if (stockLines.length > 0) {
      data = {
        stocks: stockLines
      }
    } else {
      data = {
        cryptos: cryptoLines
      }
    }

    localStorage.setItem('dataExcel', JSON.stringify(data));
    navigate('board'); 
  }

  useEffect(() => {
    if(stockLines.length === 0 && checkStock) {
      getListStock().then((list) => { 
        setInitStockList(list);
      });
      setStockLines(setupForm('init', 'stock'));
    }

    if(cryptoLines.length === 0 && checkCrypto) {
      getListCrypto().then((list) => { 
        setInitCryptoList(list);
      });
      setCryptoLines(setupForm('init', 'crypto'));
    }
  }, []);

  return (
  <div className="top-container">
    { (initStockList?.length > 0 && initCryptoList?.length > 0) || initStockList?.length  > 0 || initCryptoList?.length > 0 ?
      <>
        <div className={classContainerForms}>
        {stockLines.length > 0 &&
          <div className="container-form">
            <h2>{t('OPERATION.STOCK')}</h2>
            <form className={addMarginSoloForm} action="">
              <div className="container-h3-form">
                <h3>{t('OPERATION.NAME')}</h3>
                <h3 className="invest-h3">{t('OPERATION.INVEST')}</h3>
                <h3>Date</h3>
              </div>
              <ol ref={refListStock}>
                {
                  stockLines?.map((line, id) => {
                    return (
                      <Fragment key={line.id}>
                        <li>
                          <div className="container-input-btn-form">
                            <div className="container-input-form">
                              <DataList
                                line={line}
                                placeholder={t('OPERATION.PLACEHOLDER.STOCK')}
                                errorsForm={errorsForm}
                                onChange={onChange}
                                list={list}
                              />
                              <input
                                className={`input-form ${errorsForm.find((err) => err === `${line.id}_${t('OPERATION.INVEST').split(' ')[1]}`) ? 'error-invest' : ''}`.trim()}
                                type="text"
                                name={`${line.id}_${t('OPERATION.INVEST').split(' ')[1]}`}
                                placeholder="0"
                                onChange={onChange}
                              />
                              <input type="date" name={`${line.id}_date`} onChange={onChange} className={errorsForm.find((err) => err === `${line.id}_date`) ? 'error-date' : ''} />
                            </div>
                            <button className="delete-line" value={line.id} onClick={deleteLine}>+</button>
                          </div>
                        </li>
                        { stockLines.length !== ++id && <img className='horizontal-separator' src={horizontalSeparartor} /> }
                      </Fragment>
                    )
                  })
                }
              </ol>
              <button className="add-line" value='stock' onClick={addLine}>+</button>
            </form>
          </div>
        }
        { checkLists && <div className={addMarginSeparator}></div> }
        { cryptoLines.length > 0 && 
          <div className="container-form">
            <h2>CRYPTO</h2>
            <form className={addMarginSoloForm} action="">
              <div className="container-h3-form">
                <h3>{t('OPERATION.NAME')}</h3>
                <h3 className="invest-h3">{t('OPERATION.INVEST')}</h3>
                <h3>Date</h3>
              </div>
              <ol ref={refListCrypto}>
                {
                  cryptoLines.map((line, id) => {
                    return (
                      <Fragment key={line.id}>
                        <li>
                          <div className="container-input-btn-form">
                            <div className="container-input-form">
                              <DataList 
                                line={line}
                                placeholder={t('OPERATION.PLACEHOLDER.CRYPTO')}
                                errorsForm={errorsForm}
                                onChange={onChange}
                                list={list}
                              />
                              <input 
                                className={`input-form ${errorsForm.find((err) => err === `${line.id}_${t('OPERATION.INVEST').split(' ')[1]}`) ? 'error-invest' : ''}`.trim()}
                                type="text"
                                name={`${line.id}_${t('OPERATION.INVEST').split(' ')[1]}`}
                                placeholder="0" onChange={onChange}
                              />
                              <input type="date" name={`${line.id}_date`} onChange={onChange} className={errorsForm.find((err) => err === `${line.id}_date`) ? 'error-date' : ''} />
                            </div>
                            <button className="delete-line" value={line.id} onClick={deleteLine}>+</button>
                          </div>
                        </li>
                        {cryptoLines.length !== ++id && <img className='horizontal-separator' src={horizontalSeparartor} />}
                      </Fragment>
                    )
                  })
                }
              </ol>
              <button className="add-line" value='crypto' onClick={addLine}>+</button>
            </form>
          </div>
        }
        </div>
        <button onClick={createBoard} className="btn btn-form" disabled={buttonDisabled}>{t('OPERATION.GO_BOARD')}</button>
      </> :
      <div className="container-loading">
        <img className="husky-thinks" src={huskyThinks} alt="Mascotte husky thinks" />
        <h2 className="loading-h2">{t('OPERATION.LOADING')}<DotLoading /></h2>
      </div>
    }
  </div>
  )
}

export default CreateBoard;