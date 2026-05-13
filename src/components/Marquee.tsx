import React from 'react';

const THEMES = [
  'Love',
  'Loss',
  'Addiction',
  'Belonging',
  'Loneliness',
  'Hope',
  'Communication',
  'Time',
  'Place',
  'Mental health',
];

function Row() {
  return (
    <span>
      {THEMES.map((t, i) => (
        <React.Fragment key={i}>
          {t}
          <em className="star">✦</em>
        </React.Fragment>
      ))}
    </span>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <Row />
        <Row />
      </div>
    </div>
  );
}
