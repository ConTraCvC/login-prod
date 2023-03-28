import React from 'react';
import './possibility.css';
import possibilityImage from '../../assets/possibility.png';

const Possibility = () => {
  return (
    <div className='gpt3_possibility section_padding' id='possibility'>
      <div className='gpt3_possibility-image'>
        <img src={possibilityImage} alt="possibility" />
      </div>
      <div className='gpt3_possibility-content'>
        <h4>Request Early Access to Get Started</h4>
        <h1 className='gradient-text'>The possibilities are beyond your imagination</h1>
        <p>How many like him, are they still. Who to us all, seem to have lost the will.
          They lie in thousands lank and lost. Is knowledge worth this bitter cost.</p>
        <h4>Keep the world with all its sin. It's not fit for living in</h4>
      </div>
    </div>
  )
}

export default Possibility