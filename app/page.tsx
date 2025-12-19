"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../styles/home.module.css";
import { useAuth } from "@/hooks/useAuth";

const HomePage = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [auth, setAuth] = useState<boolean>(false);
 const { user, loading } = useAuth();

useEffect(() => {
  if (!loading) {
    if (!user) {
      router.push("/login");
    } else {
      setUsername(user.username);
      setAuth(true);
    }
  }
}, [loading, user, router]);


  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <h2 className={styles.logo}>NoteSync</h2>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Welcome to Your Dashboard , {username}</h1>
          <p className={styles.heroSubtitle}>
            Manage your notes and collaborate with others
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>📝</div>
            <h3>Create Note</h3>
            <p>Start writing your thoughts</p>
            <button className={styles.cardBtn} onClick={()=>(router.push('/create'))}>New Note</button>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>📂</div>
            <h3>My Documents</h3>
            <p>View all your saved notes</p>
            <button className={styles.cardBtn} onClick={()=>(router.push('/documents'))}>View All</button>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>👥</div>
            <h3>Shared</h3>
            <p>Collaborate with others</p>
            <button className={styles.cardBtn} onClick={()=>(router.push('/share'))}>Open</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;