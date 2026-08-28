import Loader from "../../components/common/Loader";

const ChatLayout = ({
  header,
  footer,
  children,
  isLoading = false,
  loadingText = "Loading messages...",
}) => {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">{header}</div>

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        {isLoading ? (
          <Loader text={loadingText} />
        ) : (
          children
        )}
      </div>

      <div className="shrink-0">{footer}</div>
    </div>
  );
};

export default ChatLayout;
