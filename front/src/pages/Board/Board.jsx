import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Pie } from 'react-chartjs-2';

import { getHistoricalData, postCreateExcel } from "../../services/request";
import { toPercentage } from "../../services/math";
import colors from "../../services/colors";

import DotLoading from '../../common/DotLoading/DotLoading';
import { saveAs } from 'file-saver';

import './Board.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function Board() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [dataExcel, setDataExcel] = useState();
  const [propsDataExcel, setPropsDataExcel] = useState();
  const [initDisplay, setInitDisplay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('');
  const [check, setCheck] = useState({
    charts: 'total-charts',
    infos: 'total-infos',
  });
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 2,
      },
    ],
  });

  const backgroundPieColors = colors(0.3);
  const borderPieColors = colors(1);
  const sections = [
    {id: 'charts', title: t('BOARD.CHARTS.TITLE')},
    {id: 'infos', title: 'INFOS'}
  ];
  const assetCheckboxStyle = {
    backgroundColor: 'var(--primary-color)',
    fontWeight: 'bold',
  };

  const takeOffEmptyOfNumber = (string) => {
    let number = string;
    let lengthString = number.length;
    const symbol = string.split(' ')[--lengthString];
    
    number = number.replaceAll(" ", '');
    number = number.replace(symbol, '');
    return number;
  }

  const initDatasets = useCallback((themeAsset, pie) => {
    const datasetsLabels = {
      total: t('BOARD.CHARTS.ON_TOTAL'),
      stocks: t('BOARD.CHARTS.ON_STOCK'),
      cryptos: t('BOARD.CHARTS.ON_CRYPTO'),
    };

    return pieData.datasets.map((data) => {
      return {
        ...data, 
        label: datasetsLabels[themeAsset],
        data: pie.data,
        backgroundColor: pie.backgroundColor,
        borderColor: pie.borderColor,
      };
    })
  }, [t])

  const addDataForChart = useCallback((themeAsset, propArray, dataExcel) => {
    let i = 0;
    let total = 0;
    let pie = {
      totalInvest: [],
      labels: [],
      data: [],
      backgroundColor: [],
      borderColor: [],
    }

    const getNumber = (text) => text.invest.split(' ').length > 2 ? takeOffEmptyOfNumber(text.invest) : Number(text.invest.split(' ')[0]);

    propArray.forEach((prop) => {
      if(themeAsset !== 'total') return pie.totalInvest = dataExcel[themeAsset];
      pie.totalInvest = dataExcel[prop].concat(pie.totalInvest);
    });
    pie.totalInvest.forEach((invest, id) => {
      total += getNumber(invest);

      pie.labels.push(invest.name.split('/')[1].toUpperCase());
      if(pie.totalInvest.length === id + 1) pie.totalInvest.forEach((invest) => pie.data.push(toPercentage(getNumber(invest), total)));
    });

    pie.data.forEach(() => {
      pie.backgroundColor.push(backgroundPieColors[i]);
      pie.borderColor.push(borderPieColors[i]);
      i++;
    })

    setPieData({
      ...pieData, 
      labels: pie.labels,
      datasets: initDatasets(themeAsset, pie),
    });
  }, [initDatasets]);

  const addDataForInfo = (themeAsset, invest) => {
    let totalInvest = [];
    const totalLine = {
      invest: 0,
      nbAsset: 0,
      buyPrice: 0,
      // symbol: '',
      id: 0,
    };
    const numberFormat = new Intl.NumberFormat('en-US');
    const dataExcel = JSON.parse(localStorage.getItem('dataExcel'));
    const propsDataExcel = Object.keys(dataExcel);
    let assets = invest || dataExcel;

    propsDataExcel.forEach((prop) => {
      if(themeAsset !== 'total') return totalInvest = assets[themeAsset];
      totalInvest = assets[prop].concat(totalInvest);
    });

    const indexSymbol = totalInvest[0].invest.split(' ').length - 1;
    totalLine.symbol = totalInvest[0].invest.split(' ')[indexSymbol];
    totalLine.id = totalInvest.length + 1;
    let noData = (num, id) => {
      if(num === '' || id.includes('stock')) return t('BOARD.INFOS.NO_DATA');
      return <DotLoading size='xx-large' />
    };

    return (
      <>
        <tbody>
          { totalInvest.map((data, id)=> {
            const checkNumber = data.invest.split(' ').length > 2 ?
            takeOffEmptyOfNumber(data.invest) :
            Number(data.invest.split(' ')[0]);

            let buyPrice = 0;
            let nbAsset = 0;
            let getValueInvest = data.buyPrice?.split('$')[1];

            if(data.buyPrice) {
              buyPrice = Number(getValueInvest.replace(',', getValueInvest.includes(',') && getValueInvest.includes('.') ? '' : '.'));
              nbAsset = buyPrice * checkNumber;
            }

            totalLine.buyPrice += buyPrice;
            totalLine.nbAsset += nbAsset;
            totalLine.invest += checkNumber;
            return (
              <tr key={`line-${id}`}>
                <th scope="row">{data.name.split('/')[0]}</th>
                <td>{data.name.split('/')[1].toUpperCase()}</td>
                <td>{data.date}</td>
                <td>{data.buyPrice ? `${numberFormat.format(buyPrice)} $` : noData(data.buyPrice, data.id) }</td>
                <td>{data.buyPrice ? numberFormat.format(nbAsset) : noData(data.buyPrice, data.id) }</td>
                <td>{data.invest}</td>
                <td>{++id}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <td></td>
            <td></td>
            <td>{numberFormat.format(totalLine.buyPrice) + ' $'}</td>
            <td>{numberFormat.format(totalLine.nbAsset)}</td>
            <td>{numberFormat.format(totalLine.invest) + ' $'}</td>
            <td>{totalLine.id}</td>
          </tr>
        </tfoot>
      </>
    )
  };

  const initData = useCallback((propArray, dataExcel) => {
    if(check.charts === 'stocks-charts' || propArray.length === 1 && propArray[0] === 'stocks') return addDataForChart('stocks', propArray, dataExcel);
    if(check.charts === 'cryptos-charts' || propArray.length === 1 && propArray[0] === 'cryptos') return addDataForChart('cryptos', propArray, dataExcel);
    addDataForChart('total', propArray, dataExcel);
  }, [addDataForChart])

  const dataToDisplay = (element) => {
    const id = element.target.id;
    const asset = id.split('-')[0];

    if(id.includes('charts')) {
      setCheck({...check, charts: id});
      addDataForChart(asset, propsDataExcel, dataExcel);
    }
    if(id.includes('infos')) setCheck({...check, infos: id});
  }

  const getHistory = useCallback(async (invest) => {
    let data = invest;
    if(invest.cryptos) data = await getHistoricalData(invest);
    setLoading(false);
    setDataExcel(data);
  }, [])

  useEffect(() => {
    let dataE = JSON.parse(localStorage.getItem('dataExcel'));
    const propsDataExcel = Object.keys(dataE);

    if(!initDisplay) {
      if(propsDataExcel.find((prop) => prop === 'cryptos')) {
        getHistory(dataE);
      } else {
        setDataExcel(dataE);
        setLoading(false);
      }
      setPropsDataExcel(propsDataExcel);
      setInitDisplay(true);
    }
    if(!initDisplay || lang !== i18n.language) {
      initData(propsDataExcel, dataE);
      setLang(i18n.language);
    }
  }, [initData, i18n, lang, initDisplay, getHistory, setDataExcel])

  const resetData = () => {
    localStorage.removeItem('dataExcel');
    navigate('..');
  }

  const createExcel = () => {
    postCreateExcel(dataExcel).then((res) => {
      const date = new Date();
      const filename =  t('BOARD.CHARTS.CREATE_EXCEL').includes('create') ? 
        `NSM-report_${(date.getMonth() +1)}-${date.getDate()}-${date.getFullYear()}.xlsx`:
        `NSM-rapport_${(date.getDate())}-${date.getMonth() + 1}-${date.getFullYear()}.xlsx`;
  
      saveAs(res, filename.toString());
    });
  }

  return (
    <main>
      {
        lang === i18n.language && sections.map((section) => {
          return (
             <section key={section.id}>
              <div className="container-section">
                <div className="container-title">
                  <h1 className="title-section">{section.title}</h1>
                  {section.id === 'charts' && (
                    loading ?
                      <div className="loading-excel">
                        <div>
                          <DotLoading size='xx-large' />
                        </div>
                      </div> :
                      <input className="excel-input" type="button" value="Create Excel" onClick={createExcel} />
                  )}
                  {section.id === 'charts' && <input className="reset-input" type="button" value="Reset" onClick={resetData} />}
                </div>
                { propsDataExcel && propsDataExcel.length > 1 && 
                  <div>
                    <div className="container-asset-checkbox">
                      <input
                        type="checkbox"
                        name={`total-${section.id}`}
                        id={`total-${section.id}`}
                        checked={`total-${section.id}` === check[section.id]}
                        onChange={dataToDisplay}
                        disabled={`total-${section.id}` === check[section.id]}
                        className="asset-checkbox"
                      />
                      <label
                        htmlFor={`total-${section.id}`}
                        className="asset-label"
                        style={`total-${section.id}` === check[section.id] ? assetCheckboxStyle : {}}
                      >
                        Total
                      </label>
                    </div>
                    {
                      propsDataExcel.map((themeAsset) => {
                        return (
                          <div key={themeAsset} className="container-asset-checkbox">
                            <input
                              type="checkbox"
                              name={`${themeAsset}-${section.id}`} id={`${themeAsset}-${section.id}`}
                              checked={`${themeAsset}-${section.id}` === check[section.id]}
                              onChange={dataToDisplay}
                              disabled={`${themeAsset}-${section.id}` === check[section.id]}
                              className="asset-checkbox"
                            />
                            <label
                              htmlFor={`${themeAsset}-${section.id}`}
                              className="asset-label"
                              style={`${themeAsset}-${section.id}` === check[section.id] ? assetCheckboxStyle : {}}
                            >
                              {t(`BOARD.INFOS.${themeAsset.toUpperCase()}`)}
                            </label>
                          </div>
                        )
                      })
                    }
                  </div>
                }
              </div>
              { section.id === 'charts' ?
                <div className="container-chart">
                  {pieData.datasets[0].data.length > 0 && <Pie data={pieData} />}
                </div> :
                <div className="container-info">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">{t('BOARD.INFOS.NAME')}</th>
                        <th scope="col">{t('BOARD.INFOS.SYMBOL')}</th>
                        <th scope="col">DATE</th>
                        <th scope="col">{t('BOARD.INFOS.BUY_PRICE')}</th>
                        <th scope="col">{t('BOARD.INFOS.NUMBER_ASSET')}</th>
                        <th scope="col">INVEST</th>
                        <th scope="col">ID</th>
                      </tr>
                    </thead>
                    { addDataForInfo(check.infos.split('-')[0], dataExcel) }
                  </table>
                </div>
              }
            </section>
          )
        })
      }
    </main>
  )
}

export default Board;