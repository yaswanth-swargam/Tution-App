const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center gap-3 px-4">
      <span className="loading loading-spinner loading-lg text-primary" />
      {text ? (
        <p className="text-sm text-base-content/50">{text}</p>
      ) : null}
    </div>
  );
};

export default Loader;
