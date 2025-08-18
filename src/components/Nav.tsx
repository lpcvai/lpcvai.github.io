import { useState, useEffect } from "react";

export default function Header() {
  const [isMobileNavActive, setIsMobileNavActive] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );
  const [hoverTimeouts, setHoverTimeouts] = useState<
    Record<string, ReturnType<typeof setTimeout> | null>
  >({});

  const isDesktop = () =>
    typeof window !== "undefined" && window.innerWidth > 768;

  const toggleMobileNav = () => {
    setIsMobileNavActive((prev) => !prev);
  };

  const toggleSubmenu = (key: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleMouseEnter = (key: string) => {
    if (!isDesktop()) return;

    if (hoverTimeouts[key]) clearTimeout(hoverTimeouts[key]!);

    setExpandedMenus((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const handleMouseLeave = (key: string) => {
    if (!isDesktop()) return;

    const timeout = setTimeout(() => {
      setExpandedMenus((prev) => ({
        ...prev,
        [key]: false,
      }));
    }, 300);

    setHoverTimeouts((prev) => ({
      ...prev,
      [key]: timeout,
    }));
  };

  useEffect(() => {
    if (isMobileNavActive) {
      document.body.classList.add("mobile-nav-active");
    } else {
      document.body.classList.remove("mobile-nav-active");
    }

    return () => {
      Object.values(hoverTimeouts).forEach((t) => t && clearTimeout(t));
    };
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

              <li
                className="menu-has-children"
                onMouseEnter={() => handleMouseEnter("lpcvc")}
                onMouseLeave={() => handleMouseLeave("lpcvc")}
              >
                <a href="/2025LPCVC/introduction">
                  2025 LPCVC{" "}
                  <i
                    className={`fa ${expandedMenus["lpcv"] ? "fa-chevron-up" : "fa-chevron-down"}`}
                  ></i>
                </a>
                <ul
                  style={{ display: expandedMenus["lpcvc"] ? "block" : "none" }}
                >
                  <li>
                    <a href="/2025LPCVC/introduction">Introduction</a>
                  </li>
                  <li>
                    {" "}
                    <a href="/2025LPCVC/winners">Winners</a>{" "}
                  </li>{" "}
                  {/* <-- UNCOMMENTED */}
                  <li>
                    <a href="/2025LPCVC/leaderboard_round1/track1">Leaderboard (Round 1)</a>
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
                  <li>
                    <a href="/2025LPCVC/cvpr-workshop">CVPR Workshop</a>
                  </li>
                </ul>
              </li>

              <li
                className="menu-has-children"
                onMouseEnter={() => handleMouseEnter("history")}
                onMouseLeave={() => handleMouseLeave("history")}
              >
                <a href="/competitions/c2025">
                  History{" "}
                  <i
                    className={`fa ${expandedMenus["history"] ? "fa-chevron-up" : "fa-chevron-down"}`}
                  ></i>
                </a>
                <ul
                  style={{
                    display: expandedMenus["history"] ? "block" : "none",
                  }}
                >
                  <li>
                    <a href="/competitions/c2025">Past Workshops</a>
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

      <nav id="mobile-nav">
        <ul>
          <li>
            <a href="/#newsletter">Newsletter</a>
          </li>
          <li>
            <a href="/">Home</a>
          </li>

          <li
            className={`menu-has-children ${expandedMenus["lpcvc"] ? "menu-item-active" : ""}`}
          >
            <i
              className={`fa ${expandedMenus["lpcvc"] ? "fa-chevron-up" : "fa-chevron-down"}`}
              onClick={() => toggleSubmenu("lpcvc")}
            ></i>
            <a href="/2025LPCVC/introduction">2025 LPCVC</a>
            <ul style={{ display: expandedMenus["lpcvc"] ? "block" : "none" }}>
              <li>
                <a href="/2025LPCVC/introduction">Introduction</a>
              </li>
              <li>
                <a href="/2025LPCVC/winners">Winners</a> {/* <-- UNCOMMENTED */}
              </li>
              <li>
                <a href="/2025LPCVC/leaderboard_round1/track1">Leaderboard (Round 1)</a>
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
              <li>
                <a href="/2025LPCVC/cvpr-workshop">CVPR Workshop</a>
              </li>
            </ul>
          </li>

          <li
            className={`menu-has-children ${expandedMenus["history"] ? "menu-item-active" : ""}`}
          >
            <i
              className={`fa ${expandedMenus["history"] ? "fa-chevron-up" : "fa-chevron-down"}`}
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

      {isMobileNavActive && (
        <div id="mobile-body-overly" onClick={toggleMobileNav}></div>
      )}
    </>
  );
}
