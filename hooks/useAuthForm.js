import { useState, useCallback } from 'react';
import { formatServerErrors } from '../utils/formatServerErrors';

export const useAuthForm = (initialForm = {}, isSignUp = false) => {
  const [formData, setFormData] = useState({
    email:'',
    password:'',
    ...initialForm
});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Input change / reset erreur
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); 
  }, []);

  // reset input form

  const resetForm = useCallback(() => {
    setFormData(initialForm);
    setErrors({});
  }, [initialForm])
  
  //   validation
  const validateForm = useCallback((data) => {
    const newErrors = {};
    if (!data.email?.trim()) newErrors.email = 'Email requis';
    if (!data.password?.trim()) newErrors.password = 'Mot de passe requis';

     if (data.username !== undefined && !data.username?.trim()) {
      newErrors.username = 'Pseudo requis';
    }
    if (data.firstName !== undefined && !data.firstName?.trim()) {
      newErrors.firstName = 'Prénom requis';
    }
    if (data.lastName !== undefined && !data.lastName?.trim()) {
      newErrors.lastName = 'Nom requis';
    }
    return newErrors;
  }, []);
  
  //  Submit / API
  const handleSubmit = useCallback(async (e, onLogin, onRegister) => {
    e.preventDefault();
    setLoading(true);
          console.log('formData:', formData);        
  console.log('username:', formData.username);
  console.log('username truthy?', !!formData.username);
    const frontendErrors = validateForm(formData);
    if (Object.keys(frontendErrors).length > 0) {
      setErrors(frontendErrors);
      setLoading(false);
      return;
    }
    
    try {
      if (isSignUp) {
        await onRegister(formData);  
      } else {
        await onLogin(formData.email, formData.password); 
      }
    } catch (error) {
      const serverErrors = formatServerErrors(error);
      setErrors(serverErrors);
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm]);
  
  return {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
    resetForm
  };
};
