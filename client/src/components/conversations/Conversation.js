import { useDispatch, useSelector } from 'react-redux';
import * as actionsChat from '../../actions/chat';
import * as actionsConversations from '../../actions/conversations';

import MultipleConversations from './MultipleConversations';
import MultipleConversationsRemove from './MultipleConversationsRemove';

const Conversation = ({ members, conversation }) => {
  const { user, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { friends } = user;
  const receiver = friends.filter(
    (friend) => members.includes(friend.id) && friend.id !== user.id
  );
  const admin = members[0];
  const isAdmin = admin === user.id;

  const picture =
    conversation.members.length > 2
      ? '/person/group-icon.png'
      : receiver[0].profilePicture;

  const quitConversation = () => {
    dispatch(
      actionsConversations.userQuitsConversation(conversation._id, user.id)
    );
  };
  const friendNames = receiver.map((rec) => rec.name).join(', ');
  const onlineUserNames = socket.onlineUsers.filter(
    (online) =>
      members.includes(online.userId) &&
      !receiver.some((r) => r.id === online.userId) &&
      online.userId !== user.id
  );
  const offlineUserNames = members.filter(
    (member) =>
      !receiver.some((r) => r.id === member) &&
      !onlineUserNames.some((r) => r.userId === member) &&
      member !== user.id
  );
  let names = friendNames;
  if (onlineUserNames.length > 0) {
    names =
      friendNames + ', ' + onlineUserNames.map((rec) => rec.name).join(', ');
  }
  if (offlineUserNames.length) {
    names = names + ', ' + offlineUserNames.join(',');
  }

  return (
    <div className="mb-3">
      <div
        role="button"
        className="list-group-item list-group-item-action d-flex align-items-center justify-content-start"
        onClick={() => {
          dispatch(actionsChat.getConversation(conversation));
          dispatch(actionsChat.messagesRequest(conversation));
        }}
      >
        <img
          className="rounded-circle me-4"
          src={picture}
          alt="Card"
          style={{ width: 50, height: 50 }}
        />
        <strong className="mb-1">{names}</strong>
      </div>
      {isAdmin && (
        <div className="d-flex justify-content-end">
          <MultipleConversations
            members={members}
            conversation={conversation}
          />
          {conversation.members.length > 2 && (
            <MultipleConversationsRemove
              members={members}
              conversation={conversation}
            />
          )}
        </div>
      )}
      {!isAdmin && (
        <div className="d-flex justify-content-end">
          {conversation.members.length > 2 && (
            <button
              onClick={quitConversation}
              type="button"
              className="btn btn-danger"
            >
              <i className="bi bi-person-dash-fill"></i>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Conversation;
