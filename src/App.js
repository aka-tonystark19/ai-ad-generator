import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    brandName: '',
    serviceIndustry: '',
    targetUserAge: [],
    brandSlogan: '',
    additionalComments: '',
  });

  const [result, setResult] = useState('');


  function extractPrompts(str) {
    const prompts = str.split('\n');
  
    const comedic = prompts.find((prompt) => prompt.startsWith('Comedic:'));
    const infotainment = prompts.find((prompt) => prompt.startsWith('Infotainment:'));
  
    const comedicPrompt = comedic ? comedic.replace('Comedic: ', '') : '';
    const infotainmentPrompt = infotainment ? infotainment.replace('Infotainment: ', '') : '';
  
    return { comedicPrompt, infotainmentPrompt };
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (checked) {
        setFormData({
          ...formData,
          targetUserAge: [...formData.targetUserAge, value],
        });
      } else {
        setFormData({
          ...formData,
          targetUserAge: formData.targetUserAge.filter((age) => age !== value),
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.result) {
          setResult(data.result);
        }
        console.log('Data submitted successfully!');
      } else {
        console.error('Failed to submit data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ad AI</h1>
        <div class="background-image"></div>
        <form onSubmit={handleSubmit} className="questionnaire">
          <label>
            Brand Name:
            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
            />
          </label>

          <label>
            Service Industry:
            <input
              type="text"
              name="serviceIndustry"
              value={formData.serviceIndustry}
              onChange={handleChange}
            />
          </label>

          <label>
            Target User Age:
            <div className="checkbox-options">
              {['Kids', 'Teens', 'Young Adults', 'Middle-Aged', 'Old-Aged'].map(age => (
                <label key={age} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="targetUserAge"
                    value={age}
                    checked={formData.targetUserAge.includes(age)}
                    onChange={handleChange}
                  />
                  {age}
                </label>
              ))}
            </div>
          </label>

          <label>
            Brand Slogan:
            <input
              type="text"
              name="brandSlogan"
              value={formData.brandSlogan}
              onChange={handleChange}
            />
          </label>

          <label>
            Additional Comments:
            <textarea
              name="additionalComments"
              value={formData.additionalComments}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Generate Ads</button>
        </form>

    
        {result && (
  <div className="result-container">
    <table className="prompt-table">
      <tr>
        {/* <th>Comedic Ad</th> */}
        <th>Infotainment Ad</th>
      </tr>
      <tr>
        {/* <td>{extractPrompts(result).comedicPrompt}</td> */}
        <td>{extractPrompts(result).infotainmentPrompt}</td>
      </tr>
    </table>
  </div>
)}

      </header>
    </div>
  );
}

export default App;