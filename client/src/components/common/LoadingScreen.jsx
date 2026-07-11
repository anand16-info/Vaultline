const LoadingScreen = ({ label = "Loading..." }) => {
  return (
    <div className="loading-screen">
      <div className="loading-mark" role="status" aria-label="Loading" />
      <p className="loading-label">{label}</p>
    </div>
  );
};

export default LoadingScreen;
