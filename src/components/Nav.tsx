import { useState, useEffect } from "react";

export default function Header() {
  const [isMobileNavActive, setIsMobileNavActive] = useState<boolean>(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );

  // Toggle mobile navigation
  const toggleMobileNav = () => {
    setIsMobileNavActive((prev) => !prev);
  };

  // Toggle submenu in mobile view
  const toggleSubmenu = (key: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Add or remove mobile nav class to <body>
  useEffect(() => {
    if (isMobileNavActive) {
      document.body.classList.add("mobile-nav-active");
    } else {
      document.body.classList.remove("mobile-nav-active");
    }
  }, [isMobileNavActive]);

  return (
    <>
      <button
        type="button"
        id="mobile-nav-toggle"
        onClick={toggleMobileNav}
        aria-label="toggle nav"
      >
        <i className={`fa ${isMobileNavActive ? "fa-times" : "fa-bars"}`}></i>
      </button>

      <header id="header">
        <div className="container-fluid">
          <div id="logo" className="pull-left">
            <h1>
              <a href="/" className="scrollto">
                LPCV
              </a>
            </h1>
          </div>

          <nav id="nav-menu-container">
            <ul className="nav-menu">
              <li>
                <a href="/#newsletter">Newsletter</a>
              </li>
              <li>
                <a href="/">Home</a>
              </li>

              <li className="menu-has-children">
                <a href="/2025LPCVC/introduction">2025 LPCVC</a>
                <ul>
                  <li>
                    <a href="/2025LPCVC/introduction">Introduction</a>
                  </li>
                  <li>
                    <a href="/2025LPCVC/submission/track1">Model Submission</a>
                  </li>
                  <li>
                    <a href="/2025LPCVC/image-classification">Track 1</a>
                  </li>
                  <li>
                    <a href="/2025LPCVC/open-vocabulary">Track 2</a>
                  </li>
                  <li>
                    <a href="/2025LPCVC/monocular-depth">Track 3</a>
                  </li>
                </ul>
              </li>

              <li className="menu-has-children">
                <a href="/competitions/c2023">History</a>
                <ul>
                  <li>
                    <a href="/competitions/c2023">Past Workshops</a>
                  </li>
                </ul>
              </li>

              <li>
                <a href="/publications/">Publications</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation – always rendered for proper styling */}
      <nav id="mobile-nav">
        <ul>
          <li>
            <a href="/#newsletter">Newsletter</a>
          </li>
          <li>
            <a href="/">Home</a>
          </li>

          <li
            className={`menu-has-children ${
              expandedMenus["lpcvc"] ? "menu-item-active" : ""
            }`}
          >
            <i
              className={`fa ${
                expandedMenus["lpcvc"] ? "fa-chevron-up" : "fa-chevron-down"
              }`}
              onClick={() => toggleSubmenu("lpcvc")}
            ></i>
            <a href="/2025LPCVC/introduction">2025 LPCVC</a>
            <ul style={{ display: expandedMenus["lpcvc"] ? "block" : "none" }}>
              <li>
                <a href="/2025LPCVC/introduction">Introduction</a>
              </li>
              <li>
                <a href="/2025LPCVC/submission/track1">Model Submission</a>
              </li>
              <li>
                <a href="/2025LPCVC/image-classification">Track 1</a>
              </li>
              <li>
                <a href="/2025LPCVC/open-vocabulary">Track 2</a>
              </li>
              <li>
                <a href="/2025LPCVC/monocular-depth">Track 3</a>
              </li>
            </ul>
          </li>

          <li
            className={`menu-has-children ${
              expandedMenus["history"] ? "menu-item-active" : ""
            }`}
          >
            <i
              className={`fa ${
                expandedMenus["history"] ? "fa-chevron-up" : "fa-chevron-down"
              }`}
              onClick={() => toggleSubmenu("history")}
            ></i>
            <a href="/competitions/c2023">History</a>
            <ul
              style={{ display: expandedMenus["history"] ? "block" : "none" }}
            >
              <li>
                <a href="/competitions/c2023">Past Workshops</a>
              </li>
            </ul>
          </li>

          <li>
            <a href="/publications/">Publications</a>
          </li>
        </ul>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isMobileNavActive && (
        <div id="mobile-body-overly" onClick={toggleMobileNav}></div>
      )}
    </>
  );
}
