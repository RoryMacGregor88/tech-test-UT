import { ReactNode } from 'react';

interface Props {
  title: string;
  description: string;
  pointCount: number;
  children: ReactNode;
}

const ChartWrapper = ({ title, pointCount, description, children }: Props) => (
  <div
    style={{
      border: '2px solid #fff',
      borderRadius: '5px',
      padding: '1rem',
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
