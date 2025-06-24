  export const generateDefaultImage = (name) => {
    const initials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const colors = [
      { bg: '#4F46E5', text: 'white' }, // Indigo
      { bg: '#7C3AED', text: 'white' }, // Violet  
      { bg: '#DC2626', text: 'white' }, // Red
      { bg: '#059669', text: 'white' }, // Emerald
      { bg: '#D97706', text: 'white' }, // Amber
      { bg: '#DB2777', text: 'white' }, // Pink
    ];

    const colorIndex = name.length % colors.length;
    const color = colors[colorIndex];

    return `data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100' height='100' fill='${encodeURIComponent(color.bg)}'/%3e%3ctext x='50' y='50' font-family='Arial, sans-serif' font-size='36' font-weight='bold' text-anchor='middle' dy='0.35em' fill='${color.text}'%3e${initials}%3c/text%3e%3c/svg%3e`;
  };
  