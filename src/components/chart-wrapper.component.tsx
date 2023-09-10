import { ReactNode } from 'react';

interface Props {
  title: string;
  description: string;
  pointCount: number;
  children: ReactNode;
}

const ChartWrapper = ({ title, pointCount, description, children }: Props) => (
  <div
    className='flex flex-col p-4 rounded-md border-2 bg-black border-black'
    style={{
      border: '2px solid #fff',
      borderRadius: '5px',
      padding: '0.5rem',
      textAlign: 'center',
      backgroundColor: 'rgb(62, 73, 82)',
      color: '#fff',
    }}
  >
    <h3>
      {title} &#40;{pointCount} Points&#41;
    </h3>
    <p>{description}</p>
    {children}
  </div>
);

export default ChartWrapper;