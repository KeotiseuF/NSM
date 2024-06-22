import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import colors from "../../services/colors";
import { toPercentage } from "../../services/math";
import './Board.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function Board() {
  const { t } = useTranslation();
  const [severalAsset, setSeveralAsset] = useState(false);
  const [check, setCheck] = useState({
    charts: 'total-charts',
    infos: 'total-infos',
  });

  const dataStorage = JSON.parse(localStorage.getItem('dataExcel'));
  const propsData = Object.keys(dataStorage);
  const backgroundPieColors = colors(0.3);
  const borderPieColors = colors(1);
  const sections = [
    {id: 'charts', title: t('BOARD.CHARTS.TITLE')},
    {id: 'infos', title: 'INFOS'}
  ];
  const pieBase = {
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
  }
  const assetCheckboxStyle = {
    backgroundColor: 'var(--primary-color)',
    fontWeight: 'bold',
  };

  const [pieData, setPieData] = useState(pieBase);

  const takeOffEmptyOfNumber = (string) => {
    let number = string;
    let lengthString = number.length;
    const symbol = string.split(' ')[--lengthString];
    
    number = number.replaceAll(" ", '');
    number = number.replace(symbol, '');
    return number;
  }  

  const addDataForChart = (themeAsset) => {
    let i = 0;
    let total = 0;
    let totalInvest = [];
    const datasetsLabels = {
      total: 'On total (%)',
      stocks: 'On stock (%)',
      cryptos: 'On crypto (%)',
    };
    const pie = pieBase;

    pie.datasets[0].label = datasetsLabels[themeAsset];

    propsData.forEach((prop) => {
      if(themeAsset !== 'total') return totalInvest = dataStorage[themeAsset];
      totalInvest = dataStorage[prop].concat(totalInvest);
    });
    totalInvest.forEach((invest) => {
      const checkNumber = invest.invest.split(' ').length > 2 ? takeOffEmptyOfNumber(invest.invest) : Number(invest.invest.split(' ')[0]);
      total += checkNumber;

      pie.labels.push(invest.name.split('/')[1].toUpperCase());
    });
    totalInvest.forEach((invest) => {
      const checkNumber = invest.invest.split(' ').length > 2 ? takeOffEmptyOfNumber(invest.invest) : Number(invest.invest.split(' ')[0]);
      pie.datasets[0].data.push(toPercentage(checkNumber, total))
    });

    pie.datasets[0].data.forEach(() => {
      pie.datasets[0].backgroundColor.push(backgroundPieColors[i]);
      pie.datasets[0].borderColor.push(borderPieColors[i]);
      i++;
    })
    setPieData(pie);
  };

  const addDataForInfo = (themeAsset) => {
    let totalInvest = [];
    const totalLine = {
      invest: 0,
      nbAsset: 0,
      symbol: '',
      id: 0,
    };
    const numberFormat = new Intl.NumberFormat('fr-EU');

    propsData.forEach((prop) => {
      if(themeAsset !== 'total') return totalInvest = dataStorage[themeAsset];
      totalInvest = dataStorage[prop].concat(totalInvest);
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

  const initData = () => {
    if(propsData.length === 1 && propsData[0] === 'stocks') return addDataForChart('stocks');
    if(propsData.length === 1 && propsData[0] === 'cryptos') return addDataForChart('cryptos');
    setSeveralAsset(true);
    addDataForChart('total');
  }

  const dataToDisplay = (element) => {
    const id = element.target.id;
    const asset = id.split('-')[0];

    if(id.includes('charts')) {
      setCheck({...check, charts: id});
      addDataForChart(asset);
    }
    if(id.includes('infos')) setCheck({...check, infos: id});
  }

  useEffect(() => {
    initData();
  }, [])

  return (
    <main>
      {
        sections.map((section) => {
          return ( 
            <section key={section.id}>
              <div className="container-title">
                <h1 className="title-section">{section.title}</h1>
                { severalAsset &&
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
                      propsData.map((themeAsset) => {
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
                  {pieData.labels.length !== 0 && <Pie data={pieData} />}
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