import { useState } from "react";
import PropTypes from 'prop-types';

import './DataList.css';

DataList.propTypes  = {
  initList: PropTypes.array,
  line: PropTypes.string,
  placeholder: PropTypes.string,
}

function DataList ({initList, line, placeholder}) {
  const [list, setList] = useState(null);

  const resetList = () => setList(null);

  const filterList = (name, value) => {
    const chekStockName = name.includes('stock') && value.length >= 3; 
    const chekCryptoName = name.includes('crypto') && value.length >= 2;
    let newListStock = undefined;
    let newListCrypto = undefined;
    let listWithDuplicata = undefined;

    if(chekStockName){
      listWithDuplicata = initList.filter((stock) => (stock.name.toLowerCase() + ' / ' + stock.symbol.toLowerCase()).includes(value.toLowerCase()));
      newListStock = [...new Map(listWithDuplicata.map((stock) => [stock.symbol, stock])).values()];
    }
    if(chekCryptoName){
      newListCrypto = initList.filter((stock) => (stock.name.toLowerCase() + ' / ' + stock.symbol.toLowerCase()).includes(value.toLowerCase()));
    }

    !chekStockName && resetList(newListStock);
    !chekStockName && resetList(newListCrypto);
    
    newListStock && setList(newListStock);
    newListCrypto && setList(newListCrypto);
  }

  const onChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    filterList(name, value);
  }

  // const validate = (event) => {
  //   const value = event.target.value;
  //   const symbol = event.target.name;
  //   const nameInvest = value.split('/')[0].trim();

  //   event.preventDefault();

  //   setValueNameInvest(nameInvest);
  //   setUserStock([...userStock, {symbol, nameInvest}]);
  // }

  return (
    <div>
      <input className="data-list-input" placeholder={placeholder} type="text" name={line} list={"data-" + line} onChange={onChange}/>
      <datalist id={"data-" + line}>
        {
          list?.map((value) => {
            return (
              <>
                <option value={value.name+' / '+value.symbol} />
              </>
            )
          })
        }
      </datalist>
    </div>
  )
}

export default DataList;