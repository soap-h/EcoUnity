import React, { useEffect } from 'react';

const TableauDashboard = () => {
  useEffect(() => {
    // Dynamically create and append the script for Tableau embedding
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://prod-apnortheast-a.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
    document.body.appendChild(script);

    return () => {
      // Clean up script element when the component is unmounted
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <tableau-viz
        id="tableau-viz"
        src="https://prod-apnortheast-a.online.tableau.com/t/232074a2d7d49a8f8/views/Book1/Dashboard1"
        width="1000"
        height="840"
        hide-tabs
        toolbar="bottom"
      ></tableau-viz>
    </div>
  );
};

export default TableauDashboard;
