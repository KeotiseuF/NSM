import './DotLoading.css';

function DotLoading(size='initial') {
  return (
    <>
      <span className="dot dot-one" style={{fontSize: size.size}}>.</span>
      <span className="dot dot-two" style={{fontSize: size.size}}>.</span>
      <span className="dot dot-three" style={{fontSize: size.size}}>.</span>
    </>
  )
}

export default DotLoading;