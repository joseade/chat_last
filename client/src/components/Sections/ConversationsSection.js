import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import * as actions from '../../actions/user';
import Conversation from '../conversations/Conversation';

const ConversationsSection = () => {
  const { user, userConversations } = useSelector((state) => state);
  const { t } = useTranslation();

  const { conversations } = userConversations;
  const [searchUserEmail, setSearchUserEmail] = useState('');
  const dispatch = useDispatch();
  const isSameUser = user.email === searchUserEmail && user.signin;
  const isFriend = user.friends.some((f) => {
    return f.email === searchUserEmail;
  });
  const isFollowing = user.followings.some((f) => f.email === searchUserEmail);

  const searchUser = () => {
    if (
      !(searchUserEmail.indexOf(' ') >= 0) &&
      searchUserEmail !== '' &&
      searchUserEmail !== user.email &&
      !user.followings.some((f) => f.email === searchUserEmail)
    ) {
      dispatch(actions.searchUserRequest(searchUserEmail));
    }
  };

  const friendshipRequest = () => {
    const { id, name, email, profilePicture } = user;
    dispatch(
      actions.sendFollower(
        { id, name, email, profilePicture },
        { id: user.searchUser.id }
      )
    );
    dispatch(actions.followUserRequest(user.searchUser, { userId: user.id }));

    setSearchUserEmail('');
  };

  return (
    <div className="h-100 col-3 d-flex flex-column align-items-stretch flex-shrink-0 bg-white">
      <div className="d-flex">
        <input
          type="text"
          placeholder={t('conversations.search')}
          className="form-control form-control-sm "
          onChange={({ target }) => {
            setSearchUserEmail(target.value);
            dispatch({ type: 'DELETE_ERRORS' });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && user.errors.length > 0) {
              dispatch({ type: 'DELETE_ERRORS' });
            }
            if ((e.ctrlKey && e.key === 'z') || (e.metaKey && e.key === 'z')) {
              dispatch({ type: 'DELETE_ERRORS' });
            }
          }}
          value={searchUserEmail}
        />
        <button className="btn btn-dark col-4" onClick={searchUser}>
          <i className="bi bi-search"></i>
        </button>
      </div>
      <div className="mt-3 mb-3">
        {user.searchUser && (
          <div className="col-12">
            <div>{`${t('navbar.friendship')} ${user.searchUser.name} ?`}</div>
            <button
              className="col-6 btn btn-success"
              onClick={friendshipRequest}
            >
              <i className="bi bi-check-circle"></i>
            </button>
            <button
              className="col-6 btn btn-danger"
              onClick={() => {
                dispatch({
                  type: actions.Types.FOLLOW_USER_ERROR,
                  payload: [],
                });
              }}
            >
              <i className="bi bi-x-circle"></i>
            </button>
          </div>
        )}
        {isSameUser && (
          <div className="bg-danger text-white">
            {t('conversations.error.same.user')}
          </div>
        )}
        {isFriend ? (
          <div className="bg-danger text-white">
            {t('conversations.error.friends')}
          </div>
        ) : (
          <div className="bg-danger text-white">
            {isFollowing && <>{t('conversations.error.follower')}</>}
          </div>
        )}
        {user.errors.length > 0 && (
          <div className="bg-danger text-white">
            {t('conversations.error.not.user')}
          </div>
        )}
      </div>
      <div className="list-group list-group-flush border-bottom overflow-auto">
        {conversations.map((conversation) => {
          return (
            <Conversation
              key={conversation._id}
              members={conversation.members}
              conversation={conversation}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ConversationsSection;
