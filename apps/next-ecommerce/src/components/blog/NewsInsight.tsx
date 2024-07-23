import React from 'react';
import BlogItem from './BlogItem';
import { BlogType } from '@/BlogType';

interface Props {
  data: Array<BlogType>;
  start: number;
  limit: number;
}
const NewsInsight: React.FC<Props> = ({ data, start, limit }) => {
  return (
    <div className="news-block pt-10 md:pt-20">
      <div className="container">
        <div className="heading3 text-center">Insight</div>
        <div className="list-blog mt-6 grid gap-[30px] md:mt-10 md:grid-cols-3">
          {data.slice(start, limit).map((prd, index) => (
            <BlogItem key={index} data={prd} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsInsight;
