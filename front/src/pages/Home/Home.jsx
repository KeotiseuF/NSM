import { useEffect, useState } from 'react';
import husky from '../../assets/images/husky.png';
import { getArticleNYTimes } from '../../services/stock/stockRequest';
import './Home.css';

function Home() {
  const [listArticleNYTimes, setListArticleNYTimes] = useState([]);
  const [init, setInit] = useState(true);

  useEffect(() => {
    if(init && !listArticleNYTimes.length) {
      getArticleNYTimes().then((list) => setListArticleNYTimes(list.results));
      setInit(false);
    }
  }, [init])

  return (
    <main className='home-main'>
      <div className='container-article'>
        <h2>Stock News</h2>
        <ul>
          {listArticleNYTimes.map((article, id) => {
            const publicationDate = new Date(article.first_published_date).toLocaleDateString();
            return (
              <li key={'article-'+[++id]}>
                <a href={article.url}>
                  <p className='title-article'>{article.title}</p>

                  <div className='container-date-article'>
                    <p><span className='underline-text'>Publication:</span> {publicationDate}</p>
                    <p><span className='underline-text'>Source:</span> {article.source}</p>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
      <div className='container-mascotte'>
        <img className='mascotte' src={husky} alt="Mascotte husky" />
        <h1>NO SLEEP MONEY</h1>
      </div>
      <div className='container-article'>
        <h2>Crypto News</h2>
        <p>Soon...</p>
        {/* <ul>
          {listArticleNYTimes.map((article, id) => {
            const publicationDate = new Date(article.first_published_date).toLocaleDateString();
            return (
              <li key={'article-'+[++id]}>
                <a href={article.url}>
                  <p className='title-article'>{article.title}</p>

                  <div className='container-date-article'>
                    <p><span className='underline-text'>Publication:</span> {publicationDate}</p>
                    <p><span className='underline-text'>Source:</span> {article.source}</p>
                  </div>
                </a>
              </li>
            )
          })}
        </ul> */}
      </div>
    </main>
  )
}

export default Home;