import React from "react";
import styles from "./footer.module.css";

function Footer() {
    let fecha = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.site_footer}>
                <div className={styles.copyright}>
                    <p>
                        Page created by Batnoska
                    </p>
                    <p>&copy; {fecha}. All Rights Reserved.</p>
                </div>
                <div className={styles.redes_sociales}>
                    <a href="https://www.linkedin.com/in/santiago-batnoska-672165248/" target="_blank" rel="noopener noreferrer">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="linkedin" />
                    </a>
                    <a href="https://github.com/Batnoska" target="_blank" rel="noopener noreferrer">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="github" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer