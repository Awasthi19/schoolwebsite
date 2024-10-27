import React from 'react';

interface Statistic {
  number: string;
  label: string;
}

const stats: Statistic[] = [
  { number: '200+', label: 'PROGRAMS' },
  { number: '18000+', label: 'CURRENT STUDENTS' },
  { number: '45437', label: 'GRADUATES' },
  { number: '22', label: 'AFFILIATIONS/EXTENDED' },
  { number: '1861', label: 'FACULTY/STAFF' },
];

const Statistics: React.FC = () => {
  return (
    <div className="relative statistics-container"
    >
       <div className="stat-overlay"></div>
       <div className="stats-content">
      {stats.map((stat, index) => (
        <div key={index} className='flex space-x-8 '>
        <div
          key={index}
          className={`stat-item `}
        >
          <h2 className="stat-number">{stat.number}</h2>
          <p className="stat-label">{stat.label}</p>
        </div>
        <div className={`${index !== stats.length - 1 ? 'stat-divider' : ''}`}></div>
        </div>
      ))}
      </div>
    

    </div>
  );
};

export default Statistics;
