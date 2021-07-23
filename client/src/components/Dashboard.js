import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import axios from 'axios';
import ConversationsSection from './Sections/ConversationsSection';
import ChatSection from './Sections/ChatSection';
import FriendsSection from './Sections/FriendsSection';
import Navbar from './Sections/Navbar';
import { useTranslation } from 'react-i18next';
import * as actionsSocket from '../actions/socket';
import * as actionsConversations from '../actions/conversations';

const Dashboard = (props) => {
  const { user, chat, userConversations } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!user.signin) {
      const getUser = async () => {
        try {
          const res = await axios.get('/users/currentuser');
          const currentUser = { ...res.data.currentUser };
          dispatch({ type: 'LOGIN_USER_SUCCES', payload: currentUser });
          dispatch(actionsSocket.startSocket(currentUser));
          // if (res.data === null) {
          //   console.log('AAA');
          //   return <Redirect to={'/login'} />;
          // }
        } catch (error) {
          props.history.push('/login');
        }
      };
      getUser();
    }
  }, []);

  useEffect(() => {
    if (user.signin) {
      dispatch(actionsConversations.conversationsRequest(user));
    }
  }, [user.signin]);

  useEffect(() => {
    if (user.signin) {
      i18n.changeLanguage(user.language);
    }
  }, [user.signin]);

  useEffect(() => {
    //chat.conversation._id;
    if (chat.conversation !== null) {
      const newConversation = userConversations.conversations.filter(
        (conversation) => {
          return conversation._id === chat.conversation._id;
        }
      );
      if (newConversation[0]?.members.length !== chat.conversation.length) {
        dispatch({ type: 'UPDATE_CHAT', payload: newConversation[0].members });
      }
      if (newConversation.length === 0) {
        dispatch({ type: 'DELETE_CHAT' });
        console.log('ADIOS');
      }
    }
  }, [userConversations]);

  return (
    <div className="container-fluid vh-100">
      <Navbar props={props} />
      <div className="row vh-90">
        <ConversationsSection />
        <ChatSection />

        <FriendsSection />
      </div>
    </div>
  );
};

export default Dashboard;
