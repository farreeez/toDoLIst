import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { ProjectIndicator } from "./components/ProjectIndicator";

export const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>Focus List</div>
      <nav className={styles.navigation}>
        {[
          { to: "/", label: "Dashboard" },
          { to: "/projects", label: "Projects" },
          { to: "/Calendar", label: "Calendar" },
          { to: "/Statistics", label: "Statistics" },
          { to: "/settings", label: "Settings" },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.projects}>
        <ProjectIndicator colour={3} name={"Zapier"} counter={12} />
        <ProjectIndicator colour={7} name={"Nimbus"} counter={5} />
        <ProjectIndicator colour={2} name={"Aurora"} counter={8} />
      </div>

      <div className={styles.profile}>
        <div className={styles.profileName}>John</div>
        <div className={styles.profileEmail}>JohnMicheals@gmail.com</div>
      </div>
    </div>
  );
};
