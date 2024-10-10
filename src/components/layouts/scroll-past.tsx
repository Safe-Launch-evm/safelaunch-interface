/* eslint-disable @next/next/no-img-element */
import Marquee from 'react-fast-marquee';

const ScrollPast = () => {
  return (
    <Marquee pauseOnHover speed={120} className="h-10 bg-background">
      {[...Array(14)].map((x, index) => (
        <ScrollItem key={index} />
      ))}
      <ScrollItem />
    </Marquee>
  );
};

export default ScrollPast;

function ScrollItem() {
  return (
    <div className="flex border-r border-border p-2 px-4">
      <p>
        TNM...s9T <span className="font-bold text-primary">Bought</span> 1,000.5 TRX of{' '}
      </p>
      <div className="ml-2 flex items-center">
        <img
          src="https://mrcally.com/recent-dp.jpeg"
          alt="yuy"
          className="mr-1 size-[21px] rounded"
        />{' '}
        <span>YSU</span>
      </div>
    </div>
  );
}
