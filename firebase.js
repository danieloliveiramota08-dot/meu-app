// Configuração do Firebase

const firebaseConfig = {
  apiKey: "AIzaSyDCPfrZYmDgYl47x8c423Qilpfl3x98E4g",
  authDomain: "igreja-deus-alianca.firebaseapp.com",
  projectId: "igreja-deus-alianca",
  storageBucket: "igreja-deus-alianca.firebasestorage.app",
  messagingSenderId: "341543377138",
  appId: "1:341543377138:web:96ce4cbb142cf39e90986b",
  measurementId: "G-X7R7NWCB9W"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
