import { useState } from 'react';
import Button from '../../Ui/Button';
import { useDispatch } from './../../../node_modules/react-redux/src/hooks/useDispatch';
import { updateName } from './userSlice';
import { useNavigate } from 'react-router-dom';

function CreateUser() {
  const [username, setUsername] = useState('');
 
  const dispatch =  useDispatch();
  const navigate = useNavigate();


  function handleSubmit(e) {
    e.preventDefault();

    if(!username)return;

    dispatch(updateName(username));
    navigate("./menu");


  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-4 text-sm text-stone-600  md:text-base">👋 Welcome! Please start by telling us your name:</p>

      <input
        type="text"
        placeholder="Your full name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      
      className="w-72 m-8 rounded-full border border-stone-200 
                         px-4 py-2 text-sm transition-all duration-300
                         placeholder:text-stone-400 focus:outline-none
                         focus:ring focus:ring-yellow-400 md:px-6 md:py-3 "
      />

      {username !== '' && (
        <div>
          <Button type = "primary">Start ordering</Button>
        </div>
      )}
    </form>
  );
}

export default CreateUser;
