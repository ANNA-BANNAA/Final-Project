export function FormErrorBanner({ message }) {
  // თუ შეცდომა არ არის, კომპონენტი საერთოდ არ გამოჩნდება
  if (!message) return null;

  return (
    <div style={{ 
      background: '#ffdddd', 
      color: '#900', 
      padding: '10px', 
      marginBottom: '15px', 
      borderRadius: '4px',
      fontSize: '14px',
      textAlign: 'center'
    }}>
      {message}
    </div>
  );
}