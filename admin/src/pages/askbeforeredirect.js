import React from 'react';
import '../styles/AskBeforeRedirect.css'; // Import your CSS file

const AskBeforeRedirect = ({ longUrl }) => {
  return (
    <section className="ask-before-redirect-section">
        <div className="ask-before-redirect">
        <h2>Redirect Confirmation</h2>
        <p>Do you want to redirect to ?</p>
        <p className='link'>{(longUrl)}</p>
            <div className='button-container'> 
                <button className= 'cancel-btn' onClick={() => console.log("Redirect canceled")}>No</button>
                <button className='submit-btn' onClick={() => window.location.href = longUrl}>Yes</button>
            </div>
        </div>
    </section>
  );
};

export default AskBeforeRedirect;
