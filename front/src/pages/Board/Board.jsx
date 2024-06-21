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
    {id: 'charts', title: t('BOARD.TITLE.CHARTS')},
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

  const [pieData, setPieData] = useState(pieBase);

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
      if(themeAsset !== 'total' ) return totalInvest = dataStorage[themeAsset];
      totalInvest = dataStorage[prop].concat(totalInvest);
    });
    totalInvest.forEach((invest) => {
      total += Number(invest.invest.split(' ')[0]);

      pie.labels.push(invest.name.split('/')[1]);
    });
    totalInvest.forEach((invest) => pie.datasets[0].data.push(toPercentage(Number(invest.invest.split(' ')[0]), total)));

    pie.datasets[0].data.forEach(() => {
      pie.datasets[0].backgroundColor.push(backgroundPieColors[i]);
      pie.datasets[0].borderColor.push(borderPieColors[i]);
      i++;
    })
    setPieData(pie);
  };

  const addDataForInfo = (themeAsset) => {
    let totalInvest = [];

    propsData.forEach((prop) => {
      if(themeAsset !== 'total' ) return totalInvest = dataStorage[themeAsset];
      totalInvest = dataStorage[prop].concat(totalInvest);
    });

    return totalInvest.map((data, id)=> {
      return (
        <tr key={`line-${id}`}>
          <th scope="row">{data.name.split('/')[0]}</th>
          <td>{data.name.split('/')[1]}</td>
          <td>{data.date}</td>
          <th scope="row">{data.invest}</th>
          <th scope="row">prix</th>
          <th scope="row">nm asset</th>
          <td>{++id}</td>
        </tr>
      )
    })
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
    fetch('https://www.coingecko.com/en/coins/bitcoin/historical_data?start=2024-05-20&end=2024-05-20')
    .then((res) => console.log(res))
  }, [])

  return (
    <main>
      {
        sections.map((section) => {
          return ( 
            <section key={section.id}>
              <div className="container-title">
                <h1>{section.title}</h1>
                { severalAsset &&
                  <div>
                    <div>
                      <input
                        type="checkbox"
                        name={`total-${section.id}`}
                        id={`total-${section.id}`}
                        checked={`total-${section.id}` === check[section.id]}
                        onChange={dataToDisplay}
                        disabled={`total-${section.id}` === check[section.id]}
                      />
                      <label htmlFor={`total-${section.id}`}>Total</label>
                    </div>
                    {
                      propsData.map((themeAsset) => {
                        return (
                          <div key={themeAsset}>
                            <input
                              type="checkbox"
                              name={`${themeAsset}-${section.id}`} id={`${themeAsset}-${section.id}`}
                              checked={`${themeAsset}-${section.id}` === check[section.id]}
                              onChange={dataToDisplay}
                              disabled={`${themeAsset}-${section.id}` === check[section.id]} 
                            />
                            <label htmlFor={`${themeAsset}-${section.id}`}>{themeAsset}</label>
                          </div>
                        )
                      })
                    }
                  </div>
                }
              </div>
              { section.id === 'charts' ?
                <div className="container-chart">
                  <Pie data={pieData} />
                </div> :
                <div className="container-info">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Symbol</th>
                        <th scope="col">Date</th>
                        <th scope="col">Invest</th>
                        <th scope="col">Price buy day</th>
                        <th scope="col">Number asset</th>
                        <th scope="col">Id</th>
                      </tr>
                    </thead>
                    <tbody>
                      { addDataForInfo(check.infos.split('-')[0]) }
                    </tbody>
                    <tfoot>
                      <tr>
                        <th scope="row" colSpan="2">Total</th>
                        <td>50</td>
                      </tr>
                    </tfoot>
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