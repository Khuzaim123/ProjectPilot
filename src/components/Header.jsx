import React from 'react';

function Header() {
    return (
        <header className="app-header">
            <div className="container">
                <div className="header-content">
                    <h1 className="app-title">
                        <span className="icon-rocket"></span>
                        ProjectPilot
                    </h1>
                    {/* <nav className="header-nav">
                        <span className="nav-item active">Projects</span>
                    </nav> */}
                </div>
            </div>
        </header>
    );
}

export default Header;
