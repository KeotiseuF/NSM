import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

import separartor from "../../assets/images/separator.svg";

import './CreateExcel.css';

function CreateExcel({nbStock, nbCrypto}) {
  const { t } = useTranslation();
  const checkStockAndCrypto = nbStock > 0 && nbCrypto > 0;

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

    if (value === 'stock') console.log(lines)
    return lines;
  }

  return (
  <div className="top-container">
    <div className={classContainerForms}>
      {nbStock > 0 &&
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
                      <select name="stock">
                        <option value="">--Please choose an option--</option>
                        <option value="apple">Apple</option>
                        <option value="coca-cola">Coca-cola</option>
                        <option value="air-liquide">Air Liquide</option>
                      </select>
                      <input className="input-form" type="text" name="value-crypto" />
                      <input type="date" />
                      <button>X</button>
                    </li>
                  )
                }) 
              }
            </ol>
            <input type="button" />
          </form>
        </div>
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
                            <option value="btc">BTC</option>
                            <option value="eth">ETH</option>
                            <option value="borg">BORG</option>
                            <option value="sol">SOL</option>
                            <option value="usdc">USDC</option>
                          </select>
                        <input className="input-form" type="text" />
                        <input type="date" />
                        <button>X</button>
                    </li>
                  )
                })
              }
            </ol>
            <input type="button" />
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