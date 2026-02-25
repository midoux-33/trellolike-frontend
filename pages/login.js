import { useState } from 'react';
import { useAuth } from '../context/AuthContext'
import { useAuthForm } from '../hooks/useAuthForm';
import { useRouter } from 'next/router'
import styles from '../styles/login.module.css';



export default function Login() {
  const { login, register, isAuthenticated } = useAuth();
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false);

  const loginForm = useAuthForm({
    email: '',
    password: ''
  });

    const signupForm = useAuthForm({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: ''
  });
  

  const form = isSignUp ? signupForm : loginForm;

  if (isAuthenticated && !form.loading) {
    router.push('/dashboard');
    return null;
  }

  const handleTabSwitch = (toSignup) => {
    setIsSignUp(toSignup);

    setTimeout(() => {
            if (toSignup) {
      loginForm.resetForm();   
    } else {
      signupForm.resetForm();  
    }
    }, 100)
  };

  return (
    <div
      className={`${styles.authContainer} ${isSignUp ? styles.signupMode : ""}`}
    >
      {/* PROMO PANEL - Slide de droite à gauche */}
      <div className={styles.promoPanel}>
        {!isSignUp ? (
          <>
            <h2>Bonjour !</h2>
            <p>
              Entrez vos informations personnelles et commencez votre voyage
              avec nous
            </p>
            <button
              className={styles.btnPromo}
              onClick={() => handleTabSwitch(true)}
            >
              S'INSCRIRE
            </button>
          </>
        ) : (
          <>
            <h2>Bienvenue !</h2>
            <p>
              Pour rester connecté avec nous, veuillez vous connecter avec vos
              informations personnelles
            </p>
            <button
              className={styles.btnPromo}
              onClick={() => handleTabSwitch(false)}
            >
              SE CONNECTER
            </button>
          </>
        )}
      </div>

      {/* SIGNIN FORM - Visible au départ, caché au clique */}
      <div className={styles.formPanel}>
        <h2>Se connecter à Taskela</h2>
        <div className={styles.socialButtons}>
          <button>f</button>
          <button>G+</button>
          <button>in</button>
        </div>
        <p>ou utilisez votre compte email :</p>
        <form onSubmit={(e) => loginForm.handleSubmit(e, login, register)}>
        {loginForm.errors.email && (
            <div className="errorMessage">{loginForm.errors.email}</div>
        )}            
          <input
            type="email"
            name="email"
            value={loginForm.formData.email}
            onChange={loginForm.handleInputChange}
            placeholder="Email"
          />
        {loginForm.errors.password && (
            <div className="errorMessage">{loginForm.errors.password}</div>
        )}
          <input
            type="password"
            name="password"
            value={loginForm.formData.password}
            onChange={loginForm.handleInputChange}
            placeholder="Mot de passe"
          />
          <a href="#">Mot de passe oublié ?</a>
          <button className={styles.btnSignIn} type="submit">
            SE CONNECTER
          </button>
        </form>
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
        <form onSubmit={(e) => signupForm.handleSubmit(e, login, register)}>
            {signupForm.errors.username && (
              <div className="errorMessage">{signupForm.errors.username}</div>
            )}
          <input
            type="text"
            name="username"
            value={signupForm.formData.username || ''}
            onChange={signupForm.handleInputChange}
            placeholder="Pseudo"
          />
            {signupForm.errors.email && (
              <div className="errorMessage">{signupForm.errors.email}</div>
            )}
          <input
            type="email"
            name="email"
            value={signupForm.formData.email}
            onChange={signupForm.handleInputChange}
            placeholder="Email"
          />
            {signupForm.errors.password && (
              <div className="errorMessage">{signupForm.errors.password}</div>
            )}
          <input
            type="password"
            name="password"
            value={signupForm.formData.password}
            onChange={signupForm.handleInputChange}
            placeholder="Mot de passe"
          />
            {signupForm.errors.lastName && (
              <div className="errorMessage">{signupForm.errors.lastName}</div>
            )}
          <input
            type="text"
            name="lastName"
            value={signupForm.formData.lastName || ''}
            onChange={signupForm.handleInputChange}
            placeholder="nom"
          />
            {signupForm.errors.firstName && (
              <div className="errorMessage">{signupForm.errors.firstName}</div>
            )}
          <input
            type="text"
            name="firstName"
            value={signupForm.formData.firstName || ''}
            onChange={signupForm.handleInputChange}
            placeholder="prénom"
          />
          {signupForm.errors.general && (
                <div className="errorMessage">{signupForm.errors.general}</div>
            )}
          <button className={styles.btnSignUp} type="submit">
            S'INSCRIRE
          </button>
        </form>
      </div>
    </div>
  );
}
