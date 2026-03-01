import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, List, Home, BarChart2, Moon } from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gridRef = useRef<HTMLUListElement>(null);

  const getIndexFromPath = (path: string) => {
    switch (path) {
      case '/chat': return 0;
      case '/feed': return 1; // <--- ВАЖНО: теперь это /feed
      case '/': return 2;
      case '/stats': return 3;
      case '/sleep': return 4;
      default: return 2;
    }
  };

  const [activeIndex, setActiveIndex] = useState(getIndexFromPath(location.pathname));
  const [indicatorOffset, setIndicatorOffset] = useState(0);

  const menuItems = [
    { name: "Беседа", icon: MessageCircle, path: '/chat' },
    { name: "Лента", icon: List, path: '/feed' }, // <--- ВАЖНО: путь ведет на /feed
    { name: "Дом", icon: Home, path: '/' },
    { name: "График", icon: BarChart2, path: '/stats' },
    { name: "Сон", icon: Moon, path: '/sleep' },
  ];

  useEffect(() => {
    setActiveIndex(getIndexFromPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    const updatePosition = () => {
      if (gridRef.current) {
        const itemWidth = gridRef.current.offsetWidth / 5;
        const offset = (activeIndex * itemWidth) + (itemWidth / 2) - 30;
        setIndicatorOffset(offset);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [activeIndex]);

  return (
    <div className="navigation">
      <ul className="nav-grid" ref={gridRef}>
        <div 
          className="indicator" 
          style={{ transform: `translateX(${indicatorOffset}px)` }}
        ></div>

        {menuItems.map((item, index) => (
          <li 
            key={index} 
            className={`nav-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => {
              setActiveIndex(index);
              navigate(item.path);
            }}
          >
            <div className="nav-link">
              <span className="nav-icon">
                <item.icon size={index === 2 ? 28 : 24} strokeWidth={2.5} />
              </span>
              <span className="nav-text">{item.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navigation;