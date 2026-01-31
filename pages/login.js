import { useState } from 'react';
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import styles from '../styles/login.module.css';


export default function Login() {
  const { login, register, isAuthenticated } = useAuth();
  const router = useRouter()

  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '', 
  })

  if (isAuthenticated && !loading) {
    router.push('/dashboard');
    return null;
  }

  const handleInputChange = (e) => {
    // clé dynamique
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try { 
        
        if (isSignUp) {
        
        //signup
        await register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
        })
    } else {
        await login(formData.email, formData.password)
    }
    router.push('/dashboard')
    } catch(error) {
        setError(error.response?.data?.message || 'Erreur connexion')
    } finally {
        setLoading(false)
    }
  }
  return (
    <div className={`${styles.authContainer} ${isSignUp ? styles.signupMode : ''}`}>
      
      {/* PROMO PANEL - Slide de droite à gauche */}
      <div className={styles.promoPanel}>
        {!isSignUp ? (
          <>
            <h2>Bonjour !</h2>
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
        <h2>Se connecter à Taskela</h2>
        <div className={styles.socialButtons}>
          <button>f</button>
          <button>G+</button>
          <button>in</button>
        </div>
        <p>ou utilisez votre compte email :</p>
        <form onSubmit={handleSubmit}>
        <input 
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange} 
        placeholder="Email" />
        <input 
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Mot de passe" />
        <a href="#">Mot de passe oublié ?</a>
        <button className={styles.btnSignIn} type="Submit">SE CONNECTER</button>
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
        <form onSubmit={handleSubmit}>
        <input 
        type="text" 
        name="username"
        value={formData.username}
        onChange={handleInputChange}
        placeholder="Pseudo" />
        <input 
        type="email" 
        name="email" 
        value={formData.email} 
        onChange={handleInputChange} 
        placeholder="Email" />
        <input 
        type="password" 
        name="password" 
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Mot de passe" />
        <input 
        type="text" 
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange} 
        placeholder="nom" />
        <input 
        type="text" 
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange} 
        placeholder="prénom" />
        <button className={styles.btnSignUp} type="submit">S'INSCRIRE</button>
        </form>
      </div>
    </div>
  );
}
