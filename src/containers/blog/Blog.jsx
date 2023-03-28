import React from 'react';
import './blog.css';
import { Article } from '../../components'
import { blog01, blog02, blog03, blog04, blog05 } from './imports';

const Blog = () => {
  return (
    <div className='gpt3_blog section_padding' id='blog'>
      <div className='gpt3_blog-heading'>
        <h1 className='gradient-text'>A lot is happening, We are blogging about it.</h1>
      </div>
      <div className='gpt3_blog-container'>
        <div className='gpt3_blog-container_groupA'>
          <Article imgUrl={blog01} date='Mar 3, 2022' title="Tornado of Soul !! This morning I made the call. The one that ends it all.
          Hanging up, I wanted to cry.
          But dammit, this well's gone dry.
          Not for the money, not for the fame,
          not for the power, just no more games." />
        </div>
        <div className='gpt3_blog-container_groupB'>
          <Article imgUrl={blog02} date='Jan 2, 2022' title="Your mind now bzzzzzz !!" />
          <Article imgUrl={blog03} date='Feb 26, 2022' title="Block chain. Trick or treat !!" />
          <Article imgUrl={blog04} date='Nov 12, 2022' title="010101. You can't read this but machine can !!" />
          <Article imgUrl={blog05} date='Dec 15, 2022' title="GPT-3 and Open  AI is the future. Let us exlore how it is?" />
        </div>
      </div>
    </div>
  )
}

export default Blog