import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: "Welcome to KisanConnect",
        tagline: "Seedha Kisan, Seedha Daam",
        login: "Login",
        register: "Register",
        farmer: "Farmer",
        buyer: "Buyer",
      }
    },
    hi: {
      translation: {
        welcome: "किसानकनेक्ट में आपका स्वागत है",
        tagline: "सीधा किसान, सीधा दाम",
        login: "लॉगिन",
        register: "रजिस्टर",
        farmer: "किसान",
        buyer: "खरीदार",
      }
    },
    pa: {
      translation: {
        welcome: "ਕਿਸਾਨਕਨੈਕਟ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ",
        tagline: "ਸਿੱਧਾ ਕਿਸਾਨ, ਸਿੱਧਾ ਦਾਮ",
        login: "ਲੌਗਿਨ",
        register: "ਰਜਿਸਟਰ",
        farmer: "ਕਿਸਾਨ",
        buyer: "ਖਰੀਦਦਾਰ",
      }
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;