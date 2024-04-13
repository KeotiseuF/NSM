import husky from '../../assets/images/husky.png';
import './Home.css';

function Home() {
  return (
    <main>
      <img className='mascotte' src={husky} alt="Mascotte husky" />
      <h1>NO SLEEP MONEY</h1>
    </main>
  )
}

export default Home;