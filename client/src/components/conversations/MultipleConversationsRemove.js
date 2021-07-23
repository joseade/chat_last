import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import * as actionsConversations from '../../actions/conversations';
const MultipleConversationsRemove = ({ members, conversation }) => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [friendChecked, setFriendChecked] = useState('0');
  const { friends } = user;

  const possibleDeleteMembers = friends.filter((friend) => {
    return members.includes(friend.id);
  });

  const handleChange = (e) => {
    setFriendChecked(e.target.value);
  };
  const handleSubmit = (e) => {
    dispatch(
      actionsConversations.deleteFriendFromConversation(
        conversation._id,
        friendChecked
      )
    );
    setFriendChecked('0');
  };
  return (
    <>
      <button
        type="button"
        className="btn btn-danger"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModalRemove${conversation._id}`}
      >
        <i className="bi bi-person-dash-fill"></i>
      </button>

      <div
        className="modal fade"
        id={`exampleModalRemove${conversation._id}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t('multiple.delete.welcome')}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <select
                    className="form-select"
                    aria-label="multiple select example"
                    value={friendChecked}
                    onChange={handleChange}
                  >
                    <option value="0"> {t('multiple.delete.select')}</option>
                    {possibleDeleteMembers.map((possibleDeleteMember) => (
                      <option
                        key={possibleDeleteMember.id}
                        value={possibleDeleteMember.id}
                      >
                        {possibleDeleteMember.name}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                {t('multiple.delete.close')}
              </button>
              <button
                onClick={handleSubmit}
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                {t('multiple.delete.save')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MultipleConversationsRemove;
