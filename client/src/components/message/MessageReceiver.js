import { useSelector } from 'react-redux';
import CanvasDraw from 'react-canvas-draw';
import TimeAgo from 'react-timeago';

const MessageReceiver = ({ message, receiverName, receiverPicture }) => {
  const { socket } = useSelector((state) => state);
  const drawing = message.text.includes('brushRadius');

  return (
    <>
      <div
        key={message._id}
        className={`mt-3 d-flex align-items-start justify-content-start`}
      >
        {receiverPicture ? (
          <img
            className="rounded-circle me-4"
            src={receiverPicture}
            alt={message.sender}
            style={{ width: 50, height: 50 }}
          />
        ) : (
          <>
            {socket.onlineUsers.filter(
              (onlineUser) => onlineUser.userId === message.sender
            ).length > 0 ? (
              <div className="me-2">
                {
                  socket.onlineUsers.filter(
                    (onlineUser) => onlineUser.userId === message.sender
                  )[0].email
                }
              </div>
            ) : (
              <div className="me-2">{message.sender}</div>
            )}
          </>
        )}

        {drawing ? (
          <CanvasDraw
            className="overflow-hidden"
            saveData={message.text}
            immediateLoading={true}
            hideGrid={true}
            disabled
            canvasWidth={550}
            canvasHeight={197}
            style={{ position: 'relative' }}
          />
        ) : (
          <p
            style={{ whiteSpace: 'pre-line' }}
            className={`col-6 mb-1 rounded text-white bg-primary`}
          >
            {message.text}
          </p>
        )}
      </div>
      <div>
        <TimeAgo date={message.createdAt} minPeriod={30} />
      </div>
    </>
  );
};

export default MessageReceiver;
