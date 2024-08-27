const { validateTeacherLogin } = require('./fakeApi');

const testLogin = async () => {
    const result = await validateTeacherLogin('johndoe', 'password123');
    console.log('Login result:', result); // Should output: { teacher_id: 1, name: 'John Doe' }
  };
  
  testLogin();
  