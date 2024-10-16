import Chat from './components/chat/Chat';
import Detail from './components/detail/Detail';
import List from './components/list/List';
import Login from './components/login/Login';
import Notification from './components/notification/Notification';

function App() {
  const user = false;
  return (
    <div className='container text-white w-[80vw] h-[90vh] bg-midnight/75 rounded-xl backdrop-blur-lg backdrop-saturate-200 border-[1px] border-white border-opacity-15 flex'>
      {user ? (
        <>
          <List />
          <Chat />
          <Detail />
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
}

export default App;
