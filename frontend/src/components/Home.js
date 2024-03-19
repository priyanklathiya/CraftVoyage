import React from 'react'
import '../css/homepage.css';
import billboard from "../images/billboard2.jpg";
import billboard2 from "../images/banner2.png";
import billboard3 from "../images/Renaissance.jpg";

function Home() {
  return (
    <>
      <div className="banner-i">
        <div className="overlay-i"></div> {/* Light black layer */}
        <img className="banner-image-i" src={billboard} alt="Banner" />
        <div className="text-i">
          <h1 className='display-1'>Art investing for the future</h1>
          <h3 className='display-6'>Create a portfolio of Art</h3>
          <button className='button-i'>Sign up</button>
        </div>
      </div>

      <div className='container about-us-i mt-5'>
        <div className='display-4'>Craft Voyage</div>
        <h5 className='h4 mt-2'>A complete platform for investing in art</h5>
        <hr />
        <p className="lead">
          We provide a dedicated art investment platform that has provided investors with long-term capital appreciation.
          Contemporary art has outperformed the S&P for the past 26 years, but there has been no way to invest in it.
          Masterworks is the first company to offer art investment products to the retail investing public.
        </p>
      </div>

      {/* <div className='container mission-i mt-5'>
        <div className='display-4'>Our Mission</div>
        <hr />
        <img className="banner-3-img" src={billboard3} alt="Banner-3" />
        <p className="lead">
          Our mission is to make art investable.
          CraftVoyage is the only platform that lets you invest in multi-million dollar works of art by artists like Basquiat, Picasso, Banksy, and more.
        </p>
      </div> */}
      <div className='container mission-i mt-5'>
        <div className='display-4'>Our Mission</div>
        <hr className="mt-2 mb-4" /> {/* Adjust margins as needed */}
        <div className="row">
          <div className="col-md-6">
            <img className="banner-3-img img-fluid" src={billboard3} alt="Banner-3" />
          </div>
          <div className="col-md-6 d-flex align-items-center">
            <p className="lead text-center"> {/* Added text-center class */}
              Our mission is to make art investable.
              CraftVoyage is the only platform that lets you invest in multi-million dollar works of art by artists like Basquiat, Picasso, Banksy, and more.
            </p>
          </div>
        </div>
      </div>

      <div className='container mt-5 banner-2 d-flex justify-content-center'>
        <img className="banner-2-img" src={billboard2} alt="Banner-2" />
      </div>

      
      <div className='container mission-i mt-5'>
        <div className='display-4'>Why choose art as investment? </div>
        <hr />
        <p className="lead">
          Art still performs in high inflationary periods
          Contemporary Art has demonstrated strong appreciation in high inflation periods, like right now.
        </p>
      </div>
      <div className='p-5'></div>
    </>
  )
}

export default Home