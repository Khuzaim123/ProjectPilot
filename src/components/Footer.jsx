import React from 'react';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="app-footer">
            <div className="container">
                <div className="footer-content">
                    <p>&copy; {currentYear} ProjectPilot. Real-time project management powered by Firebase.</p>
                    <div className="footer-links">
                        <a href="#" className="footer-link">About</a>
                        <a href="#" className="footer-link">Contact</a>
                        <a href="#" className="footer-link">Help</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
