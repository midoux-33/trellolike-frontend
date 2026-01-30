import { useState } from 'react';
import styles from '../styles/login.module.css';


export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);


  return (
    <div className={`${styles.authContainer} ${isSignUp ? styles.signupMode : ''}`}>
      
      {/* PROMO PANEL - Slide de droite à gauche */}
      <div className={styles.promoPanel}>
        {!isSignUp ? (
          <>
            <h2>Bonjour, ami !</h2>
            <p>Entrez vos informations personnelles et commencez votre voyage avec nous</p>
            <button 
              className={styles.btnPromo}
              onClick={() => setIsSignUp(true)}
            >
              S'INSCRIRE
            </button>
          </>
        ) : (
          <>
            <h2>Bienvenue !</h2>
            <p>Pour rester connecté avec nous, veuillez vous connecter avec vos informations personnelles</p>
            <button 
              className={styles.btnPromo}
              onClick={() => setIsSignUp(false)}
            >
              SE CONNECTER
            </button>
          </>
        )}
      </div>


      {/* SIGNIN FORM - Visible au départ, caché au clique */}
      <div className={styles.formPanel}>
        <h2>Se connecter à Diprella</h2>
        <div className={styles.socialButtons}>
          <button>f</button>
          <button>G+</button>
          <button>in</button>
        </div>
        <p>ou utilisez votre compte email :</p>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Mot de passe" />
        <a href="#">Mot de passe oublié ?</a>
        <button className={styles.btnSignIn}>SE CONNECTER</button>
      </div>


      {/* SIGNUP FORM - Caché au départ, visible au clique */}
      <div className={styles.formPanelAlt}>
        <h2>Créer un compte</h2>
        <div className={styles.socialButtons}>
          <button>f</button>
          <button>G+</button>
          <button>in</button>
        </div>
        <p>ou utilisez votre email pour vous inscrire :</p>
        <input type="text" placeholder="Nom" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Mot de passe" />
        <button className={styles.btnSignUp}>S'INSCRIRE</button>
      </div>
    </div>
  );
}
