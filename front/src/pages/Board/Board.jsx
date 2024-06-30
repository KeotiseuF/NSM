import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import colors from "../../services/colors";
import { toPercentage } from "../../services/math";
import './Board.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function Board() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dataExcel, setDataExcel] = useState();
  const [propsDataExcel, setPropsDataExcel] = useState();
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
      if(pie.totalInvest.length === ++id) pie.totalInvest.forEach((invest) => pie.data.push(toPercentage(getNumber(invest), total)));
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

  const addDataForInfo = (themeAsset) => {
    let totalInvest = [];
    const totalLine = {
      invest: 0,
      nbAsset: 0,
      symbol: '',
      id: 0,
    };
    const numberFormat = new Intl.NumberFormat('fr-EU');
    const dataExcel = JSON.parse(localStorage.getItem('dataExcel'));
    const propsDataExcel = Object.keys(dataExcel);

    propsDataExcel.forEach((prop) => {
      if(themeAsset !== 'total') return totalInvest = dataExcel[themeAsset];
      totalInvest = dataExcel[prop].concat(totalInvest);
    });
    const indexSymbol = --totalInvest[0].invest.split(' ').length;
    totalLine.symbol = totalInvest[0].invest.split(' ')[indexSymbol];
    totalLine.id = ++totalInvest.length;

    return (
      <>
        <tbody>
          { totalInvest.map((data, id)=> {
            const checkNumber = data.invest.split(' ').length > 2 ? 
            takeOffEmptyOfNumber(data.invest) : 
            Number(data.invest.split(' ')[0]);

            totalLine.invest += checkNumber;

            return (
              <tr key={`line-${id}`}>
                <th scope="row">{data.name.split('/')[0]}</th>
                <td>{data.name.split('/')[1].toUpperCase()}</td>
                <td>{data.date}</td>
                <td>{data.invest}</td>
                {/* <td>Prix</td>
                <td>Nm asset</td> */}
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
            <td>{numberFormat.format(totalLine.invest) + ' ' + totalLine.symbol}</td>
            {/* <td></td>
            <td>{totalLine.nbAsset}</td> */}
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

  useEffect(() => {
    console.log(check)
    const dataExcel = JSON.parse(localStorage.getItem('dataExcel'));
    const propsDataExcel = Object.keys(dataExcel);

    setDataExcel(dataExcel);
    setPropsDataExcel(propsDataExcel);
    initData(propsDataExcel, dataExcel);
  }, [initData])

  const recreate = () => {
    localStorage.removeItem('dataExcel');
    navigate('..');
  }

  return (
    <main>
      {
        sections.map((section) => {
          return (
            <section key={section.id}>
              <div className="container-section">
                <div className="container-title">
                  <h1 className="title-section">{section.title}</h1>
                  {section.id === 'charts' && <input type="button" value="Reset" onClick={recreate} />}
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
                        <th scope="col">INVEST</th>
                        {/* <th scope="col">PRICE BUY DAY</th>
                        <th scope="col">NUMBER ASSET</th> */}
                        <th scope="col">ID</th>
                      </tr>
                    </thead>
                    { addDataForInfo(check.infos.split('-')[0]) }
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