import { useTranslation } from "react-i18next";

import warning from "../../assets/images/warning.svg";

import './Operation.css'

function Operation() {
  const { t } = useTranslation();

  return (
    <main>
      <img className="warning" src={warning} />
      <div className="container-import">
        <h1>{t('OPERATION.NO_DATA')}</h1>
        <div className="container-btn-import">
          <button className="btn">{t('OPERATION.IMPORT')}</button>
          {t('OPERATION.OR')}
          <button className="btn">{t('OPERATION.CREATE')}</button>
        </div>
      </div>
    </main>
  )
}

export default Operation;