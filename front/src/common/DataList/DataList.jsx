import { Fragment } from "react";
import PropTypes from 'prop-types';

import './DataList.css';

DataList.propTypes  = {
  line: PropTypes.object,
  placeholder: PropTypes.string,
  errorsForm: PropTypes.array,
  onChange: PropTypes.func,
  list: PropTypes.array,
}

function DataList ({ line, placeholder, errorsForm, onChange, list}) {
  return (
    <div>
      <input
        className={`data-list-input ${errorsForm.find((err) => err === `${line.id}_name`) ? 'error-name' : ''}`}
        placeholder={placeholder}
        type="text"
        name={line.id +'_name'}
        list={"data-" + line.id}
        onChange={onChange}
      />
      <datalist id={"data-" + line.id}>
        {
          list?.map((value, id) => {
            return (
              <Fragment key={value.symbol+'-'+id}>
                <option value={value.name+' / '+value.symbol} />
              </Fragment>
            )
          })
        }
      </datalist>
    </div>
  )
}

export default DataList;