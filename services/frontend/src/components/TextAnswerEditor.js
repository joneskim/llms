import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's styling

const TextAnswerEditor = ({ value, onChange }) => {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder="Type your text answer here..."
      modules={{
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ font: [] }],
          [{ align: [] }],
        ],
      }}
      style={{ backgroundColor: '#fff', borderRadius: '8px', marginBottom: '2rem' }}
    />
  );
};

export default TextAnswerEditor;
