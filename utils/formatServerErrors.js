export const formatServerErrors = (error) => {
    console.log(error.response)    

    // 401 login
    if (error.reponse?.status === 401) {
        return { general: 'indentifiants invalide' };
    }
    // 409/422 register
    if (error.response?.status === 409 || error.response?.status === 422) {
        return { general: ' Email déjà utilsé'}
    }
    
    const errors = error?.response?.data?.errors;
    
    if (!Array.isArray(errors)) return {};
    
        const result = {};
        errors.forEach(err => {
            if (err.path) {
                result[err.path] = err.msg
            }
        });

        return result
}